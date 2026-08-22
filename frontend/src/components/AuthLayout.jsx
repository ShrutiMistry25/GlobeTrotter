import { Link } from 'react-router-dom';

const HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHNjWVbXIzxHDCfi-vLwILJB7zH2nvN85fzj6GqynDVr9m-StfJkJ5yFIxtwJYQqjH5149L8YuHNOsdTEJ7LV_nP5uwB-rAPBE4ECmW8DIOWQz0lf3jXZaMlo9OHQT3Xs38rjOcDIEmu0WiyoyiBHSvc9MjvjWbG-JB6DBTgdyY98ZCSuJc6zQKNPXPSVM-ta1M3z6P6GPPrrxIQ_chfGqsTUll5SygqpDjSWec3UPXxwuAUiHIZW4';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className="relative hidden lg:block"
        style={{ backgroundImage: `url(${HERO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-14 left-12 right-12 text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">GlobeTrotter</p>
          <h1 className="text-4xl font-extrabold leading-tight">Quiet Exploration Awaits</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Plan multi-city journeys day by day, keep every budget in view, and share your itineraries with the people you love.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-primary">public</span>
            <span className="text-2xl font-extrabold tracking-tight text-ink">GlobeTrotter</span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h2>
          <p className="mb-8 mt-2 text-sm text-muted">{subtitle}</p>
          {children}
          <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted">
            <span className="material-symbols-outlined text-sm">lock</span> Secure login · Your plans stay private until you share them
          </p>
        </div>
      </div>
    </div>
  );
}
