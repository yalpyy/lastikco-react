import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signIn } from '../services/authService';
import { useAuthStore } from '../store/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { session, setSession, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [navigate, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    setLoading(true);

    try {
      const { session: signedSession } = await signIn(email, password);
      setSession(signedSession ?? null);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Giriş başarısız oldu.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Giriş Yap</h1>
      <p className="muted">Supabase Auth kullanarak giriş yapın.</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@lastik.co"
        />

        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 12 }}>
        Supabase Auth üzerinde kullanıcı oluşturup email/şifre ile oturum açın.
      </p>
    </div>
  );
};

export default LoginPage;
