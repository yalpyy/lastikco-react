import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiAlertTriangle, FiTrendingDown } from 'react-icons/fi';
import { getTireDepthHistory, addTireDepth } from '../services/tireService';
import { supabase } from '../lib/supabaseClient';

interface DepthRecord {
  id: number;
  tire_id: number;
  depth_value: number;
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

const DisDerinligiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const [tireInfo, setTireInfo] = useState<TireInfo | null>(null);
  const [records, setRecords] = useState<DepthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDepth, setNewDepth] = useState('');
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

      // Diş derinliği kayıtlarını çek
      const depthHistory = await getTireDepthHistory(Number(tireId));
      setRecords(depthHistory.sort((a: DepthRecord, b: DepthRecord) =>
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

    const depthNum = Number(newDepth);
    if (depthNum <= 0 || depthNum > 20) {
      toast.error('Diş derinliği 0-20 mm arasında olmalıdır.');
      return;
    }

    // Yeni ölçümün son ölçümden küçük olması gerekiyor (aşınma)
    if (records.length > 0) {
      const lastDepth = records[records.length - 1].depth_value;
      if (depthNum > lastDepth) {
        toast.warning('Yeni ölçüm genellikle önceki ölçümden küçük olmalıdır (lastik aşınması).');
      }
    }

    setSaving(true);
    try {
      const newRecord = await addTireDepth(Number(tireId), depthNum, newDate);
      setRecords(prev => [...prev, newRecord].sort((a, b) =>
        new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
      ));
      setNewDepth('');
      setNewDate(new Date().toISOString().split('T')[0]);
      toast.success('Diş derinliği ölçümü başarıyla eklendi.');
    } catch (error: any) {
      toast.error(error.message || 'Ölçüm eklenirken hata oluştu.');
      console.error('Add error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ölçümü silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('dis_derinligi')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('Ölçüm kaydı silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Silme işlemi sırasında hata oluştu.');
      console.error('Delete error:', error);
    }
  };

  const handleEditSave = async (id: number) => {
    const depthNum = Number(editValue);
    if (depthNum <= 0 || depthNum > 20) {
      toast.error('Diş derinliği 0-20 mm arasında olmalıdır.');
      return;
    }

    try {
      const { error } = await supabase
        .from('dis_derinligi')
        .update({ depth_value: depthNum })
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.map(r =>
        r.id === id ? { ...r, depth_value: depthNum } : r
      ));
      setEditingId(null);
      setEditValue('');
      toast.success('Ölçüm kaydı güncellendi.');
    } catch (error: any) {
      toast.error(error.message || 'Güncelleme sırasında hata oluştu.');
      console.error('Update error:', error);
    }
  };

  const getDepthStatus = (depth: number): { color: string; bgColor: string; text: string } => {
    if (depth < 3) return { color: 'text-red-600', bgColor: 'bg-red-500', text: 'Kritik' };
    if (depth < 5) return { color: 'text-red-500', bgColor: 'bg-red-400', text: 'Tehlikeli' };
    if (depth < 8) return { color: 'text-amber-600', bgColor: 'bg-amber-500', text: 'Uyarı' };
    return { color: 'text-emerald-600', bgColor: 'bg-emerald-500', text: 'İyi' };
  };

  const maxDepth = Math.max(...records.map(r => r.depth_value), 15);
  const lastDepth = records.length > 0 ? records[records.length - 1].depth_value : null;

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
            <h1 className="text-2xl font-bold text-gray-900">Diş Derinliği Takibi</h1>
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

      {/* Warning Alert */}
      {lastDepth !== null && lastDepth < 5 && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${lastDepth < 3 ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <FiAlertTriangle className={`w-6 h-6 ${lastDepth < 3 ? 'text-red-600' : 'text-amber-600'}`} />
          <div>
            <p className={`font-semibold ${lastDepth < 3 ? 'text-red-800' : 'text-amber-800'}`}>
              {lastDepth < 3 ? 'Kritik Seviye!' : 'Dikkat!'}
            </p>
            <p className={`text-sm ${lastDepth < 3 ? 'text-red-600' : 'text-amber-600'}`}>
              {lastDepth < 3
                ? 'Diş derinliği yasal sınırın altında (3mm). Lastik derhal değiştirilmelidir!'
                : 'Diş derinliği düşük seviyede. Lastik yakın zamanda değiştirilmeli.'}
            </p>
          </div>
        </div>
      )}

      {/* Add New Measurement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Yeni Ölçüm Ekle
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Diş Derinliği (mm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={newDepth}
                onChange={e => setNewDepth(e.target.value)}
                placeholder="Örn: 8.5"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ölçüm Tarihi
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
            <FiTrendingDown className="w-5 h-5" />
            Diş Derinliği Grafiği
          </h2>
        </div>
        <div className="p-6">
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiTrendingDown className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Henüz ölçüm kaydı yok</p>
              <p className="text-sm mt-1">Yukarıdaki formu kullanarak ilk ölçümü ekleyin.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-gray-500">
                <span>{maxDepth}mm</span>
                <span>{Math.round(maxDepth / 2)}mm</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-12 flex items-end gap-2 h-48">
                {records.map((r, index) => {
                  const height = (r.depth_value / maxDepth) * 100;
                  const status = getDepthStatus(r.depth_value);
                  return (
                    <div
                      key={r.id}
                      className="flex-1 flex flex-col items-center group"
                    >
                      <div className="relative flex flex-col items-center">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                          {r.depth_value} mm
                        </div>
                        {/* Value label */}
                        <span className={`text-xs font-medium mb-1 ${status.color}`}>
                          {r.depth_value}
                        </span>
                        {/* Bar */}
                        <div
                          className={`w-full max-w-12 rounded-t-md transition-all hover:opacity-80 ${status.bgColor}`}
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

              {/* Reference lines */}
              <div className="ml-12 mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-500"></div>
                  <span className="text-gray-600">İyi (8+ mm)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-500"></div>
                  <span className="text-gray-600">Uyarı (5-8 mm)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-gray-600">Kritik (&lt;5 mm)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Ölçüm Kayıtları ({records.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B5394]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Diş Derinliği</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Ölçüm Tarihi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    Henüz ölçüm kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                records.map((r, index) => {
                  const status = getDepthStatus(r.depth_value);
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
                            step="0.1"
                            min="0"
                            max="20"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                            autoFocus
                          />
                        ) : (
                          <span className={`text-sm font-medium ${status.color}`}>
                            {r.depth_value} mm
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.depth_value < 3 ? 'bg-red-100 text-red-800' :
                          r.depth_value < 5 ? 'bg-red-50 text-red-700' :
                          r.depth_value < 8 ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {status.text}
                        </span>
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
                                onClick={() => { setEditingId(r.id); setEditValue(String(r.depth_value)); }}
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

export default DisDerinligiPage;
