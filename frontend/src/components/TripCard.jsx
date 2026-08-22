import { Link } from 'react-router-dom';
import { StatusBadge } from './ui';
import { rangeLabel, money, tripDays } from '../utils/format';

export default function TripCard({ trip, actions }) {
  return (
    <article className="soft-shadow group overflow-hidden rounded-3xl bg-surface transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden">
        {trip.cover_image_url ? (
          <img src={trip.cover_image_url} alt={trip.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-container text-4xl">🌍</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
          {trip.destination_count} {trip.destination_count === 1 ? 'destination' : 'destinations'}
        </span>
        <div className="absolute right-4 top-4">
          <StatusBadge status={trip.status} />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold leading-snug text-ink">{trip.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <span className="material-symbols-outlined text-base">calendar_month</span>
          {rangeLabel(trip.start_date, trip.end_date)} · {tripDays(trip)} days
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted">
          <span>{trip.stop_count} stops</span>
          <span>{trip.activity_count} activities</span>
          <span className="text-secondary">{money(trip.total_spent)} spent</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-outline/60 pt-4">
          <Link
            to={`/trips/${trip.id}/view`}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark"
          >
            View Itinerary
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">arrow_forward</span>
          </Link>
          {actions}
        </div>
      </div>
    </article>
  );
}
