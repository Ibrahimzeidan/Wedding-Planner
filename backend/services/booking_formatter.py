from models import Booking, ServiceProvider
from schemas.booking import BookingOut


def provider_name(provider: ServiceProvider | None) -> str | None:
    if not provider:
        return None
    return provider.business_name or (provider.user.full_name if provider.user else None)


def booking_out(booking: Booking) -> BookingOut:
    customer_user = booking.customer.user if booking.customer else None
    return BookingOut(
        id=booking.id,
        customer_id=booking.customer_id,
        provider_id=booking.provider_id,
        package_id=booking.package_id,
        wedding_package_id=booking.wedding_package_id,
        customer_name=customer_user.full_name if customer_user else None,
        provider_name=provider_name(booking.provider),
        package_title=booking.package.title if booking.package else None,
        wedding_package_title=booking.wedding_package.title if booking.wedding_package else None,
        event_date=booking.event_date,
        guest_count=booking.guest_count,
        phone_number=booking.phone_number,
        location=booking.location,
        notes=booking.notes,
        total_price=float(booking.total_price or 0),
        booking_status=booking.booking_status,
        provider_response_note=booking.provider_response_note,
        customer_confirmed=booking.customer_confirmed,
        provider_confirmed=booking.provider_confirmed,
        conversation_id=booking.conversation.id if booking.conversation else None,
        payment_method=booking.payment_method,
        payment_status=booking.payment_status,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
    )
