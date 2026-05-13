from models import Conversation, Message, ServiceProvider
from schemas.message import ConversationOut, MessageOut


def provider_name(provider: ServiceProvider | None) -> str | None:
    if not provider:
        return None
    return provider.business_name or (provider.user.full_name if provider.user else None)


def conversation_out(conversation: Conversation, current_user_id: int | None = None):
    last = conversation.messages[-1] if conversation.messages else None
    unread = 0
    if current_user_id:
        unread = sum(1 for item in conversation.messages if not item.is_read and item.sender_id != current_user_id)
    customer_user = conversation.customer.user if conversation.customer else None
    return ConversationOut(
        id=conversation.id,
        customer_id=conversation.customer_id,
        provider_id=conversation.provider_id,
        booking_id=conversation.booking_id,
        customer_name=customer_user.full_name if customer_user else None,
        provider_name=provider_name(conversation.provider),
        last_message=last.message if last else None,
        unread_count=unread,
        created_at=conversation.created_at,
    )


def message_out(message: Message):
    sender = message.sender
    return MessageOut(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        sender_name=sender.full_name if sender else None,
        sender_role=sender.role if sender else None,
        message=message.message,
        is_read=message.is_read,
        created_at=message.created_at,
    )
