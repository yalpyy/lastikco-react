import { useEffect, useState } from 'react';

interface Tire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_dis_derinlik: number;
  car_name: string | null;
  location: string;
  tire_tarih: string;
}

const TotalTiresPage = () => {
  const [tires, setTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den tüm lastikleri çek
    setTimeout(() => {
      setTires([
        { id: 1, tire_serino: 'DOT1234', tire_marka: 'Michelin', tire_desen: 'X Multi', tire_olcu: '315/80R22.5', tire_dis_derinlik: 14.5, car_name: null, location: 'Depo', tire_tarih: '2024-01-10' },
        { id: 2, tire_serino: 'DOT5678', tire_marka: 'Bridgestone', tire_desen: 'R297', tire_olcu: '295/80R22.5', tire_dis_derinlik: 13.8, car_name: null, location: 'Depo', tire_tarih: '2024-01-15' },
        { id: 3, tire_serino: 'DOT9999', tire_marka: 'Continental', tire_desen: 'HDR2', tire_olcu: '315/80R22.5', tire_dis_derinlik: 7.5, car_name: '34 ABC 123', location: 'Araçta', tire_tarih: '2024-01-20' },
        { id: 4, tire_serino: 'DOT8888', tire_marka: 'Goodyear', tire_desen: 'KMAX', tire_olcu: '295/80R22.5', tire_dis_derinlik: 6.2, car_name: '06 XYZ 789', location: 'Araçta', tire_tarih: '2024-01-22' },
        { id: 5, tire_serino: 'DOT1111', tire_marka: 'Pirelli', tire_desen: 'FR85', tire_olcu: '315/80R22.5', tire_dis_derinlik: 0.0, car_name: '34 ABC 123', location: 'Hurda', tire_tarih: '2023-12-15' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Toplam Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Tüm Lastik Listesi</h2>
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
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Dış Derinlik</th>
                        <th>Konum</th>
                        <th>Araç</th>
                        <th>Tarih</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tires.map((tire) => (
                        <tr key={tire.id}>
                          <td>{tire.id}</td>
                          <td>{tire.tire_serino}</td>
                          <td>{tire.tire_marka}</td>
                          <td>{tire.tire_desen}</td>
                          <td>{tire.tire_olcu}</td>
                          <td>
                            <span className={tire.tire_dis_derinlik < 8 ? 'text-danger font-weight-bold' : ''}>
                              {tire.tire_dis_derinlik} mm
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tire.location === 'Depo' ? 'badge-warning' : tire.location === 'Araçta' ? 'badge-success' : 'badge-dark'}`}>
                              {tire.location}
                            </span>
                          </td>
                          <td>{tire.car_name || '-'}</td>
                          <td>{tire.tire_tarih}</td>
                          <td>
                            {tire.tire_dis_derinlik < 8 && tire.tire_dis_derinlik > 0 && (
                              <span className="badge badge-danger">Alert</span>
                            )}
                            {tire.tire_dis_derinlik === 0 && (
                              <span className="badge badge-dark">Hurda</span>
                            )}
                            {tire.tire_dis_derinlik >= 8 && (
                              <span className="badge badge-success">İyi</span>
                            )}
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

export default TotalTiresPage;
