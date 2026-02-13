import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCircle, FiCheck, FiTrash2, FiSearch, FiRefreshCw, FiPackage, FiPlus } from 'react-icons/fi';
import { listDepotTires, deleteTire, updateTireDetails, type TireWithDetails } from '../services/tireService';

const LastikHavuzPage = () => {
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    loadTires();
  }, []);

  const loadTires = async () => {
    setLoading(true);
    try {
      const data = await listDepotTires();
      setTires(data);
    } catch (error: any) {
      toast.error(error.message || 'Lastikler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (tireId: number) => {
    if (!window.confirm('Bu lastiği aktif envantere taşımak istediğinize emin misiniz?')) return;

    try {
      await updateTireDetails(tireId, { tire_durum: 'Normal' });
      toast.success('Lastik aktif envantere taşındı!');
      await loadTires();
    } catch (error: any) {
      toast.error(error.message || 'İşlem sırasında hata oluştu.');
    }
  };

  const handleDelete = async (tireId: number) => {
    if (!window.confirm('Bu lastiği silmek istediğinize emin misiniz?')) return;

    try {
      await deleteTire(tireId);
      setTires(prev => prev.filter(t => t.id !== tireId));
      toast.success('Lastik başarıyla silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Lastik silinirken hata oluştu.');
    }
  };

  const getDurumBadge = (durum: string | null) => {
    switch (durum) {
      case 'Normal':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Serviste':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Hurda':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Beklemede':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Filter tires by search
  const filteredTires = tires.filter(tire =>
    tire.tire_serino?.toLowerCase().includes(search.toLowerCase()) ||
    tire.tire_marka?.toLowerCase().includes(search.toLowerCase()) ||
    tire.tire_desen?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTires.length / perPage);
  const paginatedTires = filteredTires.slice((currentPage - 1) * perPage, currentPage * perPage);

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
          <h1 className="text-2xl font-bold text-gray-900">Lastik Havuzu</h1>
          <p className="text-sm text-gray-500 mt-1">Depodaki lastikleri görüntüle ve yönet</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/lastik-sifir"
            className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Yeni Lastik Ekle
          </Link>
          <button
            onClick={loadTires}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Depodaki Lastik</p>
            <p className="text-2xl font-bold text-gray-900">{tires.length} adet</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Seri no, marka veya desen ara..."
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
            <FiCircle className="w-5 h-5" />
            Havuzdaki Lastikler ({filteredTires.length} kayıt)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seri No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marka</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Desen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ölçü</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTires.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    {search ? 'Aramanızla eşleşen lastik bulunamadı.' : 'Havuzda lastik bulunmuyor.'}
                  </td>
                </tr>
              ) : (
                paginatedTires.map((tire, index) => (
                  <tr
                    key={tire.id}
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{(currentPage - 1) * perPage + index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{tire.tire_serino || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_marka || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_desen || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_olcu || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumBadge(tire.tire_durum)}`}>
                        {tire.tire_durum || 'Depoda'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleActivate(tire.id)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Envantere Taşı"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/detay-sayfa/${tire.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detay"
                        >
                          <FiCircle className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tire.id)}
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

      {/* Info */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Lastik havuzu, depoda bulunan ve araçlara atanmamış lastikleri gösterir.
          "Envantere Taşı" butonu ile lastikleri aktif envantere taşıyabilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default LastikHavuzPage;
