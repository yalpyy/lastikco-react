import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Tire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_dis_derinlik: number;
  tire_ic_derinlik: number;
  tire_orta_derinlik: number;
  tire_adet: number;
  tire_fiyat: number;
  tire_tarih: string;
}

const LastikDepoPage = () => {
  const navigate = useNavigate();
  const [tires, setTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu lastiği silmek istediğinizden emin misiniz?')) return;
    try {
      // TODO: Supabase'den lastik sil
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
    // Navigate to car selection or show modal
    toast.info('Araç seçim sayfasına yönlendiriliyorsunuz...');
    navigate(`/arac-aktif?assignTire=${id}`);
  };

  useEffect(() => {
    // TODO: Supabase'den depodaki lastikleri çek (car_id IS NULL)
    setTimeout(() => {
      setTires([
        {
          id: 1,
          tire_serino: 'DOT1234',
          tire_marka: 'Michelin',
          tire_desen: 'X Multi',
          tire_olcu: '315/80R22.5',
          tire_dis_derinlik: 14.5,
          tire_ic_derinlik: 14.2,
          tire_orta_derinlik: 14.3,
          tire_adet: 4,
          tire_fiyat: 2500.00,
          tire_tarih: '2024-01-10',
        },
        {
          id: 2,
          tire_serino: 'DOT5678',
          tire_marka: 'Bridgestone',
          tire_desen: 'R297',
          tire_olcu: '295/80R22.5',
          tire_dis_derinlik: 13.8,
          tire_ic_derinlik: 13.5,
          tire_orta_derinlik: 13.6,
          tire_adet: 2,
          tire_fiyat: 2300.00,
          tire_tarih: '2024-01-15',
        },
      ]);
      setLoading(false);
    }, 500);
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
              <div className="heading1 margin_0" style={{ float: 'right' }}>
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
                        <th>Dış</th>
                        <th>Orta</th>
                        <th>İç</th>
                        <th>Adet</th>
                        <th>Fiyat</th>
                        <th>Tarih</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tires.map((tire) => (
                        <tr key={tire.id}>
                          <td>{tire.id}</td>
                          <td>{tire.tire_serino}</td>
                          <td>{tire.tire_marka}</td>
                          <td>{tire.tire_desen}</td>
                          <td>{tire.tire_olcu}</td>
                          <td>{tire.tire_dis_derinlik}</td>
                          <td>{tire.tire_orta_derinlik}</td>
                          <td>{tire.tire_ic_derinlik}</td>
                          <td>{tire.tire_adet}</td>
                          <td>{tire.tire_fiyat.toFixed(2)} ₺</td>
                          <td>{tire.tire_tarih}</td>
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
