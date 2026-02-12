import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface DepotBattery {
  id: number;
  aku_marka: string;
  aku_volt: string;
  aku_amper: string;
  aku_durum: string;
  aku_fatura_tarihi: string;
}

const DepodanAkuGetirPage = () => {
  const { carId: _carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState<DepotBattery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Supabase'den depodaki aküleri çek (car_id IS NULL)
    setTimeout(() => {
      setBatteries([
        { id: 1, aku_marka: 'Varta', aku_volt: '12V', aku_amper: '72Ah', aku_durum: 'İyi', aku_fatura_tarihi: '2024-01-10' },
        { id: 2, aku_marka: 'Mutlu', aku_volt: '24V', aku_amper: '74Ah', aku_durum: 'İyi', aku_fatura_tarihi: '2024-02-15' },
        { id: 3, aku_marka: 'İnci', aku_volt: '12V', aku_amper: '60Ah', aku_durum: 'Şarjda', aku_fatura_tarihi: '2024-03-01' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAssign = async (akuId: number) => {
    if (!window.confirm('Bu aküyü araca atamak istediğinize emin misiniz?')) return;
    // TODO: Supabase'de aku.car_id = carId olarak güncelle
    setBatteries(prev => prev.filter(b => b.id !== akuId));
    toast.success('Akü araca başarıyla atandı!');
  };

  const filtered = batteries.filter(b =>
    b.aku_marka.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Depodan Akü Getir</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Depodaki Aküler</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Geri Dön</button>
            </div>
            <div className="padding_infor_info">
              <div className="row margin_bottom_30">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Marka ile ara..."
                    value={search} onChange={e => setSearch(e.target.value)} />
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
                        <th>Marka</th>
                        <th>Volt</th>
                        <th>Amper</th>
                        <th>Durum</th>
                        <th>Fatura Tarihi</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">Depoda akü bulunamadı</td></tr>
                      ) : (
                        filtered.map(battery => (
                          <tr key={battery.id}>
                            <td>{battery.id}</td>
                            <td>{battery.aku_marka}</td>
                            <td>{battery.aku_volt}</td>
                            <td>{battery.aku_amper}</td>
                            <td>{battery.aku_durum}</td>
                            <td>{battery.aku_fatura_tarihi}</td>
                            <td>
                              <button className="btn btn-sm btn-success" onClick={() => handleAssign(battery.id)}>
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

export default DepodanAkuGetirPage;
