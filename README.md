# Smart Wedding Planner Platform

A full-stack wedding planning app for couples, service providers, and admins.
Customers can plan weddings, browse vendors, book packages, message providers,
save favorites, use an AI planner, and leave reviews after bookings.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Supabase PostgreSQL
- Auth: JWT bearer tokens
- AI: Gemini or compatible API key

## Features

- Customer, provider, and admin role flows
- Wedding plans, services, venues, packages, and favorites
- Bookings with payment UI and date conflict protection
- Messaging between customers and providers
- Reviews with customer creation, provider views, and admin moderation
- AI planner using stored wedding and provider data

## Backend Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.
Health check: `http://127.0.0.1:8000/health`.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Environment Variables

Backend:

- `DATABASE_URL`: Supabase PostgreSQL connection string
- `JWT_SECRET`: long random JWT signing secret
- `GEMINI_API_KEY` or `AI_API_KEY`: AI provider key
- `FRONTEND_URL`: deployed Vercel URL for CORS
- `JWT_EXPIRE_MINUTES`: optional token lifetime

Frontend:

- `NEXT_PUBLIC_API_URL`: deployed Render API URL

## Render Backend Deploy

1. Create a Render Web Service from this repo.
2. Use root directory `backend` if not using `render.yaml`.
3. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Add backend environment variables in Render.
6. Open `/health` and confirm `{"status":"ok"}`.

## Vercel Frontend Deploy

1. Import the repo in Vercel.
2. Set root directory to `frontend`.
3. Add `NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com`.
4. Deploy and test register, login, bookings, messages, reviews, and AI planner.
5. Set Render `FRONTEND_URL` to the final Vercel URL.

## Test Accounts

Default admin can be seeded from backend env values:

- `DEFAULT_ADMIN_EMAIL=admin@weddingplanner.com`
- `DEFAULT_ADMIN_PASSWORD=Admin123!`

## Final Checks

```bash
cd backend
.\.venv\Scripts\python.exe -m pytest

cd ..\frontend
npm run build
```
