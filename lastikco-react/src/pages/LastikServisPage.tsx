import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { listServiceTires, repairTire, sendTireToScrap } from '../services/tireService';

interface ServiceTire {
  id: number;
  tire_id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_durum: string | null;
  car_name: string | null;
  car_model: string | null;
  tire_olcumtarihi: string | null;
}

const LastikServisPage = () => {
  const [tires, setTires] = useState<ServiceTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listServiceTires();
      setTires(data);
    } catch (error) {
      console.error('Servisteki lastikler yüklenemedi:', error);
      toast.error('Servisteki lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async (tireId: number) => {
    try {
      await repairTire(tireId);
      setTires(tires.filter(t => t.tire_id !== tireId));
      toast.success('Lastik onarıldı ve depoya gönderildi!');
    } catch (error) {
      console.error('Onarma hatası:', error);
      toast.error('Lastik onarılırken hata oluştu!');
    }
  };

  const handleScrap = async (tireId: number) => {
    if (!window.confirm('Bu lastiği hurdaya çıkarmak istediğinizden emin misiniz?')) return;
    try {
      await sendTireToScrap(tireId);
      setTires(tires.filter(t => t.tire_id !== tireId));
      toast.success('Lastik hurdaya çıkarıldı!');
    } catch (error) {
      console.error('Hurda hatası:', error);
      toast.error('Lastik hurdaya çıkarılırken hata oluştu!');
    }
  };

  useEffect(() => {
    loadTires();
  }, []);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Servisteki Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Servis Lastik Listesi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : tires.length === 0 ? (
                  <p className="text-center">Serviste lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Araç Plakası</th>
                        <th>Araç Model</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tires.map((tire) => (
                        <tr key={tire.id}>
                          <td>{tire.tire_id}</td>
                          <td>{tire.tire_serino ?? '-'}</td>
                          <td>{tire.tire_marka ?? '-'}</td>
                          <td>{tire.tire_desen ?? '-'}</td>
                          <td>{tire.tire_olcu ?? '-'}</td>
                          <td>{tire.car_name ?? '-'}</td>
                          <td>{tire.car_model ?? '-'}</td>
                          <td>{tire.tire_durum ?? '-'}</td>
                          <td>
                            <button className="btn btn-success btn-sm" onClick={() => handleRepair(tire.tire_id)}>Onar</button>
                            {' '}
                            <button className="btn btn-danger btn-sm" onClick={() => handleScrap(tire.tire_id)}>Hurdaya Çıkar</button>
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

export default LastikServisPage;
