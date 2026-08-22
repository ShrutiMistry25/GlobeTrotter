import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripApi } from '../../api/services';
import { Button, ErrorBox, Field, inputCls } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const SAMPLE_COVERS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAv1jprWxe6vvxNvM8IQcskK9cld6UnBa0LvUXtPpOearGZVHkRbuqaD75rr_3LJN5TNkcjE5CSP71IvzkeWlUs6OpsJKepNrhsTxlggb5tfEfZOzBVHhscph-b2vVe4r2-mgZtJoMY1deJbIltNdPaMEA8LvE1ghjIZfqexo-2hqZTwInfBIvHUGl1puXALGNVYcUR4fb2VwZW3ZLrJCZL6VW1aaqgEajjOdyftDqXUfx9sDHZBppA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAXiwXaquVM4FUg0mhACEPzZEF3a4drylVi6Ej62m2H5jk9oXPc7a4OXz6HJFDqLtdHR2GcPoSkELqXlUKJqMqlC0UbwOULDr0eR1iRFSV9GdmbjYtmY04CQexPbPdwGT2TTkPUgrKanXrKnQy2hxDpKpTVDFfbg0JDqdAjtt6_dVt1lDvX0LvdIwMwqEtvrLv-FvMspW2ZGdBnNBtbkmxZupK2N0wNcA3wiLAhKbqCsjzxDnfjInP_',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB34bdo90quRcOfc7cvE8vbesgDgC1nNtbVDW9FGWOkc6dGj6AYJWN19IGlLXSmjBXfGvr47fRFYTbxZPlgoQnnU4SXcx-mwhJXhS3AB5Nr9LoTKVHhM4nt3_qEjle7pYIdzK_82L60CdaZnCyGkxtcnxIUBEpnJs7IloCJaSld2L0lm5-b_3zkFoVP3xce342yRbFxaJ1dyfeMLZ6ArMF8KV3Q0_g5PkabazqqLNzG7HGfKXW_QYcn',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSlbFYErfiHFfYknPtkyFMnrH_PcrCb6KpOS6hXgcVo9zqs0krBVj3A6sseeyDmPCmKsbnFlq_RoouFNU1OKqWw3XT3NfaCYWIXe8srA2t1BS1ap6HTWVIlzZMJ0PnQrLuLTiouKnIpSZYB2FXbnX9ivXOld0OU9hAvbh0p9jBzOzfP1x9DUFyIF9Ux_Tp9QqrPtV4lGWf4bSgc773oe9WCgcRHnIfnmHmSdEDjVqFPsGEIElFz4Ay'
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '', description: '', cover_image_url: '' });
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please give your trip a name.');
    if (!form.start_date || !form.end_date) return setError('Please pick start and end dates.');
    if (form.end_date < form.start_date) return setError('End date must be after the start date.');
    setBusy(true);
    setError('');
    try {
      const res = await tripApi.create({ ...form, budget_total: budget || null });
      toast('Trip created! Add your first stop.');
      navigate(`/trips/${res.trip.id}/build`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/trips" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <span className="material-symbols-outlined text-base">arrow_back</span> All trips
      </Link>
      <div className="soft-shadow rounded-3xl bg-surface p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Create New Trip</h1>
        <p className="mt-2 text-sm text-muted">Name your journey and set its dates — you can add stops next.</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <ErrorBox message={error} />

          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Cover photo (optional)</span>
            {form.cover_image_url ? (
              <img src={form.cover_image_url} alt="cover" className="mb-3 max-h-40 rounded-xl object-cover shadow-soft" />
            ) : null}
            <input
              className={inputCls}
              placeholder="https://… image URL"
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {SAMPLE_COVERS.map((url) => (
                <button type="button" key={url.slice(-12)} onClick={() => setForm({ ...form, cover_image_url: url })}
                  className={`h-14 w-24 overflow-hidden rounded-lg border transition ${
                    form.cover_image_url === url ? 'border-primary opacity-100' : 'border-outline opacity-70 hover:opacity-100'
                  }`}>
                  <img src={url} alt="sample" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Field label="Trip name">
            <input className={inputCls} placeholder="e.g. Kyoto Autumn Retreat" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Start date">
              <input type="date" className={inputCls} value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </Field>
            <Field label="End date">
              <input type="date" className={inputCls} value={form.end_date} min={form.start_date || undefined}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </Field>
          </div>

          <Field label="Total budget (optional)" hint="Used for budget tracking — editable later.">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
              <input type="number" min="0" className={`${inputCls} pl-8`} placeholder="3000" value={budget}
                onChange={(e) => setBudget(e.target.value)} />
            </div>
          </Field>

          <Field label="Description">
            <textarea rows={4} className={inputCls} placeholder="What's the vibe of this trip?" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          <div className="flex justify-end gap-3 border-t border-outline/60 pt-6">
            <Button type="button" variant="ghost" onClick={() => navigate('/trips')}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : <>Save Trip <span className="material-symbols-outlined text-lg">arrow_forward</span></>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
