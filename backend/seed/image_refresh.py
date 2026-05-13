from sqlalchemy import select

from models import ServiceCategory, ServiceProvider
from provider_image_data import provider_image
from service_seed_data import CATEGORIES


def refresh_existing_images(db):
    query = (
        select(ServiceProvider)
        .join(ServiceCategory)
        .where(ServiceCategory.name.in_(CATEGORIES))
        .order_by(ServiceCategory.name, ServiceProvider.id)
    )
    grouped = {}
    for provider in db.scalars(query).all():
        grouped.setdefault(provider.category.name, []).append(provider)
    for category, providers in grouped.items():
        refresh_group(category, providers)


def refresh_group(category, providers):
    for index, provider in enumerate(providers):
        image = provider_image(category, index)
        provider.user.profile_image = image
        for package in provider.packages:
            package.image_url = image
