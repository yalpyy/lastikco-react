import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listDepotTires, deleteTire, type TireWithDetails } from '../services/tireService';
import DataTable, { type Column } from '../components/DataTable';

const LastikDepoPage = () => {
  const navigate = useNavigate();
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTires = async () => {
    try {
      setLoading(true);
      const data = await listDepotTires();
      setTires(data);
    } catch (error) {
      console.error('Depodaki lastikler yüklenemedi:', error);
      toast.error('Depodaki lastikler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu lastiği silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteTire(id);
      setTires(tires.filter(t => t.id !== id));
      toast.success('Lastik başarıyla silindi!');
    } catch (error) {
      console.error('Lastik silinemedi:', error);
      toast.error('Lastik silinirken hata oluştu!');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/detay-sayfa/${id}`);
  };

  const handleAssignToCar = (id: number) => {
    toast.info('Araç seçim sayfasına yönlendiriliyorsunuz...');
    navigate(`/arac-aktif?assignTire=${id}`);
  };

  useEffect(() => {
    loadTires();
  }, []);

  const columns: Column<TireWithDetails>[] = [
    { key: 'id', header: '#', sortable: true },
    { key: 'tire_serino', header: 'Seri No', sortable: true, render: (row) => row.tire_serino ?? '-' },
    { key: 'tire_marka', header: 'Marka', sortable: true, render: (row) => row.tire_marka ?? '-' },
    { key: 'tire_desen', header: 'Desen', render: (row) => row.tire_desen ?? '-' },
    { key: 'tire_olcu', header: 'Ölçü', render: (row) => row.tire_olcu ?? '-' },
    {
      key: 'tire_disderinligi',
      header: 'Dış Derinlik',
      sortable: true,
      render: (row) => row.tire_disderinligi ? `${row.tire_disderinligi} mm` : '-',
    },
    { key: 'tire_durum', header: 'Durum', render: (row) => row.tire_durum ?? 'Normal' },
    {
      key: 'tire_olcumtarihi',
      header: 'Ölçüm Tarihi',
      sortable: true,
      render: (row) => row.tire_olcumtarihi ? new Date(row.tire_olcumtarihi).toLocaleDateString('tr-TR') : '-',
    },
  ];

  const renderActions = (tire: TireWithDetails) => (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => handleAssignToCar(tire.id)}>Araca Tak</button>
      {' '}
      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(tire.id)}>Düzenle</button>
      {' '}
      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tire.id)}>Sil</button>
    </>
  );

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Depodaki Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Depo Lastik Listesi</h2>
              </div>
              <div className="heading1 margin_0" style={{ float: 'right' }}>
                <button className="btn btn-primary" onClick={() => navigate('/lastik-sifir')}>
                  Yeni Lastik Ekle
                </button>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <DataTable
                data={tires}
                columns={columns}
                loading={loading}
                emptyMessage="Depoda lastik bulunmamaktadır."
                searchPlaceholder="Seri no veya marka ara..."
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

export default LastikDepoPage;
