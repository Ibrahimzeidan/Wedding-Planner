from models import ServicePackage, ServiceProvider
from schemas.service import ServicePackageOut, ServiceProviderOut


def active_packages(provider: ServiceProvider) -> list[ServicePackage]:
    return [package for package in provider.packages if package.is_active and package.is_available]


def provider_out(provider: ServiceProvider) -> ServiceProviderOut:
    package = next(iter(active_packages(provider)), None)
    packages = [package_out(item, provider) for item in active_packages(provider)]
    category_name = provider.category.name if provider.category else "Uncategorized"
    review_count = len(provider.reviews or [])
    return ServiceProviderOut(
        id=provider.id, user_id=provider.user.id, full_name=provider.user.full_name,
        email=provider.user.email, category_id=provider.category_id,
        business_name=provider.business_name, category_name=category_name,
        description=provider.description, phone=provider.phone, location=provider.location,
        profile_image=provider.user.profile_image, rating=float(provider.rating),
        review_count=review_count,
        package_title=package.title if package else None,
        package_price=float(package.price) if package and package.price else None,
        package_image=package.image_url if package else None,
        venue_type=provider.venue_type, max_guests=provider.max_guests, packages=packages,
    )


def package_out(package: ServicePackage, provider: ServiceProvider) -> ServicePackageOut:
    return ServicePackageOut(
        id=package.id, provider_id=provider.id,
        provider_name=provider.business_name or provider.user.full_name,
        category_name=provider.category.name if provider.category else "Uncategorized",
        title=package.title, description=package.description,
        price=float(package.price) if package.price else None,
        image_url=package.image_url, duration=package.duration,
        capacity=package.capacity, is_available=package.is_available,
    )
