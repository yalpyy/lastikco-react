import { useEffect, useState } from 'react';

interface AlertTire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_dis_derinlik: number;
  tire_ic_derinlik: number;
  tire_orta_derinlik: number;
  car_name: string;
  car_model: string;
  alert_level: 'critical' | 'warning';
}

const AlertPage = () => {
  const [alerts, setAlerts] = useState<AlertTire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den dış derinlik < 8 olan lastikleri çek
    setTimeout(() => {
      setAlerts([
        {
          id: 1,
          tire_serino: 'DOT9999',
          tire_marka: 'Continental',
          tire_desen: 'HDR2',
          tire_olcu: '315/80R22.5',
          tire_dis_derinlik: 7.5,
          tire_ic_derinlik: 7.2,
          tire_orta_derinlik: 7.3,
          car_name: '34 ABC 123',
          car_model: 'Volvo FH',
          alert_level: 'warning',
        },
        {
          id: 2,
          tire_serino: 'DOT8888',
          tire_marka: 'Goodyear',
          tire_desen: 'KMAX',
          tire_olcu: '295/80R22.5',
          tire_dis_derinlik: 6.2,
          tire_ic_derinlik: 6.0,
          tire_orta_derinlik: 6.1,
          car_name: '06 XYZ 789',
          car_model: 'Mercedes Actros',
          alert_level: 'warning',
        },
        {
          id: 3,
          tire_serino: 'DOT3333',
          tire_marka: 'Michelin',
          tire_desen: 'X Multi',
          tire_olcu: '315/80R22.5',
          tire_dis_derinlik: 4.5,
          tire_ic_derinlik: 4.8,
          tire_orta_derinlik: 4.6,
          car_name: '16 GHI 321',
          car_model: 'MAN TGX',
          alert_level: 'critical',
        },
      ]);
      setLoading(false);
    }, 500);
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
                        <th>Dış</th>
                        <th>Orta</th>
                        <th>İç</th>
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
                          <td>{tire.id}</td>
                          <td>{tire.tire_serino}</td>
                          <td>{tire.tire_marka}</td>
                          <td>{tire.tire_desen}</td>
                          <td>{tire.tire_olcu}</td>
                          <td className="font-weight-bold text-danger">{tire.tire_dis_derinlik} mm</td>
                          <td>{tire.tire_orta_derinlik} mm</td>
                          <td>{tire.tire_ic_derinlik} mm</td>
                          <td>{tire.car_name}</td>
                          <td>{tire.car_model}</td>
                          <td>
                            <button className="btn btn-sm btn-primary">Değiştir</button>
                            {' '}
                            <button className="btn btn-sm btn-info">Detay</button>
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
