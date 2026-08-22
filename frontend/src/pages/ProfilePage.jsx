import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi, cityApi, tripApi } from '../api/services';
import { Button, EmptyState, Field, Modal, PageLoader, inputCls } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LANGS = [
  ['en', 'English'],
  ['it', 'Italiano'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch']
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', language_pref: 'en', avatar_url: '' });
  const [saved, setSaved] = useState([]);
  const [recos, setRecos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', language_pref: user.language_pref || 'en', avatar_url: user.avatar_url || '' });
    userApi.savedDestinations().then(setSaved).catch(() => {});
    cityApi.top(6).then((c) => setRecos(c.filter((x) => !saved.some((s) => s.id === x.id)).slice(0, 3))).catch(() => {});
  }, []);

  if (!user) return <PageLoader />;

  const saveProfile = async () => {
    setBusy(true);
    try {
      const res = await userApi.updateMe({ name: form.name, language_pref: form.language_pref, avatar_url: form.avatar_url || null });
      updateUser(res.user);
      toast('Profile saved');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const removeSaved = async (city) => {
    try {
      await userApi.removeDestination(city.id);
      setSaved((s) => s.filter((x) => x.id !== city.id));
      toast(`${city.name} removed`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const addSaved = async (city) => {
    try {
      await userApi.saveDestination(city.id);
      setSaved((s) => [{ ...city, image_url: city.image_url }, ...s]);
      setRecos((r) => r.filter((x) => x.id !== city.id));
      toast(`${city.name} added to your horizons`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const deleteAccount = async () => {
    try {
      await userApi.deleteMe();
      logout();
      window.location.href = '/signup';
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-10 flex flex-col items-center text-center sm:flex-row sm:text-left">
        <div className="group relative mb-4 shrink-0 sm:mb-0">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt={form.name} className="h-32 w-32 rounded-full border-4 border-surface object-cover shadow-ambient" />
          ) : (
            <span className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary text-4xl font-extrabold text-white shadow-ambient">
              {user.name?.[0]}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
            paste URL below
          </span>
        </div>
        <div className="sm:ml-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{form.name}</h1>
          <p className="mt-1 text-muted">{form.email}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-secondary">
            <span className="material-symbols-outlined text-sm">slow_motion_video</span> Slow travel since day one
          </p>
        </div>
      </header>

      <section className="soft-shadow mb-10 rounded-3xl bg-surface p-8">
        <h2 className="mb-6 text-lg font-bold text-ink">Personal Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" hint="Email changes are not supported in demo mode.">
            <input className={`${inputCls} cursor-not-allowed opacity-60`} value={form.email} disabled />
          </Field>
          <Field label="Language preference">
            <select className={inputCls} value={form.language_pref} onChange={(e) => setForm({ ...form, language_pref: e.target.value })}>
              {LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Avatar image URL">
            <input className={inputCls} value={form.avatar_url} placeholder="https://…" onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
          </Field>
        </div>
        <div className="mt-7 flex justify-end">
          <Button onClick={saveProfile} disabled={busy}>{busy ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Saved Horizons</h2>
          <Link to="/explore/cities" className="text-sm font-semibold text-primary hover:text-primary-dark">Find more →</Link>
        </div>
        {saved.length === 0 ? (
          <EmptyState icon="favorite_border" title="Nothing saved yet" subtitle="Tap the ♥ on a destination to keep it close." />
        ) : (
          <div className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
            {saved.map((c) => (
              <article key={c.id} className="relative w-64 shrink-0 overflow-hidden rounded-3xl bg-surface shadow-soft">
                {c.image_url && <img src={c.image_url} alt={c.name} className="h-40 w-full object-cover" />}
                <div className="p-4">
                  <p className="font-bold text-ink">{c.name}</p>
                  <p className="text-xs text-muted">{c.country} · best in every season</p>
                </div>
                <button onClick={() => removeSaved(c)} title="Remove"
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-error shadow hover:bg-error hover:text-white">
                  <span className="material-symbols-outlined text-base">heart_minus</span>
                </button>
              </article>
            ))}
          </div>
        )}
        {recos.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Suggestions:</span>
            {recos.map((c) => (
              <button key={c.id} onClick={() => addSaved(c)}
                className="inline-flex items-center gap-1 rounded-full border border-outline bg-surface px-3 py-1.5 text-xs font-bold text-muted transition hover:border-primary hover:text-primary">
                <span className="material-symbols-outlined text-sm">add</span> {c.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-error/30 bg-error/5 p-8">
        <h2 className="text-lg font-bold text-error">Danger Zone</h2>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Deleting your account removes all trips, itineraries and expenses permanently.
        </p>
        <Button variant="danger" className="mt-5" onClick={() => setDeleteModal(true)}>
          <span className="material-symbols-outlined text-lg">delete_forever</span> Delete Account
        </Button>
      </section>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete your account?">
        <p className="text-sm leading-relaxed text-muted">
          This will permanently erase <strong className="text-ink">{user.name}</strong> and everything you've planned. There is no undo.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="soft" onClick={() => setDeleteModal(false)}>Keep my account</Button>
          <Button variant="danger" onClick={deleteAccount}>Yes, delete everything</Button>
        </div>
      </Modal>
    </div>
  );
}
