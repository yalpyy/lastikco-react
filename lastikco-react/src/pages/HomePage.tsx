import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardStats, type DashboardStats } from '../services/dashboardService';

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

  if (loading) {
    return (
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Anasayfa</h2>
            <p className="mt-2">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Anasayfa</h2>
          </div>
        </div>
      </div>

      <div className="row column1">
        {/* Toplam Araç */}
        <div className="col-md-6 col-lg-3">
          <div
            className="full counter_section margin_bottom_30"
            onClick={() => navigate('/toplam-arac')}
            style={{ cursor: 'pointer' }}
          >
            <div className="couter_icon">
              <div>
                <i className="fa fa-car blue1_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.totalCars ?? '-'}</p>
                <p className="head_couter">Toplam Araç</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toplam Lastik */}
        <div className="col-md-6 col-lg-3">
          <div
            className="full counter_section margin_bottom_30"
            onClick={() => navigate('/toplam-lastik')}
            style={{ cursor: 'pointer' }}
          >
            <div className="couter_icon">
              <div>
                <i className="fa fa-car blue1_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.totalTires ?? '-'}</p>
                <p className="head_couter">Toplam Lastik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="col-md-6 col-lg-3">
          <div
            className="full counter_section margin_bottom_30"
            onClick={() => navigate('/alert')}
            style={{ cursor: 'pointer' }}
          >
            <div className="couter_icon">
              <div>
                <i className="fa fa-car blue1_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.alertCount ?? '-'}</p>
                <p className="head_couter">Alert</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hasarlı Lastik */}
        <div className="col-md-6 col-lg-3">
          <div className="full counter_section margin_bottom_30">
            <div className="couter_icon">
              <div>
                <i className="fa fa-wrench green_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.faultyTires ?? '-'}</p>
                <p className="head_couter">Hasarlı Lastik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toplam Akü */}
        <div className="col-md-6 col-lg-3">
          <div className="full counter_section margin_bottom_30">
            <div className="couter_icon">
              <div>
                <i className="fa fa-plug red_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.totalBatteries ?? '-'}</p>
                <p className="head_couter">Toplam Akü</p>
              </div>
            </div>
          </div>
        </div>

        {/* Depodaki Lastik */}
        <div className="col-md-6 col-lg-3">
          <div className="full counter_section margin_bottom_30">
            <div className="couter_icon">
              <div>
                <i className="fa fa-life-buoy red_color"></i>
              </div>
            </div>
            <div className="counter_no">
              <div>
                <p className="total_no">{stats?.depotTires ?? '-'}</p>
                <p className="head_couter">Depodaki Lastik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
