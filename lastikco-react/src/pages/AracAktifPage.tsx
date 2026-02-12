import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listActiveCars, deactivateCar, deleteCar } from '../services/vehicleService';
import type { CarWithAxle } from '../types';

const AracAktifPage = () => {
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadCars = async (searchTerm?: string) => {
    try {
      setLoading(true);
      const result = await listActiveCars(searchTerm);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCars(search);
  };

  const handleDelete = async (carId: number) => {
    if (!window.confirm('Bu aracı silmek istediğinize emin misiniz? Tüm lastik ve akü verileri de silinecektir.')) return;
    try {
      await deleteCar(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      toast.success('Araç başarıyla silindi.');
    } catch (error) {
      console.error('Araç silinemedi:', error);
      toast.error('Araç silinirken hata oluştu!');
    }
  };

  const handlePassive = async (carId: number) => {
    if (!window.confirm('Bu aracı pasif yapmak istediğinize emin misiniz?')) return;
    try {
      await deactivateCar(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      toast.success('Araç pasif duruma alındı.');
    } catch (error) {
      console.error('Araç pasif yapılamadı:', error);
      toast.error('Araç pasif yapılırken hata oluştu!');
    }
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
              <div style={{ float: 'right' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Plaka veya model ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Ara</button>
                </form>
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
                            <td>{car.bolge_adi ?? '-'}</td>
                            <td>{car.created_at ? new Date(car.created_at).toLocaleDateString('tr-TR') : '-'}</td>
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
