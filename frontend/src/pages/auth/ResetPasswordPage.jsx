import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { Button, ErrorBox, Field, inputCls } from '../../components/ui';
import { authApi } from '../../api/services';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ token: params.get('token') || '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setBusy(true);
    setError('');
    try {
      await authApi.resetPassword(form.token.trim(), form.password);
      setDone(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Paste your reset token and pick a new password.">
      {done ? (
        <div className="rounded-2xl bg-secondary-container p-6 text-sm font-semibold text-secondary">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span> Password updated — redirecting to login…
          </span>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <ErrorBox message={error} />
          <Field label="Reset token">
            <input className={`${inputCls} font-mono text-xs`} placeholder="Paste token from previous step" value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })} />
          </Field>
          <Field label="New password">
            <input type="password" className={inputCls} placeholder="8+ characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Confirm new password">
            <input type="password" className={inputCls} placeholder="Repeat password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </Field>
          <Button type="submit" disabled={busy} className="w-full py-3.5">
            {busy ? 'Updating…' : 'Update Password'}
          </Button>
          <p className="text-center text-sm text-muted">
            <Link to="/login" className="font-bold text-primary hover:text-primary-dark">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
