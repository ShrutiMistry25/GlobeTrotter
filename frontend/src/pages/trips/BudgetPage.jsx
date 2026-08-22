import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { tripApi } from '../../api/services';
import TripTabs from '../../components/TripTabs';
import { Button, Field, Modal, PageLoader, inputCls, EmptyState } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { fmtDay, money, money2, categoryIcon } from '../../utils/format';

const CAT_COLORS = { transport: '#8C4A2E', stay: '#546347', meals: '#006763', activities: '#C98A5E', other: '#B3261E' };
const CATS = ['transport', 'stay', 'meals', 'activities', 'other'];

export default function BudgetPage() {
  const { id } = useParams();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgetEdit, setBudgetEdit] = useState(false);
  const [budgetVal, setBudgetVal] = useState('');
  const [expModal, setExpModal] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'meals', expense_date: '' });
  const [busy, setBusy] = useState(false);

  const loadAll = () =>
    Promise.all([tripApi.budget(id), tripApi.expenses(id), tripApi.get(id)])
      .then(([b, e, m]) => {
        setData(b);
        setExpenses(e);
        setMeta(m.trip);
      })
      .catch((err) => toast(err.message, 'error'));

  useEffect(() => { loadAll(); }, [id]);

  if (!data || !meta) return <PageLoader />;

  const saveBudget = async () => {
    try {
      await tripApi.update(id, { budget_total: budgetVal === '' ? null : Number(budgetVal) });
      setBudgetEdit(false);
      loadAll();
      toast('Budget updated');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const addExpense = async () => {
    if (!form.title.trim() || !Number(form.amount)) return toast('Title and amount are required', 'error');
    setBusy(true);
    try {
      await tripApi.addExpense(id, { ...form, amount: Number(form.amount), expense_date: form.expense_date || null });
      setExpModal(false);
      setForm({ title: '', amount: '', category: 'meals', expense_date: '' });
      loadAll();
      toast('Expense added');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const removeExpense = async (ex) => {
    try {
      await tripApi.removeExpense(id, ex.id);
      loadAll();
      toast('Expense deleted');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const pct = data.percent_used ?? 0;
  const overPct = pct > 100;

  return (
    <div>
      <TripTabs trip={meta} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted">Total budget:</p>
          <span className="rounded-full bg-primary-container px-4 py-1.5 text-sm font-extrabold text-primary-dark">
            {money(data.budget_total)}
          </span>
          <button onClick={() => { setBudgetVal(data.budget_total ?? ''); setBudgetEdit(true); }}
            className="rounded-full p-1.5 text-muted hover:bg-surface-container hover:text-ink">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>
        <Button variant="secondary" onClick={() => setExpModal(true)}>
          <span className="material-symbols-outlined text-lg">add</span> Add Expense
        </Button>
      </div>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="soft-shadow rounded-2xl bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Total spent</p>
          <p className={`mt-1 text-3xl font-extrabold ${overPct ? 'text-error' : 'text-ink'}`}>{money2(data.total_spent)}</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-container">
            <div className={`h-full rounded-full transition-all duration-700 ${overPct ? 'bg-error' : 'bg-gradient-to-r from-secondary to-tertiary'}`}
              style={{ width: `${Math.min(100, pct)}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {data.percent_used == null ? 'No total budget set' : `${pct}% of budget used`}
          </p>
        </div>

        <div className="soft-shadow rounded-2xl bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {data.remaining == null ? 'Remaining' : data.remaining >= 0 ? 'Remaining' : 'Overspent'}
          </p>
          <p className={`mt-1 text-3xl font-extrabold ${data.remaining != null && data.remaining < 0 ? 'text-error' : 'text-secondary'}`}>
            {data.remaining == null ? money2(null) : money2(Math.abs(data.remaining))}
          </p>
          <p className="mt-3 text-xs text-muted">{data.trip_days} days on this journey</p>
        </div>

        <div className="soft-shadow rounded-2xl bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Daily average</p>
          <p className="mt-1 text-3xl font-extrabold text-ink">{money2(data.daily_average)}</p>
          <p className="mt-3 text-xs text-muted">Allowance: {money2(data.daily_allowance)}/day</p>
        </div>

        <div className={`soft-shadow rounded-2xl p-6 ${data.over_budget_days.length ? 'bg-error/5 ring-1 ring-error/30' : 'bg-surface'}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Over-budget days</p>
          <p className={`mt-1 text-3xl font-extrabold ${data.over_budget_days.length ? 'text-error' : 'text-secondary'}`}>
            {data.over_budget_days.length}
          </p>
          <p className="mt-3 truncate text-xs text-muted">
            {data.over_budget_days.length ? data.over_budget_days.map((d) => d.slice(5)).join(', ') : 'Everything on track'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Where the money goes</h2>
          <div className="relative mx-auto mt-2 h-72 w-full max-w-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.by_category} dataKey="amount" nameKey="category" innerRadius="62%" outerRadius="88%"
                  paddingAngle={3} strokeWidth={0}>
                  {data.by_category.map((c) => (
                    <Cell key={c.category} fill={CAT_COLORS[c.category] || '#8A8078'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => money2(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Total</p>
              <p className="text-2xl font-extrabold text-ink">{money(data.total_spent)}</p>
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {data.by_category.map((c) => (
              <li key={c.category} className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined rounded-full p-1.5 text-base" style={{ background: `${CAT_COLORS[c.category]}22`, color: CAT_COLORS[c.category] }}>
                  {categoryIcon(c.category)}
                </span>
                <span className="flex-1 font-semibold capitalize text-ink">{c.category}</span>
                <span className="font-bold text-muted">{money2(c.amount)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Spending per day</h2>
          <p className="text-xs text-muted">Red bars exceed your daily allowance ({money2(data.daily_allowance)})</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.per_day}>
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(8)} tickLine={false} axisLine={false}
                  tick={{ fontSize: 11, fill: '#8A8078' }} />
                <YAxis tickFormatter={(v) => `₹${v}`} tickLine={false} axisLine={false} width={44}
                  tick={{ fontSize: 11, fill: '#8A8078' }} />
                <Tooltip formatter={(v) => [money2(v), 'Spent']} labelFormatter={(l) => fmtDay(l)} cursor={{ fill: 'rgba(140,74,46,0.06)' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {data.per_day.map((d) => (
                    <Cell key={d.date} fill={d.over ? '#B3261E' : '#C98A5E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-3xl bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Logged expenses</h2>
          <span className="text-xs font-bold text-muted">{expenses.length} entries</span>
        </div>
        {expenses.length === 0 ? (
          <EmptyState icon="receipt_long" title="No expenses logged" subtitle="Add flights, hotels and meals to complete the picture."
            action={<Button variant="secondary" onClick={() => setExpModal(true)}>Add Expense</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline/60 text-xs font-bold uppercase tracking-wider text-muted">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b border-outline/40 last:border-0">
                    <td className="py-3 pr-4 font-semibold text-ink">{e.title}</td>
                    <td className="pr-4"><span className="rounded-full px-2.5 py-1 text-xs font-bold capitalize"
                      style={{ background: `${CAT_COLORS[e.category]}18`, color: CAT_COLORS[e.category] }}>{e.category}</span></td>
                    <td className="pr-4 text-muted">{e.expense_date || '—'}</td>
                    <td className="text-right font-bold text-ink">{money2(e.amount)}</td>
                    <td className="text-right">
                      <button onClick={() => removeExpense(e)} className="rounded-full p-1.5 text-muted hover:bg-error/10 hover:text-error">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal open={budgetEdit} onClose={() => setBudgetEdit(false)} title="Set total budget">
        <Field label="Total budget (₹)">
          <input type="number" min="0" className={inputCls} value={budgetVal} onChange={(e) => setBudgetVal(e.target.value)} placeholder="55000" />
        </Field>
        <Button className="mt-5 w-full py-3.5" onClick={saveBudget}>Save Budget</Button>
      </Modal>

      <Modal open={expModal} onClose={() => setExpModal(false)} title="Add expense">
        <div className="space-y-4">
          <Field label="What was it?">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. IRCTC Train Tickets" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)">
              <input type="number" min="0" step="0.01" className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label="Date (optional)">
              <input type="date" className={inputCls} value={form.expense_date} min={data.trip?.start_date} max={data.trip?.end_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
            </Field>
          </div>
          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, category: c })}
                  className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold capitalize transition ${
                    form.category === c ? 'text-white' : 'bg-surface-container text-muted'
                  }`}
                  style={form.category === c ? { background: CAT_COLORS[c] } : {}}>
                  <span className="material-symbols-outlined text-sm">{categoryIcon(c)}</span> {c}
                </button>
              ))}
            </div>
          </Field>
          <Button className="w-full py-3.5" onClick={addExpense} disabled={busy}>{busy ? 'Saving…' : 'Add Expense'}</Button>
        </div>
      </Modal>
    </div>
  );
}
