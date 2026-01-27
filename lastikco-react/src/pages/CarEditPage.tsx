import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface TireRow {
  id: number;
  tire_id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_disderinligi: string;
  tire_durum: string;
  tire_olcumtarihi: string;
  tire_olcumkm: number;
  tire_position: string;
  axle_number: number;
}

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
}

const CarEditPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarInfo | null>(null);
  const [tires, setTires] = useState<TireRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTire, setEditingTire] = useState<TireRow | null>(null);
  const [formData, setFormData] = useState({
    tire_serino: '',
    tire_marka: '',
    tire_desen: '',
    tire_olcu: '',
    tire_disderinligi: '',
    tire_durum: 'Yeni',
    tire_olcumtarihi: '',
    tire_olcumkm: '',
    tire_position: '',
    axle_number: '1',
  });

  useEffect(() => {
    // TODO: Supabase'den araç ve lastik verilerini çek
    setTimeout(() => {
      setCar({
        id: Number(carId),
        car_name: '34 ABC 123',
        car_model: 'Volvo FH16',
        axle_count: 3,
      });
      setTires([
        {
          id: 1,
          tire_id: 101,
          tire_serino: 'DOT2024A',
          tire_marka: 'Michelin',
          tire_desen: 'X Multi D',
          tire_olcu: '315/80R22.5',
          tire_disderinligi: '12.5',
          tire_durum: 'İyi',
          tire_olcumtarihi: '2024-01-15',
          tire_olcumkm: 45000,
          tire_position: 'Sol Ön',
          axle_number: 1,
        },
        {
          id: 2,
          tire_id: 102,
          tire_serino: 'DOT2024B',
          tire_marka: 'Pirelli',
          tire_desen: 'FR85',
          tire_olcu: '315/80R22.5',
          tire_disderinligi: '10.2',
          tire_durum: 'İyi',
          tire_olcumtarihi: '2024-01-15',
          tire_olcumkm: 45000,
          tire_position: 'Sağ Ön',
          axle_number: 1,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [carId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase'e lastik ekle/güncelle
    console.log('Form data:', formData);
    setShowForm(false);
    setEditingTire(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      tire_serino: '',
      tire_marka: '',
      tire_desen: '',
      tire_olcu: '',
      tire_disderinligi: '',
      tire_durum: 'Yeni',
      tire_olcumtarihi: '',
      tire_olcumkm: '',
      tire_position: '',
      axle_number: '1',
    });
  };

  const handleEdit = (tire: TireRow) => {
    setEditingTire(tire);
    setFormData({
      tire_serino: tire.tire_serino,
      tire_marka: tire.tire_marka,
      tire_desen: tire.tire_desen,
      tire_olcu: tire.tire_olcu,
      tire_disderinligi: tire.tire_disderinligi,
      tire_durum: tire.tire_durum,
      tire_olcumtarihi: tire.tire_olcumtarihi,
      tire_olcumkm: String(tire.tire_olcumkm),
      tire_position: tire.tire_position,
      axle_number: String(tire.axle_number),
    });
    setShowForm(true);
  };

  const handleDelete = async (tireId: number) => {
    if (!window.confirm('Bu lastiği silmek istediğinize emin misiniz?')) return;
    // TODO: Supabase'den lastik sil
    setTires(prev => prev.filter(t => t.tire_id !== tireId));
  };

  const handleRemoveTire = async (tireId: number) => {
    if (!window.confirm('Bu lastiği araçtan çıkarmak istediğinize emin misiniz?')) return;
    // TODO: Supabase'de lastik car_id = null yap (depoya gönder)
    setTires(prev => prev.filter(t => t.tire_id !== tireId));
  };

  const getPositionsForAxle = (axleNum: number, totalAxles: number): string[] => {
    if (axleNum === 1) return ['Sol Ön', 'Sağ Ön'];
    if (axleNum <= totalAxles) return ['Sol Dış', 'Sol İç', 'Sağ İç', 'Sağ Dış'];
    return ['Sol', 'Sağ'];
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!car) return <p>Araç bulunamadı.</p>;

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>
              Araç Düzenle - {car.car_name} ({car.car_model})
            </h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Araç Bilgileri</h2>
              </div>
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/aku-duzenle/${car.id}`)}>
                  Akü Yönetimi
                </button>{' '}
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/arac-gecmisi/${car.id}`)}>
                  Araç Geçmişi
                </button>{' '}
                <button className="btn btn-warning btn-sm" onClick={() => navigate(`/arac-bolge/${car.id}`)}>
                  Bölge Değiştir
                </button>{' '}
                <button className="btn btn-danger btn-sm" onClick={() => {
                  if (window.confirm('Bu aracı silmek istediğinize emin misiniz? Tüm lastik ve akü verileri de silinecektir.')) {
                    // TODO: Supabase'den aracı ve ilişkili verileri sil
                    navigate('/arac-aktif');
                  }
                }}>
                  Aracı Sil
                </button>
              </div>
            </div>
            <div className="padding_infor_info">
              <div className="row">
                <div className="col-md-4">
                  <strong>Plaka:</strong> {car.car_name}
                </div>
                <div className="col-md-4">
                  <strong>Model:</strong> {car.car_model}
                </div>
                <div className="col-md-4">
                  <strong>Aks Sayısı:</strong> {car.axle_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Lastik Yönetimi</h2>
              </div>
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setEditingTire(null); setShowForm(true); }}>
                  Yeni Lastik Ekle
                </button>{' '}
                <button className="btn btn-success btn-sm" onClick={() => navigate(`/depodan-lastik-getir/${car.id}`)}>
                  Depodan Lastik Getir
                </button>
              </div>
            </div>
            <div className="padding_infor_info">
              {showForm && (
                <form onSubmit={handleSubmit} className="margin_bottom_30">
                  <h5>{editingTire ? 'Lastik Düzenle' : 'Yeni Lastik Ekle'}</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Seri No:</label>
                        <input type="text" className="form-control" value={formData.tire_serino}
                          onChange={e => setFormData({ ...formData, tire_serino: e.target.value })} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Marka:</label>
                        <input type="text" className="form-control" value={formData.tire_marka}
                          onChange={e => setFormData({ ...formData, tire_marka: e.target.value })} required />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Desen:</label>
                        <input type="text" className="form-control" value={formData.tire_desen}
                          onChange={e => setFormData({ ...formData, tire_desen: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Ölçü:</label>
                        <input type="text" className="form-control" value={formData.tire_olcu}
                          onChange={e => setFormData({ ...formData, tire_olcu: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Diş Derinliği (mm):</label>
                        <input type="text" className="form-control" value={formData.tire_disderinligi}
                          onChange={e => setFormData({ ...formData, tire_disderinligi: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Durum:</label>
                        <select className="form-control" value={formData.tire_durum}
                          onChange={e => setFormData({ ...formData, tire_durum: e.target.value })}>
                          <option value="Yeni">Yeni</option>
                          <option value="İyi">İyi</option>
                          <option value="Orta">Orta</option>
                          <option value="Kötü">Kötü</option>
                          <option value="Hurda">Hurda</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Ölçüm Tarihi:</label>
                        <input type="date" className="form-control" value={formData.tire_olcumtarihi}
                          onChange={e => setFormData({ ...formData, tire_olcumtarihi: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Ölçüm KM:</label>
                        <input type="number" className="form-control" value={formData.tire_olcumkm}
                          onChange={e => setFormData({ ...formData, tire_olcumkm: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Aks No:</label>
                        <select className="form-control" value={formData.axle_number}
                          onChange={e => setFormData({ ...formData, axle_number: e.target.value, tire_position: '' })}>
                          {Array.from({ length: car.axle_count }, (_, i) => (
                            <option key={i + 1} value={i + 1}>Aks {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Pozisyon:</label>
                        <select className="form-control" value={formData.tire_position}
                          onChange={e => setFormData({ ...formData, tire_position: e.target.value })} required>
                          <option value="">Seçiniz</option>
                          {getPositionsForAxle(Number(formData.axle_number), car.axle_count).map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">{editingTire ? 'Güncelle' : 'Ekle'}</button>{' '}
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingTire(null); }}>İptal</button>
                </form>
              )}

              {Array.from({ length: car.axle_count }, (_, axleIdx) => {
                const axleNum = axleIdx + 1;
                const axleTires = tires.filter(t => t.axle_number === axleNum);
                return (
                  <div key={axleNum} className="margin_bottom_30">
                    <h5>Aks {axleNum}</h5>
                    <div className="table-responsive-sm">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Pozisyon</th>
                            <th>Seri No</th>
                            <th>Marka</th>
                            <th>Desen</th>
                            <th>Ölçü</th>
                            <th>Diş Der.</th>
                            <th>Durum</th>
                            <th>Ölçüm Tarihi</th>
                            <th>KM</th>
                            <th>İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {axleTires.length === 0 ? (
                            <tr><td colSpan={10} className="text-center">Bu aksta lastik yok</td></tr>
                          ) : (
                            axleTires.map(tire => (
                              <tr key={tire.id}>
                                <td>{tire.tire_position}</td>
                                <td>{tire.tire_serino}</td>
                                <td>{tire.tire_marka}</td>
                                <td>{tire.tire_desen}</td>
                                <td>{tire.tire_olcu}</td>
                                <td>
                                  <span className={Number(tire.tire_disderinligi) < 3 ? 'text-danger font-weight-bold' : ''}>
                                    {tire.tire_disderinligi} mm
                                  </span>
                                </td>
                                <td>{tire.tire_durum}</td>
                                <td>{tire.tire_olcumtarihi}</td>
                                <td>{tire.tire_olcumkm}</td>
                                <td>
                                  <button className="btn btn-sm btn-primary" onClick={() => handleEdit(tire)}>Düzenle</button>{' '}
                                  <button className="btn btn-sm btn-info" onClick={() => navigate(`/dis-derinligi/${tire.tire_id}`)}>Diş Der.</button>{' '}
                                  <button className="btn btn-sm btn-warning" onClick={() => navigate(`/km-bilgi/${tire.tire_id}`)}>KM</button>{' '}
                                  <button className="btn btn-sm btn-secondary" onClick={() => handleRemoveTire(tire.tire_id)}>Çıkart</button>{' '}
                                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tire.tire_id)}>Sil</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarEditPage;
