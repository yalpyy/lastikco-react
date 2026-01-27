import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="card">
      <h1>Sayfa bulunamadı</h1>
      <p className="muted">Aradığınız sayfa mevcut değil.</p>
      <Link className="btn secondary" to="/">
        Anasayfa
      </Link>
    </div>
  );
};

export default NotFoundPage;
