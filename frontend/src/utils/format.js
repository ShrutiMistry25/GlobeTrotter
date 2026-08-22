export const money = (n) =>
  n === null || n === undefined
    ? '—'
    : `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const money2 = (n) =>
  n === null || n === undefined
    ? '—'
    : `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const fmtDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export const fmtDay = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

export const rangeLabel = (start, end) => `${fmtDate(start)} – ${fmtDate(end)}`;

export const eachDay = (start, end) => {
  const days = [];
  const s = new Date(`${start}T00:00:00Z`);
  const e = new Date(`${end}T00:00:00Z`);
  for (let d = s; d <= e; d = new Date(d.getTime() + 86400000)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export const tripDays = (trip) => eachDay(trip.start_date, trip.end_date).length;

export const timeLabel = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
};

export const statusColor = (status) => ({
  draft: 'bg-secondary-container text-secondary',
  planned: 'bg-primary-container text-primary-dark',
  completed: 'bg-[#E7F0EE] text-tertiary'
}[status] || 'bg-surface-container text-muted');

export const categoryIcon = (cat) =>
  ({
    outdoors: 'hiking',
    culture: 'museum',
    food: 'restaurant',
    adventure: 'paragliding',
    relax: 'spa',
    transport: 'flight_takeoff',
    stay: 'hotel',
    meals: 'flatware',
    activities: 'confirmation_number',
    other: 'receipt_long'
  }[cat] || 'explore');

export const costIndex = (i) => '₹'.repeat(i) + '·'.repeat(3 - i);
