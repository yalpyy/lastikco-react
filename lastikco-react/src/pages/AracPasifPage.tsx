import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listPassiveCars, activateCar, deleteCar } from '../services/vehicleService';
import type { CarWithAxle } from '../types';

const AracPasifPage = () => {
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCars = async () => {
    try {
      setLoading(true);
      const result = await listPassiveCars();
      setCars(result.data);
    } catch (error) {
      console.error('Pasif araçlar yüklenemedi:', error);
      toast.error('Pasif araçlar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleActivate = async (carId: number) => {
    if (!window.confirm('Bu aracı aktif yapmak istediğinize emin misiniz?')) return;
    try {
      await activateCar(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      toast.success('Araç aktif duruma alındı.');
    } catch (error) {
      console.error('Araç aktif yapılamadı:', error);
      toast.error('Araç aktif yapılırken hata oluştu!');
    }
  };

  const handleDelete = async (carId: number) => {
    if (!window.confirm('Bu aracı kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
      await deleteCar(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      toast.success('Araç kalıcı olarak silindi.');
    } catch (error) {
      console.error('Araç silinemedi:', error);
      toast.error('Araç silinirken hata oluştu!');
    }
  };

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
                        <th>Güncellenme Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">Pasif araç bulunamadı</td></tr>
                      ) : (
                        cars.map((car) => (
                          <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.car_name}</td>
                            <td>{car.car_model}</td>
                            <td>{car.axle_count}</td>
                            <td>{car.bolge_adi ?? '-'}</td>
                            <td>{car.updated_at ? new Date(car.updated_at).toLocaleDateString('tr-TR') : '-'}</td>
                            <td>
                              <button className="btn btn-success btn-sm" onClick={() => handleActivate(car.id)}>
                                Aktifleştir
                              </button>{' '}
                              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/arac-duzenle/${car.id}`)}>
                                Düzenle
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

export default AracPasifPage;
