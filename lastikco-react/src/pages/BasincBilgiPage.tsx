import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiTrash2, FiActivity, FiAlertTriangle } from 'react-icons/fi';
import { useConfirm } from '../hooks/useConfirm';
import { supabase } from '../lib/supabaseClient';

interface BasincRecord {
  id: number;
  tire_id: number;
  basinc_value: number;
  basinc_km: number;
  basinc_tarih: string;
  basinc_not: string | null;
  created_at?: string;
}

interface TireInfo {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  car_name?: string;
}

const BasincBilgiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const [tireInfo, setTireInfo] = useState<TireInfo | null>(null);
  const [records, setRecords] = useState<BasincRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    basinc_value: '',
    basinc_km: '',
    basinc_not: '',
    basinc_tarih: new Date().toISOString().split('T')[0],
  });

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
        car_name: (tireData?.cars as any)?.car_name,
      });

      // Basınç kayıtlarını çek
      const { data: basincData, error: basincError } = await supabase
        .from('basinc_bilgi')
        .select('*')
        .eq('tire_id', Number(tireId))
        .order('basinc_tarih', { ascending: false });

      if (basincError) {
        // Tablo yoksa veya hata varsa boş dizi kullan
        console.warn('Basınç verisi alınamadı:', basincError);
        setRecords([]);
      } else {
        setRecords(basincData || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tireId) return;

    const basincValue = parseFloat(formData.basinc_value);
    const kmValue = parseInt(formData.basinc_km);

    if (!basincValue || basincValue <= 0 || basincValue > 15) {
      toast.error('Basınç değeri 0-15 Bar arasında olmalıdır.');
      return;
    }

    if (!kmValue || kmValue < 0) {
      toast.error('Kilometre değeri geçersiz.');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('basinc_bilgi')
        .insert({
          tire_id: Number(tireId),
          basinc_value: basincValue,
          basinc_km: kmValue,
          basinc_tarih: formData.basinc_tarih,
          basinc_not: formData.basinc_not || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      setRecords(prev => [data, ...prev]);
      setFormData({
        basinc_value: '',
        basinc_km: '',
        basinc_not: '',
        basinc_tarih: new Date().toISOString().split('T')[0],
      });
      toast.success('Basınç kaydı başarıyla eklendi!');
    } catch (error: any) {
      toast.error(error.message || 'Kayıt eklenirken hata oluştu.');
      console.error('Add error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({ message: 'Bu basınç kaydını silmek istediğinize emin misiniz?', variant: 'danger' }))) return;

    try {
      const { error } = await supabase
        .from('basinc_bilgi')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('Basınç kaydı silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Silme işlemi sırasında hata oluştu.');
      console.error('Delete error:', error);
    }
  };

  const getBasincStatus = (value: number): { color: string; bgColor: string; text: string } => {
    if (value < 6) return { color: 'text-red-600', bgColor: 'bg-red-100', text: 'Çok Düşük' };
    if (value < 7) return { color: 'text-amber-600', bgColor: 'bg-amber-100', text: 'Düşük' };
    if (value > 10) return { color: 'text-red-600', bgColor: 'bg-red-100', text: 'Çok Yüksek' };
    if (value > 9) return { color: 'text-amber-600', bgColor: 'bg-amber-100', text: 'Yüksek' };
    return { color: 'text-emerald-600', bgColor: 'bg-emerald-100', text: 'Normal' };
  };

  // Son basınç değeri
  const lastBasinc = records.length > 0 ? records[0].basinc_value : null;

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
            <h1 className="text-2xl font-bold text-gray-900">Basınç Takibi</h1>
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
      {lastBasinc !== null && (lastBasinc < 7 || lastBasinc > 9) && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${
          lastBasinc < 6 || lastBasinc > 10
            ? 'bg-red-50 border border-red-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <FiAlertTriangle className={`w-6 h-6 ${
            lastBasinc < 6 || lastBasinc > 10 ? 'text-red-600' : 'text-amber-600'
          }`} />
          <div>
            <p className={`font-semibold ${
              lastBasinc < 6 || lastBasinc > 10 ? 'text-red-800' : 'text-amber-800'
            }`}>
              {lastBasinc < 7 ? 'Düşük Basınç!' : 'Yüksek Basınç!'}
            </p>
            <p className={`text-sm ${
              lastBasinc < 6 || lastBasinc > 10 ? 'text-red-600' : 'text-amber-600'
            }`}>
              {lastBasinc < 7
                ? 'Lastik basıncı düşük. Güvenlik ve yakıt ekonomisi için basıncı ayarlayın.'
                : 'Lastik basıncı yüksek. Aşırı basınç lastik ömrünü kısaltabilir.'}
            </p>
          </div>
        </div>
      )}

      {/* Last Pressure Summary */}
      {lastBasinc !== null && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${getBasincStatus(lastBasinc).bgColor}`}>
              <FiActivity className={`w-8 h-8 ${getBasincStatus(lastBasinc).color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Son Basınç Ölçümü</p>
              <p className={`text-3xl font-bold ${getBasincStatus(lastBasinc).color}`}>
                {lastBasinc} Bar
              </p>
              <p className="text-sm text-gray-500">
                {new Date(records[0].basinc_tarih).toLocaleDateString('tr-TR')} - {records[0].basinc_km.toLocaleString('tr-TR')} km
              </p>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getBasincStatus(lastBasinc).bgColor} ${getBasincStatus(lastBasinc).color}`}>
                {getBasincStatus(lastBasinc).text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Pressure Record */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Yeni Basınç Kaydı Ekle
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Basınç (Bar) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={formData.basinc_value}
                  onChange={e => setFormData({ ...formData, basinc_value: e.target.value })}
                  placeholder="Örn: 8.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kilometre <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.basinc_km}
                  onChange={e => setFormData({ ...formData, basinc_km: e.target.value })}
                  placeholder="Örn: 125000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tarih
                </label>
                <input
                  type="date"
                  value={formData.basinc_tarih}
                  onChange={e => setFormData({ ...formData, basinc_tarih: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Not
                </label>
                <input
                  type="text"
                  value={formData.basinc_not}
                  onChange={e => setFormData({ ...formData, basinc_not: e.target.value })}
                  placeholder="Opsiyonel..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <FiPlus className="w-4 h-4" />
                  {saving ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Pressure Reference */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Basınç Referans Değerleri</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-gray-600">Normal: 7-9 Bar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Uyarı: 6-7 veya 9-10 Bar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Tehlikeli: &lt;6 veya &gt;10 Bar</span>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Basınç Geçmişi ({records.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B5394]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Basınç</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Kilometre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Not</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <FiActivity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Henüz basınç kaydı yok</p>
                    <p className="text-sm mt-1">Yukarıdaki formu kullanarak ilk kaydı ekleyin.</p>
                  </td>
                </tr>
              ) : (
                records.map((r, index) => {
                  const status = getBasincStatus(r.basinc_value);
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${status.color}`}>
                          {r.basinc_value} Bar
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.basinc_km.toLocaleString('tr-TR')} km
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(r.basinc_tarih).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.basinc_not || <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default BasincBilgiPage;
