import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listActiveCars, deactivateCar, deleteCar } from '../services/vehicleService';
import DataTable, { type Column } from '../components/DataTable';
import type { CarWithAxle } from '../types';

const AracAktifPage = () => {
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);
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

  const columns: Column<CarWithAxle>[] = [
    { key: 'id', header: '#', sortable: true },
    { key: 'car_name', header: 'Plaka', sortable: true },
    { key: 'car_model', header: 'Model', sortable: true },
    { key: 'axle_count', header: 'Aks Sayısı', render: (row) => row.axle_count ?? '-' },
    { key: 'bolge_adi', header: 'Bölge', render: (row) => row.bolge_adi ?? '-' },
    {
      key: 'created_at',
      header: 'Eklenme Tarihi',
      sortable: true,
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (car: CarWithAxle) => (
    <>
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
    </>
  );

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
              <DataTable
                data={cars}
                columns={columns}
                loading={loading}
                emptyMessage="Aktif araç bulunamadı"
                searchPlaceholder="Plaka veya model ara..."
                rowKey="id"
                actions={renderActions}
                pageSize={10}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AracAktifPage;
