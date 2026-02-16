import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiAlertTriangle, FiAlertCircle, FiRefreshCw, FiExternalLink, FiClock } from 'react-icons/fi';
import { listAlertTires } from '../services/tireService';
import GenericTable, { type Column } from '../components/GenericTable';

interface AlertTire {
  id: number;
  tire_id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_disderinligi: number | null;
  car_name: string | null;
  car_model: string | null;
  alert_level: 'critical' | 'warning';
}

const AlertPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertTire[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await listAlertTires();
      setAlerts(data);
    } catch (error) {
      console.error('Uyarılar yüklenemedi:', error);
      toast.error('Uyarılar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // Stats
  const criticalCount = alerts.filter(a => a.alert_level === 'critical').length;
  const warningCount = alerts.filter(a => a.alert_level === 'warning').length;

  const columns: Column<AlertTire>[] = [
    {
      key: 'alert_level',
      header: 'Uyarı',
      render: (row) =>
        row.alert_level === 'critical' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FiAlertCircle className="w-3 h-3" />
            KRİTİK
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <FiAlertTriangle className="w-3 h-3" />
            UYARI
          </span>
        ),
    },
    { key: 'tire_id', header: '#', sortable: true, className: 'w-16' },
    { key: 'tire_serino', header: 'Seri No', render: (row) => row.tire_serino ?? '-' },
    { key: 'tire_marka', header: 'Marka', render: (row) => row.tire_marka ?? '-' },
    { key: 'tire_desen', header: 'Desen', render: (row) => row.tire_desen ?? '-' },
    { key: 'tire_olcu', header: 'Ölçü', render: (row) => row.tire_olcu ?? '-' },
    {
      key: 'tire_disderinligi',
      header: 'Dış Derinlik',
      sortable: true,
      render: (row) => (
        <span className="text-red-600 font-semibold">
          {row.tire_disderinligi} mm
        </span>
      ),
    },
    { key: 'car_name', header: 'Araç Plaka', render: (row) => row.car_name ?? '-' },
    { key: 'car_model', header: 'Araç Model', render: (row) => row.car_model ?? '-' },
  ];

  const renderActions = (tire: AlertTire) => (
    <>
      <button
        className="btn-icon btn-icon-primary"
        onClick={() => navigate(`/lastik-depo`)}
        title="Değiştir"
      >
        <FiExternalLink className="w-4 h-4" />
      </button>
      <button
        className="btn-icon btn-icon-info"
        onClick={() => navigate(`/lastik-gecmisi/${tire.tire_id}`)}
        title="Detay"
      >
        <FiClock className="w-4 h-4" />
      </button>
    </>
  );

  const headerActions = (
    <button
      onClick={loadAlerts}
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
        <h1 className="text-2xl font-bold text-gray-900">Lastik Uyarıları</h1>
        <p className="text-sm text-gray-500 mt-1">Dış derinlik değeri 8mm'nin altında olan lastikler</p>
      </div>

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <FiAlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800">Dikkat!</h3>
            <p className="text-sm text-amber-700 mt-1">
              Bu listede dış derinlik değeri 8mm'nin altında olan lastikler gösterilmektedir.
              Bu lastikler yakında değiştirilmelidir.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Uyarı</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kritik ({"<"}5mm)</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Uyarı (5-8mm)</p>
              <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success message if no alerts */}
      {!loading && alerts.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-emerald-800">Tebrikler!</h3>
          <p className="text-emerald-700 mt-1">Şu anda uyarı gerektiren lastik bulunmamaktadır.</p>
        </div>
      )}

      {/* Table */}
      {(loading || alerts.length > 0) && (
        <GenericTable
          data={alerts}
          columns={columns}
          loading={loading}
          emptyMessage="Uyarı gerektiren lastik bulunamadı."
          searchPlaceholder="Seri no, marka veya araç ara..."
          rowKey="id"
          actions={renderActions}
          pageSize={15}
          title={`Uyarı Listesi (${alerts.length} Lastik)`}
          headerActions={headerActions}
        />
      )}
    </div>
  );
};

export default AlertPage;
