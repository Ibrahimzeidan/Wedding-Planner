from schemas.ai import AIRecommendationItem, AIRecommendationOption, AIRecommendationSummary


def build_recommendation_options(
    candidates: list[AIRecommendationItem],
    primary: AIRecommendationSummary,
    memory: dict,
) -> list[AIRecommendationOption]:
    options: list[AIRecommendationOption] = []
    if primary.items:
        options.append(make_option("Recommended Package 1", primary.items, memory, "Best overall match."))
    for index in range(3):
        items = option_items(candidates, index)
        if not items or same_as_existing(items, options):
            continue
        options.append(make_option(f"Recommended Package {len(options) + 1}", items, memory, ""))
        if len(options) == 3:
            break
    if options:
        base_total = options[0].total_estimated_cost
        for option in options[1:]:
            option.difference = difference(option, base_total)
    return options


def option_items(candidates: list[AIRecommendationItem], index: int) -> list[AIRecommendationItem]:
    grouped: dict[str, list[AIRecommendationItem]] = {}
    for item in candidates:
        items = grouped.setdefault(item.category, [])
        if item.provider_id not in {existing.provider_id for existing in items}:
            items.append(item)
    return [items[index] for items in grouped.values() if len(items) > index]


def make_option(
    title: str,
    items: list[AIRecommendationItem],
    memory: dict,
    difference_text: str,
) -> AIRecommendationOption:
    total = round(sum(item.price for item in items), 2)
    remaining = round(float(memory["budget"]) - total, 2) if memory.get("budget") else None
    return AIRecommendationOption(
        title=title,
        total_estimated_cost=total,
        remaining_budget=remaining,
        difference=difference_text,
        items=items,
    )


def same_as_existing(items: list[AIRecommendationItem], options: list[AIRecommendationOption]) -> bool:
    signature = {(item.category, item.provider_id) for item in items}
    return any(signature == {(item.category, item.provider_id) for item in option.items} for option in options)


def difference(option: AIRecommendationOption, base_total: float) -> str:
    delta = round(option.total_estimated_cost - base_total, 2)
    providers = ", ".join(item.provider for item in option.items[:3])
    if delta < 0:
        price = f"${abs(delta):,.0f} cheaper"
    elif delta > 0:
        price = f"${delta:,.0f} more expensive"
    else:
        price = "the same total price"
    return f"Uses different providers ({providers}) and is {price} than package 1."
