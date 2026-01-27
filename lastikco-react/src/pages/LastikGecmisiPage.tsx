import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface LogEntry {
  id: number;
  message: string;
  created_at: string;
}

const LastikGecmisiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tireSeriNo, setTireSeriNo] = useState('');
  const perPage = 25;

  useEffect(() => {
    // TODO: Supabase'den lastik loglarını çek
    setTimeout(() => {
      setTireSeriNo('DOT2024A');
      const mockLogs: LogEntry[] = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        message: `İşlem ${i + 1}: Lastik bakım/değişim kaydı`,
        created_at: '2024-01-15 14:30:00',
      }));
      setTotalPages(Math.ceil(mockLogs.length / perPage));
      setLogs(mockLogs.slice((currentPage - 1) * perPage, currentPage * perPage));
      setLoading(false);
    }, 500);
  }, [tireId, currentPage]);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Lastik Geçmişi {tireSeriNo && `- ${tireSeriNo}`}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>İşlem Geçmişi</h2>
              </div>
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
                          <th>İşlem</th>
                          <th>Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length === 0 ? (
                          <tr><td colSpan={3} className="text-center">Kayıt bulunamadı</td></tr>
                        ) : (
                          logs.map(log => (
                            <tr key={log.id}>
                              <td>{log.id}</td>
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

export default LastikGecmisiPage;
