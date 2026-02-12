import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTruck, FiSave, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { createCarWithAxles } from '../services/vehicleService';
import { listBolges } from '../services/bolgeService';

interface Bolge {
  id: number;
  bolge_adi: string;
}

interface FormErrors {
  car_name?: string;
  car_model?: string;
  axle_count?: string;
  bolge_id?: string;
}

const AracEklePage = () => {
  const navigate = useNavigate();
  const [bolges, setBolges] = useState<Bolge[]>([]);
  const [formData, setFormData] = useState({
    car_name: '',
    car_model: '',
    axle_count: '',
    bolge_id: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [bolgeLoading, setBolgeLoading] = useState(true);

  // Load bolges from database
  useEffect(() => {
    const loadBolges = async () => {
      try {
        const data = await listBolges();
        setBolges(data);
      } catch (error) {
        console.error('Bölgeler yüklenemedi:', error);
        toast.error('Bölgeler yüklenirken hata oluştu!');
      } finally {
        setBolgeLoading(false);
      }
    };
    loadBolges();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.car_name.trim()) {
      newErrors.car_name = 'Plaka alanı zorunludur';
    } else if (formData.car_name.length < 5) {
      newErrors.car_name = 'Geçerli bir plaka giriniz';
    }

    if (!formData.car_model.trim()) {
      newErrors.car_model = 'Model alanı zorunludur';
    }

    if (!formData.axle_count) {
      newErrors.axle_count = 'Aks sayısı zorunludur';
    } else {
      const axleNum = parseInt(formData.axle_count, 10);
      if (isNaN(axleNum) || axleNum < 2 || axleNum > 6) {
        newErrors.axle_count = 'Aks sayısı 2-6 arasında olmalıdır';
      }
    }

    if (!formData.bolge_id) {
      newErrors.bolge_id = 'Bölge seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    setLoading(true);

    try {
      await createCarWithAxles({
        car_name: formData.car_name.trim().toUpperCase(),
        car_model: formData.car_model.trim(),
        axle_count: parseInt(formData.axle_count, 10),
      });
      toast.success('Araç başarıyla eklendi!');
      setTimeout(() => navigate('/arac-aktif'), 1500);
    } catch (error) {
      console.error('Araç eklenemedi:', error);
      toast.error('Araç eklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
        <FiAlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiTruck className="w-7 h-7 text-primary" />
          Yeni Araç Ekle
        </h1>
        <p className="text-sm text-gray-500 mt-1">Sisteme yeni araç kaydı oluşturun</p>
      </div>

      {/* Premium Card Form */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-3xl">
        {/* Card Header */}
        <div className="bg-primary px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Araç Bilgileri</h2>
          <p className="text-sm text-white/70 mt-1">* işaretli alanlar zorunludur</p>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plaka */}
            <div>
              <label htmlFor="car_name" className="block text-sm font-medium text-gray-700 mb-2">
                Plaka <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="car_name"
                name="car_name"
                placeholder="örn: 34 ABC 123"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.car_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.car_name}
                onChange={(e) => {
                  setFormData({ ...formData, car_name: e.target.value.toUpperCase() });
                  if (errors.car_name) setErrors({ ...errors, car_name: undefined });
                }}
              />
              <InputError message={errors.car_name} />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="car_model" className="block text-sm font-medium text-gray-700 mb-2">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="car_model"
                name="car_model"
                placeholder="örn: Volvo FH16"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.car_model ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.car_model}
                onChange={(e) => {
                  setFormData({ ...formData, car_model: e.target.value });
                  if (errors.car_model) setErrors({ ...errors, car_model: undefined });
                }}
              />
              <InputError message={errors.car_model} />
            </div>

            {/* Aks Sayısı */}
            <div>
              <label htmlFor="axle_count" className="block text-sm font-medium text-gray-700 mb-2">
                Aks/Dingil Sayısı <span className="text-red-500">*</span>
              </label>
              <select
                id="axle_count"
                name="axle_count"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.axle_count ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.axle_count}
                onChange={(e) => {
                  setFormData({ ...formData, axle_count: e.target.value });
                  if (errors.axle_count) setErrors({ ...errors, axle_count: undefined });
                }}
              >
                <option value="">Seçiniz...</option>
                <option value="2">2 Aks</option>
                <option value="3">3 Aks</option>
                <option value="4">4 Aks</option>
                <option value="5">5 Aks</option>
                <option value="6">6 Aks</option>
              </select>
              <InputError message={errors.axle_count} />
            </div>

            {/* Bölge */}
            <div>
              <label htmlFor="bolge_id" className="block text-sm font-medium text-gray-700 mb-2">
                Araç Bölgesi <span className="text-red-500">*</span>
              </label>
              <select
                id="bolge_id"
                name="bolge_id"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.bolge_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.bolge_id}
                onChange={(e) => {
                  setFormData({ ...formData, bolge_id: e.target.value });
                  if (errors.bolge_id) setErrors({ ...errors, bolge_id: undefined });
                }}
                disabled={bolgeLoading}
              >
                <option value="">
                  {bolgeLoading ? 'Yükleniyor...' : 'Bölge Seçiniz...'}
                </option>
                {bolges.map((bolge) => (
                  <option key={bolge.id} value={bolge.id}>
                    {bolge.bolge_adi}
                  </option>
                ))}
              </select>
              <InputError message={errors.bolge_id} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/arac-aktif')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Geri Dön
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AracEklePage;
