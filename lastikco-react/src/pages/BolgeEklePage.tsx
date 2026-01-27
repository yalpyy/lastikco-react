import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const BolgeEklePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region_name: '',
    region_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Supabase'e bölge eklenecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Bölge başarıyla eklendi.' });
      setTimeout(() => {
        setFormData({ region_name: '', region_description: '' });
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Bölge eklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Yeni Bölge Ekleme</h2>
          </div>
        </div>
      </div>

      <div className="midde_cont" style={{ marginTop: '20px' }}>
        <div className="white_shd full margin_bottom_30">
          <div className="full graph_head">
            <div className="heading1 margin_0">
              <h2>Bölge Bilgileri</h2>
            </div>
          </div>
          <div className="padding_infor_info">
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="region_name">Bölge Adı:</label>
                <input
                  type="text"
                  id="region_name"
                  name="region_name"
                  className="form-control"
                  placeholder="Örn: Bölge 1, Anadolu Yakası, vb."
                  value={formData.region_name}
                  onChange={(e) => setFormData({ ...formData, region_name: e.target.value })}
                  required
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="region_description">Açıklama:</label>
                <textarea
                  id="region_description"
                  name="region_description"
                  className="form-control"
                  rows={4}
                  placeholder="Bölge hakkında detaylı bilgi..."
                  value={formData.region_description}
                  onChange={(e) => setFormData({ ...formData, region_description: e.target.value })}
                />
              </div>
              <br />
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {' '}
              <button type="button" className="btn btn-danger" onClick={() => navigate('/')}>
                Geri Dön
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BolgeEklePage;
