from models import ServicePackage


def package_score(
    package: ServicePackage,
    target_budget: float | None,
    favorite_ids: set[int],
    mode: str,
    memory: dict | None = None,
) -> tuple:
    price = float(package.price or 0)
    rating = float(package.provider.rating or 0)
    favorite_rank = 0 if package.provider_id in favorite_ids else 1
    style_rank = style_score(package, (memory or {}).get("preferred_style"))
    if mode == "cheaper":
        return (favorite_rank, style_rank, price, -rating)
    if mode == "value":
        return (favorite_rank, style_rank, -(rating / max(price, 1)), price)
    if mode == "premium":
        return (favorite_rank, style_rank, -rating, -price)
    over_budget = price > target_budget if target_budget else False
    return (favorite_rank, style_rank, over_budget, -rating, price)


def style_score(package: ServicePackage, style: str | None) -> int:
    if not style:
        return 0
    provider = package.provider
    haystack = " ".join([
        package.title or "",
        package.description or "",
        provider.business_name or "",
        provider.description or "",
        provider.venue_type or "",
    ]).lower()
    return 0 if style.lower() in haystack else 1
