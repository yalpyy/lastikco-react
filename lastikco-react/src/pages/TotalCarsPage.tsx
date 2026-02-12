import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listCarsWithAxles } from '../services/vehicleService';
import type { CarWithAxle } from '../types';

const TotalCarsPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    try {
      setLoading(true);
      const result = await listCarsWithAxles();
      setCars(result.data);
    } catch (error) {
      console.error('Araçlar yüklenemedi:', error);
      toast.error('Araçlar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
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
                          <td>{car.axle_count ?? '-'}</td>
                          <td>{car.bolge_adi ?? '-'}</td>
                          <td>
                            <span className={`badge ${car.status === 'aktif' ? 'badge-success' : 'badge-secondary'}`}>
                              {car.status === 'aktif' ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td>{car.created_at ? new Date(car.created_at).toLocaleDateString('tr-TR') : '-'}</td>
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
