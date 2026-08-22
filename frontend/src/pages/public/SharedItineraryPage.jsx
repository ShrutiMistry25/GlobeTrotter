import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { publicApi, tripApi } from '../../api/services';
import { Button, PageLoader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fmtDate, fmtDay, money, timeLabel, tripDays } from '../../utils/format';

export default function SharedItineraryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [missing, setMissing] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    publicApi.getTrip(slug).then(setTrip).catch(() => setMissing(true));
  }, [slug]);

  if (missing)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <span className="material-symbols-outlined mb-4 text-6xl text-outline">link_off</span>
        <h1 className="text-2xl font-extrabold text-ink">This itinerary is no longer shared</h1>
        <p className="mt-2 text-muted">The link may have expired or been turned private by its owner.</p>
        <Link to="/" className="mt-8"><Button>Go to GlobeTrotter</Button></Link>
      </div>
    );

  if (!trip) return <PageLoader />;

  const byStop = trip.stops;
  const activityCount = byStop.reduce((n, s) => n + s.activities.length, 0);

  const copyTrip = async () => {
    if (!user) {
      toast('Log in to copy this trip into your account', 'info');
      navigate('/login');
      return;
    }
    setCopying(true);
    try {
      const res = await publicApi.copyTrip(slug);
      toast('Trip copied to your account!');
      setTimeout(() => navigate(`/trips/${res.trip_id}/build`), 900);
    } catch (e) {
      toast(e.message, 'error');
      setCopying(false);
    }
  };

  const shareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard');
    } catch {
      toast(window.location.href, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="relative -z-0">
        <div className="absolute inset-0 h-[420px] overflow-hidden">
          {trip.cover_image_url && (
            <img src={trip.cover_image_url} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/20" />
        </div>
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-white drop-shadow">
            <span className="material-symbols-outlined text-2xl">public</span> GlobeTrotter
          </Link>
          {user ? (
            <Button variant="soft" onClick={() => navigate('/')} className="!bg-white/85">My Dashboard</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" className="!text-white hover:!bg-white/15" onClick={() => navigate('/login')}>Log In</Button>
              <Button variant="soft" className="!bg-white/90" onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          )}
        </nav>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-14 pt-40">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
            <span className="material-symbols-outlined text-sm">public</span> Public Itinerary
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">{trip.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-white/90 drop-shadow">
            Curated by
            {trip.owner_avatar && (
              <img src={trip.owner_avatar} alt="" className="inline h-7 w-7 rounded-full border border-white/60 object-cover" />
            )}
            <span>{trip.owner_name}</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="-mt-6 grid grid-cols-2 divide-x divide-outline/60 rounded-3xl bg-surface p-6 shadow-ambient sm:grid-cols-4 sm:divide-x-0 sm:gap-4">
          {[
            ['calendar_month', `${fmtDate(trip.start_date)} → ${fmtDate(trip.end_date)}`],
            ['route', `${byStop.length} stops · ${activityCount} activities`],
            ['hourglass_bottom', `${tripDays(trip)} days · relaxed pace`],
            ['savings', `${money(byStop.reduce((n, s) => n + s.activities.reduce((m, a) => m + Number(a.est_cost || 0), 0), 0))} planned spend`]
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2">
              <span className="material-symbols-outlined rounded-full bg-primary-container p-2 text-xl text-primary-dark">{icon}</span>
              <span className="text-xs font-bold leading-snug text-muted">{label}</span>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-surface p-8 shadow-soft">
          <p className="leading-relaxed text-ink/80">{trip.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={copyTrip} disabled={copying}>
              <span className="material-symbols-outlined text-lg">content_copy</span>
              {copying ? 'Copying…' : 'Copy this Trip'}
            </Button>
            <Button variant="secondary" onClick={shareLink}>
              <span className="material-symbols-outlined text-lg">share</span> Share Link
            </Button>
            {!user && (
              <p className="self-center text-xs text-muted">You'll need an account to copy it — it takes 20 seconds.</p>
            )}
          </div>
        </section>

        <div className="mt-12 space-y-14">
          {byStop.map((stop) => {
            const dates = [...new Set(stop.activities.map((a) => a.scheduled_date))].sort();
            return (
              <section key={stop.id}>
                <header className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Stop</p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
                      {stop.city_name}, <span className="font-bold text-muted">{stop.city_country}</span>
                    </h2>
                    <p className="mt-1 text-sm text-muted">{fmtDate(stop.arrival_date)} → {fmtDate(stop.departure_date)}</p>
                  </div>
                  {stop.city_image && (
                    <img src={stop.city_image} alt="" className="hidden h-20 w-32 rounded-2xl object-cover shadow-soft sm:block" />
                  )}
                </header>

                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <aside className="hidden rounded-3xl bg-secondary-container/60 p-5 lg:block">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">This stop</p>
                    <ul className="space-y-2 text-xs font-semibold text-muted">
                      <li>{stop.activities.length} experiences</li>
                      <li>{money(stop.activities.reduce((n, a) => n + Number(a.est_cost), 0))} in activities</li>
                      <li>{dates.length} active days</li>
                    </ul>
                  </aside>

                  <div className="space-y-5">
                    {dates.length === 0 && <p className="rounded-2xl border border-dashed border-outline p-6 text-sm text-muted">Free days — the owner left room to wander.</p>}
                    {dates.map((date) => (
                      <article key={date} className="rounded-3xl bg-surface p-6 shadow-soft">
                        <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-primary">{fmtDay(date)}</h3>
                        <ul className="space-y-3">
                          {[...stop.activities].filter((a) => a.scheduled_date === date).map((a) => (
                            <li key={a.id} className="flex items-center gap-4">
                              <span className="w-16 shrink-0 text-xs font-bold text-muted">{timeLabel(a.start_time) || 'Anytime'}</span>
                              <span className="h-9 w-px shrink-0 bg-outline/70" />
                              <div className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3">
                                <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                                {Number(a.est_cost) > 0 && <span className="shrink-0 text-xs font-bold text-secondary">{money(a.est_cost)}</span>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-outline/60 py-8 text-center text-sm text-muted">
        © 2026 GlobeTrotter. Quiet Exploration &amp; Slow Travel.
      </footer>
    </div>
  );
}
