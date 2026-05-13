from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import Message
from schemas.admin_common import ContactMessageResponse
from schemas.admin_common import SimpleResponse
from schemas.admin_response import AdminResponse, ok
from schemas.message import ConversationOut, MessageOut
from services.message_formatter import message_out
from services.message_service import get_conversation, list_conversations

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.get("/conversations", response_model=AdminResponse[list[ConversationOut]])
@router.get("/messages", response_model=AdminResponse[list[ConversationOut]])
def list_admin_conversations(user=Depends(require_admin), db: Session = Depends(get_db)):
    return ok(list_conversations(db, user))


@router.get("/conversations/{conversation_id}/messages", response_model=AdminResponse[list[MessageOut]])
@router.get("/messages/{conversation_id}", response_model=AdminResponse[list[MessageOut]])
def list_admin_messages(
    conversation_id: int,
    user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    messages = get_conversation(db, user, conversation_id).messages
    return ok([message_out(item) for item in messages])


@router.delete("/messages/{message_id}", response_model=SimpleResponse)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.get(Message, message_id)
    if message:
        db.delete(message)
        db.commit()
    return SimpleResponse(message="Message deleted successfully.")


@router.get("/contact-messages", response_model=AdminResponse[list[ContactMessageResponse]])
def list_contact_messages(db: Session = Depends(get_db)):
    from models import ContactMessageModel
    from sqlalchemy import select

    query = select(ContactMessageModel).order_by(ContactMessageModel.created_at.desc())
    return ok(list(db.scalars(query).all()))
