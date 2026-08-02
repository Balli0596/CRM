# Datastraw Support CRM

A customer support ticketing system built for the Datastraw assessment.
**Backend:** Python + Django + Django REST Framework, SQLite (swappable to Postgres via `DATABASE_URL`).
**Frontend:** React (Vite) + Tailwind CSS.

## Project structure

```
datastraw-crm/
├── backend/          Django project (API only, no server-rendered pages)
│   ├── config/        settings, urls, wsgi/asgi
│   ├── tickets/        models, serializers, views, admin
│   ├── requirements.txt
│   └── .env.example
└── frontend/         React + Vite + Tailwind SPA
    ├── src/
    │   ├── pages/       Home, NewTicket, TicketDetail
    │   ├── components/  StatusBadge
    │   └── api.js        fetch wrapper for the Django API
    └── .env.example
```

## Data model

Two tables, as specified:

**tickets** — `id`, `ticket_id` (unique, e.g. `TKT-001`, auto-generated), `customer_name`, `customer_email`, `subject`, `description`, `status` (`Open` / `In Progress` / `Closed`), `created_at`, `updated_at`.

**notes** — `id`, `ticket_id` (FK), `note_text`, `created_at`.

## API endpoints

| Method | Path                     | Description                                            |
|--------|--------------------------|----------------------------------------------------------|
| POST   | `/api/tickets`            | Create a ticket. Body: `{customer_name, customer_email, subject, description}` |
| GET    | `/api/tickets`            | List tickets. Query params: `?status=Open&search=jane`   |
| GET    | `/api/tickets/{ticket_id}`| Ticket detail, including its notes                       |
| PUT    | `/api/tickets/{ticket_id}`| Update. Body: `{status, notes}` — `notes` appends a new note |

## Running locally

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```

The API is now live at `http://127.0.0.1:8000/api/`. Django admin at `/admin/`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The app is now live at `http://127.0.0.1:5173`, talking to the API at the URL set in `VITE_API_URL`.

## Deploying

### Backend → Railway.app (recommended for Django)

1. Push this repo to GitHub.
2. On [railway.app](https://railway.app), **New Project → Deploy from GitHub repo**, select the repo, and set the **root directory** to `backend`.
3. Add environment variables (copy from `.env.example`): `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS` (Railway also auto-injects `RAILWAY_PUBLIC_DOMAIN`, already handled in `settings.py`), and `CORS_ALLOWED_ORIGINS` set to your deployed frontend URL.
4. Railway auto-detects Python. Set the **start command** to:
   ```
   python manage.py migrate && gunicorn config.wsgi
   ```
5. (Optional) Add a Railway Postgres plugin and it will inject `DATABASE_URL` automatically — `settings.py` already picks it up. Otherwise it'll keep using SQLite on Railway's ephemeral disk, which is fine for a demo/assessment but not for real persistence.
6. Deploy. Note the public URL Railway gives you — you'll need it for the frontend's `VITE_API_URL`.

### Frontend → Vercel

1. On [vercel.com](https://vercel.com), **New Project**, import the same repo, set **root directory** to `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist` (Vercel usually auto-detects this).
3. Add an environment variable `VITE_API_URL` pointing at your Railway backend, e.g. `https://your-app.up.railway.app/api`.
4. Deploy. Note the frontend's public URL and add it to the backend's `CORS_ALLOWED_ORIGINS` on Railway, then redeploy the backend.

## What I built vs. spec

All 5 core features from the assignment are implemented: create tickets, list tickets, search (debounced, as-you-type), filter by status, and view/update a ticket (status + notes). The database is the exact 2-table schema requested — no extra tables, no over-engineering.

## Possible next steps with more time

- Auth (basic login) so agents' actions on a ticket are attributed to someone.
- Pagination/infinite scroll once the ticket list grows past a page or two.
- Optimistic UI updates on status change instead of a full refetch.
- Email notification to the customer when their ticket status changes.
