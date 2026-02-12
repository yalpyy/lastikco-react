import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface DepotTire {
  id: number;
  tire_id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_disderinligi: string;
  tire_durum: string;
}

const DepodanLastikGetirPage = () => {
  const { carId: _carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [tires, setTires] = useState<DepotTire[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    // TODO: Supabase'den depodaki lastikleri çek (car_id IS NULL)
    setTimeout(() => {
      setTires([
        { id: 1, tire_id: 201, tire_serino: 'DOT3001', tire_marka: 'Michelin', tire_desen: 'X Multi D', tire_olcu: '315/80R22.5', tire_disderinligi: '14.0', tire_durum: 'Yeni' },
        { id: 2, tire_id: 202, tire_serino: 'DOT3002', tire_marka: 'Pirelli', tire_desen: 'FR85', tire_olcu: '295/80R22.5', tire_disderinligi: '12.5', tire_durum: 'İyi' },
        { id: 3, tire_id: 203, tire_serino: 'DOT3003', tire_marka: 'Bridgestone', tire_desen: 'R-Drive', tire_olcu: '315/80R22.5', tire_disderinligi: '13.0', tire_durum: 'Yeni' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAssign = async (tireId: number) => {
    if (!window.confirm('Bu lastiği araca atamak istediğinize emin misiniz?')) return;
    // TODO: Supabase'de tire.car_id = carId olarak güncelle
    setTires(prev => prev.filter(t => t.tire_id !== tireId));
    toast.success('Lastik araca başarıyla atandı!');
  };

  const brands = [...new Set(tires.map(t => t.tire_marka))];

  const filtered = tires.filter(t => {
    const matchSearch = t.tire_serino.toLowerCase().includes(search.toLowerCase());
    const matchBrand = !brandFilter || t.tire_marka === brandFilter;
    return matchSearch && matchBrand;
  });

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Depodan Lastik Getir</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Depodaki Lastikler</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Geri Dön</button>
            </div>
            <div className="padding_infor_info">
              <div className="row margin_bottom_30">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Seri no ile ara..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <select className="form-control" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
                    <option value="">Tüm Markalar</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Diş Der.</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={8} className="text-center">Depoda lastik bulunamadı</td></tr>
                      ) : (
                        filtered.map(tire => (
                          <tr key={tire.id}>
                            <td>{tire.id}</td>
                            <td>{tire.tire_serino}</td>
                            <td>{tire.tire_marka}</td>
                            <td>{tire.tire_desen}</td>
                            <td>{tire.tire_olcu}</td>
                            <td>{tire.tire_disderinligi} mm</td>
                            <td>{tire.tire_durum}</td>
                            <td>
                              <button className="btn btn-sm btn-success" onClick={() => handleAssign(tire.tire_id)}>
                                Araca Ata
                              </button>
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

export default DepodanLastikGetirPage;
