import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { listDepotTires, deleteTire, type TireWithDetails } from '../services/tireService';

const LastikDepoPage = () => {
  const navigate = useNavigate();
  const [tires, setTires] = useState<TireWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadTires = async (searchTerm?: string) => {
    try {
      setLoading(true);
      const data = await listDepotTires(searchTerm);
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

  const handleSearch = () => {
    loadTires(search);
  };

  useEffect(() => {
    loadTires();
  }, []);

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
              <div className="heading1 margin_0" style={{ float: 'right', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Seri no veya marka ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ width: '200px' }}
                />
                <button className="btn btn-secondary" onClick={handleSearch}>Ara</button>
                <button className="btn btn-primary" onClick={() => navigate('/lastik-sifir')}>
                  Yeni Lastik Ekle
                </button>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : tires.length === 0 ? (
                  <p className="text-center">Depoda lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Dış Derinlik</th>
                        <th>Durum</th>
                        <th>Ölçüm Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tires.map((tire) => (
                        <tr key={tire.id}>
                          <td>{tire.id}</td>
                          <td>{tire.tire_serino ?? '-'}</td>
                          <td>{tire.tire_marka ?? '-'}</td>
                          <td>{tire.tire_desen ?? '-'}</td>
                          <td>{tire.tire_olcu ?? '-'}</td>
                          <td>{tire.tire_disderinligi ? `${tire.tire_disderinligi} mm` : '-'}</td>
                          <td>{tire.tire_durum ?? 'Normal'}</td>
                          <td>{tire.tire_olcumtarihi ? new Date(tire.tire_olcumtarihi).toLocaleDateString('tr-TR') : '-'}</td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => handleAssignToCar(tire.id)}>Araca Tak</button>
                            {' '}
                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(tire.id)}>Düzenle</button>
                            {' '}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tire.id)}>Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastikDepoPage;
