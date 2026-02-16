import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useConfirm } from '../hooks/useConfirm';
import { listPassiveCars, activateCar, deleteCar } from '../services/vehicleService';
import DataTable, { type Column } from '../components/DataTable';
import type { CarWithAxle } from '../types';

const AracPasifPage = () => {
  const { confirm, ConfirmDialog } = useConfirm();
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
    if (!(await confirm({ message: 'Bu aracı aktif yapmak istediğinize emin misiniz?', variant: 'warning' }))) return;
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
    if (!(await confirm({ message: 'Bu aracı kalıcı olarak silmek istediğinize emin misiniz?', variant: 'danger' }))) return;
    try {
      await deleteCar(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      toast.success('Araç kalıcı olarak silindi.');
    } catch (error) {
      console.error('Araç silinemedi:', error);
      toast.error('Araç silinirken hata oluştu!');
    }
  };

  const columns: Column<CarWithAxle>[] = [
    { key: 'id', header: '#', sortable: true },
    { key: 'car_name', header: 'Plaka', sortable: true },
    { key: 'car_model', header: 'Model', sortable: true },
    { key: 'axle_count', header: 'Aks Sayısı', render: (row) => row.axle_count ?? '-' },
    { key: 'bolge_adi', header: 'Bölge', render: (row) => row.bolge_adi ?? '-' },
    {
      key: 'updated_at',
      header: 'Güncellenme Tarihi',
      sortable: true,
      render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (car: CarWithAxle) => (
    <>
      <button className="btn btn-success btn-sm" onClick={() => handleActivate(car.id)}>
        Aktifleştir
      </button>{' '}
      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/arac-duzenle/${car.id}`)}>
        Düzenle
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
              <DataTable
                data={cars}
                columns={columns}
                loading={loading}
                emptyMessage="Pasif araç bulunamadı"
                searchPlaceholder="Plaka veya model ara..."
                rowKey="id"
                actions={renderActions}
                pageSize={10}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </>
  );
};

export default AracPasifPage;
