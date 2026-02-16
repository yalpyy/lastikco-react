import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { signOut } from '../services/authService';
import { FiMenu, FiHome, FiHelpCircle, FiLogOut, FiChevronDown } from 'react-icons/fi';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const TopNavbar = ({ onToggleSidebar, sidebarOpen: _sidebarOpen }: TopNavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { session, setSession } = useAuthStore();
  const navigate = useNavigate();

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setSession(null);
      navigate('/giris');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-[#0B5394] text-white hover:bg-[#094A84] transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <Link to="/" className="hidden sm:block">
            <img
              src="/images/logo/logo.png"
              alt="Lastik.co"
              className="h-8"
            />
          </Link>
        </div>

        {/* Right side - User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src="/images/layout_img/user_img.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {username}
            </span>
            <FiChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <Link
                to="/"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
              >
                <FiHome className="w-4 h-4" />
                Anasayfa
              </Link>
              <Link
                to="/destek"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
              >
                <FiHelpCircle className="w-4 h-4" />
                Destek Talebi
              </Link>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
