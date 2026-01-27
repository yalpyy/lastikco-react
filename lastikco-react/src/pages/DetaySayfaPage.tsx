import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface DepthRecord {
  id: number;
  depth_value: string;
  measurement_date: string;
}

const DetaySayfaPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const [records, setRecords] = useState<DepthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tireSeriNo, setTireSeriNo] = useState('');

  useEffect(() => {
    // TODO: Supabase'den lastik diş derinliği geçmişini çek
    setTimeout(() => {
      setTireSeriNo('DOT2024A');
      setRecords([
        { id: 1, depth_value: '14.0', measurement_date: '2024-01-01' },
        { id: 2, depth_value: '13.2', measurement_date: '2024-02-01' },
        { id: 3, depth_value: '12.5', measurement_date: '2024-03-01' },
        { id: 4, depth_value: '11.8', measurement_date: '2024-04-01' },
        { id: 5, depth_value: '10.9', measurement_date: '2024-05-01' },
      ]);
      setLoading(false);
    }, 500);
  }, [tireId]);

  const maxDepth = Math.max(...records.map(r => Number(r.depth_value)), 1);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Diş Derinliği Detay - {tireSeriNo}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Diş Derinliği Grafiği</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '20px 0' }}>
                  {records.map(r => {
                    const height = (Number(r.depth_value) / maxDepth) * 100;
                    const color = Number(r.depth_value) < 3 ? '#dc3545' : Number(r.depth_value) < 6 ? '#ffc107' : '#28a745';
                    return (
                      <div key={r.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '12px', marginBottom: '4px' }}>{r.depth_value}mm</span>
                        <div style={{ width: '100%', maxWidth: '60px', height: `${height}%`, backgroundColor: color, borderRadius: '4px 4px 0 0' }} />
                        <span style={{ fontSize: '10px', marginTop: '4px' }}>{r.measurement_date}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Ölçüm Geçmişi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Diş Derinliği (mm)</th>
                      <th>Ölçüm Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr><td colSpan={3} className="text-center">Kayıt bulunamadı</td></tr>
                    ) : (
                      records.map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>
                            <span className={Number(r.depth_value) < 3 ? 'text-danger font-weight-bold' : ''}>
                              {r.depth_value} mm
                            </span>
                          </td>
                          <td>{r.measurement_date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetaySayfaPage;
