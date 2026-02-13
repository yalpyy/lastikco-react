import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiPlus, FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi';
import { listBolges, createBolge, deleteBolge, type Bolge } from '../services/bolgeService';
import GenericTable, { type Column } from '../components/GenericTable';

const BolgeEklePage = () => {
  const navigate = useNavigate();
  const [bolgeAdi, setBolgeAdi] = useState('');
  const [loading, setLoading] = useState(false);
  const [bolges, setBolges] = useState<Bolge[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadBolges = async () => {
    try {
      setLoadingList(true);
      const data = await listBolges();
      setBolges(data);
    } catch (error) {
      console.error('Bölgeler yüklenemedi:', error);
      toast.error('Bölgeler yüklenirken hata oluştu!');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadBolges();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!bolgeAdi.trim()) {
      toast.error('Lütfen bölge adı giriniz.');
      return;
    }

    setLoading(true);
    try {
      await createBolge(bolgeAdi.trim());
      toast.success('Bölge başarıyla eklendi!');
      setBolgeAdi('');
      await loadBolges();
    } catch (error: any) {
      console.error('Bölge eklenemedi:', error);
      toast.error(error.message || 'Bölge eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bolgeId: number) => {
    if (!window.confirm('Bu bölgeyi silmek istediğinize emin misiniz?')) return;

    try {
      await deleteBolge(bolgeId);
      setBolges(bolges.filter(b => b.id !== bolgeId));
      toast.success('Bölge başarıyla silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Bölge silinirken hata oluştu!');
    }
  };

  const columns: Column<Bolge>[] = [
    { key: 'id', header: '#', sortable: true, className: 'w-16' },
    { key: 'bolge_adi', header: 'Bölge Adı', sortable: true },
    {
      key: 'created_at',
      header: 'Eklenme Tarihi',
      sortable: true,
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (bolge: Bolge) => (
    <button
      className="btn-icon btn-icon-danger"
      onClick={() => handleDelete(bolge.id)}
      title="Sil"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Geri Dön"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bölge Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Bölge ekle ve yönet</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Yeni Bölge Ekle
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölge Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bolgeAdi}
                onChange={(e) => setBolgeAdi(e.target.value)}
                placeholder="Örn: Marmara Bölgesi, Depo 1, vb."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiMapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Bölge</p>
            <p className="text-2xl font-bold text-gray-900">{bolges.length}</p>
          </div>
        </div>
      </div>

      {/* Existing Regions Table */}
      <GenericTable
        data={bolges}
        columns={columns}
        loading={loadingList}
        emptyMessage="Henüz bölge eklenmemiş."
        searchPlaceholder="Bölge adı ara..."
        rowKey="id"
        actions={renderActions}
        pageSize={10}
        title="Mevcut Bölgeler"
      />
    </div>
  );
};

export default BolgeEklePage;
