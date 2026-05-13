from sqlalchemy import select
from sqlalchemy.orm import joinedload

from models import Customer, Favorite, ServiceProvider, WeddingPackage
from schemas.favorite import FavoriteResponse


def favorite_query():
    return select(Favorite).options(
        joinedload(Favorite.customer).joinedload(Customer.user),
        joinedload(Favorite.provider).joinedload(ServiceProvider.user),
        joinedload(Favorite.provider).joinedload(ServiceProvider.category),
        joinedload(Favorite.provider).joinedload(ServiceProvider.packages),
        joinedload(Favorite.package),
    )


def provider_image(provider: ServiceProvider) -> str | None:
    package = next((item for item in provider.packages if item.image_url), None)
    return package.image_url if package else provider.user.profile_image


def serialize_favorite(favorite: Favorite) -> FavoriteResponse:
    return provider_favorite(favorite) if favorite.provider else package_favorite(favorite)


def provider_favorite(favorite: Favorite) -> FavoriteResponse:
    provider = favorite.provider
    customer_user = favorite.customer.user if favorite.customer else None
    return FavoriteResponse(
        id=favorite.id,
        customer_id=favorite.customer_id,
        favorite_type="provider",
        provider_id=favorite.provider_id,
        provider_name=provider.business_name or provider.user.full_name,
        category_name=provider.category.name if provider.category else "Uncategorized",
        location=provider.location,
        rating=float(provider.rating or 0),
        image_url=provider_image(provider),
        created_at=favorite.created_at,
        customer_name=customer_user.full_name if customer_user else None,
        customer_email=customer_user.email if customer_user else None,
    )


def package_favorite(favorite: Favorite) -> FavoriteResponse:
    package: WeddingPackage = favorite.package
    customer_user = favorite.customer.user if favorite.customer else None
    return FavoriteResponse(
        id=favorite.id,
        customer_id=favorite.customer_id,
        favorite_type="package",
        package_id=favorite.package_id,
        package_title=package.title,
        category_name="Wedding Package",
        image_url=package.image_url,
        created_at=favorite.created_at,
        customer_name=customer_user.full_name if customer_user else None,
        customer_email=customer_user.email if customer_user else None,
    )
