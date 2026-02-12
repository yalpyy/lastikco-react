import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { listScrapTires } from '../services/tireService';

interface ScrapTire {
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

const LastikHurdaPage = () => {
  const [tires, setTires] = useState<ScrapTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listScrapTires();
      setTires(data);
    } catch (error) {
      console.error('Hurda lastikler yüklenemedi:', error);
      toast.error('Hurda lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
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
            <h2>Hurda Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Hurdaya Çıkmış Lastikler</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : tires.length === 0 ? (
                  <p className="text-center">Hurdaya çıkmış lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Son Araç</th>
                        <th>Araç Model</th>
                        <th>Durum</th>
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

export default LastikHurdaPage;
