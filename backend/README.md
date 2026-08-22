# GlobeTrotter Backend

Express REST API serving the GlobeTrotter travel-planning app. Node.js + MySQL 8, JWT auth, layered structure (`routes → controllers → models`), centralized error handling and express-validator rules.

## Structure

```
backend/src/
├── config/db.js          # mysql2/promise pool
├── middleware/           # auth (JWT), validate, errorHandler
├── utils/                # asyncHandler, token/slug helpers
├── controllers/          # request handling per domain
├── routes/               # /auth /users /cities /activities /trips /public
├── app.js                # express app, CORS, routes, 404/error handlers
└── server.js             # listens on :5000
models/                   # SQL query layer (users, cities, activities, trips, share)
```

## Run

```bash
cd backend
npm install
npm start            # or: node --watch src/server.js
```

Environment comes from `backend/.env` (see repo-root `.env.example`):

| Var | Example |
|---|---|
| PORT | 5000 |
| DB_HOST | localhost |
| DB_USER | root |
| DB_PASSWORD | your-password |
| DB_NAME | globetrotter |
| JWT_SECRET | long-random-string |

Create the database first:

```bash
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/seed.sql
```

Health check: `GET http://localhost:5000/api/cities/top` → JSON list.
Full endpoint reference: [`../docs/api-documentation.md`](../docs/api-documentation.md).
