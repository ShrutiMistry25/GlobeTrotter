import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripApi } from '../../api/services';
import TripCard from '../../components/TripCard';
import { Button, Chip, EmptyState, Modal, PageLoader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const FILTERS = [
  { key: 'all', label: 'All trips' },
  { key: 'planned', label: 'Upcoming' },
  { key: 'draft', label: 'Drafts' },
  { key: 'completed', label: 'Completed' }
];

export default function MyTripsPage() {
  const [trips, setTrips] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const load = () => tripApi.list().then(setTrips).catch(() => setTrips([]));
  useEffect(() => { load(); }, []);

  if (!trips) return <PageLoader />;

  const visible = filter === 'all' ? trips : trips.filter((t) => t.status === filter);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await tripApi.remove(toDelete.id);
      toast(`"${toDelete.name}" deleted`);
      setToDelete(null);
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">My Trips</h1>
          <p className="mt-1 text-muted">{trips.length} journeys in your collection</p>
        </div>
        <Button onClick={() => navigate('/trips/new')}>
          <span className="material-symbols-outlined text-lg">add</span> Plan New Trip
        </Button>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="luggage"
          title={filter === 'all' ? 'No trips yet' : `No ${filter} trips`}
          subtitle="Every great journey starts with a blank itinerary."
          action={<Button onClick={() => navigate('/trips/new')}>Plan New Trip</Button>}
        />
      ) : (
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((t) => (
            <TripCard
              key={t.id}
              trip={t}
              actions={
                <div className="flex items-center gap-0.5 text-muted">
                  <Link to={`/trips/${t.id}/build`} title="Edit itinerary"
                    className="rounded-full p-2 hover:bg-primary-container hover:text-primary">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </Link>
                  <button onClick={() => setToDelete(t)} title="Delete"
                    className="rounded-full p-2 hover:bg-error/10 hover:text-error">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete this trip?">
        <p className="text-sm leading-relaxed text-muted">
          <strong className="text-ink">{toDelete?.name}</strong> and all of its stops, activities and expenses will be
          permanently removed. This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="soft" onClick={() => setToDelete(null)}>Keep trip</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete forever'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
