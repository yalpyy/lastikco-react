import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiDisc, FiArrowLeft, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { getCarWithAxles } from '../services/vehicleService';
import { listDepotTires, assignTireToCar, type TireWithDetails } from '../services/tireService';

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
  axle_count: number;
}

const DepodanLastikGetirPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarInfo | null>(null);
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [assigningTire, setAssigningTire] = useState<TireWithDetails | null>(null);
  const [selectedAxle, setSelectedAxle] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState('Sol Ön');

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
        axle_count: carData.axle_count,
      });

      // Depodaki lastikleri çek
      const depotTires = await listDepotTires();
      setTires(depotTires);
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionsForAxle = (axle: number): string[] => {
    if (axle === 1) {
      return ['Sol Ön', 'Sağ Ön'];
    }
    return ['Sol Dış', 'Sol İç', 'Sağ İç', 'Sağ Dış'];
  };

  const handleStartAssign = (tire: TireWithDetails) => {
    setAssigningTire(tire);
    setSelectedAxle(1);
    setSelectedPosition('Sol Ön');
  };

  const handleCancelAssign = () => {
    setAssigningTire(null);
  };

  const handleConfirmAssign = async () => {
    if (!assigningTire || !car) return;

    try {
      await assignTireToCar(assigningTire.id, car.id, selectedAxle, selectedPosition);
      setTires(prev => prev.filter(t => t.id !== assigningTire.id));
      toast.success(`Lastik ${car.car_name} aracına başarıyla atandı!`);
      setAssigningTire(null);
    } catch (error: any) {
      toast.error(error.message || 'Atama işlemi sırasında hata oluştu.');
      console.error('Assign error:', error);
    }
  };

  const getDepthStatus = (depth: number | null): { color: string; text: string } => {
    if (depth === null) return { color: 'bg-gray-100 text-gray-600', text: 'N/A' };
    if (depth < 5) return { color: 'bg-red-100 text-red-800', text: 'Kritik' };
    if (depth < 8) return { color: 'bg-amber-100 text-amber-800', text: 'Uyarı' };
    return { color: 'bg-emerald-100 text-emerald-800', text: 'İyi' };
  };

  const brands = [...new Set(tires.map(t => t.tire_marka).filter(Boolean))];

  const filtered = tires.filter(t => {
    const matchSearch =
      !search ||
      t.tire_serino?.toLowerCase().includes(search.toLowerCase()) ||
      t.tire_marka?.toLowerCase().includes(search.toLowerCase());
    const matchBrand = !brandFilter || t.tire_marka === brandFilter;
    return matchSearch && matchBrand;
  });

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
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Geri Dön"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Depodan Lastik Getir</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {car.car_name} - {car.car_model} ({car.axle_count} Aks)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Seri no veya marka ile ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
            >
              <option value="">Tüm Markalar</option>
              {brands.map(b => (
                <option key={b} value={b || ''}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningTire && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-[#0B5394] px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-semibold text-white">Lastik Pozisyonu Seç</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Seçili Lastik:</p>
                <p className="font-semibold text-gray-900">{assigningTire.tire_marka} - {assigningTire.tire_serino}</p>
                <p className="text-sm text-gray-500">{assigningTire.tire_desen} | {assigningTire.tire_olcu}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Aks Numarası</label>
                <select
                  value={selectedAxle}
                  onChange={e => {
                    const axle = Number(e.target.value);
                    setSelectedAxle(axle);
                    setSelectedPosition(getPositionsForAxle(axle)[0]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                >
                  {Array.from({ length: car.axle_count }, (_, i) => i + 1).map(axle => (
                    <option key={axle} value={axle}>Aks {axle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pozisyon</label>
                <select
                  value={selectedPosition}
                  onChange={e => setSelectedPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                >
                  {getPositionsForAxle(selectedAxle).map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleConfirmAssign}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <FiCheck className="w-4 h-4" />
                  Araca Ata
                </button>
                <button
                  onClick={handleCancelAssign}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                >
                  <FiX className="w-4 h-4" />
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tire List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiDisc className="w-5 h-5" />
            Depodaki Lastikler ({filtered.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B5394]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Seri No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Marka</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Desen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Ölçü</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Diş Der.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <FiDisc className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Depoda lastik bulunamadı</p>
                    <p className="text-sm mt-1">Sıfır lastik ekleyerek depoya lastik ekleyebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((tire, index) => {
                  const depthStatus = getDepthStatus(tire.tire_disderinligi);
                  return (
                    <tr
                      key={tire.id}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{tire.tire_serino || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_marka || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_desen || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_olcu || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${depthStatus.color}`}>
                          {tire.tire_disderinligi ?? '-'} mm
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tire.tire_durum || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleStartAssign(tire)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                        >
                          <FiCheck className="w-4 h-4" />
                          Araca Ata
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
    </div>
  );
};

export default DepodanLastikGetirPage;
