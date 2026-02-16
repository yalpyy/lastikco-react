import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTruck, FiDisc, FiAlertTriangle, FiTool, FiBattery, FiPackage, FiArrowRight } from 'react-icons/fi';
import { getDashboardStats, type DashboardStats } from '../services/dashboardService';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path?: string;
}

const HomePage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Dashboard verisi yüklenemedi:', error);
        toast.error('Dashboard verisi yüklenemedi!');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Toplam Araç',
      value: stats?.totalCars ?? '-',
      icon: <FiTruck className="w-8 h-8" />,
      color: 'text-[#0B5394]',
      bgColor: 'bg-blue-50',
      path: '/toplam-arac',
    },
    {
      title: 'Toplam Lastik',
      value: stats?.totalTires ?? '-',
      icon: <FiDisc className="w-8 h-8" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      path: '/toplam-lastik',
    },
    {
      title: 'Alert',
      value: stats?.alertCount ?? '-',
      icon: <FiAlertTriangle className="w-8 h-8" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      path: '/alert',
    },
    {
      title: 'Hasarlı Lastik',
      value: stats?.faultyTires ?? '-',
      icon: <FiTool className="w-8 h-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Toplam Akü',
      value: stats?.totalBatteries ?? '-',
      icon: <FiBattery className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Depodaki Lastik',
      value: stats?.depotTires ?? '-',
      icon: <FiPackage className="w-8 h-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/lastik-depo',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anasayfa</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard yükleniyor...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Anasayfa</h1>
        <p className="text-sm text-gray-500 mt-1">Lastik yönetim sistemi genel bakış</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={() => card.path && navigate(card.path)}
            className={`bg-white rounded-xl shadow-sm border-l-4 border-[#0B5394] overflow-hidden transition-all hover:shadow-lg ${
              card.path ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <span className={card.color}>{card.icon}</span>
                </div>
              </div>
              {card.path && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0B5394] hover:text-[#094A84]">
                    Detayları Gör <FiArrowRight className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#0B5394]">
          <h2 className="text-lg font-semibold text-white">Hızlı İşlemler</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/arac-ekle')}
              className="flex items-center gap-3 px-4 py-3 bg-[#0B5394] hover:bg-[#094A84] rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FiTruck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Araç Ekle</p>
                <p className="text-xs text-white/80">Yeni araç kaydı oluştur</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/lastik-sifir')}
              className="flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FiDisc className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Lastik Ekle</p>
                <p className="text-xs text-white/80">Sıfır lastik kaydı</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/aku-ekle')}
              className="flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FiBattery className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Akü Ekle</p>
                <p className="text-xs text-white/80">Yeni akü kaydı oluştur</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/arac-aktif')}
              className="flex items-center gap-3 px-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FiTool className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Lastik Yönetimi</p>
                <p className="text-xs text-white/80">Araç lastiklerini düzenle</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
