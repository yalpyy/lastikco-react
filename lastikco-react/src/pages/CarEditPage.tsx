import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiTruck, FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiBattery,
  FiClock, FiMapPin, FiPackage, FiTool, FiSave, FiX, FiAlertCircle
} from 'react-icons/fi';
import { useConfirm } from '../hooks/useConfirm';
import AxleVisual, { type TirePosition } from '../components/AxleVisual';
import { getCarWithAxles, deleteCar } from '../services/vehicleService';
import {
  listTiresByCar,
  createTireWithDetails,
  updateTireDetails,
  deleteTire,
  removeTireFromCar
} from '../services/tireService';
import type { CarWithAxle, TireDetail, Tire } from '../types';

interface TireRow {
  id: number;
  tire_id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_disderinligi: string;
  tire_durum: string;
  tire_olcumtarihi: string;
  tire_olcumkm: number;
  tire_position: string;
  axle_number: number;
}

const CarEditPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const [car, setCar] = useState<CarWithAxle | null>(null);
  const [tires, setTires] = useState<TireRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTire, setEditingTire] = useState<TireRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tire_serino: '',
    tire_marka: '',
    tire_desen: '',
    tire_olcu: '',
    tire_disderinligi: '',
    tire_durum: 'Yeni',
    tire_olcumtarihi: '',
    tire_olcumkm: '',
    tire_position: '',
    axle_number: '1',
  });

  // Load car and tires data
  useEffect(() => {
    const loadData = async () => {
      if (!carId) return;

      try {
        setLoading(true);
        const carData = await getCarWithAxles(Number(carId));
        setCar(carData);

        const tiresData = await listTiresByCar(Number(carId));
        const formattedTires: TireRow[] = tiresData.map((t: TireDetail & { tires: Tire }) => ({
          id: t.id,
          tire_id: t.tires.id,
          tire_serino: t.tire_serino || '',
          tire_marka: t.tire_marka || '',
          tire_desen: t.tire_desen || '',
          tire_olcu: t.tire_olcu || '',
          tire_disderinligi: t.tire_disderinligi || '',
          tire_durum: t.tire_durum || 'Normal',
          tire_olcumtarihi: t.tire_olcumtarihi || '',
          tire_olcumkm: t.tire_olcumkm || 0,
          tire_position: t.tires.tire_position || '',
          axle_number: t.tires.axle_number || 1,
        }));
        setTires(formattedTires);
      } catch (error) {
        console.error('Veri yüklenemedi:', error);
        toast.error('Araç bilgileri yüklenemedi!');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carId]);

  const reloadTires = async () => {
    if (!car) return;
    try {
      const tiresData = await listTiresByCar(car.id);
      const formattedTires: TireRow[] = tiresData.map((t: TireDetail & { tires: Tire }) => ({
        id: t.id,
        tire_id: t.tires.id,
        tire_serino: t.tire_serino || '',
        tire_marka: t.tire_marka || '',
        tire_desen: t.tire_desen || '',
        tire_olcu: t.tire_olcu || '',
        tire_disderinligi: t.tire_disderinligi || '',
        tire_durum: t.tire_durum || 'Normal',
        tire_olcumtarihi: t.tire_olcumtarihi || '',
        tire_olcumkm: t.tire_olcumkm || 0,
        tire_position: t.tires.tire_position || '',
        axle_number: t.tires.axle_number || 1,
      }));
      setTires(formattedTires);
    } catch (error) {
      console.error('Lastikler yüklenemedi:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!car) return;

    setSaving(true);
    try {
      if (editingTire) {
        // Update existing tire
        await updateTireDetails(editingTire.tire_id, {
          tire_serino: formData.tire_serino || null,
          tire_marka: formData.tire_marka || null,
          tire_desen: formData.tire_desen || null,
          tire_olcu: formData.tire_olcu || null,
          tire_disderinligi: formData.tire_disderinligi || null,
          tire_durum: formData.tire_durum || 'Normal',
          tire_olcumtarihi: formData.tire_olcumtarihi || null,
          tire_olcumkm: formData.tire_olcumkm ? parseInt(formData.tire_olcumkm, 10) : null,
        });
        toast.success('Lastik başarıyla güncellendi!');
      } else {
        // Create new tire
        await createTireWithDetails(car.id, {
          tire_serino: formData.tire_serino || null,
          tire_marka: formData.tire_marka || null,
          tire_desen: formData.tire_desen || null,
          tire_olcu: formData.tire_olcu || null,
          tire_disderinligi: formData.tire_disderinligi || null,
          tire_durum: formData.tire_durum || 'Yeni',
          tire_olcumtarihi: formData.tire_olcumtarihi || null,
          tire_olcumkm: formData.tire_olcumkm ? parseInt(formData.tire_olcumkm, 10) : null,
          axle_number: parseInt(formData.axle_number, 10),
          tire_position: formData.tire_position,
        });
        toast.success('Lastik başarıyla eklendi!');
      }

      await reloadTires();
      setShowForm(false);
      setEditingTire(null);
      resetForm();
    } catch (error) {
      console.error('İşlem hatası:', error);
      toast.error('İşlem sırasında hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tire_serino: '',
      tire_marka: '',
      tire_desen: '',
      tire_olcu: '',
      tire_disderinligi: '',
      tire_durum: 'Yeni',
      tire_olcumtarihi: '',
      tire_olcumkm: '',
      tire_position: '',
      axle_number: '1',
    });
  };

  const handleEdit = (tire: TireRow) => {
    setEditingTire(tire);
    setFormData({
      tire_serino: tire.tire_serino,
      tire_marka: tire.tire_marka,
      tire_desen: tire.tire_desen,
      tire_olcu: tire.tire_olcu,
      tire_disderinligi: tire.tire_disderinligi,
      tire_durum: tire.tire_durum,
      tire_olcumtarihi: tire.tire_olcumtarihi,
      tire_olcumkm: String(tire.tire_olcumkm || ''),
      tire_position: tire.tire_position,
      axle_number: String(tire.axle_number),
    });
    setShowForm(true);
  };

  const handleDelete = async (tireId: number) => {
    if (!(await confirm({ message: 'Bu lastiği silmek istediğinize emin misiniz?', variant: 'danger' }))) return;

    try {
      await deleteTire(tireId);
      setTires(prev => prev.filter(t => t.tire_id !== tireId));
      toast.success('Lastik başarıyla silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Lastik silinemedi!');
    }
  };

  const handleRemoveTire = async (tireId: number) => {
    if (!(await confirm({ message: 'Bu lastiği araçtan çıkarmak ve depoya göndermek istediğinize emin misiniz?', variant: 'warning' }))) return;

    try {
      await removeTireFromCar(tireId);
      setTires(prev => prev.filter(t => t.tire_id !== tireId));
      toast.success('Lastik araçtan çıkarıldı ve depoya gönderildi!');
    } catch (error) {
      console.error('Çıkarma hatası:', error);
      toast.error('Lastik araçtan çıkarılamadı!');
    }
  };

  const handleDeleteCar = async () => {
    if (!car) return;
    if (!(await confirm({ message: 'Bu aracı silmek istediğinize emin misiniz? Tüm lastik ve akü verileri de silinecektir.', variant: 'danger' }))) return;

    try {
      await deleteCar(car.id);
      toast.success('Araç başarıyla silindi!');
      navigate('/arac-aktif');
    } catch (error) {
      console.error('Araç silme hatası:', error);
      toast.error('Araç silinemedi!');
    }
  };

  const getPositionsForAxle = (axleNum: number, totalAxles: number): string[] => {
    if (axleNum === 1) return ['Sol Ön', 'Sağ Ön'];
    if (axleNum <= totalAxles) return ['Sol Dış', 'Sol İç', 'Sağ İç', 'Sağ Dış'];
    return ['Sol', 'Sağ'];
  };

  const getDepthColorClass = (depth: string): string => {
    const depthNum = parseFloat(depth);
    if (isNaN(depthNum)) return 'text-gray-500';
    if (depthNum < 5) return 'text-red-600 font-bold';
    if (depthNum < 8) return 'text-amber-600 font-semibold';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5394]"></div>
        <span className="ml-4 text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Araç bulunamadı</h2>
        <button
          onClick={() => navigate('/arac-aktif')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84]"
        >
          <FiArrowLeft className="w-4 h-4" />
          Araç Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiTruck className="w-7 h-7 text-[#0B5394]" />
            Araç Düzenle
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {car.car_name} - {car.car_model}
          </p>
        </div>
        <button
          onClick={() => navigate('/arac-aktif')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
      </div>

      {/* Car Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Araç Bilgileri</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/aku-duzenle/${car.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <FiBattery className="w-4 h-4" />
              Akü
            </button>
            <button
              onClick={() => navigate(`/arac-gecmisi/${car.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <FiClock className="w-4 h-4" />
              Geçmiş
            </button>
            <button
              onClick={() => navigate(`/arac-bolge/${car.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <FiMapPin className="w-4 h-4" />
              Bölge
            </button>
            <button
              onClick={handleDeleteCar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Sil
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B5394]/10 rounded-lg flex items-center justify-center">
                <FiTruck className="w-5 h-5 text-[#0B5394]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Plaka</p>
                <p className="text-lg font-semibold text-gray-900">{car.car_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiTool className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Model</p>
                <p className="text-lg font-semibold text-gray-900">{car.car_model}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-amber-600">{car.axle_count}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Aks Sayısı</p>
                <p className="text-lg font-semibold text-gray-900">{car.axle_count} Aks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tire Management Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0B5394] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Lastik Yönetimi</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingTire(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#0B5394] rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Lastik
            </button>
            <button
              onClick={() => navigate(`/depodan-lastik-getir/${car.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <FiPackage className="w-4 h-4" />
              Depodan Getir
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Axle Visual */}
          {(car.axle_count === 2 || car.axle_count === 3 || car.axle_count === 4) && (
            <div className="mb-8">
              <h3 className="text-center text-sm font-medium text-gray-700 mb-4">Araç Lastik Düzeni</h3>
              <AxleVisual
                axleCount={car.axle_count as 2 | 3 | 4}
                tires={tires.map(t => ({
                  id: t.id,
                  tire_id: t.tire_id,
                  tire_serino: t.tire_serino,
                  tire_marka: t.tire_marka,
                  tire_disderinligi: t.tire_disderinligi,
                  tire_position: t.tire_position,
                  axle_number: t.axle_number,
                } as TirePosition))}
                onTireClick={(tire) => {
                  const fullTire = tires.find(t => t.tire_id === tire.tire_id);
                  if (fullTire) handleEdit(fullTire);
                }}
                onEmptyClick={(axleNumber, position) => {
                  resetForm();
                  setFormData(prev => ({
                    ...prev,
                    axle_number: String(axleNumber),
                    tire_position: position,
                  }));
                  setShowForm(true);
                }}
              />
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {editingTire ? <FiEdit2 className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                {editingTire ? 'Lastik Düzenle' : 'Yeni Lastik Ekle'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seri No *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="DOT2024..."
                      value={formData.tire_serino}
                      onChange={e => setFormData({ ...formData, tire_serino: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marka *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="Michelin"
                      value={formData.tire_marka}
                      onChange={e => setFormData({ ...formData, tire_marka: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desen</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="X Multi D"
                      value={formData.tire_desen}
                      onChange={e => setFormData({ ...formData, tire_desen: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ölçü</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="315/80R22.5"
                      value={formData.tire_olcu}
                      onChange={e => setFormData({ ...formData, tire_olcu: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diş Derinliği (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="14.5"
                      value={formData.tire_disderinligi}
                      onChange={e => setFormData({ ...formData, tire_disderinligi: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      value={formData.tire_durum}
                      onChange={e => setFormData({ ...formData, tire_durum: e.target.value })}
                    >
                      <option value="Yeni">Yeni</option>
                      <option value="İyi">İyi</option>
                      <option value="Normal">Normal</option>
                      <option value="Orta">Orta</option>
                      <option value="Kötü">Kötü</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ölçüm Tarihi</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      value={formData.tire_olcumtarihi}
                      onChange={e => setFormData({ ...formData, tire_olcumtarihi: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ölçüm KM</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      placeholder="50000"
                      value={formData.tire_olcumkm}
                      onChange={e => setFormData({ ...formData, tire_olcumkm: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aks No *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      value={formData.axle_number}
                      onChange={e => setFormData({ ...formData, axle_number: e.target.value, tire_position: '' })}
                    >
                      {Array.from({ length: car.axle_count ?? 0 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Aks {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                      value={formData.tire_position}
                      onChange={e => setFormData({ ...formData, tire_position: e.target.value })}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {getPositionsForAxle(Number(formData.axle_number), car.axle_count ?? 0).map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        {editingTire ? 'Güncelle' : 'Ekle'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTire(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tires by Axle */}
          {Array.from({ length: car.axle_count ?? 0 }, (_, axleIdx) => {
            const axleNum = axleIdx + 1;
            const axleTires = tires.filter(t => t.axle_number === axleNum);
            return (
              <div key={axleNum} className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#0B5394] text-white rounded-full flex items-center justify-center text-xs">
                    {axleNum}
                  </span>
                  Aks {axleNum}
                  <span className="text-sm font-normal text-gray-500">({axleTires.length} lastik)</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0B5394]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Pozisyon</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Seri No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Marka</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Desen</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Ölçü</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Diş Der.</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Durum</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Tarih</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">KM</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {axleTires.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-8 text-center text-gray-500 bg-slate-50">
                            Bu aksta lastik yok
                          </td>
                        </tr>
                      ) : (
                        axleTires.map((tire, idx) => (
                          <tr key={tire.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{tire.tire_position}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_serino || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_marka || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_desen || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_olcu || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={getDepthColorClass(tire.tire_disderinligi)}>
                                {tire.tire_disderinligi ? `${tire.tire_disderinligi} mm` : '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_durum || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_olcumtarihi || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{tire.tire_olcumkm || '-'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEdit(tire)}
                                  className="p-1.5 text-[#0B5394] hover:bg-[#0B5394]/10 rounded-lg transition-colors"
                                  title="Düzenle"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/dis-derinligi/${tire.tire_id}`)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Diş Derinliği"
                                >
                                  <FiTool className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveTire(tire.tire_id)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Araçtan Çıkar"
                                >
                                  <FiPackage className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(tire.tire_id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            );
          })}
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default CarEditPage;
