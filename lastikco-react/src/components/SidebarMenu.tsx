import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import {
  FiHome,
  FiTruck,
  FiDisc,
  FiBattery,
  FiMapPin,
  FiPieChart,
  FiChevronDown,
  FiChevronRight,
  FiHelpCircle,
  FiX,
} from 'react-icons/fi';

interface SidebarMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Anasayfa',
    icon: <FiHome className="w-5 h-5" />,
    path: '/',
  },
  {
    id: 'dashboard',
    label: 'Raporlar',
    icon: <FiPieChart className="w-5 h-5" />,
    children: [
      { label: 'Toplam Araç', path: '/toplam-arac' },
      { label: 'Toplam Lastik', path: '/toplam-lastik' },
      { label: 'Uyarılar', path: '/alert' },
    ],
  },
  {
    id: 'arac',
    label: 'Araç İşlemleri',
    icon: <FiTruck className="w-5 h-5" />,
    children: [
      { label: 'Araç Ekle', path: '/arac-ekle' },
      { label: 'Aktif Araçlar', path: '/arac-aktif' },
      { label: 'Pasif Araçlar', path: '/arac-pasif' },
    ],
  },
  {
    id: 'lastik',
    label: 'Lastik İşlemleri',
    icon: <FiDisc className="w-5 h-5" />,
    children: [
      { label: 'Sıfır Lastik Ekle', path: '/lastik-sifir' },
      { label: 'Depodaki Lastikler', path: '/lastik-depo' },
      { label: 'Servisteki Lastikler', path: '/lastik-servis' },
      { label: 'Hurda Lastikler', path: '/lastik-hurda' },
      { label: 'Lastik Havuzu', path: '/lastik-havuz' },
    ],
  },
  {
    id: 'aku',
    label: 'Akü İşlemleri',
    icon: <FiBattery className="w-5 h-5" />,
    children: [
      { label: 'Akü Yönetimi', path: '/aku-depo' },
      { label: 'Yeni Akü Ekle', path: '/yeni-aku' },
    ],
  },
  {
    id: 'diger',
    label: 'Diğer İşlemler',
    icon: <FiMapPin className="w-5 h-5" />,
    children: [
      { label: 'Bölge Ekleme', path: '/bolge-ekle' },
      { label: 'Lastik Bilgi', path: '/lastik-bilgi' },
      { label: 'Sabitler', path: '/sabitler' },
    ],
  },
  {
    id: 'destek',
    label: 'Destek',
    icon: <FiHelpCircle className="w-5 h-5" />,
    path: '/destek',
  },
];

const SidebarMenu = ({ isOpen, onToggle }: SidebarMenuProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>(['dashboard', 'arac', 'lastik']);
  const { session } = useAuthStore();

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#15283c] text-white transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/images/logo/logo_icon.png"
              alt="Lastik.co"
              className="w-10 h-10"
            />
            <span className="text-lg font-bold">Lastik.co</span>
          </NavLink>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/images/layout_img/user_img.jpg"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item) => {
            // Single link (no children)
            if (item.path && !item.children) {
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? 'bg-[#0B5394] text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            }

            // Collapsible menu with children
            const isMenuOpen = openMenus.includes(item.id);
            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isMenuOpen
                      ? 'bg-white/5 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isMenuOpen ? (
                    <FiChevronDown className="w-4 h-4" />
                  ) : (
                    <FiChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Submenu */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 pl-4 border-l border-white/10 mt-1">
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-[#0B5394] text-white'
                              : 'text-gray-400 hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#15283c]">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Lastik.co
          </p>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
