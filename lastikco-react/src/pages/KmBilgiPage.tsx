import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiNavigation, FiTrendingUp } from 'react-icons/fi';
import { getTireKmHistory, addTireKm } from '../services/tireService';
import { supabase } from '../lib/supabaseClient';

interface KmRecord {
  id: number;
  tire_id: number;
  km_value: number;
  measurement_date: string;
  created_at?: string;
}

interface TireInfo {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  car_name?: string;
}

const KmBilgiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const [tireInfo, setTireInfo] = useState<TireInfo | null>(null);
  const [records, setRecords] = useState<KmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKm, setNewKm] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadData();
  }, [tireId]);

  const loadData = async () => {
    if (!tireId) return;

    setLoading(true);
    try {
      // Lastik bilgilerini çek
      const { data: tireData, error: tireError } = await supabase
        .from('tires')
        .select(`
          id,
          tire_details(tire_serino, tire_marka, tire_desen),
          cars(car_name)
        `)
        .eq('id', Number(tireId))
        .single();

      if (tireError) throw tireError;

      const details = tireData?.tire_details?.[0] || {};
      setTireInfo({
        id: tireData.id,
        tire_serino: details.tire_serino || 'Bilinmiyor',
        tire_marka: details.tire_marka || '',
        tire_desen: details.tire_desen || '',
        car_name: tireData?.cars?.car_name,
      });

      // KM kayıtlarını çek
      const kmHistory = await getTireKmHistory(Number(tireId));
      setRecords(kmHistory.sort((a: KmRecord, b: KmRecord) =>
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
      ));
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!tireId) return;

    const kmNum = Number(newKm);
    if (kmNum <= 0) {
      toast.error('KM değeri 0\'dan büyük olmalıdır.');
      return;
    }

    // Yeni KM'nin son KM'den büyük olması gerekiyor
    if (records.length > 0) {
      const lastKm = records[records.length - 1].km_value;
      if (kmNum <= lastKm) {
        toast.error('Yeni KM değeri önceki değerden büyük olmalıdır!');
        return;
      }
    }

    setSaving(true);
    try {
      const newRecord = await addTireKm(Number(tireId), kmNum, newDate);
      setRecords(prev => [...prev, newRecord].sort((a, b) =>
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
      ));
      setNewKm('');
      setNewDate(new Date().toISOString().split('T')[0]);
      toast.success('KM kaydı başarıyla eklendi.');
    } catch (error: any) {
      toast.error(error.message || 'Kayıt eklenirken hata oluştu.');
      console.error('Add error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('km_bilgi')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('KM kaydı silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Silme işlemi sırasında hata oluştu.');
      console.error('Delete error:', error);
    }
  };

  const handleEditSave = async (id: number) => {
    const kmNum = Number(editValue);
    if (kmNum <= 0) {
      toast.error('KM değeri 0\'dan büyük olmalıdır.');
      return;
    }

    try {
      const { error } = await supabase
        .from('km_bilgi')
        .update({ km_value: kmNum })
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.map(r =>
        r.id === id ? { ...r, km_value: kmNum } : r
      ));
      setEditingId(null);
      setEditValue('');
      toast.success('KM kaydı güncellendi.');
    } catch (error: any) {
      toast.error(error.message || 'Güncelleme sırasında hata oluştu.');
      console.error('Update error:', error);
    }
  };

  // Toplam KM hesaplama
  const totalKm = records.length >= 2
    ? records[records.length - 1].km_value - records[0].km_value
    : 0;

  const maxKm = Math.max(...records.map(r => r.km_value), 1);

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
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Geri Dön"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Kilometre Takibi</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {tireInfo?.tire_serino} - {tireInfo?.tire_marka} {tireInfo?.tire_desen}
            {tireInfo?.car_name && <span className="text-[#0B5394]"> ({tireInfo.car_name})</span>}
          </p>
        </div>
        <Link
          to={`/detay-sayfa/${tireId}`}
          className="ml-11 sm:ml-0 inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
        >
          Detay Görünüm
        </Link>
      </div>

      {/* Summary Cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0B5394]/10 rounded-lg">
                <FiNavigation className="w-5 h-5 text-[#0B5394]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">İlk KM</p>
                <p className="text-lg font-semibold text-gray-900">{records[0].km_value.toLocaleString('tr-TR')} km</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiNavigation className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Son KM</p>
                <p className="text-lg font-semibold text-gray-900">{records[records.length - 1].km_value.toLocaleString('tr-TR')} km</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiTrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Mesafe</p>
                <p className="text-lg font-semibold text-gray-900">{totalKm.toLocaleString('tr-TR')} km</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New KM Record */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Yeni KM Kaydı Ekle
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kilometre <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={newKm}
                onChange={e => setNewKm(e.target.value)}
                placeholder="Örn: 45000"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kayıt Tarihi
              </label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm font-medium disabled:opacity-50"
            >
              <FiPlus className="w-4 h-4" />
              {saving ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </form>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5" />
            KM Grafiği
          </h2>
        </div>
        <div className="p-6">
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiTrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Henüz KM kaydı yok</p>
              <p className="text-sm mt-1">Yukarıdaki formu kullanarak ilk kaydı ekleyin.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-14 flex flex-col justify-between text-xs text-gray-500">
                <span>{(maxKm / 1000).toFixed(0)}k</span>
                <span>{(maxKm / 2000).toFixed(0)}k</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-16 flex items-end gap-2 h-48">
                {records.map((r, index) => {
                  const height = (r.km_value / maxKm) * 100;
                  return (
                    <div
                      key={r.id}
                      className="flex-1 flex flex-col items-center group"
                    >
                      <div className="relative flex flex-col items-center">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                          {r.km_value.toLocaleString('tr-TR')} km
                        </div>
                        {/* Value label */}
                        <span className="text-xs font-medium text-[#0B5394] mb-1">
                          {(r.km_value / 1000).toFixed(0)}k
                        </span>
                        {/* Bar */}
                        <div
                          className="w-full max-w-12 rounded-t-md bg-[#0B5394] hover:bg-[#094A84] transition-all"
                          style={{ height: `${Math.max(height, 5)}%`, minHeight: '8px' }}
                        />
                      </div>
                      {/* Date label */}
                      <span className="text-[10px] text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(r.measurement_date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            KM Kayıtları ({records.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B5394]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Kilometre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Fark</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    Henüz KM kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                records.map((r, index) => {
                  const diff = index > 0 ? r.km_value - records[index - 1].km_value : 0;
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        {editingId === r.id ? (
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {r.km_value.toLocaleString('tr-TR')} km
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {index > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                            <FiTrendingUp className="w-3 h-3" />
                            +{diff.toLocaleString('tr-TR')} km
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(r.measurement_date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {editingId === r.id ? (
                            <>
                              <button
                                onClick={() => handleEditSave(r.id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Kaydet"
                              >
                                <FiSave className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setEditingId(null); setEditValue(''); }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="İptal"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingId(r.id); setEditValue(String(r.km_value)); }}
                                className="p-2 text-[#0B5394] hover:bg-[#0B5394]/10 rounded-lg transition-colors"
                                title="Düzenle"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KmBilgiPage;
