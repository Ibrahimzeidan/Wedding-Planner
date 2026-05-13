from sqlalchemy.orm import Session

from schemas.ai import AIChatResponse, AIRecommendationSummary
from services.ai_context_service import save_message
from services.ai_guardrails import missing_plan_fields


def should_ask_for_details(message: str, memory: dict) -> bool:
    text = message.lower()
    generic = "wedding package" in text or "recommend" in text or "for my plan" in text
    critical = {"budget", "guest count", "preferred location"}
    if "my location" in text and not memory.get("location"):
        return True
    if memory.get("needs_replacement_target"):
        return True
    if memory.get("needs_guest_delta"):
        return True
    if memory.get("needs_guest_base"):
        return True
    return generic and bool(critical.intersection(missing_plan_fields(memory)))


def detail_question(message: str, memory: dict) -> str:
    if "my location" in message.lower() and not memory.get("location"):
        return "What preferred location should I search in?"
    if memory.get("needs_replacement_target"):
        return "Which service provider or category should I replace?"
    if memory.get("needs_guest_delta"):
        return "How many guests should I add?"
    if memory.get("needs_guest_base"):
        return "What is your current guest count before adding guests?"
    return f"What is your {', '.join(missing_plan_fields(memory))}?"


def summary_message(summary: AIRecommendationSummary) -> str:
    note = f" {summary.recommendation_summary}" if summary.recommendation_summary else ""
    if not summary.items:
        return summary.recommendation_summary or "I could not find matching available packages in your database yet."
    remaining = summary.remaining_budget
    budget_line = f" Remaining budget: ${remaining:,.0f}." if remaining is not None else ""
    return f"I found {len(summary.items)} database-backed recommendation(s).{budget_line}{note}"


def chat_reply(db: Session, conversation_id: int, message: str) -> AIChatResponse:
    save_message(db, conversation_id, "assistant", message)
    return AIChatResponse(
        conversation_id=conversation_id,
        message=message,
        total_estimated_cost=0,
        remaining_budget=None,
        items=[],
    )
