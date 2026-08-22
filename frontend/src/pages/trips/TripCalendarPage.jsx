import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tripApi } from '../../api/services';
import TripTabs from '../../components/TripTabs';
import { Button, EmptyState, PageLoader } from '../../components/ui';
import { money, timeLabel } from '../../utils/format';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function TripCalendarPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    tripApi.get(id).then((d) => {
      setDetail(d);
      const first = new Date(`${d.trip.start_date}T00:00:00`);
      setCursor({ y: first.getFullYear(), m: first.getMonth() });
      setSelected(d.trip.start_date);
    }).catch(() => {});
  }, [id]);

  const byDate = useMemo(() => {
    if (!detail) return {};
    const map = {};
    for (const s of detail.stops)
      for (const a of s.activities) (map[a.scheduled_date] ||= []).push(a);
    for (const e of detail.expenses) {
      if (e.expense_date) (map[e.expense_date] ||= []).push({ ...e, isExpense: true });
    }
    return map;
  }, [detail]);

  const grid = useMemo(() => {
    if (!cursor) return [];
    const first = new Date(cursor.y, cursor.m, 1);
    const startPad = (first.getDay() + 6) % 7;
    const count = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= count; d++)
      cells.push(`${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  if (!detail || !cursor) return <PageLoader />;
  const { trip } = detail;

  const shiftMonth = (dir) => {
    let m = cursor.m + dir, y = cursor.y;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCursor({ y, m });
  };

  const exportItinerary = () => {
    const lines = [`GLOBETROTTER ITINERARY — ${trip.name}`, `${trip.start_date} → ${trip.end_date}`, '' ];
    for (const s of detail.stops) {
      lines.push(`== ${s.city_name}, ${s.city_country} (${s.arrival_date} → ${s.departure_date}) ==`);
      for (const a of s.activities)
        lines.push(`  ${a.scheduled_date} ${a.start_time || ''} — ${a.title} (${money(a.est_cost)})`);
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedItems = (byDate[selected] || []).sort((x, y) =>
    (x.isExpense ? '99' : x.start_time || '99').localeCompare(y.isExpense ? '99' : y.start_time || '99')
  );
  const inTrip = selected >= trip.start_date && selected <= trip.end_date;
  const stopForDay = detail.stops.find((s) => selected >= s.arrival_date && selected <= s.departure_date);

  return (
    <div>
      <TripTabs trip={trip} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Visualize your journey month by month. Click any day to see its plan.</p>
        <Button variant="soft" onClick={exportItinerary}>
          <span className="material-symbols-outlined text-lg">download</span> Export Itinerary
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <header className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ink">{MONTHS[cursor.m]} {cursor.y}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => shiftMonth(-1)} className="rounded-full p-2 text-muted hover:bg-primary-container hover:text-primary">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={() => shiftMonth(1)} className="rounded-full p-2 text-muted hover:bg-primary-container hover:text-primary">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </header>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-muted">
            {DOW.map((d) => <span key={d}>{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {grid.map((date, i) => {
              if (!date) return <span key={`pad-${i}`} />;
              const items = byDate[date];
              const inRange = date >= trip.start_date && date <= trip.end_date;
              const isSelected = date === selected;
              return (
                <button key={date}
                  onClick={() => setSelected(date)}
                  className={`relative aspect-square rounded-xl p-1 text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-primary text-white shadow-lift'
                      : inRange
                        ? 'bg-primary-container/60 text-ink hover:bg-primary-container'
                        : 'text-muted hover:bg-surface-container'
                  }`}>
                  {Number(date.slice(-2))}
                  {!!items?.length && (
                    <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {items.slice(0, 3).map((_, k) => (
                        <span key={k} className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : inRange ? 'bg-primary' : 'bg-outline'}`} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-outline/60 pt-4 text-xs font-semibold text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> itinerary item</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-primary-container" /> trip days</span>
            <Link to={`/trips/${id}/build`} className="ml-auto inline-flex items-center gap-1 text-primary hover:text-primary-dark">
              Edit activities <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        <aside className="rounded-3xl bg-surface p-6 shadow-soft">
          {inTrip ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{stopForDay ? stopForDay.city_name : 'Travel day'}</p>
              <h3 className="mt-1 text-lg font-extrabold text-ink">
                {new Date(`${selected}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="mt-5 space-y-3">
                {selectedItems.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-outline py-8 text-center text-sm text-muted">
                    A quiet day — nothing scheduled yet.
                  </div>
                )}
                {selectedItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-outline/70 bg-background/60 p-4">
                    <span className={`material-symbols-outlined rounded-full p-1.5 text-lg ${item.isExpense ? 'bg-error/10 text-error' : 'bg-secondary-container text-secondary'}`}>
                      {item.isExpense ? 'receipt_long' : ({ outdoors: 'hiking', culture: 'museum', food: 'restaurant', adventure: 'paragliding', relax: 'spa' })[item.category] || 'explore'}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{item.title}</p>
                      <p className="text-xs text-muted">
                        {item.isExpense
                          ? `${money(item.amount)} expense`
                          : `${timeLabel(item.start_time) || 'Flexible'} · ${money(item.est_cost)}${item.duration_hours ? ` · ${item.duration_hours}h` : ''}`}
                      </p>
                      {item.notes && <p className="mt-1 text-xs italic text-muted">{item.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState icon="event_busy" title="Outside the trip" subtitle={`${trip.name} runs ${trip.start_date} → ${trip.end_date}. Pick a day inside that range.`} />
          )}
        </aside>
      </div>
    </div>
  );
}
