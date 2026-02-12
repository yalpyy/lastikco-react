import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listCarsWithAxles } from '../services/vehicleService';
import DataTable, { type Column } from '../components/DataTable';
import type { CarWithAxle } from '../types';

const TotalCarsPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarWithAxle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    try {
      setLoading(true);
      const result = await listCarsWithAxles();
      setCars(result.data);
    } catch (error) {
      console.error('Araçlar yüklenemedi:', error);
      toast.error('Araçlar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const columns: Column<CarWithAxle>[] = [
    { key: 'id', header: '#', sortable: true },
    { key: 'car_name', header: 'Plaka', sortable: true },
    { key: 'car_model', header: 'Model', sortable: true },
    { key: 'axle_count', header: 'Aks Sayısı', render: (row) => row.axle_count ?? '-' },
    { key: 'bolge_adi', header: 'Bölge', render: (row) => row.bolge_adi ?? '-' },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => (
        <span className={`badge ${row.status === 'aktif' ? 'badge-success' : 'badge-secondary'}`}>
          {row.status === 'aktif' ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Eklenme Tarihi',
      sortable: true,
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (car: CarWithAxle) => (
    <>
      <button className="btn btn-sm btn-info" onClick={() => navigate(`/arac-gecmisi/${car.id}`)}>Detay</button>
      {' '}
      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/arac-duzenle/${car.id}`)}>Düzenle</button>
    </>
  );

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Toplam Araçlar</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Tüm Araç Listesi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <DataTable
                data={cars}
                columns={columns}
                loading={loading}
                emptyMessage="Kayıtlı araç bulunmamaktadır."
                searchPlaceholder="Plaka veya model ara..."
                rowKey="id"
                actions={renderActions}
                pageSize={10}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalCarsPage;
