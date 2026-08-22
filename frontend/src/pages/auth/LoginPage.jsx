import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { Button, ErrorBox, Field, inputCls } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Please fill in both fields.');
    setBusy(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue planning your journeys.">
      <form onSubmit={submit} className="space-y-5">
        <ErrorBox message={error} />
        <Field label="Email">
          <input type="email" className={inputCls} placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Password">
          <input type="password" className={inputCls} placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-dark">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={busy} className="w-full py-3.5">
          {busy ? 'Logging in…' : 'Log In'}
        </Button>
        <p className="rounded-xl bg-primary-container px-4 py-3 text-center text-xs font-semibold text-primary-dark">
          Demo account: elena@globetrotter.app / Demo@1234
        </p>
        <p className="text-center text-sm text-muted">
          New here?{' '}
          <Link to="/signup" className="font-bold text-primary hover:text-primary-dark">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
