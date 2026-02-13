import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiDisc, FiPackage, FiTruck, FiAlertTriangle, FiTrash2, FiRefreshCw, FiEye, FiClock } from 'react-icons/fi';
import { listAllTires, type TireWithDetails } from '../services/tireService';
import GenericTable, { type Column } from '../components/GenericTable';

const TotalTiresPage = () => {
  const navigate = useNavigate();
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listAllTires();
      setTires(data);
    } catch (error) {
      console.error('Lastikler yüklenemedi:', error);
      toast.error('Lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTires();
  }, []);

  // Stats
  const totalCount = tires.length;
  const depotCount = tires.filter(t => t.car_id === null).length;
  const inUseCount = tires.filter(t => t.car_id !== null).length;
  const alertCount = tires.filter(t => t.tire_disderinligi !== null && t.tire_disderinligi < 8).length;

  const getLocationBadge = (tire: TireWithDetails) => {
    if (tire.car_id === null) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Depoda
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        Araçta
      </span>
    );
  };

  const getStatusBadge = (tire: TireWithDetails) => {
    const depth = tire.tire_disderinligi;

    if (tire.tire_durum === 'Hurda') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          Hurda
        </span>
      );
    }

    if (depth !== null && depth < 8 && depth > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          Alert
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        İyi
      </span>
    );
  };

  const columns: Column<TireWithDetails>[] = [
    { key: 'id', header: '#', sortable: true, className: 'w-16' },
    { key: 'tire_serino', header: 'Seri No', sortable: true, render: (row) => row.tire_serino ?? '-' },
    { key: 'tire_marka', header: 'Marka', sortable: true, render: (row) => row.tire_marka ?? '-' },
    { key: 'tire_desen', header: 'Desen', render: (row) => row.tire_desen ?? '-' },
    { key: 'tire_olcu', header: 'Ölçü', render: (row) => row.tire_olcu ?? '-' },
    {
      key: 'tire_disderinligi',
      header: 'Dış Derinlik',
      sortable: true,
      render: (row) => {
        const depth = row.tire_disderinligi;
        if (depth === null) return '-';
        const isAlert = depth < 8;
        return (
          <span className={isAlert ? 'text-red-600 font-semibold' : ''}>
            {depth} mm
          </span>
        );
      },
    },
    {
      key: 'location',
      header: 'Konum',
      render: (row) => getLocationBadge(row),
    },
    {
      key: 'car_name',
      header: 'Araç',
      render: (row) => row.car_name ?? '-',
    },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => getStatusBadge(row),
    },
  ];

  const renderActions = (tire: TireWithDetails) => (
    <>
      <button
        className="btn-icon btn-icon-info"
        onClick={() => navigate(`/detay-sayfa/${tire.id}`)}
        title="Detay"
      >
        <FiEye className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-primary"
        onClick={() => navigate(`/lastik-gecmisi/${tire.id}`)}
        title="Geçmiş"
      >
        <FiClock className="w-4 h-4" />
      </button>
    </>
  );

  const headerActions = (
    <button
      onClick={loadTires}
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
        <h1 className="text-2xl font-bold text-gray-900">Toplam Lastikler</h1>
        <p className="text-sm text-gray-500 mt-1">Tüm lastikleri görüntüle</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDisc className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Lastik</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Depoda</p>
              <p className="text-2xl font-bold text-gray-900">{depotCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FiTruck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kullanımda</p>
              <p className="text-2xl font-bold text-gray-900">{inUseCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alert</p>
              <p className="text-2xl font-bold text-gray-900">{alertCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <GenericTable
        data={tires}
        columns={columns}
        loading={loading}
        emptyMessage="Kayıtlı lastik bulunmamaktadır."
        searchPlaceholder="Seri no veya marka ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={15}
        title="Tüm Lastik Listesi"
        headerActions={headerActions}
      />
    </div>
  );
};

export default TotalTiresPage;
