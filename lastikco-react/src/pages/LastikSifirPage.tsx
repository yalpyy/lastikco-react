import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCircle, FiSave, FiArrowLeft, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { createTireWithDetails } from '../services/tireService';
import { listCarsWithAxles } from '../services/vehicleService';
import { getConstantsByType, type TireConstant } from '../services/constantsService';
import type { CarWithAxle } from '../types';

interface FormErrors {
  tire_serino?: string;
  tire_marka?: string;
  tire_desen?: string;
  tire_olcu?: string;
}

const LastikSifirPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [formData, setFormData] = useState({
    tire_serino: '',
    tire_marka: '',
    tire_desen: '',
    tire_olcu: '',
    tire_disderinligi: '',
    tire_durum: 'Normal',
    tire_olcumtarihi: '',
    tire_olcumkm: '',
    car_id: '', // Empty = depot (NULL)
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [markalar, setMarkalar] = useState<TireConstant[]>([]);
  const [desenler, setDesenler] = useState<TireConstant[]>([]);
  const [olculer, setOlculer] = useState<TireConstant[]>([]);

  // Load cars and constants from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const [carsResult, markaData, desenData, olcuData] = await Promise.all([
          listCarsWithAxles({ status: 'aktif' }),
          getConstantsByType('marka'),
          getConstantsByType('desen'),
          getConstantsByType('olcu'),
        ]);
        setCars(carsResult.data);
        setMarkalar(markaData);
        setDesenler(desenData);
        setOlculer(olcuData);
      } catch (error) {
        console.error('Veriler yüklenemedi:', error);
      } finally {
        setCarsLoading(false);
      }
    };
    loadData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tire_serino.trim()) {
      newErrors.tire_serino = 'Seri no zorunludur';
    }

    if (!formData.tire_marka.trim()) {
      newErrors.tire_marka = 'Marka zorunludur';
    }

    if (!formData.tire_desen.trim()) {
      newErrors.tire_desen = 'Desen zorunludur';
    }

    if (!formData.tire_olcu.trim()) {
      newErrors.tire_olcu = 'Ölçü zorunludur';
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
      // car_id empty = depot (NULL)
      const carId = formData.car_id ? parseInt(formData.car_id, 10) : null;
      await createTireWithDetails(carId, {
        tire_serino: formData.tire_serino.trim() || null,
        tire_marka: formData.tire_marka.trim() || null,
        tire_desen: formData.tire_desen.trim() || null,
        tire_olcu: formData.tire_olcu.trim() || null,
        tire_disderinligi: formData.tire_disderinligi || null,
        tire_durum: formData.tire_durum || 'Normal',
        tire_olcumtarihi: formData.tire_olcumtarihi || null,
        tire_olcumkm: formData.tire_olcumkm ? parseInt(formData.tire_olcumkm, 10) : null,
      });

      const destination = carId ? 'araca' : 'depoya';
      toast.success(`Lastik başarıyla ${destination} eklendi!`);
      setTimeout(() => navigate('/lastik-depo'), 1500);
    } catch (error) {
      console.error('Lastik eklenemedi:', error);
      toast.error('Lastik eklenirken hata oluştu!');
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
          <FiCircle className="w-7 h-7 text-[#0B5394]" />
          Yeni Lastik Ekle
        </h1>
        <p className="text-sm text-gray-500 mt-1">Envantere yeni lastik kaydı oluşturun</p>
      </div>

      {/* Premium Card Form */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl">
        {/* Card Header */}
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Lastik Bilgileri</h2>
          <p className="text-sm text-white/70 mt-1">* işaretli alanlar zorunludur</p>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seri No */}
            <div>
              <label htmlFor="tire_serino" className="block text-sm font-medium text-gray-700 mb-2">
                Seri No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tire_serino"
                name="tire_serino"
                placeholder="örn: DOT2024ABC"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors ${
                  errors.tire_serino ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.tire_serino}
                onChange={(e) => {
                  setFormData({ ...formData, tire_serino: e.target.value.toUpperCase() });
                  if (errors.tire_serino) setErrors({ ...errors, tire_serino: undefined });
                }}
              />
              <InputError message={errors.tire_serino} />
            </div>

            {/* Marka */}
            <div>
              <label htmlFor="tire_marka" className="block text-sm font-medium text-gray-700 mb-2">
                Marka <span className="text-red-500">*</span>
              </label>
              <select
                id="tire_marka"
                name="tire_marka"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors ${
                  errors.tire_marka ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.tire_marka}
                onChange={(e) => {
                  setFormData({ ...formData, tire_marka: e.target.value });
                  if (errors.tire_marka) setErrors({ ...errors, tire_marka: undefined });
                }}
              >
                <option value="">-- Marka Seçin --</option>
                {markalar.map(m => (
                  <option key={m.id} value={m.value}>{m.value}</option>
                ))}
              </select>
              <InputError message={errors.tire_marka} />
            </div>

            {/* Desen */}
            <div>
              <label htmlFor="tire_desen" className="block text-sm font-medium text-gray-700 mb-2">
                Desen <span className="text-red-500">*</span>
              </label>
              <select
                id="tire_desen"
                name="tire_desen"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors ${
                  errors.tire_desen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.tire_desen}
                onChange={(e) => {
                  setFormData({ ...formData, tire_desen: e.target.value });
                  if (errors.tire_desen) setErrors({ ...errors, tire_desen: undefined });
                }}
              >
                <option value="">-- Desen Seçin --</option>
                {desenler.map(d => (
                  <option key={d.id} value={d.value}>{d.value}</option>
                ))}
              </select>
              <InputError message={errors.tire_desen} />
            </div>

            {/* Ölçü */}
            <div>
              <label htmlFor="tire_olcu" className="block text-sm font-medium text-gray-700 mb-2">
                Ölçü <span className="text-red-500">*</span>
              </label>
              <select
                id="tire_olcu"
                name="tire_olcu"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors ${
                  errors.tire_olcu ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.tire_olcu}
                onChange={(e) => {
                  setFormData({ ...formData, tire_olcu: e.target.value });
                  if (errors.tire_olcu) setErrors({ ...errors, tire_olcu: undefined });
                }}
              >
                <option value="">-- Ölçü Seçin --</option>
                {olculer.map(o => (
                  <option key={o.id} value={o.value}>{o.value}</option>
                ))}
              </select>
              <InputError message={errors.tire_olcu} />
            </div>

            {/* Dış Derinlik */}
            <div>
              <label htmlFor="tire_disderinligi" className="block text-sm font-medium text-gray-700 mb-2">
                Dış Derinlik (mm)
              </label>
              <input
                type="number"
                step="0.1"
                id="tire_disderinligi"
                name="tire_disderinligi"
                placeholder="örn: 14.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                value={formData.tire_disderinligi}
                onChange={(e) => setFormData({ ...formData, tire_disderinligi: e.target.value })}
              />
            </div>

            {/* Durum */}
            <div>
              <label htmlFor="tire_durum" className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                id="tire_durum"
                name="tire_durum"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                value={formData.tire_durum}
                onChange={(e) => setFormData({ ...formData, tire_durum: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Yeni">Yeni</option>
                <option value="İyi">İyi</option>
                <option value="Orta">Orta</option>
                <option value="Kötü">Kötü</option>
              </select>
            </div>

            {/* Ölçüm Tarihi */}
            <div>
              <label htmlFor="tire_olcumtarihi" className="block text-sm font-medium text-gray-700 mb-2">
                Ölçüm Tarihi
              </label>
              <input
                type="date"
                id="tire_olcumtarihi"
                name="tire_olcumtarihi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                value={formData.tire_olcumtarihi}
                onChange={(e) => setFormData({ ...formData, tire_olcumtarihi: e.target.value })}
              />
            </div>

            {/* Ölçüm KM */}
            <div>
              <label htmlFor="tire_olcumkm" className="block text-sm font-medium text-gray-700 mb-2">
                Ölçüm KM
              </label>
              <input
                type="number"
                id="tire_olcumkm"
                name="tire_olcumkm"
                placeholder="örn: 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
                value={formData.tire_olcumkm}
                onChange={(e) => setFormData({ ...formData, tire_olcumkm: e.target.value })}
              />
            </div>
          </div>

          {/* Car Selection - Optional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FiPackage className="w-5 h-5 text-blue-600" />
              <label htmlFor="car_id" className="text-sm font-medium text-blue-800">
                Araç Seçimi (Opsiyonel)
              </label>
            </div>
            <p className="text-sm text-blue-600 mb-3">
              Boş bırakırsanız lastik <strong>DEPOYA</strong> eklenecektir.
            </p>
            <select
              id="car_id"
              name="car_id"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors bg-white"
              value={formData.car_id}
              onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
              disabled={carsLoading}
            >
              <option value="">
                {carsLoading ? 'Araçlar yükleniyor...' : '-- Depoya Ekle (Araç Seçme) --'}
              </option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.car_name} - {car.car_model}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={() => navigate('/lastik-depo')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
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

export default LastikSifirPage;
