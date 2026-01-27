import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface LogEntry {
  id: number;
  car_name: string;
  message: string;
  created_at: string;
}

const AracGecmisiPage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [carName, setCarName] = useState('');
  const perPage = 25;

  useEffect(() => {
    // TODO: Supabase'den araç loglarını çek
    setTimeout(() => {
      setCarName('34 ABC 123');
      const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        car_name: '34 ABC 123',
        message: `İşlem ${i + 1}: Lastik değişimi yapıldı`,
        created_at: '2024-01-15 14:30:00',
      }));
      setTotalPages(Math.ceil(mockLogs.length / perPage));
      setLogs(mockLogs.slice((currentPage - 1) * perPage, currentPage * perPage));
      setLoading(false);
    }, 500);
  }, [carId, currentPage]);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Araç Geçmişi {carName && `- ${carName}`}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>İşlem Geçmişi</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                Geri Dön
              </button>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <>
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Araç</th>
                          <th>İşlem</th>
                          <th>Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length === 0 ? (
                          <tr><td colSpan={4} className="text-center">Kayıt bulunamadı</td></tr>
                        ) : (
                          logs.map(log => (
                            <tr key={log.id}>
                              <td>{log.id}</td>
                              <td>{log.car_name}</td>
                              <td>{log.message}</td>
                              <td>{log.created_at}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <nav>
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Önceki</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Sonraki</button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AracGecmisiPage;
