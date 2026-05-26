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

## How this project works

### Backend (server)

- `server/src/index.js` starts an Express server and enables CORS for Vite frontends.
- `server/src/routes/auth.routes.js` mounts authentication and authorization endpoints under `/api/auth`.
- `register` and `login` live in `server/src/controllers/auth.controller.js`.
  - `register` hashes the password with `bcrypt` and saves the user to the database.
  - `login` checks the password, then returns a JWT if credentials are valid.
- `server/src/utils/jwt.js` signs JWT tokens using `JWT_SECRET`.
  - The token payload includes `id`, `roleId`, and `email`.
  - The token expires in one day (`1d`).
- `server/src/middleware/auth.middleware.js` checks the `Authorization: Bearer <token>` header.
  - If the JWT is valid, it attaches the decoded user to `req.user`.
- `server/src/middleware/rbac.middleware.js` performs authorization.
  - It loads role permissions from the database and checks for the required permission string.
  - Routes like `/students`, `/grades`, and `/users` use this middleware.
- `server/src/controllers/user.controller.js` returns the current user profile and permissions.
- `server/src/controllers/role.controller.js` returns the available roles for registration.

### Database and RBAC

- Prisma defines the schema in `server/prisma/schema.prisma`.
- Key models:
  - `User` stores email, hashed password, and `roleId`.
  - `Role` defines roles such as `admin`, `teacher`, and `student`.
  - `Permission` defines permission strings like `manage_users`, `view_students`, and `create_grade`.
  - `RolePermission` links roles to permissions.
- This is role-based access control (RBAC): the user gets permissions through their role.

### Frontend (client)

- `client/src/App.jsx` renders the main `AuthApp` component.
- `client/src/components/AuthApp.jsx` holds the application state and API logic.
  - It loads role options from `/roles`.
  - It performs `register` and `login` requests.
  - It saves the returned JWT in `localStorage`.
  - It fetches `/me` to load the current user profile and permission details.
  - It sends the JWT with `Authorization: Bearer <token>` for protected requests.
- `client/src/components/AuthForm.jsx` renders the login/register form.
- `client/src/components/UserPanel.jsx` shows the logged-in user and protected action buttons.
- `client/src/components/MessageBox.jsx` displays feedback to the user.
- `client/src/index.css` is configured for Tailwind and global styles.

### JWT concepts in this codebase

- A JWT (JSON Web Token) is an encoded token that proves a user has authenticated.
- In this project, the server issues a JWT after `login` or `register`.
- The client stores the JWT and sends it on protected requests.
- The server verifies the JWT with a secret key before allowing access.

### Access tokens vs refresh tokens

- This app currently uses only access tokens.
- An access token is short-lived and sent with every request.
- A refresh token is a separate token used to request a new access token when the old one expires.
- Refresh tokens are not implemented here, but a production-ready system would usually:
  - issue a short-lived access token
  - issue a long-lived refresh token stored securely (for example, as an httpOnly cookie)
  - provide a `/refresh` endpoint to exchange a refresh token for a new access token
  - provide a `/logout` endpoint to revoke refresh tokens.

### Dockerization

- `docker-compose.yml` defines three services:
  - `client` for the React frontend
  - `server` for the Express backend
  - `db` for the PostgreSQL database
- The server uses `DATABASE_URL=postgresql://postgres:password@db:5432/school_db` within Docker.
- The client uses `VITE_API_BASE_URL` to call the backend.
- `docker compose up --build` builds and starts all services together.

## How to explain this to someone else

1. The user opens the UI in the browser and chooses login or register.
2. The UI calls a backend API endpoint with email/password.
3. The backend checks the credentials and creates a JWT.
4. The UI stores the JWT and sends it with future requests.
5. The backend confirms the JWT is valid and extracts the user role.
6. For protected actions, the backend also checks whether the user’s role includes the required permission.
7. The database stores users, roles, permissions, and role-permission links.
8. Docker ties the client, server, and database together so the whole app runs with one command.

## Notes

- `client/.env` is safe for public config values only.
- Real secrets belong in `server/.env` only.
- Both `client/.env` and `server/.env` are excluded from Git via `.gitignore`.
