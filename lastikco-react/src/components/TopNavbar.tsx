import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { signOut } from '../services/authService';

const TopNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { session, setSession } = useAuthStore();
  const navigate = useNavigate();

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

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
    <div className="topbar">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="full">
          <button type="button" id="sidebarCollapse" className="sidebar_toggle">
            <i className="fa fa-bars" />
          </button>
          <div className="logo_section">
            <Link to="/">
              <img className="img-responsive" src="/images/logo/logo.png" alt="logo" />
            </Link>
          </div>
          <div className="right_topbar">
            <div className="icon_info">
              <ul />
              <ul className="user_profile_dd">
                <li>
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      className="img-responsive rounded-circle"
                      src="/images/layout_img/user_img.jpg"
                      alt="user"
                    />
                    <span className="name_user">{username}</span>
                  </a>
                  <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                    <Link className="dropdown-item" to="/" onClick={() => setDropdownOpen(false)}>
                      Anasayfa
                    </Link>
                    <Link className="dropdown-item" to="/destek" onClick={() => setDropdownOpen(false)}>
                      Destek Talebi
                    </Link>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>Çıkış Yap</span> <i className="fa fa-sign-out" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopNavbar;
