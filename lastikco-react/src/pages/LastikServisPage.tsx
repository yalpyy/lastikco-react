import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ServiceTire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  car_name: string;
  service_date: string;
  service_reason: string;
}

const LastikServisPage = () => {
  const [tires, setTires] = useState<ServiceTire[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRepair = async (id: number) => {
    try {
      // TODO: Supabase'de lastiği depo durumuna çevir
      setTires(tires.filter(t => t.id !== id));
      toast.success('Lastik onarıldı ve depoya gönderildi!');
    } catch (error) {
      console.error('Onarma hatası:', error);
      toast.error('Lastik onarılırken hata oluştu!');
    }
  };

  const handleScrap = async (id: number) => {
    if (!window.confirm('Bu lastiği hurdaya çıkarmak istediğinizden emin misiniz?')) return;
    try {
      // TODO: Supabase'de lastiği hurda durumuna çevir
      setTires(tires.filter(t => t.id !== id));
      toast.success('Lastik hurdaya çıkarıldı!');
    } catch (error) {
      console.error('Hurda hatası:', error);
      toast.error('Lastik hurdaya çıkarılırken hata oluştu!');
    }
  };

  useEffect(() => {
    // TODO: Supabase'den servisteki lastikleri çek
    setTimeout(() => {
      setTires([
        {
          id: 1,
          tire_serino: 'DOT9999',
          tire_marka: 'Continental',
          tire_desen: 'HDR2',
          tire_olcu: '315/80R22.5',
          car_name: '34 ABC 123',
          service_date: '2024-01-20',
          service_reason: 'Diş derinliği düşük',
        },
        {
          id: 2,
          tire_serino: 'DOT8888',
          tire_marka: 'Goodyear',
          tire_desen: 'KMAX',
          tire_olcu: '295/80R22.5',
          car_name: '06 XYZ 789',
          service_date: '2024-01-22',
          service_reason: 'Yanak hasarı',
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
            <h2>Servisteki Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Servis Lastik Listesi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : tires.length === 0 ? (
                  <p className="text-center">Serviste lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Araç Plakası</th>
                        <th>Servis Tarihi</th>
                        <th>Sebep</th>
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
                          <td>{tire.car_name}</td>
                          <td>{tire.service_date}</td>
                          <td>{tire.service_reason}</td>
                          <td>
                            <button className="btn btn-success btn-sm" onClick={() => handleRepair(tire.id)}>Onar</button>
                            {' '}
                            <button className="btn btn-danger btn-sm" onClick={() => handleScrap(tire.id)}>Hurdaya Çıkar</button>
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

export default LastikServisPage;
