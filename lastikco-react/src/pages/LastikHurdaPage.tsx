import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { listScrapTires } from '../services/tireService';
import GenericTable, { type Column } from '../components/GenericTable';

interface ScrapTire {
  id: number;
  tire_id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_durum: string | null;
  car_name: string | null;
  car_model: string | null;
  tire_olcumtarihi: string | null;
}

const LastikHurdaPage = () => {
  const [tires, setTires] = useState<ScrapTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listScrapTires();
      setTires(data);
    } catch (error) {
      console.error('Hurda lastikler yüklenemedi:', error);
      toast.error('Hurda lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTires();
  }, []);

  const columns: Column<ScrapTire>[] = [
    { key: 'tire_id', header: '#', sortable: true, className: 'w-16' },
    { key: 'tire_serino', header: 'Seri No', render: (row) => row.tire_serino ?? '-' },
    { key: 'tire_marka', header: 'Marka', render: (row) => row.tire_marka ?? '-' },
    { key: 'tire_desen', header: 'Desen', render: (row) => row.tire_desen ?? '-' },
    { key: 'tire_olcu', header: 'Ölçü', render: (row) => row.tire_olcu ?? '-' },
    { key: 'car_name', header: 'Son Araç', render: (row) => row.car_name ?? '-' },
    { key: 'car_model', header: 'Araç Model', render: (row) => row.car_model ?? '-' },
    {
      key: 'tire_durum',
      header: 'Durum',
      render: () => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          Hurda
        </span>
      ),
    },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">Hurda Lastikler</h1>
        <p className="text-sm text-gray-500 mt-1">Hurdaya çıkarılmış lastiklerin listesi</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <FiTrash2 className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Hurda Lastik</p>
            <p className="text-2xl font-bold text-gray-900">{tires.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <GenericTable
        data={tires}
        columns={columns}
        loading={loading}
        emptyMessage="Hurdaya çıkmış lastik bulunmamaktadır."
        searchPlaceholder="Seri no, marka veya araç ara..."
        rowKey="id"
        pageSize={15}
        title="Hurda Lastik Listesi"
        headerActions={headerActions}
      />
    </div>
  );
};

export default LastikHurdaPage;
