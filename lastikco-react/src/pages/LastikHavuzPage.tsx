import { useState, useEffect } from 'react';

interface PoolTire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  tire_durum: string;
}

const LastikHavuzPage = () => {
  const [tires, setTires] = useState<PoolTire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den lastik havuzunu çek (lastik_havuz tablosu)
    setTimeout(() => {
      setTires([
        { id: 1, tire_serino: 'DOT5001', tire_marka: 'Michelin', tire_desen: 'X Multi D', tire_olcu: '315/80R22.5', tire_durum: 'Beklemede' },
        { id: 2, tire_serino: 'DOT5002', tire_marka: 'Continental', tire_desen: 'HDR2', tire_olcu: '295/80R22.5', tire_durum: 'Beklemede' },
        { id: 3, tire_serino: 'DOT5003', tire_marka: 'Goodyear', tire_desen: 'KMAX D', tire_olcu: '315/80R22.5', tire_durum: 'Beklemede' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleActivate = async (id: number) => {
    if (!window.confirm('Bu lastiği aktif envantere taşımak istediğinize emin misiniz?')) return;
    // TODO: lastik_havuz'dan tire_details'e taşı, durum = kullanılabilir
    setTires(prev => prev.filter(t => t.id !== id));
    alert('Lastik aktif envantere taşındı!');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu lastiği havuzdan silmek istediğinize emin misiniz?')) return;
    // TODO: Supabase'den sil
    setTires(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Lastik Havuzu</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Havuzdaki Lastikler</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tires.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">Havuzda lastik yok</td></tr>
                      ) : (
                        tires.map(tire => (
                          <tr key={tire.id}>
                            <td>{tire.id}</td>
                            <td>{tire.tire_serino}</td>
                            <td>{tire.tire_marka}</td>
                            <td>{tire.tire_desen}</td>
                            <td>{tire.tire_olcu}</td>
                            <td>{tire.tire_durum}</td>
                            <td>
                              <button className="btn btn-sm btn-success" onClick={() => handleActivate(tire.id)}>
                                Envantere Taşı
                              </button>{' '}
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tire.id)}>
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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

export default LastikHavuzPage;
