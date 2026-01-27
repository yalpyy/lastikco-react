import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CarWithAxle } from '../types';
import { searchCarByName } from '../services/vehicleService';

const DashboardPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchCarByName(query);
      setResults(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arama sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid two">
      <div className="card">
        <h1>Araç Ara</h1>
        <p className="muted">Araç adına göre aks sayısını ve lastik işlemlerini görüntüleyin.</p>
        <form onSubmit={handleSearch}>
          <label htmlFor="car-name">Araç adı</label>
          <input
            id="car-name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="örn. Volvo FH"
          />
          <button className="btn primary" type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </form>
        {error && <div className="alert" style={{ marginTop: 10 }}>{error}</div>}
      </div>

      <div className="card">
        <h2>Sonuçlar</h2>
        {results.length === 0 && <p className="muted">Henüz sonuç yok. Arama yapın.</p>}
        <div className="grid">
          {results.map((car) => (
            <div key={car.id} className="card" style={{ padding: 14 }}>
              <div className="pill">Aks: {car.axle_count ?? '–'}</div>
              <h3 style={{ margin: '8px 0 4px' }}>{car.car_name}</h3>
              <p className="muted" style={{ marginTop: 0 }}>{car.car_model}</p>
              <Link className="btn secondary" to={`/araclar/${car.id}/lastik-ekle`}>
                Lastik Ekle / Görüntüle
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
