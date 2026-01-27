import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface KmRecord {
  id: number;
  km_value: number;
  measurement_date: string;
}

const KmBilgiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const [records, setRecords] = useState<KmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tireSeriNo, setTireSeriNo] = useState('');
  const [newKm, setNewKm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // TODO: Supabase'den KM kayıtlarını çek
    setTimeout(() => {
      setTireSeriNo('DOT2024A');
      setRecords([
        { id: 1, km_value: 10000, measurement_date: '2024-01-01' },
        { id: 2, km_value: 25000, measurement_date: '2024-02-01' },
        { id: 3, km_value: 45000, measurement_date: '2024-03-01' },
      ]);
      setLoading(false);
    }, 500);
  }, [tireId]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const kmNum = Number(newKm);
    if (records.length > 0) {
      const lastKm = records[records.length - 1].km_value;
      if (kmNum <= lastKm) {
        toast.error('Yeni KM değeri önceki değerden büyük olmalıdır!');
        return;
      }
    }
    // TODO: Supabase'e KM kaydı ekle
    const newRecord: KmRecord = {
      id: records.length + 1,
      km_value: kmNum,
      measurement_date: new Date().toISOString().split('T')[0],
    };
    setRecords([...records, newRecord]);
    setNewKm('');
    toast.success('KM kaydı eklendi.');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    // TODO: Supabase'den sil
    setRecords(prev => prev.filter(r => r.id !== id));
    toast.success('KM kaydı silindi.');
  };

  const handleEditSave = async (id: number) => {
    // TODO: Supabase'de güncelle
    setRecords(prev => prev.map(r => r.id === id ? { ...r, km_value: Number(editValue) } : r));
    setEditingId(null);
    setEditValue('');
    toast.success('KM kaydı güncellendi.');
  };

  const maxKm = Math.max(...records.map(r => r.km_value), 1);

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Kilometre Bilgisi - {tireSeriNo}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Yeni KM Kaydı Ekle</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <form onSubmit={handleAdd} className="form-inline">
                <div className="form-group" style={{ marginRight: '10px' }}>
                  <label style={{ marginRight: '5px' }}>Kilometre:</label>
                  <input type="number" className="form-control" value={newKm}
                    onChange={e => setNewKm(e.target.value)} required style={{ width: '150px' }} />
                </div>
                <button type="submit" className="btn btn-success">Ekle</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>KM Grafiği</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '20px 0' }}>
                  {records.map(r => {
                    const height = (r.km_value / maxKm) * 100;
                    return (
                      <div key={r.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '12px', marginBottom: '4px' }}>{r.km_value.toLocaleString()} km</span>
                        <div style={{ width: '100%', maxWidth: '60px', height: `${height}%`, backgroundColor: '#007bff', borderRadius: '4px 4px 0 0' }} />
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
                <h2>KM Kayıtları</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Kilometre</th>
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
                            <input type="number" className="form-control" style={{ width: '150px', display: 'inline' }}
                              value={editValue} onChange={e => setEditValue(e.target.value)} />
                          ) : (
                            `${r.km_value.toLocaleString()} km`
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
                              <button className="btn btn-sm btn-primary" onClick={() => { setEditingId(r.id); setEditValue(String(r.km_value)); }}>Düzenle</button>{' '}
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

export default KmBilgiPage;
