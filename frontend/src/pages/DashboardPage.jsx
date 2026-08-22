import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripApi, cityApi } from '../api/services';
import TripCard from '../components/TripCard';
import { StatCard, PageLoader, EmptyState, Button, Chip } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { money, fmtDate, rangeLabel, tripDays } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);
  const [recos, setRecos] = useState([]);

  useEffect(() => {
    Promise.all([tripApi.list(), cityApi.top(4)])
      .then(([t, c]) => {
        setTrips(t);
        setRecos(c);
      })
      .catch(() => setTrips([]));
  }, []);

  if (!trips) return <PageLoader />;

  const upcoming = trips.filter((t) => t.status !== 'completed');
  const budgetTrip = upcoming.find((t) => t.budget_total !== null);

  return (
    <div>
      <section className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Good to see you, Traveler.
          </h1>
          <p className="mt-2 text-muted">Where will the wind take you next, {user?.name?.split(' ')[0]}?</p>
        </div>
        <Button onClick={() => (window.location.href = '/trips/new')} className="shrink-0">
          <span className="material-symbols-outlined text-lg">add</span> Plan New Trip
        </Button>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-lg font-bold text-ink">Recent Journeys</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            icon="flight_takeoff"
            title="No trips yet"
            subtitle="Your next adventure is one click away. Start by creating a trip."
            action={<Button onClick={() => (window.location.href = '/trips/new')}>Create your first trip</Button>}
          />
        ) : (
          <div className="hide-scrollbar -mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-2">
            {upcoming.map((t) => (
              <div key={t.id} className="w-[320px] shrink-0 snap-start">
                <TripCard trip={t} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold text-ink">Quiet Recommendations</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {recos.map((c) => (
              <Link
                key={c.id}
                to={`/explore/cities?q=${encodeURIComponent(c.name)}`}
                className="soft-shadow group relative h-52 overflow-hidden rounded-3xl"
              >
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80">{c.country}</p>
                  <h3 className="text-xl font-extrabold">{c.name}</h3>
                  <p className="mt-1 text-xs text-white/85">{c.activity_count} curated activities · {'$'.repeat(c.cost_index)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-shadow flex flex-col rounded-3xl bg-surface p-7">
          <h2 className="text-lg font-bold text-ink">Budget Highlights</h2>
          {budgetTrip ? (
            <>
              <p className="mt-1 text-xs text-muted">{budgetTrip.name}</p>
              <div className="my-6">
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-extrabold tracking-tight text-primary">{money(budgetTrip.total_spent)}</p>
                  <p className="pb-1 text-sm text-muted">of {money(budgetTrip.budget_total)}</p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-tertiary transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.round((budgetTrip.total_spent / budgetTrip.budget_total) * 100))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {Math.round((budgetTrip.total_spent / budgetTrip.budget_total) * 100)}% of budget used ·{' '}
                  {money(Math.max(0, budgetTrip.budget_total - budgetTrip.total_spent))} remaining
                </p>
              </div>
              <Link
                to={`/trips/${budgetTrip.id}/budget`}
                className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark"
              >
                Open budget dashboard <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">Set a budget on one of your trips to see highlights here.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-primary-container via-background to-secondary-container p-10 text-center">
        <span className="material-symbols-outlined mb-3 text-4xl text-primary">travel_luggage_and_bags</span>
        <h2 className="text-2xl font-extrabold text-ink">Travel is the only thing you buy that makes you richer.</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Browse destinations and activities, then weave them into a day-by-day plan that respects your budget and your pace.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/explore/cities"><Button variant="ghost" className="bg-white/70">Explore Cities</Button></Link>
          <Link to="/explore/activities"><Button variant="secondary">Browse Activities</Button></Link>
        </div>
      </section>
    </div>
  );
}
