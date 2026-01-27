import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const SidebarMenu = () => {
  const [openMenus, setOpenMenus] = useState<string[]>(['dashboard', 'element', 'element2', 'apps', 'additional_page']);
  const { session } = useAuthStore();

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const username = session?.user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <nav id="sidebar">
      <div className="sidebar_blog_1">
        <div className="sidebar-header">
          <div className="logo_section">
            <NavLink to="/">
              <img className="logo_icon img-responsive" src="/images/logo/logo_icon.png" alt="logo icon" />
            </NavLink>
          </div>
        </div>
        <div className="sidebar_user_info">
          <div className="icon_setting" />
          <div className="user_profle_side">
            <div className="user_img">
              <img className="img-responsive" src="/images/layout_img/user_img.jpg" alt="user" />
            </div>
            <div className="user_info">
              <h6>Lastik.co</h6>
              <p>
                <span className="online_animation" /> {username} Online
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar_blog_2">
        <h4>Lastik.co</h4>
        <ul className="list-unstyled components">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              <i className="fa fa-road yellow_color" /> <span>Anasayfa</span>
            </NavLink>
          </li>

          <li className={openMenus.includes('dashboard') ? 'active' : ''}>
            <a
              href="#dashboard"
              data-toggle="collapse"
              aria-expanded={openMenus.includes('dashboard')}
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('dashboard');
              }}
            >
              <i className="fa fa-car purple_color2" /> <span>Araç İşlemleri</span>
            </a>
            <ul className={`collapse list-unstyled ${openMenus.includes('dashboard') ? 'show' : ''}`} id="dashboard">
              <li>
                <NavLink to="/arac-ekle">&gt; <span>Araç Ekle</span></NavLink>
              </li>
              <li>
                <NavLink to="/arac-aktif">&gt; <span>Aktif Araç İşlemleri</span></NavLink>
              </li>
              <li>
                <NavLink to="/arac-pasif">&gt; <span>Pasif Araç İşlemleri</span></NavLink>
              </li>
            </ul>
          </li>

          <li className={openMenus.includes('element') ? 'active' : ''}>
            <a
              href="#element"
              data-toggle="collapse"
              aria-expanded={openMenus.includes('element')}
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('element');
              }}
            >
              <i className="fa fa-life-ring purple_color" /> <span>Lastik İşlemleri</span>
            </a>
            <ul className={`collapse list-unstyled ${openMenus.includes('element') ? 'show' : ''}`} id="element">
              <li>
                <NavLink to="/lastik-sifir">&gt; <span>Sıfır Lastik Ekle</span></NavLink>
              </li>
              <li>
                <NavLink to="/lastik-depo">&gt; <span>Depodaki Lastikler</span></NavLink>
              </li>
              <li>
                <NavLink to="/lastik-servis">&gt; <span>Servisteki Lastikler</span></NavLink>
              </li>
              <li>
                <NavLink to="/lastik-hurda">&gt; <span>Hurda Lastikler</span></NavLink>
              </li>
              <li>
                <NavLink to="/lastik-havuz">&gt; <span>Lastik Havuzu</span></NavLink>
              </li>
            </ul>
          </li>

          <li className={openMenus.includes('apps') ? 'active' : ''}>
            <a
              href="#apps"
              data-toggle="collapse"
              aria-expanded={openMenus.includes('apps')}
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('apps');
              }}
            >
              <i className="fa fa-wrench blue2_color" /> <span>Akü İşlemleri</span>
            </a>
            <ul className={`collapse list-unstyled ${openMenus.includes('apps') ? 'show' : ''}`} id="apps">
              <li>
                <NavLink to="/aku-depo">&gt; <span>Akü Ekleme / Depo</span></NavLink>
              </li>
              <li>
                <NavLink to="/yeni-aku">&gt; <span>Yeni Akü Ekle</span></NavLink>
              </li>
            </ul>
          </li>

          <li className={openMenus.includes('additional_page') ? 'active' : ''}>
            <a
              href="#additional_page"
              data-toggle="collapse"
              aria-expanded={openMenus.includes('additional_page')}
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('additional_page');
              }}
            >
              <i className="fa fa-road blue2_color" /> <span>Diğer İşlemler</span>
            </a>
            <ul className={`collapse list-unstyled ${openMenus.includes('additional_page') ? 'show' : ''}`} id="additional_page">
              <li>
                <NavLink to="/bolge-ekle">&gt; <span>Yeni Bölge Ekleme</span></NavLink>
              </li>
              <li>
                <NavLink to="/lastik-bilgi">&gt; <span>Lastik Bilgi Ekleme</span></NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SidebarMenu;
