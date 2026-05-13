import json
import os
import urllib.error
import urllib.request

SYSTEM_PROMPT = (
    "You are a wedding planning assistant. You may ONLY answer using the provided database "
    "results. Never invent providers, prices, or packages. If information is missing, ask "
    "follow-up questions. If the topic is not wedding planning, politely refuse."
)


def public_memory(memory: dict) -> dict:
    keys = ["budget", "guest_count", "wedding_date", "location", "preferred_services"]
    return {key: memory.get(key) for key in keys}


def post_gemini(api_key: str, prompt: str, max_tokens: int = 360) -> dict:
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": max_tokens,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }
    request = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(payload).encode("utf-8"),
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def extract_text(data: dict) -> str | None:
    for candidate in data.get("candidates", []):
        content = candidate.get("content") or {}
        texts = [
            part.get("text", "")
            for part in content.get("parts", [])
            if isinstance(part.get("text"), str)
        ]
        joined = "".join(texts).strip()
        if joined:
            return joined
    return None


def gemini_key() -> str | None:
    return os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY")


def is_gemini_error(error: Exception) -> bool:
    return isinstance(error, (OSError, urllib.error.URLError, json.JSONDecodeError, TimeoutError))
