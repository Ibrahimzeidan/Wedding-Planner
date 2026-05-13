import re

from services.ai_nlu_constants import STYLE_WORDS
from services.ai_nlu_dates import extract_date


def extract_budget(message: str) -> float | None:
    text = message.lower().replace(",", "")
    k_match = re.search(r"(?:budget|under|below|max|about|around|~|\$)?\D{0,8}(\d+(?:\.\d+)?)\s*k\b", text)
    if k_match:
        return float(k_match.group(1)) * 1000
    dollar = re.search(r"\$\s*(\d{3,})", text)
    if dollar:
        return float(dollar.group(1))
    trailing_dollar = re.search(r"\b(\d{3,})\s*(?:\$|usd|dollars?)", text)
    if trailing_dollar:
        return float(trailing_dollar.group(1))
    budget = re.search(r"(?:budget|under|below|max|about|around|becomes|dollars?)\D{0,16}(\d{3,})", text)
    return float(budget.group(1)) if budget else None


def extract_guest_count(message: str) -> int | None:
    text = message.lower()
    base = re.search(
        r"(?:current|existing|original|base|before adding|guest count(?: is|:)?|we have|we are|already)\D{0,20}(\d{1,5})",
        text,
    )
    if base:
        return int(base.group(1))
    for match in re.finditer(r"(?:around|about|approximately|approx)?\s*(\d{1,5})\s*(?:guests|guest|people|persons)", text):
        if not looks_like_delta(text, match.start(), match.end()):
            return int(match.group(1))
    if "small wedding" in text:
        return 50
    if "big wedding" in text or "large wedding" in text:
        return 250
    return None


def looks_like_delta(text: str, start: int, end: int) -> bool:
    prefix = text[max(0, start - 28):start]
    suffix = text[end:end + 28]
    delta_words = r"(?:add|adding|increase|plus|another|more|additional|extra|new)"
    return bool(re.search(delta_words + r"\W*$", prefix) or re.search(r"^\W*" + delta_words, suffix))


def extract_guest_delta(message: str) -> int | None:
    text = message.lower()
    patterns = [
        r"(?:add|adding|increase(?: by)?|plus)\D{0,16}(\d{1,4})",
        r"(?:another|more|additional|extra|new)\D{0,16}(\d{1,4})",
        r"(\d{1,4})\s*(?:more|additional|extra|new)\s*(?:guests|guest|people|persons)",
        r"(\d{1,4})\s*(?:people|persons|guests|guest)\s*more",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return int(match.group(1))
    return None


def extract_standalone_number(message: str) -> int | None:
    match = re.fullmatch(r"\s*(\d{1,5})\s*", message)
    return int(match.group(1)) if match else None


def extract_location(message: str) -> str | None:
    text = message.strip()
    match = re.search(r"\b(?:in|near|at|around|location is|somewhere near)\s+([A-Za-z][A-Za-z\s-]{1,40})", text)
    if match:
        location = re.split(r"\b(?:under|below|with|for|and|on|about)\b", match.group(1))[0].strip()
        return None if location.lower().startswith("my location") else location
    if re.search(r"\bmountain area\b", text.lower()):
        return "mountain area"
    return None


def extract_style(message: str) -> str | None:
    text = message.lower()
    if "not too expensive" in text:
        return "budget"
    for word in STYLE_WORDS:
        if word in text:
            return word
    return None
