# Coding Platform (LeetCode-style)

Beginner-friendly full-stack coding platform with:

- React + Tailwind frontend
- Node + Express + MongoDB backend
- JWT + Google OAuth authentication
- Judge0 integration for code execution

## Folder Structure

```text
CP/
  client/
    src/
      api/
      components/
      context/
      pages/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
```

## Setup

### 1) Backend

```bash
cd server
npm install
cp .env.example .env
```

Set real values in `.env`.

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd client
npm install
cp .env.example .env
```

Run frontend:

```bash
npm run dev
```

## Notes

- Ensure MongoDB is running locally or provide a cloud `MONGO_URI`.
- Run Judge0 locally with Docker and set `JUDGE0_BASE_URL=http://localhost:2358`.
- First server run seeds a starter problem automatically.

## Local Judge0 (no API key)

Start dependencies:

```bash
docker run -d --name judge0-db -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=judge0 -e POSTGRES_DB=judge0 postgres:13
docker run -d --name judge0-redis redis:6
```

Start Judge0 API:

```bash
docker run -d --name judge0-server -p 2358:2358 -e REDIS_HOST=judge0-redis -e POSTGRES_HOST=judge0-db -e POSTGRES_USER=judge0 -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=judge0 --link judge0-db --link judge0-redis judge0/judge0:1.13.1
```
