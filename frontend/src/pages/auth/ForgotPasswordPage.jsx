import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { Button, ErrorBox, Field, inputCls } from '../../components/ui';
import { authApi } from '../../api/services';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      setResult(await authApi.forgotPassword(email.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll generate a secure reset token for your account.">
      {result ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-secondary-container p-6 text-sm leading-relaxed text-ink">
            <p className="flex items-center gap-2 font-bold text-secondary">
              <span className="material-symbols-outlined">mark_email_read</span> Reset token generated
            </p>
            {result.resetToken && (
              <>
                <p className="mt-3 break-all rounded-lg bg-white/70 p-3 font-mono text-xs">{result.resetToken}</p>
                <p className="mt-2 text-xs text-muted">{result.note}</p>
                <Link
                  to={`/reset-password?token=${result.resetToken}`}
                  className="mt-4 inline-flex items-center gap-1 font-bold text-primary hover:text-primary-dark"
                >
                  Continue to reset <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </>
            )}
            {!result.resetToken && <p className="mt-2">{result.message}</p>}
          </div>
          <Link to="/login" className="block text-center text-sm font-semibold text-muted hover:text-ink">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <ErrorBox message={error} />
          <Field label="Account email">
            <input type="email" className={inputCls} placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Button type="submit" disabled={busy} className="w-full py-3.5">
            {busy ? 'Generating…' : 'Generate Reset Token'}
          </Button>
          <p className="text-center text-sm text-muted">
            Remembered it?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary-dark">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
