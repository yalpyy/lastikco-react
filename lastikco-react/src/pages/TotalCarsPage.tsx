import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTruck, FiTool, FiClock, FiRefreshCw } from 'react-icons/fi';
import { listCarsWithAxles } from '../services/vehicleService';
import GenericTable, { type Column } from '../components/GenericTable';
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

  // Stats
  const totalCount = cars.length;
  const activeCount = cars.filter(c => c.status === 'aktif').length;
  const passiveCount = cars.filter(c => c.status !== 'aktif').length;

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
      ),
    },
    { key: 'bolge_adi', header: 'Bölge', render: (row) => row.bolge_adi ?? '-' },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'aktif'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}
        >
          {row.status === 'aktif' ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Eklenme Tarihi',
      sortable: true,
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (car: CarWithAxle) => (
    <>
      <button
        className="btn-icon btn-icon-info"
        onClick={() => navigate(`/arac-gecmisi/${car.id}`)}
        title="Geçmiş"
      >
        <FiClock className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-primary"
        onClick={() => navigate(`/arac-duzenle/${car.id}`)}
        title="Düzenle"
      >
        <FiTool className="w-4 h-4" />
      </button>
    </>
  );

  const headerActions = (
    <button
      onClick={loadCars}
      className="flex items-center gap-2 px-4 py-2 bg-white text-[#0B5394] rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
    >
      <FiRefreshCw className="w-4 h-4" />
      Yenile
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Toplam Araçlar</h1>
        <p className="text-sm text-gray-500 mt-1">Tüm araçları görüntüle</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiTruck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Araç</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FiTruck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiTruck className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pasif</p>
              <p className="text-2xl font-bold text-gray-900">{passiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <GenericTable
        data={cars}
        columns={columns}
        loading={loading}
        emptyMessage="Kayıtlı araç bulunmamaktadır."
        searchPlaceholder="Plaka veya model ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={15}
        title="Tüm Araç Listesi"
        headerActions={headerActions}
      />
    </div>
  );
};

export default TotalCarsPage;
