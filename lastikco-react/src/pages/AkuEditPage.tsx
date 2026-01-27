import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BatteryRow {
  id: number;
  aku_marka: string;
  aku_volt: string;
  aku_amper: string;
  aku_durum: string;
  aku_fatura_tarihi: string;
}

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
}

const AkuEditPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarInfo | null>(null);
  const [batteries, setBatteries] = useState<BatteryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    aku_marka: '',
    aku_volt: '12V',
    aku_amper: '72Ah',
    aku_durum: 'İyi',
    aku_fatura_tarihi: '',
  });

  const markalar = ['Varta', 'İnci', 'Mutlu', 'Yiğit', 'Bosh', 'Exide', 'Banner', 'Diğer'];
  const voltlar = ['12V', '24V'];
  const amperler = ['7Ah', '9Ah', '12Ah', '45Ah', '50Ah', '55Ah', '60Ah', '63Ah', '66Ah', '70Ah', '72Ah', '74Ah'];
  const durumlar = ['İyi', 'Şarjda', 'Hurda'];

  useEffect(() => {
    // TODO: Supabase'den araç ve akü verilerini çek
    setTimeout(() => {
      setCar({ id: Number(carId), car_name: '34 ABC 123', car_model: 'Volvo FH16' });
      setBatteries([
        {
          id: 1,
          aku_marka: 'Varta',
          aku_volt: '12V',
          aku_amper: '72Ah',
          aku_durum: 'İyi',
          aku_fatura_tarihi: '2024-01-10',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [carId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase'e akü ekle
    console.log('Akü ekleniyor:', formData);
    setShowForm(false);
    setFormData({ aku_marka: '', aku_volt: '12V', aku_amper: '72Ah', aku_durum: 'İyi', aku_fatura_tarihi: '' });
  };

  const handleDelete = async (akuId: number) => {
    if (!window.confirm('Bu aküyü silmek istediğinize emin misiniz?')) return;
    // TODO: Supabase'den akü sil
    setBatteries(prev => prev.filter(b => b.id !== akuId));
  };

  const handleSendToDepot = async (akuId: number) => {
    if (!window.confirm('Bu aküyü depoya göndermek istediğinize emin misiniz?')) return;
    // TODO: Supabase'de aku car_id = null yap
    setBatteries(prev => prev.filter(b => b.id !== akuId));
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!car) return <p>Araç bulunamadı.</p>;

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Akü Yönetimi - {car.car_name}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Akü Ekle</h2>
              </div>
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Formu Kapat' : 'Yeni Akü Ekle'}
                </button>{' '}
                <button className="btn btn-success btn-sm" onClick={() => navigate(`/depodan-aku-getir/${car.id}`)}>
                  Depodan Akü Getir
                </button>
              </div>
            </div>
            <div className="padding_infor_info">
              {showForm && (
                <form onSubmit={handleSubmit} className="margin_bottom_30">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Marka:</label>
                        <select className="form-control" value={formData.aku_marka}
                          onChange={e => setFormData({ ...formData, aku_marka: e.target.value })} required>
                          <option value="">Seçiniz</option>
                          {markalar.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Volt:</label>
                        <select className="form-control" value={formData.aku_volt}
                          onChange={e => setFormData({ ...formData, aku_volt: e.target.value })}>
                          {voltlar.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Amper:</label>
                        <select className="form-control" value={formData.aku_amper}
                          onChange={e => setFormData({ ...formData, aku_amper: e.target.value })}>
                          {amperler.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Durum:</label>
                        <select className="form-control" value={formData.aku_durum}
                          onChange={e => setFormData({ ...formData, aku_durum: e.target.value })}>
                          {durumlar.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Fatura Tarihi:</label>
                        <input type="date" className="form-control" value={formData.aku_fatura_tarihi}
                          onChange={e => setFormData({ ...formData, aku_fatura_tarihi: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">Kaydet</button>{' '}
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button>
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
                <h2>Araçtaki Aküler</h2>
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
                        <th>Volt</th>
                        <th>Amper</th>
                        <th>Durum</th>
                        <th>Fatura Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batteries.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">Bu araçta akü yok</td></tr>
                      ) : (
                        batteries.map(battery => (
                          <tr key={battery.id}>
                            <td>{battery.id}</td>
                            <td>{battery.aku_marka}</td>
                            <td>{battery.aku_volt}</td>
                            <td>{battery.aku_amper}</td>
                            <td>
                              <span className={`badge ${battery.aku_durum === 'İyi' ? 'badge-success' : battery.aku_durum === 'Şarjda' ? 'badge-warning' : 'badge-danger'}`}>
                                {battery.aku_durum}
                              </span>
                            </td>
                            <td>{battery.aku_fatura_tarihi}</td>
                            <td>
                              <button className="btn btn-sm btn-warning" onClick={() => handleSendToDepot(battery.id)}>Depoya Gönder</button>{' '}
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(battery.id)}>Sil</button>
                            </td>
                          </tr>
                        ))
                      )}
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

export default AkuEditPage;
