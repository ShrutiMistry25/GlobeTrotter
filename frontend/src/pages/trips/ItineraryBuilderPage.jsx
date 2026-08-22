import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripApi, cityApi, activityApi } from '../../api/services';
import TripTabs from '../../components/TripTabs';
import { Button, Chip, EmptyState, ErrorBox, Field, Modal, PageLoader, inputCls } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { fmtDate, money, timeLabel } from '../../utils/format';

const CATS = ['outdoors', 'culture', 'food', 'adventure', 'relax'];

export default function ItineraryBuilderPage() {
  const { id } = useParams();
  const toast = useToast();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [openStop, setOpenStop] = useState(null);

  const [stopModal, setStopModal] = useState(false);
  const [cityQ, setCityQ] = useState('');
  const [cities, setCities] = useState([]);
  const [stopForm, setStopForm] = useState({ city_id: '', arrival_date: '', departure_date: '' });
  const [busyStop, setBusyStop] = useState(false);

  const [actModal, setActModal] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [actCat, setActCat] = useState('all');
  const [customMode, setCustomMode] = useState(false);
  const [actForm, setActForm] = useState({ title: '', scheduled_date: '', start_time: '', est_cost: '' });
  const [busyAct, setBusyAct] = useState(false);

  useEffect(() => {
    tripApi.get(id)
      .then((d) => {
        setDetail(d);
        if (d.stops[0]) setOpenStop(d.stops[0].id);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const reload = () =>
    tripApi.get(id).then(setDetail).catch((e) => toast(e.message, 'error'));

  useEffect(() => {
    if (stopModal) cityApi.search({ q: cityQ || undefined }).then((r) => setCities(r.cities)).catch(() => {});
  }, [cityQ, stopModal]);

  useEffect(() => {
    if (actModal && !customMode) {
      activityApi.search({ cityId: actModal.cityId, category: actCat === 'all' ? undefined : actCat })
        .then((r) => setCatalog(r.activities))
        .catch(() => {});
    }
  }, [actModal, actCat, customMode]);

  if (error) return <ErrorBox message={error} />;
  if (!detail) return <PageLoader />;

  const { trip, stops } = detail;

  const moveStop = async (index, dir) => {
    const ids = stops.map((s) => s.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      await tripApi.reorderStops(id, ids);
      await reload();
      toast('Order updated');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const addStop = async () => {
    if (!stopForm.city_id) return toast('Pick a destination city', 'error');
    if (!stopForm.arrival_date || !stopForm.departure_date) return toast('Pick arrival & departure dates', 'error');
    if (stopForm.departure_date < stopForm.arrival_date) return toast('Departure must be after arrival', 'error');
    setBusyStop(true);
    try {
      const res = await tripApi.addStop(id, stopForm);
      await reload();
      setOpenStop(res.stop.id);
      setStopModal(false);
      setStopForm({ city_id: '', arrival_date: '', departure_date: '' });
      toast(`${res.stop.city_name} added to your journey`);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusyStop(false);
    }
  };

  const addCatalogActivity = async (a) => {
    let date = actModal.stop.activities.at(-1)?.scheduled_date || actModal.stop.arrival_date;
    try {
      await tripApi.addActivity(id, actModal.stop.id, {
        activity_id: a.id,
        scheduled_date: date < actModal.stop.arrival_date ? actModal.stop.arrival_date : date
      });
      await reload();
      toast(`"${a.title}" added`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const addCustomActivity = async () => {
    const f = actForm;
    if (!f.title.trim()) return toast('Give it a title', 'error');
    if (!f.scheduled_date) return toast('Pick a date', 'error');
    setBusyAct(true);
    try {
      await tripApi.addActivity(id, actModal.stop.id, { ...f, est_cost: f.est_cost || 0 });
      await reload();
      setActModal(null);
      setCustomMode(false);
      setActForm({ title: '', scheduled_date: '', start_time: '', est_cost: '' });
      toast('Activity added');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusyAct(false);
    }
  };

  const removeActivity = async (stopId, actId) => {
    try {
      await tripApi.removeActivity(id, stopId, actId);
      await reload();
      toast('Removed');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const removeStop = async (s) => {
    if (!window.confirm(`Remove ${s.city_name} and its activities from this trip?`)) return;
    try {
      await tripApi.removeStop(id, s.id);
      await reload();
      toast(`${s.city_name} removed`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const toggleShare = async () => {
    try {
      if (trip.is_public) {
        await tripApi.disableShare(id);
        toast('Public link disabled');
      } else {
        const res = await tripApi.enableShare(id);
        const url = `${window.location.origin}/share/${res.share_slug}`;
        await navigator.clipboard?.writeText(url).catch(() => {});
        toast(`Public link copied! ${url}`, 'info');
      }
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <TripTabs trip={trip} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{stops.length} stops · drag-free reordering with arrows</p>
        <div className="flex gap-2">
          <Button variant={trip.is_public ? 'secondary' : 'soft'} onClick={toggleShare}>
            <span className="material-symbols-outlined text-lg">{trip.is_public ? 'link_off' : 'share'}</span>
            {trip.is_public ? 'Sharing ON' : 'Share Trip'}
          </Button>
          <Button onClick={() => setStopModal(true)}>
            <span className="material-symbols-outlined text-lg">add_location_alt</span> Add Stop
          </Button>
        </div>
      </div>

      {stops.length === 0 ? (
        <EmptyState
          icon="add_location_alt"
          title="No stops yet"
          subtitle="Add the first city to your journey — then fill its days with activities."
          action={<Button onClick={() => setStopModal(true)}>Add first stop</Button>}
        />
      ) : (
        <div className="space-y-4">
          {stops.map((s, i) => (
            <section key={s.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
              <header
                className="flex cursor-pointer items-center gap-4 p-5"
                onClick={() => setOpenStop(openStop === s.id ? null : s.id)}
              >
                <span className="material-symbols-outlined cursor-grab text-muted">drag_indicator</span>
                <img src={s.city_image} alt={s.city_name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-ink">
                    {i + 1}. {s.city_name}, {s.city_country}
                  </h3>
                  <p className="text-xs text-muted">
                    {fmtDate(s.arrival_date)} → {fmtDate(s.departure_date)} · {s.activities.length} planned
                  </p>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button disabled={i === 0} onClick={() => moveStop(i, -1)}
                    className="rounded-full p-1.5 text-muted hover:bg-primary-container hover:text-primary disabled:opacity-30">
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
                  <button disabled={i === stops.length - 1} onClick={() => moveStop(i, 1)}
                    className="rounded-full p-1.5 text-muted hover:bg-primary-container hover:text-primary disabled:opacity-30">
                    <span className="material-symbols-outlined">arrow_downward</span>
                  </button>
                  <button onClick={() => removeStop(s)}
                    className="rounded-full p-1.5 text-muted hover:bg-error/10 hover:text-error">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <span className={`material-symbols-outlined text-muted transition-transform ${openStop === s.id ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </header>

              {openStop === s.id && (
                <div className="border-t border-outline/60 bg-background/50 p-5">
                  {s.activities.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted">No activities yet — browse the catalog or add a custom one.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {s.activities.map((a) => (
                        <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-outline/70 bg-surface px-4 py-3">
                          <span className="material-symbols-outlined text-xl text-secondary">check_circle</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">{a.title}</p>
                            <p className="text-xs text-muted">
                              {fmtDate(a.scheduled_date)} · {timeLabel(a.start_time) || 'flexible'} · {money(a.est_cost)}
                            </p>
                          </div>
                          <button onClick={() => removeActivity(s.id, a.id)}
                            className="rounded-full p-1.5 text-muted hover:bg-error/10 hover:text-error">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" className="px-4 py-2.5" onClick={() => { setActModal({ stop: s, cityId: s.city_id }); setCustomMode(false); }}>
                      <span className="material-symbols-outlined text-lg">travel_explore</span> Browse Activities in {s.city_name}
                    </Button>
                    <Button variant="soft" className="px-4 py-2.5" onClick={() => { setActModal({ stop: s, cityId: s.city_id }); setCustomMode(true); }}>
                      <span className="material-symbols-outlined text-lg">edit_note</span> Custom Activity
                    </Button>
                    <Link to={`/trips/${id}/view`} className="ml-auto self-center text-sm font-semibold text-primary hover:text-primary-dark">
                      Preview itinerary →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <Modal open={stopModal} onClose={() => setStopModal(false)} title="Add a stop" wide>
        <div className="space-y-5">
          <input className={inputCls} placeholder="Search cities…" value={cityQ} onChange={(e) => setCityQ(e.target.value)} />
          <div className="hide-scrollbar grid max-h-52 gap-2 overflow-y-auto pr-1">
            {cities.map((c) => (
              <button key={c.id}
                onClick={() => setStopForm((f) => ({ ...f, city_id: c.id }))}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  stopForm.city_id === c.id ? 'border-primary bg-primary-container' : 'border-outline/70 hover:border-primary/50'
                }`}>
                <img src={c.image_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{c.name}, {c.country}</p>
                  <p className="text-xs text-muted">{'$'.repeat(c.cost_index)} · {c.activity_count} activities</p>
                </div>
                {stopForm.city_id === c.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
              </button>
            ))}
            {cities.length === 0 && <p className="py-6 text-center text-sm text-muted">No cities match “{cityQ}”.</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Arrival"><input type="date" className={inputCls} value={stopForm.arrival_date}
              min={trip.start_date} max={trip.end_date}
              onChange={(e) => setStopForm({ ...stopForm, arrival_date: e.target.value })} /></Field>
            <Field label="Departure"><input type="date" className={inputCls} value={stopForm.departure_date}
              min={stopForm.arrival_date || trip.start_date} max={trip.end_date}
              onChange={(e) => setStopForm({ ...stopForm, departure_date: e.target.value })} /></Field>
          </div>
          <Button className="w-full py-3.5" onClick={addStop} disabled={busyStop}>
            {busyStop ? 'Adding…' : 'Add Stop'}
          </Button>
        </div>
      </Modal>

      <Modal open={!!actModal} onClose={() => { setActModal(null); setCustomMode(false); }}
        title={customMode ? `Custom activity · ${actModal?.stop.city_name}` : `Activities in ${actModal?.stop.city_name}`} wide>
        {!customMode ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Chip active={actCat === 'all'} onClick={() => setActCat('all')}>All</Chip>
              {CATS.map((c) => (
                <Chip key={c} active={actCat === c} onClick={() => setActCat(c)} icon="filter_alt">{c}</Chip>
              ))}
            </div>
            <div className="hide-scrollbar grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {catalog.map((a) => (
                <div key={a.id} className="flex flex-col rounded-2xl border border-outline/70 bg-surface p-4">
                  <p className="font-bold leading-snug text-ink">{a.title}</p>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted">{a.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary">{money(a.est_cost)} · {a.duration_hours}h</span>
                    <button onClick={() => addCatalogActivity(a)}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark">
                      <span className="material-symbols-outlined text-sm">add</span> Add
                    </button>
                  </div>
                </div>
              ))}
              {catalog.length === 0 && <p className="col-span-2 py-8 text-center text-sm text-muted">No catalog activities for this filter — add a custom one instead.</p>}
            </div>
            <button onClick={() => setCustomMode(true)} className="w-full rounded-full border border-dashed border-outline py-3 text-sm font-bold text-primary hover:bg-primary-container/40">
              + Add something custom instead
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Title"><input className={inputCls} value={actForm.title} placeholder="e.g. Sunset picnic by the river"
              onChange={(e) => setActForm({ ...actForm, title: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date"><input type="date" className={inputCls} value={actForm.scheduled_date}
                min={actModal?.stop.arrival_date} max={actModal?.stop.departure_date}
                onChange={(e) => setActForm({ ...actForm, scheduled_date: e.target.value })} /></Field>
              <Field label="Time (optional)"><input type="time" className={inputCls} value={actForm.start_time}
                onChange={(e) => setActForm({ ...actForm, start_time: e.target.value })} /></Field>
            </div>
            <Field label="Estimated cost ($)"><input type="number" min="0" className={inputCls} value={actForm.est_cost}
              onChange={(e) => setActForm({ ...actForm, est_cost: e.target.value })} /></Field>
            <Button className="w-full py-3.5" onClick={addCustomActivity} disabled={busyAct}>
              {busyAct ? 'Adding…' : 'Add to Itinerary'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
