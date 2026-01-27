import { useEffect, useState } from 'react';

interface Car {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
  arac_bolgesi: string;
  passiveDate: string;
}

const AracPasifPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den pasif araçları çek
    setTimeout(() => {
      setCars([
        { id: 3, car_name: '35 DEF 456', car_model: 'Scania R450', axle_count: 3, arac_bolgesi: 'Bölge 3', passiveDate: '2023-12-01' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Pasif Araç İşlemleri</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Pasif Araçlar</h2>
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
                        <th>Plaka</th>
                        <th>Model</th>
                        <th>Aks Sayısı</th>
                        <th>Bölge</th>
                        <th>Pasif Olma Tarihi</th>
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
                          <td>{car.passiveDate}</td>
                          <td>
                            <button className="btn btn-success btn-sm">Aktifleştir</button>
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

export default AracPasifPage;
