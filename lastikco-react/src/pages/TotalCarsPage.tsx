import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
  arac_bolgesi: string;
  status: string;
  created_date: string;
}

const TotalCarsPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den tüm araçları çek
    setTimeout(() => {
      setCars([
        { id: 1, car_name: '34 ABC 123', car_model: 'Volvo FH', axle_count: 3, arac_bolgesi: 'Bölge 1', status: 'Aktif', created_date: '2024-01-15' },
        { id: 2, car_name: '06 XYZ 789', car_model: 'Mercedes Actros', axle_count: 4, arac_bolgesi: 'Bölge 2', status: 'Aktif', created_date: '2024-01-20' },
        { id: 3, car_name: '35 DEF 456', car_model: 'Scania R450', axle_count: 3, arac_bolgesi: 'Bölge 3', status: 'Pasif', created_date: '2023-12-01' },
        { id: 4, car_name: '16 GHI 321', car_model: 'MAN TGX', axle_count: 4, arac_bolgesi: 'Bölge 1', status: 'Aktif', created_date: '2024-02-10' },
        { id: 5, car_name: '01 JKL 654', car_model: 'DAF XF', axle_count: 3, arac_bolgesi: 'Bölge 2', status: 'Aktif', created_date: '2024-02-15' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Toplam Araçlar</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Tüm Araç Listesi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : cars.length === 0 ? (
                  <p className="text-center">Kayıtlı araç bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Plaka</th>
                        <th>Model</th>
                        <th>Aks Sayısı</th>
                        <th>Bölge</th>
                        <th>Durum</th>
                        <th>Eklenme Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car) => (
                        <tr key={car.id}>
                          <td>{car.id}</td>
                          <td>{car.car_name}</td>
                          <td>{car.car_model}</td>
                          <td>{car.axle_count}</td>
                          <td>{car.arac_bolgesi}</td>
                          <td>
                            <span className={`badge ${car.status === 'Aktif' ? 'badge-success' : 'badge-secondary'}`}>
                              {car.status}
                            </span>
                          </td>
                          <td>{car.created_date}</td>
                          <td>
                            <button className="btn btn-sm btn-info" onClick={() => navigate(`/arac-gecmisi/${car.id}`)}>Detay</button>
                            {' '}
                            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/arac-duzenle/${car.id}`)}>Düzenle</button>
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

export default TotalCarsPage;
