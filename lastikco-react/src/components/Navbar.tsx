import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiTruck, FiDisc, FiBattery, FiLogOut, FiUser,
  FiChevronDown, FiMenu, FiX, FiMapPin, FiAlertTriangle,
  FiSettings, FiList, FiPlusCircle, FiArchive, FiTool
} from 'react-icons/fi';
import { signOut } from '../services/authService';
import { useAuthStore } from '../store/auth';

interface NavChild {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  children?: NavChild[];
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, clearSession, setLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      clearSession();
      navigate('/giris');
    } finally {
      setLoading(false);
    }
  };

  const navItems: NavItem[] = [
    {
      to: '/',
      label: 'Anasayfa',
      icon: <FiHome className="w-4 h-4" />
    },
    {
      to: '/arac-aktif',
      label: 'Araç İşlemleri',
      icon: <FiTruck className="w-4 h-4" />,
      children: [
        { to: '/arac-aktif', label: 'Aktif Araçlar', icon: <FiList className="w-4 h-4" /> },
        { to: '/arac-pasif', label: 'Pasif Araçlar', icon: <FiArchive className="w-4 h-4" /> },
        { to: '/arac-ekle', label: 'Araç Ekle', icon: <FiPlusCircle className="w-4 h-4" /> },
        { to: '/toplam-arac', label: 'Toplam Araçlar', icon: <FiTruck className="w-4 h-4" /> },
      ],
    },
    {
      to: '/lastik-sifir',
      label: 'Lastik İşlemleri',
      icon: <FiDisc className="w-4 h-4" />,
      children: [
        { to: '/lastik-sifir', label: 'Sıfır Lastik Ekle', icon: <FiPlusCircle className="w-4 h-4" /> },
        { to: '/lastik-depo', label: 'Depo Lastikleri', icon: <FiArchive className="w-4 h-4" /> },
        { to: '/lastik-servis', label: 'Servisteki Lastikler', icon: <FiTool className="w-4 h-4" /> },
        { to: '/lastik-hurda', label: 'Hurda Lastikler', icon: <FiArchive className="w-4 h-4" /> },
        { to: '/lastik-havuz', label: 'Lastik Havuzu', icon: <FiList className="w-4 h-4" /> },
        { to: '/toplam-lastik', label: 'Toplam Lastikler', icon: <FiDisc className="w-4 h-4" /> },
        { to: '/alert', label: 'Lastik Alertleri', icon: <FiAlertTriangle className="w-4 h-4" /> },
      ],
    },
    {
      to: '/aku-depo',
      label: 'Akü İşlemleri',
      icon: <FiBattery className="w-4 h-4" />,
      children: [
        { to: '/yeni-aku', label: 'Yeni Akü Ekle', icon: <FiPlusCircle className="w-4 h-4" /> },
        { to: '/aku-depo', label: 'Depo Aküler', icon: <FiArchive className="w-4 h-4" /> },
      ],
    },
    {
      to: '/bolge-ekle',
      label: 'Yönetim',
      icon: <FiSettings className="w-4 h-4" />,
      children: [
        { to: '/bolge-ekle', label: 'Bölge Yönetimi', icon: <FiMapPin className="w-4 h-4" /> },
        { to: '/destek', label: 'Destek', icon: <FiSettings className="w-4 h-4" /> },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isChildActive = (children?: NavChild[]) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.to);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="bg-[#0B5394] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between" ref={dropdownRef}>
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <FiDisc className="w-6 h-6 text-[#0B5394]" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden md:block">
            Lastik Yönetim
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                      isChildActive(item.children) || openDropdown === item.label
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl py-2 min-w-[200px] z-50 border border-gray-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            location.pathname === child.to
                              ? 'bg-[#0B5394]/10 text-[#0B5394] font-medium'
                              : 'text-gray-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className={location.pathname === child.to ? 'text-[#0B5394]' : 'text-gray-400'}>
                            {child.icon}
                          </span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                    isActive(item.to) ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2">
          {session && (
            <div className="hidden md:flex items-center gap-2 text-white/80 mr-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{username}</span>
            </div>
          )}
          {session ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          ) : (
            <Link
              to="/giris"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0B5394] rounded-lg text-sm font-medium hover:bg-slate-100 transition-all"
            >
              Giriş
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all ml-1"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#094A84] border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-white font-medium transition-all ${
                        isChildActive(item.children) ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => {
                              setOpenDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                              location.pathname === child.to
                                ? 'bg-white/20 text-white font-medium'
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-all ${
                      isActive(item.to) ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
