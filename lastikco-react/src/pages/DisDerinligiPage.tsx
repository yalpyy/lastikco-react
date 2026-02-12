import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface DepthRecord {
  id: number;
  depth_value: string;
  measurement_date: string;
}

const DisDerinligiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<DepthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tireSeriNo, setTireSeriNo] = useState('');
  const [newDepth, setNewDepth] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // TODO: Supabase'den diş derinliği kayıtlarını çek
    setTimeout(() => {
      setTireSeriNo('DOT2024A');
      setRecords([
        { id: 1, depth_value: '14.0', measurement_date: '2024-01-01' },
        { id: 2, depth_value: '12.5', measurement_date: '2024-02-01' },
        { id: 3, depth_value: '10.9', measurement_date: '2024-03-01' },
      ]);
      setLoading(false);
    }, 500);
  }, [tireId]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const depthNum = Number(newDepth);
    if (records.length > 0) {
      const lastDepth = Number(records[records.length - 1].depth_value);
      if (depthNum >= lastDepth) {
        toast.error('Yeni ölçüm önceki ölçümden küçük olmalıdır!');
        return;
      }
    }
    // TODO: Supabase'e diş derinliği ekle
    const newRecord: DepthRecord = {
      id: records.length + 1,
      depth_value: newDepth,
      measurement_date: new Date().toISOString().split('T')[0],
    };
    setRecords([...records, newRecord]);
    setNewDepth('');
    toast.success('Diş derinliği ölçümü eklendi.');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ölçümü silmek istediğinize emin misiniz?')) return;
    // TODO: Supabase'den sil
    setRecords(prev => prev.filter(r => r.id !== id));
    toast.success('Ölçüm kaydı silindi.');
  };

  const handleEditSave = async (id: number) => {
    // TODO: Supabase'de güncelle
    setRecords(prev => prev.map(r => r.id === id ? { ...r, depth_value: editValue } : r));
    setEditingId(null);
    setEditValue('');
    toast.success('Ölçüm kaydı güncellendi.');
  };

  const maxDepth = Math.max(...records.map(r => Number(r.depth_value)), 1);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Diş Derinliği - {tireSeriNo}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Yeni Ölçüm Ekle</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <form onSubmit={handleAdd} className="form-inline">
                <div className="form-group" style={{ marginRight: '10px' }}>
                  <label style={{ marginRight: '5px' }}>Diş Derinliği (mm):</label>
                  <input type="number" step="0.1" className="form-control" value={newDepth}
                    onChange={e => setNewDepth(e.target.value)} required style={{ width: '120px' }} />
                </div>
                <button type="submit" className="btn btn-success">Ekle</button>
              </form>
              {records.length > 0 && Number(records[records.length - 1].depth_value) < 1.5 && (
                <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                  Diş derinliği kritik seviyenin altında! (1.5mm)
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
            <div className="full graph_head d-flex justify-content-between align-items-center">
              <div className="heading1 margin_0">
                <h2>Ölçüm Kayıtları</h2>
              </div>
              <button className="btn btn-info btn-sm" onClick={() => navigate(`/detay-sayfa/${tireId}`)}>
                Detay Görünüm
              </button>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Diş Derinliği (mm)</th>
                      <th>Ölçüm Tarihi</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>
                          {editingId === r.id ? (
                            <input type="number" step="0.1" className="form-control" style={{ width: '100px', display: 'inline' }}
                              value={editValue} onChange={e => setEditValue(e.target.value)} />
                          ) : (
                            <span className={Number(r.depth_value) < 3 ? 'text-danger font-weight-bold' : ''}>
                              {r.depth_value} mm
                            </span>
                          )}
                        </td>
                        <td>{r.measurement_date}</td>
                        <td>
                          {editingId === r.id ? (
                            <>
                              <button className="btn btn-sm btn-success" onClick={() => handleEditSave(r.id)}>Kaydet</button>{' '}
                              <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>İptal</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-sm btn-primary" onClick={() => { setEditingId(r.id); setEditValue(r.depth_value); }}>Düzenle</button>{' '}
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Sil</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
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

export default DisDerinligiPage;
