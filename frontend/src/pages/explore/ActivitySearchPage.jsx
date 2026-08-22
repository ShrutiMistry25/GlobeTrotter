import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { activityApi, tripApi } from '../../api/services';
import { Button, Chip, EmptyState, Modal, PageLoader, inputCls } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { money } from '../../utils/format';

const TYPES = ['outdoors', 'culture', 'food', 'adventure', 'relax'];
const COSTS = [
  { key: '', label: 'Any cost' },
  { key: '0', label: 'Free' },
  { key: '500', label: 'Under ₹500' },
  { key: '1000', label: 'Under ₹1,000' },
  { key: '2000', label: 'Under ₹2,000' }
];
const DURATIONS = [
  { key: '', label: 'Any length' },
  { key: '1.5', label: '≤ 1.5 h' },
  { key: '2', label: '≤ 2 h' },
  { key: '3', label: '≤ 3 h' },
  { key: '6', label: 'Half day +' }
];

export default function ActivitySearchPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [type, setType] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [cityId] = useState(params.get('cityId') || '');
  const [acts, setActs] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      activityApi.search({
        q: q || undefined,
        category: type || undefined,
        maxCost: maxCost === '' ? undefined : maxCost,
        maxDuration: maxDuration || undefined,
        cityId: cityId || undefined
      }).then((r) => setActs(r.activities)).catch(() => setActs([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, type, maxCost, maxDuration, cityId]);

  const openAdd = async (a) => {
    if (!user) return navigate('/login');
    const trips = await tripApi.list();
    if (!trips.length) return toast('Create a trip first!', 'error');
    const first = await tripApi.get(trips[0].id);
    setAddModal({ act: a, trips, tripId: trips[0].id, stopId: first.stops[0]?.id || '' });
  };

  const pickTrip = async (tripId) => {
    const d = await tripApi.get(tripId);
    setAddModal((m) => ({ ...m, tripId, stopId: d.stops[0]?.id || '' }));
  };

  const confirmAdd = async () => {
    const { act, tripId, stopId } = addModal;
    if (!stopId) return toast('This trip has no stops yet — add one in the builder.', 'error');
    try {
      const d = await tripApi.get(tripId);
      const stop = d.stops.find((s) => s.id === Number(stopId));
      await tripApi.addActivity(tripId, Number(stopId), {
        activity_id: act.id,
        scheduled_date: stop.activities.at(-1)?.scheduled_date || stop.arrival_date
      });
      toast(`"${act.title}" added to ${stop.city_name}`);
      setAddModal(null);
      navigate(`/trips/${tripId}/build`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Discover</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">Things worth slowing down for</h1>
        <p className="mt-3 text-muted">Browse activities by mood, cost and pace — add favorites straight into an itinerary.</p>
      </header>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-muted">search</span>
        <input className={`${inputCls} rounded-full py-4 pl-14 text-base shadow-soft`} placeholder="Search activities…"
          value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={!type} onClick={() => setType('')}>All types</Chip>
        {TYPES.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(type === t ? '' : t)}>{t}</Chip>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
          Cost
          <select className="rounded-full border border-outline bg-surface px-3 py-1.5 text-xs font-semibold normal-case text-ink outline-none"
            value={maxCost} onChange={(e) => setMaxCost(e.target.value)}>
            {COSTS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
          Duration
          <select className="rounded-full border border-outline bg-surface px-3 py-1.5 text-xs font-semibold normal-case text-ink outline-none"
            value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)}>
            {DURATIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </label>
        {cityId && <span className="self-center rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-primary-dark">filtered by city</span>}
      </div>

      {!acts ? (
        <PageLoader />
      ) : acts.length === 0 ? (
        <EmptyState icon="search_off" title="No activities found" subtitle="Try loosening the filters." />
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {acts.map((a) => (
            <article key={a.id} className="soft-shadow group flex flex-col overflow-hidden rounded-3xl bg-surface transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-44 overflow-hidden">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary-container to-primary-container text-5xl">🧭</div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary backdrop-blur">
                  {a.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{a.city_name}, {a.city_country}</p>
                <h3 className="mt-1.5 font-bold leading-snug text-ink">{a.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{a.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-outline/60 pt-4">
                  <div className="text-xs font-bold text-muted">
                    {money(a.est_cost)} · {a.duration_hours}h
                  </div>
                  <Button variant="soft" className="px-4 py-2 text-xs" onClick={() => openAdd(a)}>
                    <span className="material-symbols-outlined text-sm">add_circle</span> Add to Itinerary
                  </Button>
                </div>
                <button onClick={() => setDetail(a)} className="mt-2 self-start text-xs font-semibold text-primary hover:text-primary-dark">
                  Quick view →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!addModal} onClose={() => setAddModal(null)} title={`Add "${addModal?.act?.title}" to…`}>
        <div className="space-y-4">
          {addModal?.trips.map((t) => (
            <button key={t.id} onClick={() => pickTrip(t.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                addModal.tripId === t.id ? 'border-primary bg-primary-container' : 'border-outline/70 hover:border-primary/50'
              }`}>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.stop_count} stops</p>
              </div>
              {addModal.tripId === t.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>
          ))}
          {!!addModal?.tripId && (
            <>
              <span className="block text-xs font-bold uppercase tracking-wider text-muted">Add to stop</span>
              <StopPicker addModal={addModal} onChange={(stopId) => setAddModal({ ...addModal, stopId })} />
              <Button className="w-full py-3.5" onClick={confirmAdd}>Add to Itinerary</Button>
            </>
          )}
        </div>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title}>
        {detail && (
          <div className="space-y-4">
            {detail.image_url && <img src={detail.image_url} alt="" className="max-h-56 w-full rounded-2xl object-cover" />}
            <p className="text-sm leading-relaxed text-muted">{detail.description}</p>
            <div className="flex gap-2 text-xs font-bold">
              <span className="rounded-full bg-primary-container px-3 py-1.5 text-primary-dark">{money(detail.est_cost)}</span>
              <span className="rounded-full bg-secondary-container px-3 py-1.5 text-secondary">{detail.duration_hours} hours</span>
              <span className="rounded-full bg-surface-container px-3 py-1.5 capitalize text-muted">{detail.category}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StopPicker({ addModal, onChange }) {
  const [stops, setStops] = useState([]);
  useEffect(() => {
    if (addModal?.tripId)
      tripApi.get(addModal.tripId).then((d) => setStops(d.stops)).catch(() => {});
  }, [addModal?.tripId]);

  return (
    <select className={`${inputCls} mt-[-12px]`} value={addModal.stopId} onChange={(e) => onChange(Number(e.target.value))}>
      <option value="">Choose a city stop…</option>
      {stops.map((s) => (
        <option key={s.id} value={s.id}>{s.city_name} ({s.arrival_date} → {s.departure_date})</option>
      ))}
    </select>
  );
}
