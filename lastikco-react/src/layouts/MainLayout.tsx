import { Outlet } from 'react-router-dom';
import SidebarMenu from '../components/SidebarMenu';
import TopNavbar from '../components/TopNavbar';

const MainLayout = () => {
  return (
    <div className="full_container">
      <div className="inner_container">
        <SidebarMenu />
        <div id="content">
          <TopNavbar />
          <div className="midde_cont">
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
