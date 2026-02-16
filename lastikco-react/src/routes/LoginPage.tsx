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
    <div className="relative min-h-screen w-full flex items-center justify-end">
      {/* Background Image */}
      <img
        src={`${import.meta.env.BASE_URL}images/landing_page/login_background.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Login Form - right side */}
      <div className="relative z-10 w-full max-w-sm mr-8 md:mr-16 lg:mr-24">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={`${import.meta.env.BASE_URL}images/logo/logo.png`}
              alt="Lastik.co"
              className="h-10"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
            Giriş Yap
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Hesabınıza giriş yapın
          </p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@lastik.co"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#0B5394] text-white text-sm font-bold rounded-lg hover:bg-[#094A84] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
