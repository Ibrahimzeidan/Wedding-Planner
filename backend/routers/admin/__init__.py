from routers.admin.bookings import router as bookings_router
from routers.admin.categories import router as categories_router
from routers.admin.customers import router as customers_router
from routers.admin.messages import router as messages_router
from routers.admin.notifications import router as notifications_router
from routers.admin.packages import router as packages_router
from routers.admin.providers import router as providers_router
from routers.admin.reviews import router as reviews_router
from routers.admin.stats import router as stats_router
from routers.admin.users import router as users_router
from routers.admin.ai_recommendations import router as ai_recommendations_router
from routers.admin.favorites import router as favorites_router
from routers.admin.wedding_packages import router as wedding_packages_router
from routers.admin.wedding_plans import router as wedding_plans_router

admin_routers = [
    stats_router,
    users_router,
    categories_router,
    providers_router,
    customers_router,
    packages_router,
    wedding_packages_router,
    wedding_plans_router,
    favorites_router,
    bookings_router,
    reviews_router,
    notifications_router,
    messages_router,
    ai_recommendations_router,
]
