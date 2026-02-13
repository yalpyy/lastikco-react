import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiBattery, FiSave, FiX } from 'react-icons/fi';
import { createAku } from '../services/akuService';

const YeniAkuPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    aku_marka: '',
    aku_volt: '12V',
    aku_amper: '72Ah',
    aku_durum: 'İyi',
    aku_fatura_tarihi: '',
  });

  const markalar = ['Varta', 'İnci', 'Mutlu', 'Yiğit', 'Bosch', 'Exide', 'Banner', 'Diğer'];
  const voltlar = ['12V', '24V'];
  const amperler = ['7Ah', '9Ah', '12Ah', '45Ah', '50Ah', '55Ah', '60Ah', '63Ah', '66Ah', '70Ah', '72Ah', '74Ah', '80Ah', '90Ah', '100Ah', '105Ah', '110Ah', '120Ah', '140Ah', '180Ah', '225Ah'];
  const durumlar = ['İyi', 'Şarjda', 'Hurda'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.aku_marka) {
      toast.error('Lütfen bir marka seçiniz.');
      return;
    }

    setLoading(true);
    try {
      await createAku({
        aku_marka: formData.aku_marka,
        aku_volt: formData.aku_volt,
        aku_amper: formData.aku_amper,
        aku_durum: formData.aku_durum,
        aku_fatura_tarihi: formData.aku_fatura_tarihi || null,
        car_id: null, // Depoya ekle
      });

      toast.success('Akü başarıyla depoya eklendi!');
      navigate('/aku-depo');
    } catch (error: any) {
      toast.error(error.message || 'Akü eklenirken hata oluştu.');
      console.error('Create error:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Yeni Akü Ekle</h1>
          <p className="text-sm text-gray-500 mt-1">Depoya yeni akü ekle</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiBattery className="w-5 h-5" />
            Akü Bilgileri
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Marka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.aku_marka}
                onChange={(e) => setFormData({ ...formData, aku_marka: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
                required
              >
                <option value="">Marka Seçiniz</option>
                {markalar.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Volt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volt
              </label>
              <select
                value={formData.aku_volt}
                onChange={(e) => setFormData({ ...formData, aku_volt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
              >
                {voltlar.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Amper */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amper
              </label>
              <select
                value={formData.aku_amper}
                onChange={(e) => setFormData({ ...formData, aku_amper: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
              >
                {amperler.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={formData.aku_durum}
                onChange={(e) => setFormData({ ...formData, aku_durum: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
              >
                {durumlar.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Fatura Tarihi */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fatura Tarihi
              </label>
              <input
                type="date"
                value={formData.aku_fatura_tarihi}
                onChange={(e) => setFormData({ ...formData, aku_fatura_tarihi: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Not:</strong> Akü depoya eklenecektir. Daha sonra araçlara atama yapabilirsiniz.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Depoya Ekle'}
            </button>
            <Link
              to="/aku-depo"
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-gray-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <FiX className="w-4 h-4" />
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YeniAkuPage;
