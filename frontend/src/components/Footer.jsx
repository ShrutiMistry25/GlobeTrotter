export default function Footer() {
  return (
    <footer className="mt-16 border-t border-outline/60 bg-surface/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-primary">public</span>
          <span className="font-bold text-ink">GlobeTrotter</span>
        </div>
        <p className="text-sm text-muted">© 2026 GlobeTrotter. Quiet Exploration &amp; Slow Travel.</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted/70">Plan · Wander · Share</p>
      </div>
    </footer>
  );
}
