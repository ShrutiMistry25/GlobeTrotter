export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-container border-t-primary ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
}

export function Chip({ active, children, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-secondary text-white shadow-soft'
          : 'bg-surface-container text-muted hover:bg-secondary-container hover:text-secondary'
      }`}
    >
      {icon && <span className="material-symbols-outlined text-base">{icon}</span>}
      {children}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    draft: 'bg-secondary-container text-secondary',
    planned: 'bg-primary-container text-primary-dark',
    completed: 'bg-[#E7F0EE] text-tertiary'
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${map[status] || ''}`}>
      {status}
    </span>
  );
}

export function EmptyState({ icon = 'explore', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline bg-surface/60 py-16 text-center">
      <span className="material-symbols-outlined mb-3 text-5xl text-outline">{icon}</span>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-muted">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className={`ambient-shadow max-h-[88vh] w-full overflow-y-auto rounded-3xl bg-surface p-7 ${wide ? 'max-w-2xl' : 'max-w-md'}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h3 className="text-xl font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-surface-container hover:text-ink">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-outline bg-background px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container';

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lift',
    secondary: 'bg-secondary text-white hover:bg-[#465339] shadow-soft',
    ghost: 'bg-transparent text-primary hover:bg-primary-container',
    danger: 'bg-error/10 text-error hover:bg-error hover:text-white',
    soft: 'bg-surface-container text-ink hover:bg-primary-container'
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatCard({ icon, label, value, sub, accent = 'primary' }) {
  const accents = {
    primary: 'text-primary bg-primary-container',
    secondary: 'text-secondary bg-secondary-container',
    tertiary: 'text-tertiary bg-[#E0EFED]'
  };
  return (
    <div className="soft-shadow rounded-2xl bg-surface p-6">
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${accents[accent]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">
      <span className="material-symbols-outlined text-lg">error</span>
      {message}
    </div>
  );
}
