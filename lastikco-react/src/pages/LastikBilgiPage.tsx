import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiTruck, FiCircle, FiInfo, FiExternalLink, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { listCarsWithAxles } from '../services/vehicleService';
import { listTiresByCar } from '../services/tireService';
import type { CarWithAxle } from '../types';

interface TireInfo {
  tire_id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_disderinligi: number | null;
  tire_durum: string;
  tire_olcumtarihi: string | null;
  tire_position: string;
  axle_number: number;
}

const LastikBilgiPage = () => {
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [carsLoading, setCarsLoading] = useState(true);
  const [tireInfo, setTireInfo] = useState<TireInfo | null>(null);
  const [carTires, setCarTires] = useState<TireInfo[]>([]);

  const positions = [
    { value: 'on_sol_dis', label: 'Ön Sol Dış' },
    { value: 'on_sol_ic', label: 'Ön Sol İç' },
    { value: 'on_sag_dis', label: 'Ön Sağ Dış' },
    { value: 'on_sag_ic', label: 'Ön Sağ İç' },
    { value: 'arka_sol_dis', label: 'Arka Sol Dış' },
    { value: 'arka_sol_ic', label: 'Arka Sol İç' },
    { value: 'arka_sag_dis', label: 'Arka Sağ Dış' },
    { value: 'arka_sag_ic', label: 'Arka Sağ İç' },
  ];

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setCarsLoading(true);
    try {
      const result = await listCarsWithAxles({ status: 'aktif' });
      setCars(result.data);
    } catch (error: any) {
      toast.error(error.message || 'Araçlar yüklenirken hata oluştu.');
    } finally {
      setCarsLoading(false);
    }
  };

  const handleCarChange = async (carId: string) => {
    setSelectedCarId(carId);
    setSelectedPosition('');
    setTireInfo(null);

    if (!carId) {
      setCarTires([]);
      return;
    }

    try {
      const tires = await listTiresByCar(Number(carId));
      const mappedTires = tires.map((t: any) => ({
        tire_id: t.tires.id,
        tire_serino: t.tire_serino || '-',
        tire_marka: t.tire_marka || '-',
        tire_desen: t.tire_desen || '-',
        tire_olcu: t.tire_olcu || '-',
        tire_disderinligi: t.tire_disderinligi ? Number(t.tire_disderinligi) : null,
        tire_durum: t.tire_durum || '-',
        tire_olcumtarihi: t.tire_olcumtarihi,
        tire_position: t.tires.tire_position,
        axle_number: t.tires.axle_number,
      }));
      setCarTires(mappedTires);
    } catch (error: any) {
      toast.error(error.message || 'Lastikler yüklenirken hata oluştu.');
      setCarTires([]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCarId || !selectedPosition) {
      toast.error('Lütfen araç ve pozisyon seçiniz.');
      return;
    }

    setLoading(true);
    try {
      const foundTire = carTires.find(t => t.tire_position === selectedPosition);
      if (foundTire) {
        setTireInfo(foundTire);
      } else {
        setTireInfo(null);
        toast.info('Bu pozisyonda lastik bulunamadı.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDepthStatus = (depth: number | null) => {
    if (depth === null) return { color: 'text-gray-500', bg: 'bg-gray-100', text: 'Bilinmiyor' };
    if (depth < 3) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Kritik' };
    if (depth < 5) return { color: 'text-red-500', bg: 'bg-red-50', text: 'Tehlikeli' };
    if (depth < 8) return { color: 'text-amber-600', bg: 'bg-amber-100', text: 'Uyarı' };
    return { color: 'text-emerald-600', bg: 'bg-emerald-100', text: 'İyi' };
  };

  const getDurumBadge = (durum: string) => {
    switch (durum) {
      case 'Normal':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Serviste':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Hurda':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPositionLabel = (pos: string) => {
    return positions.find(p => p.value === pos)?.label || pos;
  };

  const selectedCar = cars.find(c => c.id === Number(selectedCarId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lastik Bilgisi Sorgulama</h1>
        <p className="text-sm text-gray-500 mt-1">Araç ve pozisyona göre lastik detaylarını görüntüle</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiSearch className="w-5 h-5" />
            Araç ve Pozisyon Seçimi
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Araç Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Araç Seçiniz <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => handleCarChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
                required
                disabled={carsLoading}
              >
                <option value="">
                  {carsLoading ? 'Yükleniyor...' : 'Araç Seçiniz...'}
                </option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.car_name} - {car.car_model}
                  </option>
                ))}
              </select>
            </div>

            {/* Pozisyon Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lastik Pozisyonu <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent bg-white"
                required
                disabled={!selectedCarId}
              >
                <option value="">Pozisyon Seçiniz...</option>
                {positions.map((pos) => {
                  const hasTire = carTires.some(t => t.tire_position === pos.value);
                  return (
                    <option key={pos.value} value={pos.value}>
                      {pos.label} {hasTire ? '(Lastik var)' : '(Boş)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedCarId || !selectedPosition}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSearch className="w-4 h-4" />
            {loading ? 'Sorgulanıyor...' : 'Bilgileri Getir'}
          </button>
        </form>
      </div>

      {/* Selected Car Info */}
      {selectedCar && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FiTruck className="w-5 h-5 text-[#0B5394]" />
              <span className="font-semibold text-gray-900">{selectedCar.car_name}</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Model:</span>
              <span className="font-medium text-gray-700">{selectedCar.car_model}</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Aks Sayısı:</span>
              <span className="font-medium text-gray-700">{selectedCar.axle_count}</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Takılı Lastik:</span>
              <span className="font-medium text-gray-700">{carTires.length} adet</span>
            </div>
          </div>
        </div>
      )}

      {/* Tire Info Result */}
      {tireInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0B5394] px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiCircle className="w-5 h-5" />
              Lastik Detay Bilgileri
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sol Kolon */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Seri No</span>
                  <span className="font-semibold text-gray-900">{tireInfo.tire_serino}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Marka</span>
                  <span className="font-medium text-gray-700">{tireInfo.tire_marka}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Desen</span>
                  <span className="font-medium text-gray-700">{tireInfo.tire_desen}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Ölçü</span>
                  <span className="font-medium text-gray-700">{tireInfo.tire_olcu}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Pozisyon</span>
                  <span className="font-medium text-gray-700">
                    Aks {tireInfo.axle_number} - {getPositionLabel(tireInfo.tire_position)}
                  </span>
                </div>
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Diş Derinliği</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getDepthStatus(tireInfo.tire_disderinligi).color}`}>
                      {tireInfo.tire_disderinligi !== null ? `${tireInfo.tire_disderinligi} mm` : '-'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDepthStatus(tireInfo.tire_disderinligi).bg} ${getDepthStatus(tireInfo.tire_disderinligi).color}`}>
                      {getDepthStatus(tireInfo.tire_disderinligi).text}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Durum</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurumBadge(tireInfo.tire_durum)}`}>
                    {tireInfo.tire_durum}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Son Ölçüm Tarihi</span>
                  <span className="font-medium text-gray-700">
                    {tireInfo.tire_olcumtarihi
                      ? new Date(tireInfo.tire_olcumtarihi).toLocaleDateString('tr-TR')
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Hızlı İşlemler</h4>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/dis-derinligi/${tireInfo.tire_id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors text-sm"
                >
                  <FiTrendingDown className="w-4 h-4" />
                  Diş Derinliği
                </Link>
                <Link
                  to={`/km-bilgi/${tireInfo.tire_id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  <FiCalendar className="w-4 h-4" />
                  KM Bilgi
                </Link>
                <Link
                  to={`/detay-sayfa/${tireInfo.tire_id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-gray-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Detay Sayfası
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Car Tires Overview */}
      {selectedCarId && carTires.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-slate-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiInfo className="w-5 h-5" />
              Araçtaki Tüm Lastikler
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pozisyon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seri No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marka</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ölçü</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Diş Derinliği</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {carTires.map((tire, index) => {
                  const depthStatus = getDepthStatus(tire.tire_disderinligi);
                  return (
                    <tr
                      key={tire.tire_id}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Aks {tire.axle_number} - {getPositionLabel(tire.tire_position)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{tire.tire_serino}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_marka}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_olcu}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${depthStatus.color}`}>
                          {tire.tire_disderinligi !== null ? `${tire.tire_disderinligi} mm` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/detay-sayfa/${tire.tire_id}`}
                          className="text-[#0B5394] hover:text-[#094A84] text-sm font-medium"
                        >
                          Detay
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LastikBilgiPage;
