import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiTrash2, FiTag, FiGrid, FiCircle, FiUpload, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useConfirm } from '../hooks/useConfirm';
import {
  getConstantsByType,
  addConstant,
  deleteConstant,
  updateConstant,
  importExistingValuesAsConstants,
  type TireConstant,
} from '../services/constantsService';

type TabType = 'marka' | 'desen' | 'olcu';

const SabitlerPage = () => {
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabType>('marka');
  const [constants, setConstants] = useState<TireConstant[]>([]);
  const [loading, setLoading] = useState(true);
  const [newValue, setNewValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const tabLabels: Record<TabType, { label: string; icon: ReactNode }> = {
    marka: { label: 'Markalar', icon: <FiTag className="w-4 h-4" /> },
    desen: { label: 'Desenler', icon: <FiGrid className="w-4 h-4" /> },
    olcu: { label: 'Ölçüler', icon: <FiCircle className="w-4 h-4" /> },
  };

  const loadConstants = async () => {
    setLoading(true);
    try {
      const data = await getConstantsByType(activeTab);
      setConstants(data);
    } catch (error) {
      toast.error('Sabitler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConstants();
  }, [activeTab]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) {
      toast.error('Değer boş olamaz!');
      return;
    }

    setSaving(true);
    try {
      const newConstant = await addConstant(activeTab, newValue);
      setConstants(prev => [...prev, newConstant].sort((a, b) => a.value.localeCompare(b.value)));
      setNewValue('');
      toast.success('Sabit başarıyla eklendi!');
    } catch (error: any) {
      toast.error(error.message || 'Sabit eklenirken hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({ message: 'Bu sabiti silmek istediğinize emin misiniz?', variant: 'danger' }))) return;

    try {
      await deleteConstant(id);
      setConstants(prev => prev.filter(c => c.id !== id));
      toast.success('Sabit silindi.');
    } catch (error: any) {
      toast.error(error.message || 'Sabit silinirken hata oluştu!');
    }
  };

  const handleEditSave = async (id: number) => {
    if (!editValue.trim()) {
      toast.error('Değer boş olamaz!');
      return;
    }

    try {
      const updated = await updateConstant(id, editValue);
      setConstants(prev => prev.map(c => c.id === id ? updated : c));
      setEditingId(null);
      setEditValue('');
      toast.success('Sabit güncellendi.');
    } catch (error: any) {
      toast.error(error.message || 'Sabit güncellenirken hata oluştu!');
    }
  };

  const handleImport = async () => {
    if (!(await confirm({ message: 'Mevcut lastiklerden benzersiz marka, desen ve ölçü değerleri içe aktarılsın mı?', variant: 'info' }))) return;

    setImporting(true);
    try {
      const result = await importExistingValuesAsConstants();
      toast.success(`İçe aktarıldı: ${result.markaCount} marka, ${result.desenCount} desen, ${result.olcuCount} ölçü`);
      await loadConstants();
    } catch (error: any) {
      toast.error(error.message || 'İçe aktarma sırasında hata oluştu!');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Geri Dön"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sabitler Yönetimi</h1>
            <p className="text-sm text-gray-500 mt-1">Lastik marka, desen ve ölçü değerlerini yönetin</p>
          </div>
        </div>
        <button
          onClick={handleImport}
          disabled={importing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <FiUpload className="w-4 h-4" />
          {importing ? 'İçe aktarılıyor...' : 'Mevcut Değerleri İçe Aktar'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {(Object.keys(tabLabels) as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#0B5394] border-b-2 border-[#0B5394] bg-[#0B5394]/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tabLabels[tab].icon}
              {tabLabels[tab].label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab
                  ? 'bg-[#0B5394] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {activeTab === tab ? constants.length : ''}
              </span>
            </button>
          ))}
        </div>

        {/* Add Form */}
        <div className="p-6 bg-slate-50 border-b border-gray-200">
          <form onSubmit={handleAdd} className="flex items-end gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Yeni {tabLabels[activeTab].label.slice(0, -3)} Ekle
              </label>
              <input
                type="text"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder={`Örn: ${activeTab === 'marka' ? 'Michelin' : activeTab === 'desen' ? 'X Multi' : '315/80R22.5'}`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5394] text-white rounded-lg hover:bg-[#094A84] transition-colors disabled:opacity-50"
            >
              <FiPlus className="w-4 h-4" />
              {saving ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </form>
        </div>

        {/* Constants List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#0B5394] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : constants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {tabLabels[activeTab].icon}
              </div>
              <p className="text-gray-500 font-medium">Henüz {tabLabels[activeTab].label.toLowerCase()} eklenmemiş</p>
              <p className="text-sm text-gray-400 mt-1">Yukarıdaki formu kullanarak ilk değeri ekleyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {constants.map(constant => (
                <div
                  key={constant.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-gray-200 hover:border-[#0B5394]/30 transition-colors group"
                >
                  {editingId === constant.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSave(constant.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Kaydet"
                      >
                        <FiSave className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditValue(''); }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="İptal"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-800">{constant.value}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingId(constant.id); setEditValue(constant.value); }}
                          className="p-1.5 text-[#0B5394] hover:bg-[#0B5394]/10 rounded transition-colors"
                          title="Düzenle"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(constant.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Sil"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Bilgi</h3>
        <p className="text-sm text-blue-700">
          Bu sayfada tanımlanan marka, desen ve ölçü değerleri, yeni lastik eklerken dropdown olarak kullanılabilir.
          "Mevcut Değerleri İçe Aktar" butonuyla sistemde kayıtlı lastiklerden benzersiz değerleri otomatik olarak ekleyebilirsiniz.
        </p>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default SabitlerPage;
