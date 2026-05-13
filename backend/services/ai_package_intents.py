FULL_PACKAGE_PHRASES = [
    "full package",
    "complete package",
    "whole package",
    "package for my wedding",
    "all services",
    "everything",
]

NEW_PACKAGE_PHRASES = [
    "new package",
    "another package",
    "regenerate",
    "start over",
    "different package",
]


def wants_full_package(message: str) -> bool:
    text = message.lower()
    return any(phrase in text for phrase in FULL_PACKAGE_PHRASES)


def wants_new_package(message: str) -> bool:
    text = message.lower()
    return any(phrase in text for phrase in NEW_PACKAGE_PHRASES)
