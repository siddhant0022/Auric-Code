# AuricCode - Full Stack Coding Platform

Interview-ready documentation for the AuricCode project.

## Live Links

- Frontend (Vercel): https://auric-code-one.vercel.app/
- Backend API (Render): https://coding-platform-1-ezzo.onrender.com/

Base API path in production:

- `https://coding-platform-1-ezzo.onrender.com/api`

---

## 1. What This Project Is

AuricCode is a LeetCode-style coding platform where users can:

- Sign up / log in with email-password or Google OAuth
- Browse coding problems
- Open a problem and submit code in multiple languages
- Get verdicts by running against hidden test cases using Judge0
- View leaderboard per problem (top accepted solutions)
- View a personal dashboard (solved problems + recent submissions)

---

## 2. Tech Stack

### Frontend

- React 18 (Vite)
- React Router v6
- Tailwind CSS
- Axios
- Google OAuth client (`@react-oauth/google`)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Google ID token verification (`google-auth-library`)
- Judge0 integration via Axios

### Deployment

- Frontend on Vercel
- Backend on Render
- MongoDB (cloud/local based on `MONGO_URI`)

---

## 3. High-Level Architecture

```text
Browser (React + Tailwind)
  -> Axios calls /api endpoints
  -> JWT in Authorization header

Express API
  -> Auth Middleware (JWT + blacklist check)
  -> Controllers (auth, problems, submissions, users)
  -> Mongoose Models (User, Problem, Submission, BlacklistedToken)
  -> Judge0 Service (external code execution)

MongoDB
  -> Stores users, problems, submissions, token blacklist
```

---

## 4. Folder Structure

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

---

## 5. End-to-End Runtime Flow

### 5.1 App startup flow

1. `server/server.js` loads env vars and creates Express app.
2. CORS allowlist is built from `CLIENT_URL` (comma-separated supported).
3. Middleware is attached (`cors`, `express.json`, `morgan`).
4. Routes are mounted under `/api/*`.
5. Backend connects to MongoDB.
6. `ensureSeedProblems()` runs once on startup to seed starter questions.
7. Frontend bootstraps React and wraps app with:
   - `GoogleOAuthProvider`
   - `AuthProvider`
8. `AuthProvider` restores user from `localStorage` if available.

### 5.2 Authentication flow

#### Signup (`POST /api/auth/signup`)

1. Frontend sends `{ name, email, password }`.
2. Backend validates fields and checks duplicate email.
3. Password is hashed with bcrypt.
4. User is created with `oauthProvider: "local"`.
5. JWT token (`expiresIn: 7d`) is returned with user info.
6. Frontend stores token + user in `localStorage`.

#### Login (`POST /api/auth/login`)

1. Frontend sends `{ email, password }`.
2. Backend finds user by lowercased email.
3. Password is verified with bcrypt.
4. JWT + user payload is returned.
5. Frontend stores session and navigates to home.

#### Google Login (`POST /api/auth/google`)

1. Frontend Google widget returns `credential` (ID token).
2. Backend verifies token using `GOOGLE_CLIENT_ID`.
3. If user doesn't exist, a new user is created with `oauthProvider: "google"`.
4. JWT + user payload is returned.

#### Logout (`POST /api/auth/logout`)

1. Protected route extracts bearer token.
2. Backend decodes token expiry.
3. Token is added/upserted into `BlacklistedToken`.
4. TTL index automatically deletes expired blacklist entries.
5. Frontend clears local storage regardless of request outcome.

### 5.3 Problem browsing flow

#### Problems list (`GET /api/problems`)

1. Frontend pages call API on mount.
2. Backend returns lightweight fields: `title`, `topic`, `difficulty`, `createdAt`.
3. Questions page groups problems by topic and by difficulty (`Easy/Medium/Hard`).

#### Problem detail (`GET /api/problems/:id`)

1. Protected route on frontend ensures user is logged in.
2. Backend returns full problem details except hidden test cases (`select("-testCases")`).
3. Frontend preloads starter code for selected language.

### 5.4 Submission + judging flow

Main route: `POST /api/submissions` (protected)

1. Frontend sends:
   - `problemId`
   - `code`
   - `language` (label)
   - `languageId` (Judge0 numeric language ID)
2. Backend loads problem and iterates over hidden test cases.
3. For each test case:
   - Input variants are generated (`buildInputVariants`) to handle common CP formats.
   - Code is sent to Judge0 (`submitAndWait`).
   - Polling continues until terminal status or timeout.
4. Output comparison:
   - Whitespace-normalized line comparison.
   - Numeric token comparison with tolerance (`OUTPUT_COMPARE_EPSILON`, default `1e-6`).
5. Verdict mapping:
   - Accepted
   - Wrong Answer
   - Compile Error
   - Runtime Error
   - Timeout
   - Execution Provider Error
6. Submission is stored in MongoDB.
7. On `Accepted`, problem ID is added to user's `solvedProblems` via `$addToSet`.
8. API returns submission result plus details (stderr/compile output/status text).
9. Frontend then fetches per-problem leaderboard.

### 5.5 Leaderboard flow

