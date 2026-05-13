from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_customer
from models import User
from schemas.ai import AIChatRequest, AIChatResponse, AIHistoryResponse, AIRecommendationSummary, AIReplacementResponse
from services.ai_chat_service import chat_reply, detail_question, should_ask_for_details
from services.ai_context_service import conversation_messages, customer_profile, get_or_create_conversation, owned_plan, save_message
from services.ai_guardrails import is_wedding_message, wants_cheaper, wants_favorites, wants_premium, wants_value
from services.ai_gemini_planner import plan_with_gemini
from services.ai_memory_service import build_memory, current_expected_detail
from services.ai_option_service import build_recommendation_options
from services.ai_package_builder import build_package_candidates
from services.ai_recommendation_service import build_recommendations
from services.ai_recommendation_store import save_recommendations, saved_recommendations
from services.ai_replacement_service import find_replacement_provider
from services.ai_response_text import package_reply

router = APIRouter(prefix="/ai", tags=["AI Planner"])
SCOPE_REPLY = "I can only help with wedding planning services and recommendations."

@router.post("/chat", response_model=AIChatResponse)
def chat(payload: AIChatRequest, db: Session = Depends(get_db), user: User = Depends(require_customer)):
    customer = customer_profile(user)
    plan = owned_plan(db, user, payload.wedding_plan_id)
    conversation = get_or_create_conversation(db, customer.id, plan.id if plan else None)
    has_context = bool(plan) or bool(conversation.messages)
    expected_detail = current_expected_detail(conversation.messages)
    if not is_wedding_message(payload.message, has_context, expected_detail):
        save_message(db, conversation.id, "user", payload.message)
        return chat_reply(db, conversation.id, SCOPE_REPLY)
    memory = build_memory(db, plan, conversation, payload.message)
    save_message(db, conversation.id, "user", payload.message)
    if should_ask_for_details(payload.message, memory):
        return chat_reply(db, conversation.id, detail_question(payload.message, memory))
    mode = "cheaper" if wants_cheaper(payload.message) else "normal"
    mode = "value" if wants_value(payload.message) else mode
    mode = "premium" if wants_premium(payload.message) else mode
    summary = build_recommendations(
        db, customer.id, plan.id if plan else None, memory, payload.message,
        mode=mode, favorites_only=wants_favorites(payload.message),
    )
    fallback = package_reply(summary, memory)
    candidates = build_package_candidates(
        db, customer.id, memory, payload.message, mode, wants_favorites(payload.message)
    )
    summary, answer = plan_with_gemini(payload.message, memory, candidates, summary, fallback)
    summary.options = build_recommendation_options(candidates, summary, memory)
    summary.recommendation_summary = answer
    if plan and summary.items:
        summary = save_recommendations(db, customer.id, plan.id, summary)
    save_message(db, conversation.id, "assistant", answer)
    return AIChatResponse(conversation_id=conversation.id, message=answer, **summary.model_dump())

@router.get("/history", response_model=AIHistoryResponse)
def read_history(wedding_plan_id: int | None = None, db: Session = Depends(get_db),
                 user: User = Depends(require_customer)):
    customer = customer_profile(user)
    plan = owned_plan(db, user, wedding_plan_id)
    conversation = get_or_create_conversation(db, customer.id, plan.id if plan else None)
    return AIHistoryResponse(conversation_id=conversation.id, messages=conversation_messages(db, conversation.id))

@router.get("/recommendations/{wedding_plan_id}", response_model=AIRecommendationSummary)
def read_recommendations(wedding_plan_id: int, db: Session = Depends(get_db),
                         user: User = Depends(require_customer)):
    customer = customer_profile(user)
    owned_plan(db, user, wedding_plan_id)
    return saved_recommendations(db, customer.id, wedding_plan_id)

@router.post("/recommendations/{wedding_plan_id}", response_model=AIRecommendationSummary)
def create_recommendations(wedding_plan_id: int, db: Session = Depends(get_db),
                           user: User = Depends(require_customer)):
    customer = customer_profile(user)
    plan = owned_plan(db, user, wedding_plan_id)
    memory = build_memory(db, plan, get_or_create_conversation(db, customer.id, plan.id), "")
    summary = build_recommendations(db, customer.id, plan.id, memory)
    candidates = build_package_candidates(db, customer.id, memory, "", "normal", False)
    summary.options = build_recommendation_options(candidates, summary, memory)
    summary.recommendation_summary = package_reply(summary, memory)
    return save_recommendations(db, customer.id, plan.id, summary)

@router.post("/recommendations/replacement/{booking_id}", response_model=AIReplacementResponse)
def replacement_recommendation(
    booking_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_customer),
):
    return find_replacement_provider(db, user, booking_id)
