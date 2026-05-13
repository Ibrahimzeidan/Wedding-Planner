from services.ai_nlu_extractors import extract_guest_delta


def wants_guest_delta_without_amount(message: str) -> bool:
    text = message.lower()
    phrases = [
        "add more guests",
        "add guests",
        "more guests",
        "increase guests",
        "increase the guests",
    ]
    return any(phrase in text for phrase in phrases) and extract_guest_delta(text) is None