Route: `GET /api/submissions/problem/:problemId/leaderboard` (protected)

Aggregation pipeline:

1. Filter accepted submissions for the problem.
2. Sort by runtime, memory, then earliest created time.
3. Group by user to keep each user's best accepted submission.
4. Sort again and limit top 10.
5. Join user collection to show usernames.

### 5.6 Dashboard flow

Route: `GET /api/users/dashboard` (protected)

Backend returns:

- Logged in user basic profile
- Populated solved problems (`title`, `difficulty`)
- Last 20 submissions with populated problem data

---

## 6. API Summary

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout` (protected)

### Problems

- `GET /api/problems`
- `GET /api/problems/:id`

### Submissions

- `POST /api/submissions` (protected)
- `GET /api/submissions/me` (protected)
- `GET /api/submissions/problem/:problemId/leaderboard` (protected)

### User

- `GET /api/users/dashboard` (protected)

---

## 7. Data Models

### User

- `name`, `email`, `password?`, `oauthProvider`
- `solvedProblems: ObjectId[]`

### Problem

- `title`, `topic`, `difficulty`
- `description`, `constraints[]`, `examples[]`
- `starterCode` (python/javascript/cpp/java)
- `testCases[]` (hidden from detail API)

### Submission

- `user`, `problem`
- `code`, `language`, `languageId`
- `status`, `runtimeMs`, `memoryKb`

### BlacklistedToken

- `token`, `expiresAt`
- TTL index for automatic cleanup

---

## 8. Environment Variables

### 8.1 Backend (`server/.env`)

- `PORT=5000`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `GOOGLE_CLIENT_ID=...`
- `JUDGE0_BASE_URL=http://localhost:2358`
- `JUDGE0_API_KEY=` (optional when using RapidAPI)
- `JUDGE0_API_HOST=` (optional when using RapidAPI)
- `JUDGE0_TIMEOUT_MS=15000`
- `JUDGE0_RETRY_COUNT=2`
- `JUDGE0_RETRY_DELAY_MS=400`
- `JUDGE0_POLL_MAX_ATTEMPTS=12`
- `JUDGE0_POLL_INTERVAL_MS=700`
- `OUTPUT_COMPARE_EPSILON=1e-6`
- `CLIENT_URL=http://localhost:5173`

### 8.2 Frontend (`client/.env`)

- `VITE_API_URL=http://localhost:5000/api`
- `VITE_GOOGLE_CLIENT_ID=...`

---

## 9. Local Setup

### 9.1 Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 9.2 Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### 9.3 Local Judge0 (Docker)

```bash
docker run -d --name judge0-db -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=judge0 -e POSTGRES_DB=judge0 postgres:13
docker run -d --name judge0-redis redis:6
docker run -d --name judge0-server -p 2358:2358 -e REDIS_HOST=judge0-redis -e POSTGRES_HOST=judge0-db -e POSTGRES_USER=judge0 -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=judge0 --link judge0-db --link judge0-redis judge0/judge0:1.13.1
```

---

## 10. Security and Reliability Notes

- Protected endpoints require Bearer JWT.
- Token blacklist supports logout invalidation before token expiry.
- `testCases` are hidden from problem detail API.
- Judge0 calls have timeout + retry handling for transient failures.
- CORS allowlist supports multiple comma-separated origins.
- Output checker handles numeric precision tolerance.

---

## 11. Interview Talking Points (Use These)

1. Why JWT + blacklist?
   - JWT keeps auth stateless and scalable.
   - Blacklist solves practical logout invalidation.

2. Why hide test cases?
   - Prevents user from hardcoding outputs.
   - Mirrors coding-platform behavior.

3. How is fairness improved in judging?
   - Handles whitespace normalization.
   - Handles float precision with epsilon.
   - Supports input variant adaptation for common CP formats.

4. How is leaderboard computed?
   - Aggregation keeps each user's best accepted submission.
   - Sorted by runtime, memory, and earliest timestamp.

5. What are the tradeoffs?
   - Sequential test case execution is simple but slower at scale.
   - In-memory polling works now; queue workers can improve throughput.
   - `localStorage` token storage is simple; httpOnly cookies can improve XSS posture.

6. What would you improve next?
   - Add role-based admin APIs for problem CRUD.
   - Add rate limiting + request validation.
   - Add test coverage (unit + integration).
   - Add async job queue for submissions (BullMQ/RabbitMQ).
   - Add code editor upgrade (Monaco + themes + linting).

---

## 12. Quick Demo Script for Interview

1. Open frontend and show public landing + questions list.
2. Sign up or login with Google.
3. Open a problem and switch language starter code.
4. Submit wrong code once (show verdict and details).
5. Submit correct code (show Accepted + leaderboard modal).
6. Open dashboard (show solved problems + recent submissions).
7. Explain backend flow from submission request to Judge0 to MongoDB.

---

## 13. Important Current Behavior to Remember

- New starter questions are seeded by editing `server/utils/seedProblems.js`.
- Seeding uses `title` uniqueness and upsert logic.
- Topic backfill updates only when existing problem topic is missing/empty.
- Problem solving page (`/problems/:id`) and dashboard are protected routes.


