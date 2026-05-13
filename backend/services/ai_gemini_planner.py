import json

from schemas.ai import AIRecommendationItem, AIRecommendationSummary
from services.ai_candidate_service import summary_from_ids
from services.ai_gemini_service import extract_text, gemini_key, is_gemini_error
from services.ai_gemini_service import post_gemini, public_memory
from services.ai_response_text import package_reply


def plan_with_gemini(
    user_message: str,
    memory: dict,
    candidates: list[AIRecommendationItem],
    fallback_summary: AIRecommendationSummary,
    fallback_message: str,
) -> tuple[AIRecommendationSummary, str]:
    key = gemini_key()
    if not key or not candidates:
        return fallback_summary, fallback_message
    try:
        data = post_gemini(key, planner_prompt(user_message, memory, candidates), 1200)
        parsed = parse_json(extract_text(data) or "")
        summary = summary_from_ids(candidates, parsed.get("package_ids", []), memory)
        if not summary.items:
            return fallback_summary, fallback_message
        return summary, with_availability_note(package_reply(summary, memory), summary.recommendation_summary)
    except Exception as error:
        if is_gemini_error(error):
            return fallback_summary, fallback_message
        raise


def planner_prompt(
    user_message: str,
    memory: dict,
    candidates: list[AIRecommendationItem],
) -> str:
    context = {
        "user_message": user_message,
        "memory": public_memory(memory),
        "database_candidates": [candidate.model_dump() for candidate in candidates],
    }
    return (
        "Choose the best wedding package recommendations from the candidates. "
        "Return only valid compact JSON with keys message and package_ids. Keep message "
        "under 45 words. package_ids must be selected only from database_candidates. "
        "Do not invent anything.\n"
        f"{json.dumps(context, default=str)}"
    )


def parse_json(text: str) -> dict:
    clean = text.strip()
    if clean.startswith("```"):
        clean = clean.strip("`")
        clean = clean.removeprefix("json").strip()
    start = clean.find("{")
    end = clean.rfind("}")
    if start >= 0 and end >= start:
        clean = clean[start:end + 1]
    data = json.loads(clean)
    return data if isinstance(data, dict) else {}


def with_availability_note(message: str, note: str | None) -> str:
    return f"{message} {note}" if note and note not in message else message
