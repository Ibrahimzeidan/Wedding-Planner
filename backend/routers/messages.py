from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user, require_customer
from models import User
from schemas.message import ConversationOut, MessageCreate, MessageOut
from services.booking_chat_service import create_booking_conversation
from services.message_service import create_conversation, list_conversations
from services.message_service import list_messages, send_message

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/conversations", response_model=list[ConversationOut])
def get_conversations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_conversations(db, user)


@router.post(
    "/conversations/{provider_id}",
    response_model=ConversationOut,
    status_code=status.HTTP_201_CREATED,
)
def start_conversation(
    provider_id: int,
    user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return create_conversation(db, user, provider_id)


@router.post("/bookings/{booking_id}", response_model=ConversationOut, status_code=status.HTTP_201_CREATED)
def start_booking_conversation(
    booking_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_booking_conversation(db, user, booking_id)


@router.get("/{conversation_id}", response_model=list[MessageOut])
def get_chat_messages(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_messages(db, user, conversation_id)


@router.post("/{conversation_id}", response_model=MessageOut)
def add_chat_message(
    conversation_id: int,
    payload: MessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return send_message(db, user, conversation_id, payload)
