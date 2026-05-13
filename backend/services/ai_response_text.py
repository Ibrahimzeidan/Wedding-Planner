from schemas.ai import AIRecommendationSummary


def package_reply(summary: AIRecommendationSummary, memory: dict) -> str:
    if not summary.items:
        if memory.get("remove_categories"):
            removed = ", ".join(memory["remove_categories"]).lower()
            return f"I removed {removed} from your package. Your package is now empty."
        return summary.recommendation_summary or "I could not find matching available packages in your database yet."
    prefix = ""
    if memory.get("missing_provider_name"):
        prefix = f"I could not find {memory['missing_provider_name']} in the database. "
    if memory.get("remove_categories"):
        removed = ", ".join(memory["remove_categories"]).lower()
        prefix += f"I removed {removed} from your package. "
    if memory.get("add_categories"):
        added = ", ".join(memory["add_categories"]).lower()
        prefix += f"I added {added} to your package. "
    names = ", ".join(f"{item.provider} for {item.category.lower()}" for item in summary.items[:3])
    extra = "" if len(summary.items) <= 3 else f", plus {len(summary.items) - 3} more service(s)"
    total = f"${summary.total_estimated_cost:,.0f}"
    remaining = ""
    if summary.remaining_budget is not None:
        remaining = f" You still have ${summary.remaining_budget:,.0f} remaining."
    style = f" for a {memory['preferred_style']} style" if memory.get("preferred_style") else ""
    return f"{prefix}I found a database-backed package{style}: {names}{extra}. Total estimate: {total}.{remaining}"
