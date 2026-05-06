from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from auth_helpers import build_profile, build_user, get_user_by_email
from database import get_db
from schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)) -> RegisterResponse:
    normalized_email = payload.email.strip().lower()

    if get_user_by_email(db, normalized_email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    try:
        user = build_user(payload, normalized_email)
        db.add(user)
        db.flush()

        profile = build_profile(db, payload, user)
        db.add(profile)
        db.commit()
        db.refresh(user)
        db.refresh(profile)
    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again.",
        ) from error

    return RegisterResponse(
        message="Account created successfully.",
        user=user,
        profile_id=profile.id,
    )


@router.post("/login", response_model=LoginResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    user = get_user_by_email(db, payload.email)

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    try:
        access_token = create_access_token(
            user_id=user.id,
            email=user.email,
            role=user.role,
        )
    except RuntimeError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT_SECRET is not configured.",
        ) from error

    return LoginResponse(access_token=access_token, user=user)
