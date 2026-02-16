import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiTool, FiCheckCircle, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useConfirm } from '../hooks/useConfirm';
import { listServiceTires, repairTire, sendTireToScrap } from '../services/tireService';
import GenericTable, { type Column } from '../components/GenericTable';

interface ServiceTire {
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

const LastikServisPage = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const [tires, setTires] = useState<ServiceTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listServiceTires();
      setTires(data);
    } catch (error) {
      console.error('Servisteki lastikler yüklenemedi:', error);
      toast.error('Servisteki lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async (tireId: number) => {
    try {
      await repairTire(tireId);
      setTires(tires.filter(t => t.tire_id !== tireId));
      toast.success('Lastik onarıldı ve depoya gönderildi!');
    } catch (error) {
      console.error('Onarma hatası:', error);
      toast.error('Lastik onarılırken hata oluştu!');
    }
  };

  const handleScrap = async (tireId: number) => {
    if (!(await confirm({ message: 'Bu lastiği hurdaya çıkarmak istediğinizden emin misiniz?', variant: 'danger' }))) return;
    try {
      await sendTireToScrap(tireId);
      setTires(tires.filter(t => t.tire_id !== tireId));
      toast.success('Lastik hurdaya çıkarıldı!');
    } catch (error) {
      console.error('Hurda hatası:', error);
      toast.error('Lastik hurdaya çıkarılırken hata oluştu!');
    }
  };

  useEffect(() => {
    loadTires();
  }, []);

  const columns: Column<ServiceTire>[] = [
    { key: 'tire_id', header: '#', sortable: true, className: 'w-16' },
    { key: 'tire_serino', header: 'Seri No', render: (row) => row.tire_serino ?? '-' },
    { key: 'tire_marka', header: 'Marka', render: (row) => row.tire_marka ?? '-' },
    { key: 'tire_desen', header: 'Desen', render: (row) => row.tire_desen ?? '-' },
    { key: 'tire_olcu', header: 'Ölçü', render: (row) => row.tire_olcu ?? '-' },
    { key: 'car_name', header: 'Araç Plakası', render: (row) => row.car_name ?? '-' },
    { key: 'car_model', header: 'Araç Model', render: (row) => row.car_model ?? '-' },
    {
      key: 'tire_durum',
      header: 'Durum',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          {row.tire_durum ?? 'Serviste'}
        </span>
      ),
    },
  ];

  const renderActions = (tire: ServiceTire) => (
    <>
      <button
        className="btn-icon btn-icon-success"
        onClick={() => handleRepair(tire.tire_id)}
        title="Onar (Depoya Gönder)"
      >
        <FiCheckCircle className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-danger"
        onClick={() => handleScrap(tire.tire_id)}
        title="Hurdaya Çıkar"
      >
        <FiTrash2 className="w-4 h-4" />
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
        <h1 className="text-2xl font-bold text-gray-900">Servisteki Lastikler</h1>
        <p className="text-sm text-gray-500 mt-1">Serviste onarım bekleyen lastikleri görüntüleyin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <FiTool className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Servisteki Lastik</p>
            <p className="text-2xl font-bold text-gray-900">{tires.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <GenericTable
        data={tires}
        columns={columns}
        loading={loading}
        emptyMessage="Serviste lastik bulunmamaktadır."
        searchPlaceholder="Seri no, marka veya araç ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={15}
        title="Servis Lastik Listesi"
        headerActions={headerActions}
      />
      <ConfirmDialog />
    </div>
  );
};

export default LastikServisPage;
