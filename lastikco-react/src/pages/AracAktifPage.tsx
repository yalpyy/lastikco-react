import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
  arac_bolgesi: string;
  created_date: string;
}

const AracAktifPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Supabase'den veri çekilecek
    // Mock data
    setTimeout(() => {
      setCars([
        { id: 1, car_name: '34 ABC 123', car_model: 'Volvo FH', axle_count: 3, arac_bolgesi: 'Marmara', created_date: '2024-01-15' },
        { id: 2, car_name: '06 XYZ 789', car_model: 'Mercedes Actros', axle_count: 4, arac_bolgesi: 'Ege', created_date: '2024-01-20' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = async (carId: number) => {
    if (!window.confirm('Bu aracı silmek istediğinize emin misiniz? Tüm lastik ve akü verileri de silinecektir.')) return;
    // TODO: Supabase'den aracı ve ilişkili verileri sil
    setCars(prev => prev.filter(c => c.id !== carId));
  };

  const handlePassive = async (carId: number) => {
    if (!window.confirm('Bu aracı pasif yapmak istediğinize emin misiniz?')) return;
    // TODO: Supabase'de cars.status = 'pasif' yap
    setCars(prev => prev.filter(c => c.id !== carId));
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Aktif Araç İşlemleri</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Aktif Araçlar</h2>
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
                        <th>Eklenme Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">Aktif araç bulunamadı</td></tr>
                      ) : (
                        cars.map((car) => (
                          <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.car_name}</td>
                            <td>{car.car_model}</td>
                            <td>{car.axle_count}</td>
                            <td>{car.arac_bolgesi}</td>
                            <td>{car.created_date}</td>
                            <td>
                              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/arac-duzenle/${car.id}`)}>
                                Lastik
                              </button>{' '}
                              <button className="btn btn-info btn-sm" onClick={() => navigate(`/aku-duzenle/${car.id}`)}>
                                Akü
                              </button>{' '}
                              <button className="btn btn-warning btn-sm" onClick={() => navigate(`/arac-bolge/${car.id}`)}>
                                Bölge
                              </button>{' '}
                              <button className="btn btn-secondary btn-sm" onClick={() => handlePassive(car.id)}>
                                Pasif Yap
                              </button>{' '}
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.id)}>
                                Sil
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

export default AracAktifPage;
