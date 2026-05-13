# Provider Date Availability Manual Tests

Use a customer JWT for `/bookings` and `/ai/chat`.

1. Customer A books Zahar Photography on `2026-08-20`.
   Expected: `201 Created` and a booking is returned.

2. Customer B books Zahar Photography on `2026-08-20`.
   Expected: `409 Conflict` with `Someone already booked this service provider on this date.`

3. Customer B books Zahar Photography on `2026-08-21`.
   Expected: `201 Created` and a booking is returned.

4. Customer A cancels the `2026-08-20` booking, then Customer B books it.
   Expected: `201 Created` because `cancelled` does not block availability.

5. AI recommends photography for `2026-08-20` while Zahar is booked.
   Expected: AI explains Zahar is unavailable and names another real available photographer.

6. AI recommends photography when all photographers are booked that date.
   Expected: AI says no real photographer is free and asks for another date.

7. AI package for `150 guests under $8000 in Beirut`.
   Expected: AI returns real database providers only and excludes booked providers.

8. AI user says `What if we add 20 guests?`.
   Expected: AI updates guest count, recalculates, and checks availability again.

9. AI user says `Find cheaper options.`
   Expected: AI searches cheaper available database providers.

10. User asks `I want to buy a laptop.`
    Expected: `I can only help with wedding planning services.`
