from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import AIConversation, AIMessage, Customer, User, WeddingPlan


def customer_profile(user: User) -> Customer:
    if not user.customer_profile:
        raise HTTPException(status_code=403, detail="Customer profile required.")
    return user.customer_profile


def owned_plan(db: Session, user: User, plan_id: int | None = None) -> WeddingPlan | None:
    customer = customer_profile(user)
    if not plan_id:
        return customer.wedding_plan
    plan = db.scalar(
        select(WeddingPlan).where(WeddingPlan.id == plan_id, WeddingPlan.customer_id == customer.id)
    )
    if not plan:
        raise HTTPException(status_code=404, detail="Wedding plan not found.")
    return plan


def get_or_create_conversation(
    db: Session,
    customer_id: int,
    wedding_plan_id: int | None,
) -> AIConversation:
    query = select(AIConversation).where(
        AIConversation.customer_id == customer_id,
        AIConversation.wedding_plan_id == wedding_plan_id,
    )
    conversation = db.scalar(query.order_by(AIConversation.created_at.desc()))
    if conversation:
        return conversation
    conversation = AIConversation(customer_id=customer_id, wedding_plan_id=wedding_plan_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def save_message(db: Session, conversation_id: int, sender: str, message: str) -> None:
    db.add(AIMessage(conversation_id=conversation_id, sender=sender, message=message))
    db.commit()


def conversation_messages(db: Session, conversation_id: int) -> list[AIMessage]:
    query = select(AIMessage).where(AIMessage.conversation_id == conversation_id)
    return list(db.scalars(query.order_by(AIMessage.created_at.asc(), AIMessage.id.asc())).all())
