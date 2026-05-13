from services.ai_category_names import canonical_category
from services.ai_nlu_constants import CATEGORY_ALIASES

ADD_WORDS = ["add", "include", "put", "bring", "want", "choose", "select"]
REMOVE_WORDS = ["remove", "delete", "drop", "take out", "take off", "don't want", "dont want"]
REPLACE_AFTER_REMOVE = ["another", "replace", "instead", "different", "new one", "find me"]


def add_categories(message: str, providers: list | None = None) -> list[str]:
    text = message.lower()
    cats = categories_with_words(text, ADD_WORDS)
    if providers and any(word in text for word in ADD_WORDS):
        cats += [provider_category(provider) for provider in providers if not negative_context(text, provider)]
    return dedupe(cats)


def remove_categories(message: str, providers: list | None = None) -> list[str]:
    text = message.lower()
    if replacement_after_remove(text):
        return []
    cats = categories_with_words(text, REMOVE_WORDS)
    if providers and any(word in text for word in REMOVE_WORDS):
        cats += [provider_category(provider) for provider in providers]
    return dedupe(cats)


def replacement_after_remove(text: str) -> bool:
    return "remove" in text and any(phrase in text for phrase in REPLACE_AFTER_REMOVE)


def categories_with_words(text: str, words: list[str]) -> list[str]:
    if not any(word in text for word in words):
        return []
    return [
        category
        for category, aliases in CATEGORY_ALIASES.items()
        if any(alias in text for alias in aliases)
    ]


def provider_category(provider) -> str:
    return canonical_category(provider.category.name if provider.category else None)


def negative_context(text: str, provider) -> bool:
    name = (provider.business_name or "").lower()
    before = text.split(name)[0][-30:] if name and name in text else text
    return "don't want" in before or "dont want" in before or "remove" in before


def dedupe(items: list[str]) -> list[str]:
    return list(dict.fromkeys(item for item in items if item))
