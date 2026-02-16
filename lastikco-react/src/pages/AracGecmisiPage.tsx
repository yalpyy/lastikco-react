import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiClock, FiActivity, FiTruck, FiAlertCircle, FiCheckCircle, FiRefreshCw, FiTrash2, FiEdit2, FiPlus, FiBattery } from 'react-icons/fi';
import { getCarWithAxles, getCarHistory } from '../services/vehicleService';

interface LogEntry {
  id: number;
  tire_id: number | null;
  car_id: number | null;
  message: string;
  created_at: string;
}

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
  status: string;
}

const AracGecmisiPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    loadData();
  }, [carId]);

  const loadData = async () => {
    if (!carId) return;

    setLoading(true);
    try {
      // Araç bilgilerini çek
      const carData = await getCarWithAxles(Number(carId));
      setCarInfo({
        id: carData.id,
        car_name: carData.car_name,
        car_model: carData.car_model,
        axle_count: carData.axle_count ?? 0,
        status: carData.status ?? 'aktif',
      });

      // Geçmiş logları çek
      const history = await getCarHistory(Number(carId));
      setLogs(history);
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (message: string) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('sil') || lowerMsg.includes('kaldır')) {
      return <FiTrash2 className="w-4 h-4 text-red-500" />;
    }
    if (lowerMsg.includes('düzenle') || lowerMsg.includes('güncelle')) {
      return <FiEdit2 className="w-4 h-4 text-blue-500" />;
    }
    if (lowerMsg.includes('uyarı') || lowerMsg.includes('alert')) {
      return <FiAlertCircle className="w-4 h-4 text-amber-500" />;
    }
    if (lowerMsg.includes('akü')) {
      return <FiBattery className="w-4 h-4 text-orange-500" />;
    }
    if (lowerMsg.includes('lastik') || lowerMsg.includes('ata')) {
      return <FiTruck className="w-4 h-4 text-emerald-500" />;
    }
    if (lowerMsg.includes('ekle') || lowerMsg.includes('yeni')) {
      return <FiPlus className="w-4 h-4 text-green-500" />;
    }
    if (lowerMsg.includes('tamam') || lowerMsg.includes('onay')) {
      return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <FiActivity className="w-4 h-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pasif':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const totalPages = Math.ceil(logs.length / perPage);
  const paginatedLogs = logs.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0B5394] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!carInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 text-lg">Araç bulunamadı.</p>
        <Link
          to="/arac-aktif"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Araç Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Geri Dön"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Araç Geçmişi</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {carInfo.car_name} - {carInfo.car_model}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/arac-duzenle/${carId}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            Düzenle
          </Link>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Car Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiTruck className="w-5 h-5 text-[#0B5394]" />
            <span className="font-semibold text-gray-900">{carInfo.car_name}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Model:</span>
            <span className="font-medium text-gray-700">{carInfo.car_model}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Aks Sayısı:</span>
            <span className="font-medium text-gray-700">{carInfo.axle_count}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Durum:</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(carInfo.status)}`}>
              {carInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiClock className="w-5 h-5" />
            İşlem Geçmişi ({logs.length} kayıt)
          </h2>
        </div>

        <div className="p-6">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <FiClock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Henüz işlem kaydı bulunmuyor</p>
              <p className="text-sm text-gray-400 mt-1">Bu araç için yapılan işlemler burada görünecek.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-4">
                {paginatedLogs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-2 top-1 w-4 h-4 bg-white border-2 border-[#0B5394] rounded-full"></div>

                    <div className="flex-1 bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getActionIcon(log.message)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{log.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Önceki
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#0B5394] text-white'
                          : 'text-gray-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AracGecmisiPage;
