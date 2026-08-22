import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cityApi, tripApi } from '../../api/services';
import { Button, Chip, EmptyState, Modal, PageLoader, inputCls } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { costIndex } from '../../utils/format';

export default function CitySearchPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [region, setRegion] = useState(params.get('region') || '');
  const [cities, setCities] = useState(null);
  const [regions, setRegions] = useState([]);
  const [addModal, setAddModal] = useState(null);
  const [trips, setTrips] = useState([]);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    cityApi.regions().then(setRegions).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      cityApi.search({ q: q || undefined, region: region || undefined })
        .then((r) => setCities(r.cities))
        .catch(() => setCities([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, region]);

  const openAdd = async (city) => {
    if (!user) return navigate('/login');
    const list = await tripApi.list();
    setTrips(list);
    setAddModal({ city, tripId: list[0]?.id || '' });
  };

  const addToTrip = async () => {
    const { city, tripId } = addModal;
    if (!tripId) return toast('Create a trip first', 'error');
    try {
      const t = trips.find((x) => x.id === Number(tripId));
      await tripApi.addStop(tripId, { city_id: city.id, arrival_date: t.start_date, departure_date: t.start_date });
      toast(`${city.name} added to "${t.name}"`);
      setAddModal(null);
      navigate(`/trips/${tripId}/build`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Explore</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">Where to next?</h1>
        <p className="mt-3 text-muted">Search cities, regions, or vibes — then weave them into a trip.</p>
      </header>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-muted">search</span>
        <input
          className={`${inputCls} rounded-full py-4 pl-14 text-base shadow-soft`}
          placeholder="Search cities, countries, or feelings…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={!region} onClick={() => setRegion('')}>All regions</Chip>
        {regions.map((r) => (
          <Chip key={r.region} active={region === r.region} onClick={() => setRegion(region === r.region ? '' : r.region)} icon="public">
            {r.region} · {r.city_count}
          </Chip>
        ))}
      </div>

      {!cities ? (
        <PageLoader />
      ) : cities.length === 0 ? (
        <EmptyState icon="location_off" title="No destinations found" subtitle={`Nothing matches "${q}" — try another search.`} />
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {cities.map((c) => (
            <article key={c.id} className="soft-shadow group overflow-hidden rounded-3xl bg-surface transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-secondary backdrop-blur">
                  ♥ {c.popularity}% love it
                </span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80">{c.country}</p>
                  <h3 className="text-2xl font-extrabold">{c.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-muted">{c.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-outline/60 pt-4">
                  <div className="text-xs font-semibold text-muted">
                    <span className="text-primary" title="Cost index">{costIndex(c.cost_index)}</span> · {c.activity_count} activities
                  </div>
                  <Button className="px-4 py-2 text-xs" onClick={() => openAdd(c)}>
                    <span className="material-symbols-outlined text-sm">add</span> Add to Trip
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!addModal} onClose={() => setAddModal(null)} title={`Add ${addModal?.city?.name} to…`}>
        {trips.length === 0 ? (
          <EmptyState icon="luggage" title="No trips yet" subtitle="Create a trip first, then add destinations."
            action={<Button onClick={() => navigate('/trips/new')}>Plan New Trip</Button>} />
        ) : (
          <div className="space-y-4">
            {trips.map((t) => (
              <button key={t.id}
                onClick={() => setAddModal({ ...addModal, tripId: t.id })}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  addModal.tripId === t.id ? 'border-primary bg-primary-container' : 'border-outline/70 hover:border-primary/50'
                }`}>
                {t.cover_image_url && <img src={t.cover_image_url} alt="" className="h-11 w-11 rounded-xl object-cover" />}
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.start_date} → {t.end_date}</p>
                </div>
                {addModal.tripId === t.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
              </button>
            ))}
            <Button className="w-full py-3.5" onClick={addToTrip}>
              <span className="material-symbols-outlined text-lg">add_location_alt</span> Add Stop
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
