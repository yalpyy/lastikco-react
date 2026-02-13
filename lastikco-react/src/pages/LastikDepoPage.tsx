import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiDisc, FiPackage, FiPlus, FiTrash2, FiEdit, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { listDepotTires, deleteTire, type TireWithDetails } from '../services/tireService';
import GenericTable, { type Column } from '../components/GenericTable';

const LastikDepoPage = () => {
  const navigate = useNavigate();
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listDepotTires();
      setTires(data);
    } catch (error) {
      console.error('Depodaki lastikler yüklenemedi:', error);
      toast.error('Depodaki lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu lastiği silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteTire(id);
      setTires(tires.filter(t => t.id !== id));
      toast.success('Lastik başarıyla silindi!');
    } catch (error) {
      console.error('Lastik silinemedi:', error);
      toast.error('Lastik silinirken hata oluştu!');
    }
  };

  useEffect(() => {
    loadTires();
  }, []);

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
      key: 'tire_durum',
      header: 'Durum',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          {row.tire_durum ?? 'Normal'}
        </span>
      ),
    },
    {
      key: 'tire_olcumtarihi',
      header: 'Ölçüm Tarihi',
      sortable: true,
      render: (row) => row.tire_olcumtarihi ? new Date(row.tire_olcumtarihi).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (tire: TireWithDetails) => (
    <>
      <button
        className="btn-icon btn-icon-success"
        onClick={() => navigate(`/arac-aktif?assignTire=${tire.id}`)}
        title="Araca Tak"
      >
        <FiTruck className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-warning"
        onClick={() => navigate(`/detay-sayfa/${tire.id}`)}
        title="Düzenle"
      >
        <FiEdit className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-danger"
        onClick={() => handleDelete(tire.id)}
        title="Sil"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </>
  );

  const headerActions = (
    <>
      <button
        onClick={() => navigate('/lastik-sifir')}
        className="flex items-center gap-2 px-4 py-2 bg-white text-[#0B5394] rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
      >
        <FiPlus className="w-4 h-4" />
        Yeni Lastik
      </button>
      <button
        onClick={loadTires}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
      >
        <FiRefreshCw className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Depodaki Lastikler</h1>
        <p className="text-sm text-gray-500 mt-1">Depoda bekleyen lastikleri görüntüleyin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Depodaki Lastik</p>
              <p className="text-2xl font-bold text-gray-900">{tires.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FiDisc className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kullanıma Hazır</p>
              <p className="text-2xl font-bold text-gray-900">
                {tires.filter(t => (t.tire_disderinligi ?? 0) >= 8).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <GenericTable
        data={tires}
        columns={columns}
        loading={loading}
        emptyMessage="Depoda lastik bulunmamaktadır."
        searchPlaceholder="Seri no veya marka ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={15}
        title="Depo Lastik Listesi"
        headerActions={headerActions}
      />
    </div>
  );
};

export default LastikDepoPage;
