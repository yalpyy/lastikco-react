import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import {
  FiHome,
  FiTruck,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiDisc,
  FiPackage,
  FiTool,
  FiTrash2,
  FiLayers,
  FiBattery,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiPieChart,
  FiChevronDown,
  FiChevronRight,
  FiHelpCircle,
} from 'react-icons/fi';

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
    icon: <FiHome />,
    path: '/',
  },
  {
    id: 'dashboard',
    label: 'Raporlar',
    icon: <FiPieChart />,
    children: [
      { label: 'Toplam Araç', path: '/toplam-arac' },
      { label: 'Toplam Lastik', path: '/toplam-lastik' },
      { label: 'Uyarılar', path: '/alert' },
    ],
  },
  {
    id: 'arac',
    label: 'Araç İşlemleri',
    icon: <FiTruck />,
    children: [
      { label: 'Araç Ekle', path: '/arac-ekle' },
      { label: 'Aktif Araçlar', path: '/arac-aktif' },
      { label: 'Pasif Araçlar', path: '/arac-pasif' },
    ],
  },
  {
    id: 'lastik',
    label: 'Lastik İşlemleri',
    icon: <FiDisc />,
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
    icon: <FiBattery />,
    children: [
      { label: 'Akü Yönetimi', path: '/aku-depo' },
      { label: 'Yeni Akü Ekle', path: '/yeni-aku' },
    ],
  },
  {
    id: 'diger',
    label: 'Diğer İşlemler',
    icon: <FiMapPin />,
    children: [
      { label: 'Bölge Ekleme', path: '/bolge-ekle' },
      { label: 'Lastik Bilgi', path: '/lastik-bilgi' },
    ],
  },
  {
    id: 'destek',
    label: 'Destek',
    icon: <FiHelpCircle />,
    path: '/destek',
  },
];

const SidebarMenu = () => {
  const [openMenus, setOpenMenus] = useState<string[]>(['dashboard', 'arac', 'lastik', 'aku', 'diger']);
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
          {menuItems.map((item) => {
            // Single link item (no children)
            if (item.path && !item.children) {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            }

            // Collapsible menu with children
            const isOpen = openMenus.includes(item.id);
            return (
              <li key={item.id} className={isOpen ? 'active' : ''}>
                <a
                  href={`#${item.id}`}
                  data-toggle="collapse"
                  aria-expanded={isOpen}
                  className="dropdown-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu(item.id);
                  }}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="menu-arrow">
                    {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                </a>
                <ul className={`collapse list-unstyled ${isOpen ? 'show' : ''}`} id={item.id}>
                  {item.children?.map((child) => (
                    <li key={child.path}>
                      <NavLink
                        to={child.path}
                        className={({ isActive }) => (isActive ? 'active-child' : '')}
                      >
                        <span className="child-indicator">&gt;</span>
                        <span>{child.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .sidebar-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-right: 15px;
          font-size: 18px;
        }
        .sidebar-icon svg {
          width: 18px;
          height: 18px;
        }
        #sidebar ul li a {
          display: flex;
          align-items: center;
        }
        .menu-arrow {
          margin-left: auto;
          display: flex;
          align-items: center;
        }
        .menu-arrow svg {
          width: 14px;
          height: 14px;
        }
        .child-indicator {
          margin-right: 10px;
          color: rgba(255, 255, 255, 0.5);
        }
        #sidebar ul.components ul li a {
          display: flex;
          align-items: center;
        }
        #sidebar ul.components ul li a.active-child {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        #sidebar ul li a.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </nav>
  );
};

export default SidebarMenu;
