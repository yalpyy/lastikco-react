import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTrash2, FiPause, FiTool, FiBattery, FiMapPin, FiPlus } from 'react-icons/fi';
import { listActiveCars, deactivateCar, deleteCar } from '../services/vehicleService';
import GenericTable, { type Column } from '../components/GenericTable';
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
    { key: 'id', header: '#', sortable: true, className: 'w-16' },
    { key: 'car_name', header: 'Plaka', sortable: true },
    { key: 'car_model', header: 'Model', sortable: true },
    {
      key: 'axle_count',
      header: 'Aks Sayısı',
      className: 'text-center',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.axle_count ?? '-'}
        </span>
      )
    },
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
      <button
        className="btn-icon btn-icon-primary"
        onClick={() => navigate(`/arac-duzenle/${car.id}`)}
        title="Lastik Yönetimi"
      >
        <FiTool className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-info"
        onClick={() => navigate(`/aku-duzenle/${car.id}`)}
        title="Akü Yönetimi"
      >
        <FiBattery className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-warning"
        onClick={() => navigate(`/arac-bolge/${car.id}`)}
        title="Bölge Değiştir"
      >
        <FiMapPin className="w-4 h-4" />
      </button>
      <button
        className="btn-icon text-gray-500 hover:bg-gray-100"
        onClick={() => handlePassive(car.id)}
        title="Pasif Yap"
      >
        <FiPause className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-danger"
        onClick={() => handleDelete(car.id)}
        title="Sil"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </>
  );

  const headerActions = (
    <button
      onClick={() => navigate('/arac-ekle')}
      className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
    >
      <FiPlus className="w-4 h-4" />
      Yeni Araç
    </button>
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Aktif Araç İşlemleri</h1>
        <p className="text-sm text-gray-500 mt-1">Aktif durumdaki araçları görüntüleyin ve yönetin</p>
      </div>

      {/* Table */}
      <GenericTable
        data={cars}
        columns={columns}
        loading={loading}
        emptyMessage="Aktif araç bulunamadı"
        searchPlaceholder="Plaka veya model ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={10}
        title="Aktif Araç Listesi"
        headerActions={headerActions}
      />
    </div>
  );
};

export default AracAktifPage;
