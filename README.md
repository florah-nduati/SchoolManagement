# School Management System

A Dockerized React + Express + Prisma RBAC demo with Tailwind styling.

## Environment setup

Sensitive values should be stored in `.env` files only, not committed to source control.

### Client

1. Copy `client/.env.example` to `client/.env`.
2. Do not store secrets in `client/.env`.
3. The only value exposed to the browser is `VITE_API_BASE_URL`.

### Server

1. Copy `server/.env.example` to `server/.env`.
2. Set a strong `JWT_SECRET`.
3. Keep `server/.env` private and do not commit it.

Example `server/.env` values:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/school_db
JWT_SECRET=your-very-secret-key
PORT=5000
```

## Docker (recommended)

From the repository root:

```bash
docker compose up --build
```

This will start:

- UI on `http://localhost:5173`
- Backend API on `http://localhost:5000`
- Database accessible internally as `db:5432`

## Local development

If you run the server locally instead of Docker, update `server/.env` to use your host database connection, for example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/school_db
```

Then start the server and client separately.

## URLs

- UI: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/auth`
- Health check: `http://localhost:5000/api/ping`

## Notes

- `client/.env` is safe for public config values only.
- Real secrets belong in `server/.env` only.
- Both `client/.env` and `server/.env` are excluded from Git via `.gitignore`.
