import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTruck, FiDisc, FiBattery, FiLogOut, FiUser, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { signOut } from '../services/authService';
import { useAuthStore } from '../store/auth';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  children?: { to: string; label: string }[];
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, clearSession, setLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

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
    { to: '/', label: 'Anasayfa', icon: <FiHome className="w-4 h-4" /> },
    {
      to: '/arac-aktif',
      label: 'Araç İşlemleri',
      icon: <FiTruck className="w-4 h-4" />,
      children: [
        { to: '/arac-aktif', label: 'Aktif Araçlar' },
        { to: '/arac-pasif', label: 'Pasif Araçlar' },
        { to: '/arac-ekle', label: 'Araç Ekle' },
      ],
    },
    {
      to: '/lastik-sifir',
      label: 'Lastik İşlemleri',
      icon: <FiDisc className="w-4 h-4" />,
      children: [
        { to: '/lastik-sifir', label: 'Sıfır Lastik Ekle' },
        { to: '/lastik-depo', label: 'Depo Lastikleri' },
        { to: '/lastik-hurda', label: 'Hurda Lastikler' },
      ],
    },
    {
      to: '/aku-islem',
      label: 'Akü İşlemleri',
      icon: <FiBattery className="w-4 h-4" />,
      children: [
        { to: '/aku-ekle', label: 'Akü Ekle' },
        { to: '/aku-depo', label: 'Depo Aküler' },
        { to: '/aku-hurda', label: 'Hurda Aküler' },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="bg-[#0B5394] h-16 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <FiDisc className="w-6 h-6 text-[#0B5394]" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
                      isActive(item.to) ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2 text-gray-700 hover:bg-slate-100 transition-colors ${
                            location.pathname === child.to ? 'bg-slate-100 text-[#0B5394] font-medium' : ''
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
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
        <div className="flex items-center gap-3">
          {session && (
            <div className="hidden sm:flex items-center gap-2 text-white/80">
              <FiUser className="w-4 h-4" />
              <span className="text-sm font-medium">{username}</span>
            </div>
          )}
          {session ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          ) : (
            <Link
              to="/giris"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0B5394] rounded-lg font-medium hover:bg-slate-100 transition-all"
            >
              Giriş
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#094A84] border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-white font-medium transition-all ${
                        isActive(item.to) ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      <FiChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => {
                              setOpenDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                            className={`block px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors ${
                              location.pathname === child.to ? 'bg-white/10 text-white' : ''
                            }`}
                          >
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
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all ${
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
