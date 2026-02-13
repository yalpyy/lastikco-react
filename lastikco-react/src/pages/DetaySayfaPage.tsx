import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiTrendingDown, FiCalendar, FiAlertTriangle, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { getTireDepthHistory, getTireKmHistory } from '../services/tireService';
import { supabase } from '../lib/supabaseClient';

interface DepthRecord {
  id: number;
  tire_id: number;
  depth_value: number;
  measurement_date: string;
}

interface KmRecord {
  id: number;
  tire_id: number;
  km_value: number;
  measurement_date: string;
}

interface TireInfo {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_olcu: string;
  tire_durum: string;
  tire_disderinligi: number | null;
}

const DetaySayfaPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const [depthRecords, setDepthRecords] = useState<DepthRecord[]>([]);
  const [kmRecords, setKmRecords] = useState<KmRecord[]>([]);
  const [tireInfo, setTireInfo] = useState<TireInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tireId]);

  const loadData = async () => {
    if (!tireId) return;

    setLoading(true);
    try {
      // Lastik bilgilerini çek
      const { data: tireData, error: tireError } = await supabase
        .from('tire_details')
        .select('tire_id, tire_serino, tire_marka, tire_olcu, tire_durum, tire_disderinligi')
        .eq('tire_id', Number(tireId))
        .single();

      if (tireError) throw tireError;

      setTireInfo({
        id: Number(tireId),
        tire_serino: tireData?.tire_serino ?? 'Bilinmiyor',
        tire_marka: tireData?.tire_marka ?? '-',
        tire_olcu: tireData?.tire_olcu ?? '-',
        tire_durum: tireData?.tire_durum ?? '-',
        tire_disderinligi: tireData?.tire_disderinligi ? Number(tireData.tire_disderinligi) : null,
      });

      // Diş derinliği kayıtlarını çek
      const depthHistory = await getTireDepthHistory(Number(tireId));
      setDepthRecords(depthHistory.map((d: any) => ({
        id: d.id,
        tire_id: d.tire_id,
        depth_value: Number(d.depth_value),
        measurement_date: d.measurement_date,
      })));

      // KM kayıtlarını çek
      const kmHistory = await getTireKmHistory(Number(tireId));
      setKmRecords(kmHistory.map((k: any) => ({
        id: k.id,
        tire_id: k.tire_id,
        km_value: Number(k.km_value),
        measurement_date: k.measurement_date,
      })));
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepthStatus = (depth: number) => {
    if (depth < 3) return { color: 'bg-red-500', text: 'Kritik', textColor: 'text-red-600' };
    if (depth < 5) return { color: 'bg-red-400', text: 'Tehlikeli', textColor: 'text-red-500' };
    if (depth < 8) return { color: 'bg-amber-500', text: 'Uyarı', textColor: 'text-amber-600' };
    return { color: 'bg-emerald-500', text: 'İyi', textColor: 'text-emerald-600' };
  };

  const getDurumBadge = (durum: string) => {
    switch (durum) {
      case 'Normal':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Serviste':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Hurda':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Chart için veriler (son 10 kayıt, ters sıralı - en eski en solda)
  const chartData = [...depthRecords].reverse().slice(-10);
  const maxDepth = Math.max(...chartData.map(r => r.depth_value), 16);

  // KM özet
  const firstKm = kmRecords.length > 0 ? kmRecords[kmRecords.length - 1]?.km_value : null;
  const lastKm = kmRecords.length > 0 ? kmRecords[0]?.km_value : null;
  const totalDistance = firstKm && lastKm ? lastKm - firstKm : 0;

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

  if (!tireInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 text-lg">Lastik bulunamadı.</p>
        <Link
          to="/lastik-depo"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Lastik Listesine Dön
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
            <h1 className="text-2xl font-bold text-gray-900">Lastik Detay</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {tireInfo.tire_serino} - {tireInfo.tire_marka}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/dis-derinligi/${tireId}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
          >
            <FiTrendingDown className="w-4 h-4" />
            Diş Derinliği
          </Link>
          <Link
            to={`/km-bilgi/${tireId}`}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <FiCalendar className="w-4 h-4" />
            KM Bilgi
          </Link>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tire Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Seri No:</span>
            <span className="font-semibold text-gray-900">{tireInfo.tire_serino}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Marka:</span>
            <span className="font-medium text-gray-700">{tireInfo.tire_marka}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ölçü:</span>
            <span className="font-medium text-gray-700">{tireInfo.tire_olcu}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Durum:</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumBadge(tireInfo.tire_durum)}`}>
              {tireInfo.tire_durum}
            </span>
          </div>
          {tireInfo.tire_disderinligi !== null && (
            <>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Son Diş:</span>
                <span className={`font-semibold ${getDepthStatus(tireInfo.tire_disderinligi).textColor}`}>
                  {tireInfo.tire_disderinligi} mm
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Last Depth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              tireInfo.tire_disderinligi && tireInfo.tire_disderinligi < 5 ? 'bg-red-100' : 'bg-emerald-100'
            }`}>
              <FiTrendingDown className={`w-6 h-6 ${
                tireInfo.tire_disderinligi && tireInfo.tire_disderinligi < 5 ? 'text-red-600' : 'text-emerald-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Son Diş Derinliği</p>
              <p className={`text-2xl font-bold ${
                tireInfo.tire_disderinligi && tireInfo.tire_disderinligi < 5 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {tireInfo.tire_disderinligi ?? '-'} mm
              </p>
            </div>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Mesafe</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalDistance.toLocaleString('tr-TR')} km
              </p>
            </div>
          </div>
        </div>

        {/* Measurement Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiInfo className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ölçüm Sayısı</p>
              <p className="text-2xl font-bold text-gray-900">
                {depthRecords.length} kayıt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Depth Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiTrendingDown className="w-5 h-5" />
            Diş Derinliği Grafiği
          </h2>
        </div>

        <div className="p-6">
          {chartData.length === 0 ? (
            <div className="text-center py-12">
              <FiTrendingDown className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Henüz ölçüm kaydı bulunmuyor</p>
            </div>
          ) : (
            <div className="h-64">
              <div className="flex items-end justify-between h-full gap-2">
                {chartData.map((record, index) => {
                  const heightPercent = (record.depth_value / maxDepth) * 100;
                  const status = getDepthStatus(record.depth_value);
                  return (
                    <div key={record.id} className="flex flex-col items-center flex-1 h-full">
                      <span className={`text-xs font-semibold mb-1 ${status.textColor}`}>
                        {record.depth_value}mm
                      </span>
                      <div className="flex-1 w-full flex items-end">
                        <div
                          className={`w-full ${status.color} rounded-t-lg transition-all duration-300 hover:opacity-80`}
                          style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                          title={`${record.depth_value}mm - ${record.measurement_date}`}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 text-center">
                        {new Date(record.measurement_date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Warning levels */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-600">İyi (8+ mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">Uyarı (5-8 mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-xs text-gray-600">Tehlikeli (3-5 mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Kritik (&lt;3 mm)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiCalendar className="w-5 h-5" />
            Ölçüm Geçmişi
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Diş Derinliği</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ölçüm Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {depthRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                depthRecords.map((record, index) => {
                  const status = getDepthStatus(record.depth_value);
                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${status.textColor}`}>
                          {record.depth_value} mm
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.depth_value < 5
                            ? 'bg-red-100 text-red-800'
                            : record.depth_value < 8
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {record.depth_value < 5 && <FiAlertTriangle className="w-3 h-3" />}
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(record.measurement_date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Hızlı İşlemler</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/dis-derinligi/${tireId}`}
            className="px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm"
          >
            Diş Derinliği Ekle
          </Link>
          <Link
            to={`/km-bilgi/${tireId}`}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            KM Bilgisi Ekle
          </Link>
          <Link
            to={`/basinc-bilgi/${tireId}`}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            Basınç Bilgisi Ekle
          </Link>
          <Link
            to={`/lastik-gecmisi/${tireId}`}
            className="px-4 py-2 bg-slate-100 text-gray-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            İşlem Geçmişi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetaySayfaPage;
