from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models import Booking, Conversation, Customer, Message, ServiceProvider, User
from schemas.message import MessageCreate
from services.message_formatter import conversation_out, message_out
from services.message_notifications import notify_message_receiver
from services.role_profiles import customer_for_user, provider_for_user

def conversation_query():
    return select(Conversation).options(
        joinedload(Conversation.customer).joinedload(Customer.user),
        joinedload(Conversation.provider).joinedload(ServiceProvider.user),
        joinedload(Conversation.messages).joinedload(Message.sender),
    )

def list_conversations(db: Session, user: User):
    query = conversation_query()
    if user.role == "customer":
        query = query.where(Conversation.customer_id == customer_for_user(db, user).id)
    elif user.role == "service_provider":
        query = query.where(Conversation.provider_id == provider_for_user(db, user).id)
    elif user.role != "admin":
        raise HTTPException(status_code=403, detail="Messages are not available.")
    rows = db.scalars(query.order_by(Conversation.created_at.desc())).unique().all()
    return [conversation_out(item, user.id) for item in rows]

def create_conversation(db: Session, user: User, provider_id: int):
    customer = customer_for_user(db, user)
    if not db.get(ServiceProvider, provider_id):
        raise HTTPException(status_code=404, detail="Provider not found.")
    conversation = get_or_create_conversation(db, customer.id, provider_id)
    db.commit()
    return conversation_out(get_conversation(db, user, conversation.id), user.id)

def get_or_create_booking_conversation(db: Session, booking: Booking) -> Conversation:
    conversation = get_or_create_conversation(db, booking.customer_id, booking.provider_id)
    if not conversation.booking_id:
        conversation.booking_id = booking.id
    return conversation

def get_or_create_conversation(db: Session, customer_id: int, provider_id: int | None):
    if not provider_id:
        raise HTTPException(status_code=400, detail="Provider is required for chat.")
    query = select(Conversation).where(
        Conversation.customer_id == customer_id,
        Conversation.provider_id == provider_id,
    )
    conversation = db.scalar(query)
    if conversation:
        return conversation
    conversation = Conversation(customer_id=customer_id, provider_id=provider_id)
    db.add(conversation)
    db.flush()
    return conversation

def get_conversation(db: Session, user: User, conversation_id: int):
    query = conversation_query().where(Conversation.id == conversation_id)
    conversation = db.scalars(query).unique().first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    guard_conversation(db, user, conversation)
    return conversation

def guard_conversation(db: Session, user: User, conversation: Conversation) -> None:
    if user.role == "admin":
        return
    if user.role == "customer" and conversation.customer_id == customer_for_user(db, user).id:
        return
    if user.role == "service_provider" and conversation.provider_id == provider_for_user(db, user).id:
        return
    raise HTTPException(status_code=403, detail="You cannot access this conversation.")

def list_messages(db: Session, user: User, conversation_id: int):
    conversation = get_conversation(db, user, conversation_id)
    for item in conversation.messages:
        item.is_read = item.is_read or item.sender_id != user.id
    db.commit()
    return [message_out(item) for item in sorted(conversation.messages, key=lambda item: item.created_at)]

def send_message(db: Session, user: User, conversation_id: int, payload: MessageCreate):
    conversation = get_conversation(db, user, conversation_id)
    message = Message(conversation_id=conversation.id, sender_id=user.id, message=payload.message.strip())
    db.add(message)
    notify_message_receiver(db, user, conversation)
    db.commit()
    db.refresh(message)
    return message_out(message)
