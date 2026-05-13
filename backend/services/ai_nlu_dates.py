import re
from datetime import date, timedelta

MONTHS = {
    "january": 1, "jan": 1, "february": 2, "feb": 2, "march": 3, "mar": 3,
    "april": 4, "apr": 4, "may": 5, "june": 6, "jun": 6, "july": 7,
    "jul": 7, "august": 8, "aug": 8, "september": 9, "sep": 9,
    "october": 10, "oct": 10, "november": 11, "nov": 11, "december": 12,
    "dec": 12,
}
WEEKDAYS = {
    "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
    "friday": 4, "saturday": 5, "sunday": 6,
}


def extract_date(message: str, today: date | None = None) -> str | None:
    today = today or date.today()
    text = message.lower()
    iso = re.search(r"\b(20\d{2}-\d{1,2}-\d{1,2})\b", text)
    if iso:
        return normalize_date(*map(int, iso.group(1).split("-")))
    if numeric := numeric_date(text, today):
        return numeric
    if named := named_month_date(text, today):
        return named
    if relative := relative_date(text, today):
        return relative
    return None


def numeric_date(text: str, today: date) -> str | None:
    match = re.search(r"\b(\d{1,2})[./-](\d{1,2})(?:[./-](20\d{2}|\d{2}))?\b", text)
    if not match:
        return None
    day, month = int(match.group(1)), int(match.group(2))
    year = expand_year(match.group(3), today, month, day)
    return normalize_date(year, month, day)


def named_month_date(text: str, today: date) -> str | None:
    month_names = "|".join(MONTHS)
    patterns = [
        rf"\b({month_names})\s+(\d{{1,2}})(?:,\s*(20\d{{2}}))?\b",
        rf"\b(\d{{1,2}})\s+({month_names})(?:\s*(20\d{{2}}))?\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if not match:
            continue
        first, second, year_text = match.group(1), match.group(2), match.group(3)
        month = MONTHS[first] if first in MONTHS else MONTHS[second]
        day = int(second if first in MONTHS else first)
        return normalize_date(int(year_text) if year_text else choose_year(today, month, day), month, day)
    return None


def relative_date(text: str, today: date) -> str | None:
    if "next summer" in text or "summer" == text.strip():
        return normalize_date(today.year if today.month < 6 else today.year + 1, 7, 1)
    if "end of june" in text:
        year = choose_year(today, 6, 30)
        return normalize_date(year, 6, 30)
    weekday = re.search(r"\bnext\s+(" + "|".join(WEEKDAYS) + r")\b", text)
    if weekday:
        days = (WEEKDAYS[weekday.group(1)] - today.weekday()) % 7 or 7
        return (today + timedelta(days=days)).isoformat()
    return None


def expand_year(year_text: str | None, today: date, month: int, day: int) -> int:
    if not year_text:
        return choose_year(today, month, day)
    return int(year_text) + 2000 if len(year_text) == 2 else int(year_text)


def choose_year(today: date, month: int, day: int) -> int:
    return today.year + (date(today.year, month, day) < today)


def normalize_date(year: int, month: int, day: int) -> str | None:
    try:
        return date(year, month, day).isoformat()
    except ValueError:
        return None
