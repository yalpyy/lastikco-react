import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../services/authService';
import { useAuthStore } from '../store/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const { session, clearSession, setLoading } = useAuthStore();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      clearSession();
      navigate('/giris');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="navbar">
      <div className="brand">Lastik.co</div>
      <nav className="nav-links">
        <Link to="/">Anasayfa</Link>
        <Link to="/araclar/ekle">Araç Ekle</Link>
        <Link to="/araclar/sec">Araç Seç / Lastik</Link>
        {session ? (
          <button className="btn secondary" type="button" onClick={handleLogout}>
            Çıkış
          </button>
        ) : (
          <Link to="/giris">Giriş</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
