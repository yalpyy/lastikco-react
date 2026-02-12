import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTireWithDetails } from '../services/tireService';

const LastikSifirPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tire_serino: '',
    tire_marka: '',
    tire_desen: '',
    tire_olcu: '',
    tire_disderinligi: '',
    tire_durum: 'Normal',
    tire_olcumtarihi: '',
    tire_olcumkm: '',
    car_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const carId = formData.car_id ? parseInt(formData.car_id, 10) : null;
      await createTireWithDetails(carId, {
        tire_serino: formData.tire_serino || null,
        tire_marka: formData.tire_marka || null,
        tire_desen: formData.tire_desen || null,
        tire_olcu: formData.tire_olcu || null,
        tire_disderinligi: formData.tire_disderinligi || null,
        tire_durum: formData.tire_durum || 'Normal',
        tire_olcumtarihi: formData.tire_olcumtarihi || null,
        tire_olcumkm: formData.tire_olcumkm ? parseInt(formData.tire_olcumkm, 10) : null,
      });
      toast.success('Lastik başarıyla eklendi!');
      setTimeout(() => navigate('/lastik-depo'), 1500);
    } catch (error) {
      console.error('Lastik eklenemedi:', error);
      toast.error('Lastik eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Yeni Lastik Ekleme</h2>
          </div>
        </div>
      </div>

      <div className="midde_cont" style={{ marginTop: '20px' }}>
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="addTireForm">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tire_serino">Seri No:</label>
                <input
                  type="text"
                  id="tire_serino"
                  name="tire_serino"
                  className="form-control"
                  value={formData.tire_serino}
                  onChange={(e) => setFormData({ ...formData, tire_serino: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tire_marka">Marka:</label>
                <input
                  type="text"
                  id="tire_marka"
                  name="tire_marka"
                  className="form-control"
                  value={formData.tire_marka}
                  onChange={(e) => setFormData({ ...formData, tire_marka: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tire_desen">Desen:</label>
                <input
                  type="text"
                  id="tire_desen"
                  name="tire_desen"
                  className="form-control"
                  value={formData.tire_desen}
                  onChange={(e) => setFormData({ ...formData, tire_desen: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tire_olcu">Ölçü:</label>
                <input
                  type="text"
                  id="tire_olcu"
                  name="tire_olcu"
                  className="form-control"
                  value={formData.tire_olcu}
                  onChange={(e) => setFormData({ ...formData, tire_olcu: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_disderinligi">Dış Derinlik (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  id="tire_disderinligi"
                  name="tire_disderinligi"
                  className="form-control"
                  value={formData.tire_disderinligi}
                  onChange={(e) => setFormData({ ...formData, tire_disderinligi: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_durum">Durum:</label>
                <select
                  id="tire_durum"
                  name="tire_durum"
                  className="form-control"
                  value={formData.tire_durum}
                  onChange={(e) => setFormData({ ...formData, tire_durum: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Serviste">Serviste</option>
                  <option value="Hurda">Hurda</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_olcumtarihi">Ölçüm Tarihi:</label>
                <input
                  type="date"
                  id="tire_olcumtarihi"
                  name="tire_olcumtarihi"
                  className="form-control"
                  value={formData.tire_olcumtarihi}
                  onChange={(e) => setFormData({ ...formData, tire_olcumtarihi: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tire_olcumkm">Ölçüm KM:</label>
                <input
                  type="number"
                  id="tire_olcumkm"
                  name="tire_olcumkm"
                  className="form-control"
                  value={formData.tire_olcumkm}
                  onChange={(e) => setFormData({ ...formData, tire_olcumkm: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="car_id">Araç (Opsiyonel - Depoya eklemek için boş bırakın):</label>
                <input
                  type="text"
                  id="car_id"
                  name="car_id"
                  className="form-control"
                  placeholder="Araç ID veya boş"
                  value={formData.car_id}
                  onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                />
              </div>
            </div>
          </div>

          <br />
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {' '}
          <button type="button" className="btn btn-danger" onClick={() => navigate('/lastik-depo')}>
            Geri Dön
          </button>
        </form>
      </div>
    </>
  );
};

export default LastikSifirPage;
