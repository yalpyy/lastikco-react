import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBattery, FiArrowLeft, FiPlus, FiTrash2, FiSend, FiEdit2, FiX, FiSave } from 'react-icons/fi';
import { useConfirm } from '../hooks/useConfirm';
import { getCarWithAxles } from '../services/vehicleService';
import { listCarAkus, createAku, updateAku, deleteAku, sendAkuToDepot, type Aku } from '../services/akuService';
import { useAuthStore } from '../store/auth';

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
}

const AkuEditPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const { session } = useAuthStore();
  const [car, setCar] = useState<CarInfo | null>(null);
  const [batteries, setBatteries] = useState<Aku[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAku, setEditingAku] = useState<Aku | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    aku_marka: '',
    aku_volt: '12V',
    aku_amper: '72Ah',
    aku_durum: 'İyi',
    aku_fatura_tarihi: '',
  });

  const markalar = ['Varta', 'İnci', 'Mutlu', 'Yiğit', 'Bosch', 'Exide', 'Banner', 'Diğer'];
  const voltlar = ['12V', '24V'];
  const amperler = ['7Ah', '9Ah', '12Ah', '45Ah', '50Ah', '55Ah', '60Ah', '63Ah', '66Ah', '70Ah', '72Ah', '74Ah', '80Ah', '90Ah', '100Ah', '120Ah', '140Ah', '180Ah', '200Ah'];
  const durumlar = ['İyi', 'Şarjda', 'Hurda'];

  useEffect(() => {
    loadData();
  }, [carId]);

  const loadData = async () => {
    if (!carId) return;

    setLoading(true);
    try {
      // Araç bilgilerini çek
      const carData = await getCarWithAxles(Number(carId));
      setCar({
        id: carData.id,
        car_name: carData.car_name,
        car_model: carData.car_model,
      });

      // Araçtaki aküleri çek
      const akuData = await listCarAkus(Number(carId));
      setBatteries(akuData);
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      aku_marka: '',
      aku_volt: '12V',
      aku_amper: '72Ah',
      aku_durum: 'İyi',
      aku_fatura_tarihi: '',
    });
    setEditingAku(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!car) return;

    if (!formData.aku_marka) {
      toast.error('Lütfen akü markasını seçin.');
      return;
    }

    setSaving(true);
    try {
      if (editingAku) {
        // Akü güncelle
        const updated = await updateAku(editingAku.id, {
          aku_marka: formData.aku_marka,
          aku_volt: formData.aku_volt,
          aku_amper: formData.aku_amper,
          aku_durum: formData.aku_durum,
          aku_fatura_tarihi: formData.aku_fatura_tarihi || null,
        });
        setBatteries(prev => prev.map(b => b.id === editingAku.id ? updated : b));
        toast.success('Akü başarıyla güncellendi.');
      } else {
        // Yeni akü ekle
        const newAku = await createAku({
          aku_marka: formData.aku_marka,
          aku_volt: formData.aku_volt,
          aku_amper: formData.aku_amper,
          aku_durum: formData.aku_durum,
          aku_fatura_tarihi: formData.aku_fatura_tarihi || null,
          car_id: car.id,
          created_by: session?.user?.id || null,
        });
        setBatteries(prev => [newAku, ...prev]);
        toast.success('Akü başarıyla eklendi.');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'İşlem sırasında hata oluştu.');
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (aku: Aku) => {
    setEditingAku(aku);
    setFormData({
      aku_marka: aku.aku_marka,
      aku_volt: aku.aku_volt,
      aku_amper: aku.aku_amper,
      aku_durum: aku.aku_durum,
      aku_fatura_tarihi: aku.aku_fatura_tarihi || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (akuId: number) => {
    if (!(await confirm({ message: 'Bu aküyü kalıcı olarak silmek istediğinize emin misiniz?', variant: 'danger' }))) return;

    try {
      await deleteAku(akuId);
      setBatteries(prev => prev.filter(b => b.id !== akuId));
      toast.success('Akü başarıyla silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Silme işlemi sırasında hata oluştu.');
      console.error('Delete error:', error);
    }
  };

  const handleSendToDepot = async (akuId: number) => {
    if (!(await confirm({ message: 'Bu aküyü depoya göndermek istediğinize emin misiniz?', variant: 'warning' }))) return;

    try {
      await sendAkuToDepot(akuId);
      setBatteries(prev => prev.filter(b => b.id !== akuId));
      toast.success('Akü depoya gönderildi.');
    } catch (error: any) {
      toast.error(error.message || 'İşlem sırasında hata oluştu.');
      console.error('Send to depot error:', error);
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

  if (!car) {
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
            <Link
              to="/arac-aktif"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Araç Listesine Dön"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Akü Yönetimi</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {car.car_name} - {car.car_model}
          </p>
        </div>
        <div className="flex gap-2 ml-11 sm:ml-0">
          <button
            onClick={() => {
              if (showForm && !editingAku) {
                resetForm();
              } else {
                setEditingAku(null);
                setFormData({
                  aku_marka: '',
                  aku_volt: '12V',
                  aku_amper: '72Ah',
                  aku_durum: 'İyi',
                  aku_fatura_tarihi: '',
                });
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm font-medium"
          >
            {showForm && !editingAku ? (
              <>
                <FiX className="w-4 h-4" />
                Formu Kapat
              </>
            ) : (
              <>
                <FiPlus className="w-4 h-4" />
                Yeni Akü Ekle
              </>
            )}
          </button>
          <button
            onClick={() => navigate(`/depodan-aku-getir/${car.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <FiBattery className="w-4 h-4" />
            Depodan Getir
          </button>
        </div>
      </div>

      {/* Akü Ekleme/Düzenleme Formu */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0B5394] px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiBattery className="w-5 h-5" />
              {editingAku ? 'Akü Düzenle' : 'Yeni Akü Ekle'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Marka <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.aku_marka}
                    onChange={e => setFormData({ ...formData, aku_marka: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                    required
                  >
                    <option value="">Seçiniz</option>
                    {markalar.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Volt</label>
                  <select
                    value={formData.aku_volt}
                    onChange={e => setFormData({ ...formData, aku_volt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  >
                    {voltlar.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amper</label>
                  <select
                    value={formData.aku_amper}
                    onChange={e => setFormData({ ...formData, aku_amper: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  >
                    {amperler.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Durum</label>
                  <select
                    value={formData.aku_durum}
                    onChange={e => setFormData({ ...formData, aku_durum: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  >
                    {durumlar.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fatura Tarihi</label>
                  <input
                    type="date"
                    value={formData.aku_fatura_tarihi}
                    onChange={e => setFormData({ ...formData, aku_fatura_tarihi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  {saving ? 'Kaydediliyor...' : editingAku ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                >
                  <FiX className="w-4 h-4" />
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Akü Listesi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiBattery className="w-5 h-5" />
            Araçtaki Aküler ({batteries.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B5394]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Marka</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Volt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Amper</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Fatura Tarihi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batteries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <FiBattery className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Bu araçta akü bulunmuyor</p>
                    <p className="text-sm mt-1">Yukarıdaki butonları kullanarak akü ekleyebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                batteries.map((battery, index) => (
                  <tr
                    key={battery.id}
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{battery.aku_marka}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{battery.aku_volt}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{battery.aku_amper}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumBadge(battery.aku_durum)}`}>
                        {battery.aku_durum}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {battery.aku_fatura_tarihi
                        ? new Date(battery.aku_fatura_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(battery)}
                          className="p-2 text-[#0B5394] hover:bg-[#0B5394]/10 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendToDepot(battery.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Depoya Gönder"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(battery.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default AkuEditPage;
