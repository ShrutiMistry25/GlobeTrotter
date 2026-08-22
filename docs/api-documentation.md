# GlobeTrotter API Documentation

Base URL: `http://localhost:5000/api`

All responses are JSON. Authenticated endpoints require the header:

```
Authorization: Bearer <token>
```

Tokens are JWTs returned by `/auth/signup` and `/auth/login` (valid 7 days).

---

## Authentication

### POST /auth/signup
Creates an account and returns a token.

| Body | Type | Rules |
|---|---|---|
| name | string | required |
| email | string | valid email, unique |
| password | string | min 8 chars |

```json
// 201
{
  "message": "Account created successfully",
  "token": "eyJhbGciOi...",
  "user": { "id": 3, "name": "Elena Rossi", "email": "elena@globetrotter.app", "...": "..." }
}
```
Errors: `409` email already exists · `400` validation failed

### POST /auth/login

| Body | Type |
|---|---|
| email | string |
| password | string |

```json
// 200
{ "message": "Login successful", "token": "...", "user": { ... } }
```
Errors: `401` invalid credentials

### POST /auth/forgot-password

| Body | Type |
|---|---|
| email | string |

Dev mode returns a `resetToken` valid for 1 hour (production would email it).

```json
// 200
{ "message": "Reset token generated", "resetToken": "a1b2c3...", "note": "DEV MODE ONLY ..." }
```

### POST /auth/reset-password

| Body | Type |
|---|---|
| token | string |
| password | string (min 8) |

```json
// 200 { "message": "Password updated. You can now log in." }
```
Errors: `400` invalid/expired token

---

## Users / Profile

### GET /users/me *(auth)*
Returns the current user (never includes password hash).

### PUT /users/me *(auth)*
Partial update. Accepts any of: `name`, `avatar_url`, `language_pref`.

### DELETE /users/me *(auth)*
Deletes account **and cascades** all trips/stops/activities/expenses.

### GET /users/me/saved-destinations *(auth)*
Returns saved cities (`"Saved Horizons"`).

### POST /users/me/saved-destinations/:cityId *(auth)* — save a city
### DELETE /users/me/saved-destinations/:cityId *(auth)* — unsave

---

## Cities & Activities (discovery)

### GET /cities?q=&region=&sort=
Public search. `q` matches name/country/description. `region`: Europe, Asia, Africa, Americas, Oceania. `sort=cost` sorts cheapest first. Each city includes `activity_count`.

### GET /cities/:id — single city
### GET /cities/regions — region list with counts
### GET /cities/top?limit=6 — most popular cities (dashboard recommendations)

### GET /activities?cityId=&category=&maxCost=&maxDuration=&q=
Public activity catalog search. `category`: outdoors, culture, food, adventure, relax. Costs are USD numbers, duration in hours.

### GET /activities/:id — single activity

---

## Trips

All trip endpoints verify ownership — foreign IDs return `404`.

### GET /trips *(auth)*
List own trips with summary counters:

```json
{
  "count": 3,
  "trips": [
    {
      "id": 1,
      "name": "Kyoto Autumn Retreat",
      "status": "planned",
      "start_date": "2026-11-08",
      "end_date": "2026-11-16",
      "budget_total": 3000,
      "stop_count": 3,
      "destination_count": 3,
      "activity_count": 11,
      "total_spent": 2442
    }
  ]
}
```

### POST /trips *(auth)*

| Body | Rules |
|---|---|
| name | required |
| start_date / end_date | `YYYY-MM-DD`, end ≥ start |
| description, cover_image_url | optional |
| status | optional: draft (default), planned, completed |
| budget_total | optional number |

### GET /trips/:id *(auth)*
Full nested detail:

```json
{
  "trip": { "id": 1, "...": "..." },
  "stops": [
    {
      "id": 1, "city_id": 2, "city_name": "Tokyo", "city_country": "Japan",
      "arrival_date": "2026-11-08", "departure_date": "2026-11-10", "position": 0,
      "activities": [
        {
          "id": 1, "title": "teamLab Planets Digital Art",
          "scheduled_date": "2026-11-08", "start_time": "17:00:00",
          "duration_hours": 2.5, "est_cost": 25, "category": "culture"
        }
      ]
    }
  ],
  "activities_flat": [ ... ],
  "expenses": [ ... ]
}
```

### PUT /trips/:id — partial update (same fields as create)
### DELETE /trips/:id — cascade delete

### Stops

| Method & Path | Notes |
|---|---|
| `POST /trips/:id/stops` | body: `city_id`, `arrival_date`, `departure_date`, optional `notes`. Appended to route order. |
| `PUT /trips/:id/stops/:stopId` | update dates/notes |
| `DELETE /trips/:id/stops/:stopId` | removes stop + its activities |
| `PUT /trips/:id/stops/reorder` | body `{ "stopIds": [3, 1, 2] }` — full ordering |

### Itinerary activities

| Method & Path | Notes |
|---|---|
| `POST /trips/:id/stops/:stopId/activities` | From catalog: `{ activity_id, scheduled_date, start_time?, notes? }` (title/cost/duration copied). Custom: `{ title, scheduled_date, est_cost?, category?, start_time?, duration_hours?, notes? }` |
| `PUT /trips/:id/stops/:stopId/activities/:activityId` | update fields |
| `DELETE /trips/:id/stops/:stopId/activities/:activityId` | remove |
| `PUT /trips/:id/stops/:stopId/activities/reorder` | body `{ "activityIds": [...] }` |

### Budget

#### GET /trips/:id/budget *(auth)*
Computed on the fly = expenses + itinerary activity costs:

```json
{
  "budget_total": 3000,
  "total_spent": 2442,
  "remaining": 558,
  "percent_used": 81,
  "trip_days": 9,
  "daily_average": 271.33,
  "daily_allowance": 333.33,
  "over_budget_days": ["2026-11-08", "2026-11-12"],
  "by_category": [
    { "category": "transport", "amount": 1120 },
    { "category": "stay", "amount": 750 },
    { "category": "meals", "amount": 264 },
    { "category": "activities", "amount": 220 },
    { "category": "other", "amount": 88 }
  ],
  "per_day": [ { "date": "2026-11-08", "amount": 1230, "over": true } ]
}
```

### Expenses

| Method & Path | Body |
|---|---|
| `GET /trips/:id/expenses` | — |
| `POST /trips/:id/expenses` | `title`*, `amount`*>0, `category` (transport/stay/meals/activities/other), `expense_date?` |
| `PUT /trips/:id/expenses/:expenseId` | partial |
| `DELETE /trips/:id/expenses/:expenseId` | — |

### Sharing

| Method & Path | Effect |
|---|---|
| `POST /trips/:id/share` | Generates/reuses a 12-char slug, sets public. Returns `{ share_slug, share_url }`. |
| `DELETE /trips/:id/share` | Sets private (slug retained for re-enable). |

---

## Public (no auth)

### GET /public/trips/:slug
Read-only shared itinerary incl. owner name/avatar, stops and activities. `404` if not public.

### POST /public/trips/:slug/copy *(auth)*
Clones trip + stops + activities + expenses into your account as `"Copy of <name>"` (status draft).

---

## Error format

Validation failures return `400`:

```json
{ "error": "Trip name is required", "details": [ { "msg": "...", "path": "name" } ] }
```

Other codes: `401` no/bad token · `404` not found or not yours · `409` duplicates · `500` server error.
