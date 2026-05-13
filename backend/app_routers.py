from routers.account import router as account_router
from routers.ai import router as ai_router
from routers.admin import admin_routers
from routers.auth import router as auth_router
from routers.bookings import router as bookings_router
from routers.contact import router as contact_router
from routers.favorites import router as favorites_router
from routers.health import router as health_router
from routers.messages import router as messages_router
from routers.notifications import router as notifications_router
from routers.provider.bookings import router as provider_bookings_router
from routers.provider.notifications import router as provider_notifications_router
from routers.provider.reviews import router as provider_reviews_router
from routers.provider_packages import router as provider_packages_router
from routers.public_packages import router as public_packages_router
from routers.public_providers import router as public_providers_router
from routers.reviews import router as reviews_router
from routers.service_categories import router as service_categories_router
from routers.services import router as services_router
from routers.venues import router as venues_router
from routers.wedding_plans import router as wedding_plans_router

app_routers = [
    health_router,
    contact_router,
    auth_router,
    account_router,
    service_categories_router,
    services_router,
    venues_router,
    wedding_plans_router,
    ai_router,
    favorites_router,
    bookings_router,
    messages_router,
    notifications_router,
    reviews_router,
    provider_packages_router,
    provider_bookings_router,
    provider_notifications_router,
    provider_reviews_router,
    public_packages_router,
    public_providers_router,
    *admin_routers,
]
