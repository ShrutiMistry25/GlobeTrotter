import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tripApi } from '../../api/services';
import TripTabs from '../../components/TripTabs';
import { EmptyState, PageLoader, Button } from '../../components/ui';
import { fmtDay, money, timeLabel } from '../../utils/format';

export default function ItineraryViewPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [mode, setMode] = useState('list');

  useEffect(() => {
    tripApi.get(id).then(setDetail).catch(() => {});
  }, [id]);

  const days = useMemo(() => {
    if (!detail) return [];
    const byDate = {};
    for (const s of detail.stops)
      for (const a of s.activities) (byDate[a.scheduled_date] ||= []).push({ ...a, stop: s });
    for (const d of Object.values(byDate))
      d.sort((x, y) => (x.start_time || '99:99').localeCompare(y.start_time || '99:99'));

    const cityFor = (date) =>
      detail.stops.find((s) => date >= s.arrival_date && date <= s.departure_date);

    return Object.keys(byDate).sort().map((d) => ({ date: d, items: byDate[d], stop: cityFor(d) }));
  }, [detail]);

  if (!detail) return <PageLoader />;
  const { trip } = detail;

  return (
    <div>
      <TripTabs trip={trip} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {days.length} planned days · {detail.activities_flat.length} activities ·{' '}
          <span className="font-semibold text-secondary">{money(detail.trip.budget_total)} budget</span>
        </p>
        <div className="flex gap-1 rounded-full bg-surface-container p-1.5">
          {[['list', 'view_list', 'List'], ['calendar', 'calendar_month', 'Calendar']].map(([m, icn, label]) => (
            <Link key={m} to={m === 'calendar' ? `/trips/${id}/calendar` : '#'}
              onClick={() => m === 'list' && setMode('list')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
                (m === 'calendar') === false && mode === 'list' && m === 'list'
                  ? 'bg-primary text-white shadow-lift'
                  : m === 'calendar'
                    ? 'text-muted hover:text-ink'
                    : ''
              }`}>
              <span className="material-symbols-outlined text-base">{icn}</span> {label}
            </Link>
          ))}
        </div>
      </div>

      {days.length === 0 ? (
        <EmptyState icon="view_timeline" title="Nothing planned yet"
          subtitle="Head to the builder to add stops and activities."
          action={<Link to={`/trips/${id}/build`}><Button>Open Builder</Button></Link>} />
      ) : (
        <div className="relative space-y-10 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-outline md:before:left-1/2">
          {days.map((d, idx) => (
            <div key={d.date} className={`relative flex flex-col gap-5 md:flex-row ${idx % 2 ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden shrink-0 md:block md:w-1/2" />
              <span className="absolute left-0 top-1 h-4 w-4 rounded-full border-[3px] border-primary bg-background md:left-1/2 md:-translate-x-1/2" />
              <article className="soft-shadow ml-7 w-full rounded-3xl bg-surface p-6 md:ml-0 md:w-1/2">
                <p className={`mb-1 text-xs font-bold uppercase tracking-widest ${idx % 2 ? 'text-right' : ''} text-primary`}>
                  Day {idx + 1}{d.stop ? ` · ${d.stop.city_name}` : ''}
                </p>
                <h3 className={`text-lg font-extrabold text-ink ${idx % 2 ? 'md:text-right' : ''}`}>{fmtDay(d.date)}</h3>
                <ul className="mt-4 space-y-3">
                  {d.items.map((a) => (
                    <li key={a.id} className="rounded-2xl border border-outline/70 bg-background/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold leading-snug text-ink">{a.title}</p>
                          <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                            {a.start_time && (
                              <span className="inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">schedule</span>{timeLabel(a.start_time)}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">timer</span>{a.duration_hours}h
                            </span>
                            {a.est_cost > 0 && (
                              <span className="inline-flex items-center gap-1 font-bold text-secondary">
                                <span className="material-symbols-outlined text-sm">payments</span>{money(a.est_cost)}
                              </span>
                            )}
                            {a.activity_id === null && (
                              <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary">custom</span>
                            )}
                          </p>
                        </div>
                        <span className="material-symbols-outlined rounded-full bg-primary-container p-2 text-lg text-primary-dark">
                          {({ outdoors: 'hiking', culture: 'museum', food: 'restaurant', adventure: 'paragliding', relax: 'spa' })[a.category] || 'explore'}
                        </span>
                      </div>
                      {a.notes && <p className="mt-2 border-t border-dashed border-outline pt-2 text-xs italic text-muted">{a.notes}</p>}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
