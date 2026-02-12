import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LastikSifirPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tire_serino: '',
    tire_marka: '',
    tire_desen: '',
    tire_olcu: '',
    tire_dis_derinlik: '',
    tire_ic_derinlik: '',
    tire_orta_derinlik: '',
    tire_adet: '',
    tire_fiyat: '',
    tire_tarih: '',
    car_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Supabase'e veri eklenecek
      await new Promise(resolve => setTimeout(resolve, 1000));
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
                <label htmlFor="tire_dis_derinlik">Dış Derinlik:</label>
                <input
                  type="number"
                  step="0.1"
                  id="tire_dis_derinlik"
                  name="tire_dis_derinlik"
                  className="form-control"
                  value={formData.tire_dis_derinlik}
                  onChange={(e) => setFormData({ ...formData, tire_dis_derinlik: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_orta_derinlik">Orta Derinlik:</label>
                <input
                  type="number"
                  step="0.1"
                  id="tire_orta_derinlik"
                  name="tire_orta_derinlik"
                  className="form-control"
                  value={formData.tire_orta_derinlik}
                  onChange={(e) => setFormData({ ...formData, tire_orta_derinlik: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_ic_derinlik">İç Derinlik:</label>
                <input
                  type="number"
                  step="0.1"
                  id="tire_ic_derinlik"
                  name="tire_ic_derinlik"
                  className="form-control"
                  value={formData.tire_ic_derinlik}
                  onChange={(e) => setFormData({ ...formData, tire_ic_derinlik: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_adet">Adet:</label>
                <input
                  type="number"
                  id="tire_adet"
                  name="tire_adet"
                  className="form-control"
                  value={formData.tire_adet}
                  onChange={(e) => setFormData({ ...formData, tire_adet: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_fiyat">Fiyat:</label>
                <input
                  type="number"
                  step="0.01"
                  id="tire_fiyat"
                  name="tire_fiyat"
                  className="form-control"
                  value={formData.tire_fiyat}
                  onChange={(e) => setFormData({ ...formData, tire_fiyat: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tire_tarih">Tarih:</label>
                <input
                  type="date"
                  id="tire_tarih"
                  name="tire_tarih"
                  className="form-control"
                  value={formData.tire_tarih}
                  onChange={(e) => setFormData({ ...formData, tire_tarih: e.target.value })}
                  required
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
