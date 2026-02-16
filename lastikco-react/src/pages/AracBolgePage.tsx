import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMapPin, FiTruck, FiSave, FiX } from 'react-icons/fi';
import { getCarWithAxles, updateCarRegion, addCarLog } from '../services/vehicleService';
import { listBolges } from '../services/bolgeService';

interface Region {
  id: number;
  bolge_adi: string;
}

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
  bolge_id: number | null;
  bolge_adi?: string;
}

const AracBolgePage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [carId]);

  const loadData = async () => {
    if (!carId) return;

    setLoading(true);
    try {
      // Araç ve bölge verilerini paralel çek
      const [carData, bolgeData] = await Promise.all([
        getCarWithAxles(Number(carId)),
        listBolges(),
      ]);

      const currentBolge = bolgeData.find((b: Region) => b.id === carData.bolge_id);

      setCarInfo({
        id: carData.id,
        car_name: carData.car_name,
        car_model: carData.car_model,
        bolge_id: carData.bolge_id ?? null,
        bolge_adi: currentBolge?.bolge_adi,
      });

      setRegions(bolgeData);
      setSelectedRegionId(carData.bolge_id?.toString() || '');
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedRegionId) {
      toast.error('Lütfen bir bölge seçiniz.');
      return;
    }

    if (!carId) return;

    setSaving(true);
    try {
      const newRegionId = Number(selectedRegionId);
      const newRegion = regions.find(r => r.id === newRegionId);
      const oldRegion = carInfo?.bolge_adi || 'Atanmamış';

      await updateCarRegion(Number(carId), newRegionId);

      // Log kaydı ekle
      await addCarLog(
        Number(carId),
        `Bölge değiştirildi: ${oldRegion} → ${newRegion?.bolge_adi}`
      );

      toast.success('Bölge başarıyla güncellendi!');
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || 'Güncelleme sırasında hata oluştu.');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
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

  if (!carInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600 text-lg">Araç bulunamadı.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Bölge Değiştir</h1>
          <p className="text-sm text-gray-500 mt-1">{carInfo.car_name} - {carInfo.car_model}</p>
        </div>
      </div>

      {/* Car Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiTruck className="w-5 h-5 text-[#0B5394]" />
            <span className="font-semibold text-gray-900">{carInfo.car_name}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Model:</span>
            <span className="font-medium text-gray-700">{carInfo.car_model}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Mevcut Bölge:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              carInfo.bolge_adi
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              <FiMapPin className="w-3 h-3" />
              {carInfo.bolge_adi || 'Atanmamış'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-xl">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiMapPin className="w-5 h-5" />
            Bölge Ataması
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Current Region Info */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Mevcut Bölge:</strong>{' '}
                <span className="text-gray-900">{carInfo.bolge_adi || 'Atanmamış'}</span>
              </p>
            </div>

            {/* Region Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Bölge <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
                required
              >
                <option value="">Bölge Seçiniz</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.bolge_adi}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Options Preview */}
            {regions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegionId(region.id.toString())}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedRegionId === region.id.toString()
                        ? 'bg-[#0B5394] text-white border-[#0B5394]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B5394]'
                    }`}
                  >
                    {region.bolge_adi}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Not:</strong> Bölge değişikliği araç geçmişine kaydedilecektir.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving || !selectedRegionId}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-gray-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Geri Dön
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AracBolgePage;
