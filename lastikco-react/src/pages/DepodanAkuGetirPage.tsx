import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBattery, FiArrowLeft, FiSearch, FiCheck } from 'react-icons/fi';
import { getCarWithAxles } from '../services/vehicleService';
import { listDepotAkus, assignAkuToCar, type Aku } from '../services/akuService';

interface CarInfo {
  id: number;
  car_name: string;
  car_model: string;
}

const DepodanAkuGetirPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarInfo | null>(null);
  const [batteries, setBatteries] = useState<Aku[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assigning, setAssigning] = useState<number | null>(null);

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

      // Depodaki aküleri çek
      const depotAkus = await listDepotAkus();
      setBatteries(depotAkus);
    } catch (error: any) {
      toast.error(error.message || 'Veriler yüklenirken hata oluştu.');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (akuId: number) => {
    if (!car) return;
    if (!window.confirm('Bu aküyü araca atamak istediğinize emin misiniz?')) return;

    setAssigning(akuId);
    try {
      await assignAkuToCar(akuId, car.id);
      setBatteries(prev => prev.filter(b => b.id !== akuId));
      toast.success(`Akü ${car.car_name} aracına başarıyla atandı!`);
    } catch (error: any) {
      toast.error(error.message || 'Atama işlemi sırasında hata oluştu.');
      console.error('Assign error:', error);
    } finally {
      setAssigning(null);
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

  const filtered = batteries.filter(b =>
    !search ||
    b.aku_marka.toLowerCase().includes(search.toLowerCase()) ||
    b.aku_volt.toLowerCase().includes(search.toLowerCase()) ||
    b.aku_amper.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Depodan Akü Getir</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            {car.car_name} - {car.car_model}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Marka, volt veya amper ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394] transition-colors"
          />
        </div>
      </div>

      {/* Battery List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiBattery className="w-5 h-5" />
            Depodaki Aküler ({filtered.length})
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
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <FiBattery className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Depoda akü bulunamadı</p>
                    <p className="text-sm mt-1">Yeni akü ekleyerek depoya akü ekleyebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((battery, index) => (
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
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAssign(battery.id)}
                        disabled={assigning === battery.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <FiCheck className="w-4 h-4" />
                        {assigning === battery.id ? 'Atanıyor...' : 'Araca Ata'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepodanAkuGetirPage;
