import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBattery, FiPlus, FiTrash2, FiTruck, FiSearch, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { listAkus, deleteAku, sendAkuToDepot, type AkuWithCar } from '../services/akuService';

const AkuDepoPage = () => {
  const [batteries, setBatteries] = useState<AkuWithCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const perPage = 15;

  useEffect(() => {
    loadBatteries();
  }, []);

  const loadBatteries = async () => {
    setLoading(true);
    try {
      const data = await listAkus();
      setBatteries(data);
    } catch (error: any) {
      toast.error(error.message || 'Aküler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu aküyü silmek istediğinize emin misiniz?')) return;

    try {
      await deleteAku(id);
      setBatteries(prev => prev.filter(b => b.id !== id));
      toast.success('Akü başarıyla silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Akü silinirken hata oluştu.');
    }
  };

  const handleSendToDepot = async (id: number) => {
    try {
      await sendAkuToDepot(id);
      await loadBatteries();
      toast.success('Akü depoya gönderildi.');
    } catch (error: any) {
      toast.error(error.message || 'İşlem sırasında hata oluştu.');
    }
  };

  const getDurumBadge = (durum: string) => {
    switch (durum) {
      case 'İyi':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Şarjda':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Hurda':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getLocationBadge = (carId: number | null) => {
    if (carId === null) {
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  };

  // Filter batteries by search
  const filteredBatteries = batteries.filter(battery =>
    battery.aku_marka.toLowerCase().includes(search.toLowerCase()) ||
    battery.car_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBatteries.length / perPage);
  const paginatedBatteries = filteredBatteries.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Stats
  const totalCount = batteries.length;
  const depotCount = batteries.filter(b => b.car_id === null).length;
  const inUseCount = batteries.filter(b => b.car_id !== null).length;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Akü Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Tüm aküleri görüntüle ve yönet</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/yeni-aku"
            className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Yeni Akü Ekle
          </Link>
          <button
            onClick={loadBatteries}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiBattery className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Akü</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBattery className="w-6 h-6 text-blue-600" />
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
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Marka veya araç adına göre ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiBattery className="w-5 h-5" />
            Akü Listesi ({filteredBatteries.length} kayıt)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marka</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Volt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amper</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fatura Tarihi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Konum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedBatteries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    {search ? 'Aramanızla eşleşen akü bulunamadı.' : 'Henüz akü kaydı bulunmuyor.'}
                  </td>
                </tr>
              ) : (
                paginatedBatteries.map((battery, index) => (
                  <tr
                    key={battery.id}
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{(currentPage - 1) * perPage + index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{battery.aku_marka}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{battery.aku_volt}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{battery.aku_amper}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {battery.aku_fatura_tarihi
                        ? new Date(battery.aku_fatura_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumBadge(battery.aku_durum)}`}>
                        {battery.aku_durum}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getLocationBadge(battery.car_id)}`}>
                        {battery.car_id ? battery.car_name : 'Depoda'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {battery.car_id ? (
                          <>
                            <button
                              onClick={() => navigate(`/aku-duzenle/${battery.car_id}`)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Araçta Görüntüle"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendToDepot(battery.id)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Depoya Gönder"
                            >
                              <FiBattery className="w-4 h-4" />
                            </button>
                          </>
                        ) : null}
                        <button
                          onClick={() => handleDelete(battery.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
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
  );
};

export default AkuDepoPage;
