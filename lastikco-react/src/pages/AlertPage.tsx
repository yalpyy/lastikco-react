import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listAlertTires } from '../services/tireService';

interface AlertTire {
  id: number;
  tire_id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_disderinligi: number | null;
  car_name: string | null;
  car_model: string | null;
  alert_level: 'critical' | 'warning';
}

const AlertPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await listAlertTires();
      setAlerts(data);
    } catch (error) {
      console.error('Uyarılar yüklenemedi:', error);
      toast.error('Uyarılar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (_tireId: number) => {
    toast.info('Lastik değiştirme işlemi için araca yönlendiriliyorsunuz...');
    navigate(`/lastik-depo`);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Lastik Uyarıları (Dış Derinlik &lt; 8mm)</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-warning">
            <strong>Dikkat!</strong> Bu listede dış derinlik değeri 8mm'nin altında olan lastikler gösterilmektedir.
            Bu lastikler yakında değiştirilmelidir.
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Uyarı Listesi ({alerts.length} Lastik)</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : alerts.length === 0 ? (
                  <p className="text-success">Tebrikler! Şu anda uyarı gerektiren lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Uyarı</th>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Dış Derinlik</th>
                        <th>Araç Plaka</th>
                        <th>Araç Model</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((tire) => (
                        <tr key={tire.id} className={tire.alert_level === 'critical' ? 'table-danger' : 'table-warning'}>
                          <td>
                            {tire.alert_level === 'critical' ? (
                              <span className="badge badge-danger">KRİTİK</span>
                            ) : (
                              <span className="badge badge-warning">UYARI</span>
                            )}
                          </td>
                          <td>{tire.tire_id}</td>
                          <td>{tire.tire_serino ?? '-'}</td>
                          <td>{tire.tire_marka ?? '-'}</td>
                          <td>{tire.tire_desen ?? '-'}</td>
                          <td>{tire.tire_olcu ?? '-'}</td>
                          <td className="font-weight-bold text-danger">{tire.tire_disderinligi} mm</td>
                          <td>{tire.car_name ?? '-'}</td>
                          <td>{tire.car_model ?? '-'}</td>
                          <td>
                            <button className="btn btn-sm btn-primary" onClick={() => handleChange(tire.tire_id)}>Değiştir</button>
                            {' '}
                            <button className="btn btn-sm btn-info" onClick={() => navigate(`/lastik-gecmisi/${tire.tire_id}`)}>Detay</button>
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

export default AlertPage;
