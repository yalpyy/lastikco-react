import { useState } from 'react';
import type { FormEvent } from 'react';
import { createCarWithAxles } from '../services/vehicleService';
import { useAuthStore } from '../store/auth';

const VehicleCreatePage = () => {
  const { session } = useAuthStore();
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [axleCount, setAxleCount] = useState(2);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (carName.trim().length < 2 || carModel.trim().length < 1) {
      setError('Araç adı ve modeli en az 2 karakter olmalı.');
      return;
    }
    if (axleCount < 1) {
      setError('Aks sayısı 1 veya daha fazla olmalı.');
      return;
    }
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const createdBy = session?.user?.email ?? session?.user?.id ?? 'tanimsiz';
      await createCarWithAxles({
        car_name: carName,
        car_model: carModel,
        axle_count: axleCount,
        created_by: createdBy,
      });
      setStatus('Araç ve aks bilgisi kaydedildi.');
      setCarName('');
      setCarModel('');
      setAxleCount(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Araç Ekle</h1>
      <p className="muted">Araç bilgisi ve aks sayısını Supabase veritabanına kaydedin.</p>
      {status && <div className="pill">{status}</div>}
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="car-name">Araç adı</label>
        <input
          id="car-name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          required
        />

        <label htmlFor="car-model">Araç modeli</label>
        <input
          id="car-model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          required
        />

        <label htmlFor="axle-count">Aks sayısı</label>
        <input
          id="axle-count"
          type="number"
          min={1}
          max={10}
          value={axleCount}
          onChange={(e) => setAxleCount(Number(e.target.value))}
          required
        />

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default VehicleCreatePage;
