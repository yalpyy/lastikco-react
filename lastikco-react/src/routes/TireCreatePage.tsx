import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { createTireWithDetails } from '../services/tireService';
import { getCarWithAxles } from '../services/vehicleService';
import type { TireInput } from '../types';

const emptyRow = (axleNumber: number): TireInput => ({
  axle_number: axleNumber,
  tire_position: '',
  tire_serino: '',
  tire_marka: '',
  tire_desen: '',
  tire_olcu: '',
  tire_disderinligi: '',
  tire_durum: '',
  tire_olcumtarihi: '',
  tire_olcumkm: undefined,
});

const TireCreatePage = () => {
  const { carId } = useParams();
  const [carName, setCarName] = useState<string>('');
  const [axleCount, setAxleCount] = useState<number>(0);
  const [rows, setRows] = useState<TireInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!carId) return;
      try {
        const carIdNum = Number(carId);
        const car = await getCarWithAxles(carIdNum);
        setCarName(`${car.car_name} (${car.car_model})`);
        const count = Number(car.axle_count ?? 0);
        setAxleCount(count);
        setRows(Array.from({ length: count }).map((_, idx) => emptyRow(idx + 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Araç bilgisi alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [carId]);

  const handleRowChange = (index: number, field: keyof TireInput, value: string) => {
    setRows((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
      if (field === 'tire_olcumkm') {
        current.tire_olcumkm = value ? Number(value) : undefined;
      } else if (field === 'axle_number') {
        current.axle_number = Number(value);
      } else {
        (current as Record<string, string | number | undefined>)[field] = value;
      }
      next[index] = current;
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!carId) return;
    const hasEmptyPosition = rows.some((row) => !row.tire_position.trim());
    if (hasEmptyPosition) {
      setError('Her aks için lastik pozisyonu doldurulmalı.');
      return;
    }
    const hasNegativeKm = rows.some((row) => (row.tire_olcumkm ?? 0) < 0);
    if (hasNegativeKm) {
      setError('Ölçüm KM değeri negatif olamaz.');
      return;
    }
    setSaving(true);
    setStatus(null);
    setError(null);

    try {
      const carIdNumber = Number(carId);
      for (const row of rows) {
        await createTireWithDetails(carIdNumber, row);
      }
      setStatus('Lastikler kaydedildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page">Araç bilgisi yükleniyor...</div>;
  }

  if (error) {
    return <div className="alert">{error}</div>;
  }

  return (
    <div className="card">
      <h1>Lastik Ekle</h1>
      <p className="muted">
        Araç: <strong>{carName}</strong> | Aks sayısı: {axleCount}
      </p>
      {status && <div className="pill">{status}</div>}
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index} className="card" style={{ padding: 16, marginTop: 10 }}>
            <div className="pill">Aks {row.axle_number}</div>
            <label htmlFor={`tire_position_${index}`}>Lastik pozisyonu</label>
            <input
              id={`tire_position_${index}`}
              value={row.tire_position}
              onChange={(e) => handleRowChange(index, 'tire_position', e.target.value)}
              required
            />

            <label htmlFor={`tire_serino_${index}`}>Lastik seri no</label>
            <input
              id={`tire_serino_${index}`}
              value={row.tire_serino ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_serino', e.target.value)}
            />

            <label htmlFor={`tire_marka_${index}`}>Marka</label>
            <input
              id={`tire_marka_${index}`}
              value={row.tire_marka ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_marka', e.target.value)}
            />

            <label htmlFor={`tire_desen_${index}`}>Desen</label>
            <input
              id={`tire_desen_${index}`}
              value={row.tire_desen ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_desen', e.target.value)}
            />

            <label htmlFor={`tire_olcu_${index}`}>Ölçü</label>
            <input
              id={`tire_olcu_${index}`}
              value={row.tire_olcu ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_olcu', e.target.value)}
            />

            <label htmlFor={`tire_disderinligi_${index}`}>Dış derinlik</label>
            <input
              id={`tire_disderinligi_${index}`}
              value={row.tire_disderinligi ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_disderinligi', e.target.value)}
            />

            <label htmlFor={`tire_durum_${index}`}>Durum</label>
            <input
              id={`tire_durum_${index}`}
              value={row.tire_durum ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_durum', e.target.value)}
            />

            <label htmlFor={`tire_olcumtarihi_${index}`}>Ölçüm tarihi</label>
            <input
              id={`tire_olcumtarihi_${index}`}
              type="date"
              value={row.tire_olcumtarihi ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_olcumtarihi', e.target.value)}
            />

            <label htmlFor={`tire_olcumkm_${index}`}>Ölçüm KM</label>
            <input
              id={`tire_olcumkm_${index}`}
              type="number"
              value={row.tire_olcumkm ?? ''}
              onChange={(e) => handleRowChange(index, 'tire_olcumkm', e.target.value)}
            />
          </div>
        ))}

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Kaydediliyor...' : 'Lastikleri Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default TireCreatePage;
