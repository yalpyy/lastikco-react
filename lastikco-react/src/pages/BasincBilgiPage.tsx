import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BasincRecord {
  id: number;
  basinc_value: number;
  basinc_tarih: string;
  basinc_km: number;
  basinc_not: string;
}

const BasincBilgiPage = () => {
  const { tireId } = useParams<{ tireId: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<BasincRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    basinc_value: '',
    basinc_km: '',
    basinc_not: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Supabase'den basınç kayıtlarını çek
    setTimeout(() => {
      setRecords([
        {
          id: 1,
          basinc_value: 8.5,
          basinc_tarih: '2024-01-15',
          basinc_km: 125000,
          basinc_not: 'Normal basınç',
        },
        {
          id: 2,
          basinc_value: 8.2,
          basinc_tarih: '2024-02-10',
          basinc_km: 132000,
          basinc_not: 'Hafif düşük',
        },
        {
          id: 3,
          basinc_value: 8.8,
          basinc_tarih: '2024-03-05',
          basinc_km: 140000,
          basinc_not: 'Ayarlandı',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [tireId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.basinc_value || !formData.basinc_km) {
      toast.error('Lütfen basınç değeri ve KM bilgisini giriniz!');
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Supabase'e basınç kaydı ekle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRecord: BasincRecord = {
        id: records.length + 1,
        basinc_value: parseFloat(formData.basinc_value),
        basinc_km: parseInt(formData.basinc_km),
        basinc_tarih: new Date().toISOString().split('T')[0],
        basinc_not: formData.basinc_not,
      };

      setRecords([newRecord, ...records]);
      setFormData({ basinc_value: '', basinc_km: '', basinc_not: '' });
      toast.success('Basınç bilgisi başarıyla eklendi!');
    } catch (error) {
      console.error('Basınç bilgisi eklenemedi:', error);
      toast.error('Basınç bilgisi eklenirken hata oluştu!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu basınç kaydını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      // TODO: Supabase'den basınç kaydını sil
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords(records.filter(r => r.id !== id));
      toast.success('Basınç kaydı silindi!');
    } catch (error) {
      console.error('Basınç kaydı silinemedi:', error);
      toast.error('Basınç kaydı silinirken hata oluştu!');
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Basınç Bilgisi - Lastik #{tireId}</h2>
          </div>
        </div>
      </div>

      {/* Yeni Basınç Ekleme Formu */}
      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Yeni Basınç Kaydı Ekle</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="basinc_value">Basınç (Bar):</label>
                      <input
                        type="number"
                        step="0.1"
                        id="basinc_value"
                        className="form-control"
                        placeholder="Örn: 8.5"
                        value={formData.basinc_value}
                        onChange={(e) => setFormData({ ...formData, basinc_value: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="basinc_km">Kilometre:</label>
                      <input
                        type="number"
                        id="basinc_km"
                        className="form-control"
                        placeholder="Örn: 125000"
                        value={formData.basinc_km}
                        onChange={(e) => setFormData({ ...formData, basinc_km: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="basinc_not">Not:</label>
                      <input
                        type="text"
                        id="basinc_not"
                        className="form-control"
                        placeholder="Opsiyonel not..."
                        value={formData.basinc_not}
                        onChange={(e) => setFormData({ ...formData, basinc_not: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-2" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                      {submitting ? 'Ekleniyor...' : 'Ekle'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Basınç Kayıtları Tablosu */}
      <div className="row">
        <div className="col-md-12">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Basınç Geçmişi</h2>
              </div>
            </div>
            <div className="table_section padding_infor_info">
              <div className="table-responsive-sm">
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : records.length === 0 ? (
                  <p className="text-center">Henüz basınç kaydı bulunmamaktadır.</p>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Basınç (Bar)</th>
                        <th>Kilometre</th>
                        <th>Tarih</th>
                        <th>Not</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={record.id}>
                          <td>{index + 1}</td>
                          <td>
                            <span className={record.basinc_value < 7 ? 'text-danger font-weight-bold' : record.basinc_value > 9 ? 'text-warning font-weight-bold' : ''}>
                              {record.basinc_value} Bar
                            </span>
                          </td>
                          <td>{record.basinc_km.toLocaleString()} km</td>
                          <td>{record.basinc_tarih}</td>
                          <td>{record.basinc_not || '-'}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(record.id)}
                            >
                              Sil
                            </button>
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

      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Geri Dön
          </button>
        </div>
      </div>
    </>
  );
};

export default BasincBilgiPage;
