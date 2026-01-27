import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Battery {
  id: number;
  battery_brand: string;
  battery_serial: string;
  car_id: number | null;
  car_name: string | null;
  purchase_date: string;
  battery_status: string;
}

const AkuDepoPage = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    battery_brand: '',
    battery_serial: '',
    purchase_date: '',
    car_id: '',
  });

  useEffect(() => {
    // TODO: Supabase'den akü verilerini çek
    setTimeout(() => {
      setBatteries([
        {
          id: 1,
          battery_brand: 'Varta',
          battery_serial: 'VRT123456',
          car_id: null,
          car_name: null,
          purchase_date: '2024-01-10',
          battery_status: 'Depoda',
        },
        {
          id: 2,
          battery_brand: 'Mutlu',
          battery_serial: 'MTL789012',
          car_id: 1,
          car_name: '34 ABC 123',
          purchase_date: '2024-01-15',
          battery_status: 'Kullanımda',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase'e akü ekle
    console.log('Form data:', formData);
    setShowForm(false);
    setFormData({ battery_brand: '', battery_serial: '', purchase_date: '', car_id: '' });
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Akü Yönetimi</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Akü Ekle</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              {!showForm ? (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Yeni Akü Ekle
                </button>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="battery_brand">Marka:</label>
                        <input
                          type="text"
                          id="battery_brand"
                          className="form-control"
                          value={formData.battery_brand}
                          onChange={(e) => setFormData({ ...formData, battery_brand: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="battery_serial">Seri No:</label>
                        <input
                          type="text"
                          id="battery_serial"
                          className="form-control"
                          value={formData.battery_serial}
                          onChange={(e) => setFormData({ ...formData, battery_serial: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="purchase_date">Alım Tarihi:</label>
                        <input
                          type="date"
                          id="purchase_date"
                          className="form-control"
                          value={formData.purchase_date}
                          onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="car_id">Araç (Opsiyonel):</label>
                        <input
                          type="text"
                          id="car_id"
                          className="form-control"
                          placeholder="Depoya eklemek için boş bırakın"
                          value={formData.car_id}
                          onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">Kaydet</button>
                  {' '}
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    İptal
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Akü Listesi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Marka</th>
                        <th>Seri No</th>
                        <th>Alım Tarihi</th>
                        <th>Durum</th>
                        <th>Araç</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batteries.map((battery) => (
                        <tr key={battery.id}>
                          <td>{battery.id}</td>
                          <td>{battery.battery_brand}</td>
                          <td>{battery.battery_serial}</td>
                          <td>{battery.purchase_date}</td>
                          <td>
                            <span className={`badge ${battery.battery_status === 'Depoda' ? 'badge-warning' : 'badge-success'}`}>
                              {battery.battery_status}
                            </span>
                          </td>
                          <td>{battery.car_name || '-'}</td>
                          <td>
                            {battery.car_id ? (
                              <button className="btn btn-sm btn-info" onClick={() => navigate(`/aku-duzenle/${battery.car_id}`)}>
                                Araçta Görüntüle
                              </button>
                            ) : (
                              <>
                                <button className="btn btn-sm btn-warning" onClick={() => {
                                  // TODO: Supabase'de akü depoya gönder
                                  setBatteries(prev => prev.filter(b => b.id !== battery.id));
                                }}>
                                  Depoya Gönder
                                </button>{' '}
                              </>
                            )}
                            {' '}
                            <button className="btn btn-sm btn-danger" onClick={() => {
                              if (window.confirm('Bu aküyü silmek istediğinize emin misiniz?')) {
                                // TODO: Supabase'den akü sil
                                setBatteries(prev => prev.filter(b => b.id !== battery.id));
                              }
                            }}>
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AkuDepoPage;
