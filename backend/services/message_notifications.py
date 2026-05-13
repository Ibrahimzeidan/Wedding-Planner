from sqlalchemy.orm import Session

from models import Conversation, User
from services.notification_service import create_notification


def notify_message_receiver(db: Session, sender: User, conversation: Conversation) -> None:
    receiver = conversation.provider.user if sender.role == "customer" else conversation.customer.user
    if receiver and receiver.id != sender.id:
        create_notification(db, receiver.id, "New Message", "You received a new message.", "new_message")
