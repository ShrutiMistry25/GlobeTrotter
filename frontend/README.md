# GlobeTrotter Frontend

React 18 + Vite + Tailwind CSS single-page app for GlobeTrotter, styled with the "Warm Airy" design system (cream surfaces, terracotta & sage accents, Plus Jakarta Sans).

## Structure

```
frontend/src/
├── api/            # axios client + typed endpoint modules
├── components/     # Navbar, Footer, TripCard, TripTabs, UI kit, guards
├── context/        # AuthContext (JWT session), ToastContext
├── pages/
│   ├── auth/       # Login, Signup, Forgot/Reset Password
│   ├── trips/      # Create, My Trips, Builder, View, Calendar, Budget
│   ├── explore/    # City Search, Activity Search
│   └── public/     # Shared Itinerary (/share/:slug)
└── utils/          # money/date formatters
```

## Routes

| Path | Page |
|---|---|
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth screens |
| `/` | Dashboard |
| `/trips` · `/trips/new` | Trip list · create trip |
| `/trips/:id/build` | Itinerary builder (add/reorder stops + activities) |
| `/trips/:id/view` | Day-by-day timeline view |
| `/trips/:id/calendar` | Month calendar + day panel + export |
| `/trips/:id/budget` | Charts, KPIs, expense log |
| `/explore/cities` · `/explore/activities` | Discovery + add-to-trip |
| `/profile` | Settings, saved horizons, delete account |
| `/share/:slug` | Public shared itinerary |

## Run

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
```

The API URL is read from `VITE_API_URL` (repo-root `.env`, defaults to `http://localhost:5000/api`). Start the backend first.
