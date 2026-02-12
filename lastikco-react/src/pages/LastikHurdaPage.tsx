import { useEffect, useState } from 'react';

interface ScrapTire {
  id: number;
  tire_serino: string;
  tire_marka: string;
  tire_desen: string;
  tire_olcu: string;
  car_name: string;
  scrap_date: string;
  scrap_reason: string;
}

const LastikHurdaPage = () => {
  const [tires, setTires] = useState<ScrapTire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den hurdaya çıkmış lastikleri çek
    setTimeout(() => {
      setTires([
        {
          id: 1,
          tire_serino: 'DOT1111',
          tire_marka: 'Pirelli',
          tire_desen: 'FR85',
          tire_olcu: '315/80R22.5',
          car_name: '34 ABC 123',
          scrap_date: '2023-12-15',
          scrap_reason: 'Diş derinliği sıfır',
        },
        {
          id: 2,
          tire_serino: 'DOT2222',
          tire_marka: 'Dunlop',
          tire_desen: 'SP346',
          tire_olcu: '295/80R22.5',
          car_name: '06 XYZ 789',
          scrap_date: '2023-12-20',
          scrap_reason: 'Onarılamaz hasar',
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
            <h2>Hurda Lastikler</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Hurdaya Çıkmış Lastikler</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : tires.length === 0 ? (
                  <p className="text-center">Hurdaya çıkmış lastik bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seri No</th>
                        <th>Marka</th>
                        <th>Desen</th>
                        <th>Ölçü</th>
                        <th>Son Araç</th>
                        <th>Hurda Tarihi</th>
                        <th>Sebep</th>
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
                          <td>{tire.scrap_date}</td>
                          <td>{tire.scrap_reason}</td>
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

export default LastikHurdaPage;
