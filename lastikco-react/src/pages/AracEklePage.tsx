import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AracEklePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    car_name: '',
    car_model: '',
    axle_count: '',
    arac_bolgesi: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Supabase'e veri eklenecek
      // Şimdilik mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Araç başarıyla eklendi!');
      setTimeout(() => navigate('/arac-aktif'), 1500);
    } catch (error) {
      console.error('Araç eklenemedi:', error);
      toast.error('Araç eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Araç Ekleme</h2>
          </div>
        </div>
      </div>

      <div className="midde_cont" style={{ marginTop: '20px' }}>
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="addcarForm">
          <div className="row">
            <div className="col-6 col-md-4">
              <label className="input-group-text" htmlFor="car_name">Plaka:</label>
            </div>
            <div className="col-6 col-md-4">
              <label className="input-group-text" htmlFor="car_model">Model:</label>
            </div>
            <div className="col-6 col-md-4">
              <label className="input-group-text" htmlFor="axle_count">Aks/Dingil Sayısı:</label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                type="text"
                id="car_name"
                name="car_name"
                className="form-control"
                value={formData.car_name}
                onChange={(e) => setFormData({ ...formData, car_name: e.target.value })}
                required
              />
              <br /><br />
            </div>
            <div className="col">
              <input
                type="text"
                id="car_model"
                name="car_model"
                className="form-control"
                value={formData.car_model}
                onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                required
              />
            </div>
            <div className="col">
              <input
                type="number"
                id="axle_count"
                name="axle_count"
                className="form-control"
                value={formData.axle_count}
                onChange={(e) => setFormData({ ...formData, axle_count: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="arac_bolgesi">Araç Bölgesi:</label>
          </div>
          <select
            className="form-control"
            id="arac_bolgesi"
            name="arac_bolgesi"
            value={formData.arac_bolgesi}
            onChange={(e) => setFormData({ ...formData, arac_bolgesi: e.target.value })}
            required
          >
            <option value="">Bölge Seçiniz...</option>
            <option value="Bölge 1">Bölge 1</option>
            <option value="Bölge 2">Bölge 2</option>
            <option value="Bölge 3">Bölge 3</option>
          </select>
          <br /><br />
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {' '}
          <button type="button" className="btn btn-danger" onClick={() => navigate('/arac-aktif')}>
            Geri Dön
          </button>
        </form>
      </div>
    </>
  );
};

export default AracEklePage;
