import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCarsWithAxles } from '../services/vehicleService';
import type { CarWithAxle } from '../types';

const VehicleSelectPage = () => {
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listCarsWithAxles();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Araçlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return <div className="page">Araçlar yükleniyor...</div>;
  }

  if (error) {
    return <div className="alert">{error}</div>;
  }

  return (
    <div className="card">
      <h1>Araç Seç / Lastik Ekle</h1>
      <p className="muted">Aks sayısına göre araçları listeleyip lastik eklemeye geçin.</p>
      <div className="grid two">
        {cars.map((car) => (
          <div key={car.id} className="card" style={{ padding: 14 }}>
            <div className="pill">Aks: {car.axle_count ?? '–'}</div>
            <h3 style={{ marginBottom: 4 }}>{car.car_name}</h3>
            <p className="muted" style={{ marginTop: 0 }}>{car.car_model}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link className="btn secondary" to={`/araclar/${car.id}/lastik-ekle`}>
                Lastik Ekle
              </Link>
              <Link className="btn secondary" to={`/araclar/${car.id}/lastikler`}>
                Lastikleri Gör
              </Link>
            </div>
          </div>
        ))}
        {cars.length === 0 && <p className="muted">Kayıtlı araç bulunamadı.</p>}
      </div>
    </div>
  );
};

export default VehicleSelectPage;
