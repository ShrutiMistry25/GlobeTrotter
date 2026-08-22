import { Link, useLocation } from 'react-router-dom';
import { StatusBadge } from './ui';
import { rangeLabel } from '../utils/format';

const TABS = [
  { seg: 'build', label: 'Builder', icon: 'construction' },
  { seg: 'view', label: 'Itinerary', icon: 'view_timeline' },
  { seg: 'calendar', label: 'Calendar', icon: 'calendar_month' },
  { seg: 'budget', label: 'Budget', icon: 'savings' }
];

export default function TripTabs({ trip }) {
  const { pathname } = useLocation();
  return (
    <div className="mb-8">
      <Link to="/trips" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <span className="material-symbols-outlined text-base">arrow_back</span> All trips
      </Link>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{trip.name}</h1>
        <StatusBadge status={trip.status} />
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <span className="material-symbols-outlined text-base">calendar_month</span>
        {rangeLabel(trip.start_date, trip.end_date)}
      </p>
      <nav className="mt-5 flex flex-wrap gap-1 rounded-full bg-surface-container p-1.5 sm:inline-flex">
        {TABS.map((t) => {
          const to = `/trips/${trip.id}/${t.seg}`;
          const active = pathname.endsWith(`/${t.seg}`);
          return (
            <Link
              key={t.seg}
              to={to}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                active ? 'bg-primary text-white shadow-lift' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{t.icon}</span>
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
