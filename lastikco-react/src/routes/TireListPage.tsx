import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listTiresByCar } from '../services/tireService';
import { getCarWithAxles } from '../services/vehicleService';

type TireDetailWithMeta = {
  id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_disderinligi: string | null;
  tire_durum: string | null;
  tire_olcumtarihi: string | null;
  tire_olcumkm: number | null;
  tires: {
    car_id: number;
    axle_number: number;
    tire_position: string;
  };
};

const TireListPage = () => {
  const { carId } = useParams();
  const [carTitle, setCarTitle] = useState('');
  const [items, setItems] = useState<TireDetailWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!carId) return;
      try {
        const car = await getCarWithAxles(Number(carId));
        setCarTitle(`${car.car_name} (${car.car_model})`);
        const data = await listTiresByCar(Number(carId));
        setItems(data as TireDetailWithMeta[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lastikler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [carId]);

  if (loading) return <div className="page">Lastikler yükleniyor...</div>;
  if (error) return <div className="alert">{error}</div>;

  return (
    <div className="card">
      <h1>Lastik Listesi</h1>
      <p className="muted">
        Araç: <strong>{carTitle}</strong>
      </p>
      <div className="grid two">
        {items.map((item) => (
          <div key={item.id} className="card" style={{ padding: 14 }}>
            <div className="pill">Aks {item.tires.axle_number}</div>
            <div style={{ fontWeight: 700 }}>{item.tires.tire_position}</div>
            <div className="muted">Seri: {item.tire_serino ?? '—'}</div>
            <div className="muted">Marka/Desen: {item.tire_marka ?? '—'} {item.tire_desen ?? ''}</div>
            <div className="muted">Ölçü: {item.tire_olcu ?? '—'}</div>
            <div className="muted">Dış derinlik: {item.tire_disderinligi ?? '—'}</div>
            <div className="muted">Durum: {item.tire_durum ?? '—'}</div>
            <div className="muted">Tarih: {item.tire_olcumtarihi ?? '—'} | KM: {item.tire_olcumkm ?? '—'}</div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="muted">Kayıtlı lastik bulunamadı.</p>}
      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <Link className="btn secondary" to={`/araclar/${carId}/lastik-ekle`}>Lastik Ekle</Link>
        <Link className="btn secondary" to="/araclar/sec">Araçlara Dön</Link>
      </div>
    </div>
  );
};

export default TireListPage;
