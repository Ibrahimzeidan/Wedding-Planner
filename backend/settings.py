import os


def cors_origins() -> list[str]:
    defaults = ["http://localhost:3000", "http://127.0.0.1:3000"]
    frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
    extra_urls = os.getenv("CORS_ORIGINS", "")
    origins = defaults + [item.strip().rstrip("/") for item in extra_urls.split(",") if item.strip()]
    if frontend_url:
        origins.append(frontend_url)
    return list(dict.fromkeys(origins))
