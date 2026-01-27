import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const YeniAkuPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aku_marka: '',
    aku_volt: '12V',
    aku_amper: '72Ah',
    aku_durum: 'İyi',
    aku_fatura_tarihi: '',
  });

  const markalar = ['Varta', 'İnci', 'Mutlu', 'Yiğit', 'Bosh', 'Exide', 'Banner', 'Diğer'];
  const voltlar = ['12V', '24V'];
  const amperler = ['7Ah', '9Ah', '12Ah', '45Ah', '50Ah', '55Ah', '60Ah', '63Ah', '66Ah', '70Ah', '72Ah', '74Ah'];
  const durumlar = ['İyi', 'Şarjda', 'Hurda'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase'e yeni akü ekle (car_id null - depoya)
    console.log('Yeni akü ekleniyor:', formData);
    alert('Akü başarıyla depoya eklendi!');
    navigate('/aku-depo');
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Yeni Akü Ekle</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Akü Bilgileri</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Marka:</label>
                      <select className="form-control" value={formData.aku_marka}
                        onChange={e => setFormData({ ...formData, aku_marka: e.target.value })} required>
                        <option value="">Marka Seçiniz</option>
                        {markalar.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Volt:</label>
                      <select className="form-control" value={formData.aku_volt}
                        onChange={e => setFormData({ ...formData, aku_volt: e.target.value })}>
                        {voltlar.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Amper:</label>
                      <select className="form-control" value={formData.aku_amper}
                        onChange={e => setFormData({ ...formData, aku_amper: e.target.value })}>
                        {amperler.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Durum:</label>
                      <select className="form-control" value={formData.aku_durum}
                        onChange={e => setFormData({ ...formData, aku_durum: e.target.value })}>
                        {durumlar.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Fatura Tarihi:</label>
                      <input type="date" className="form-control" value={formData.aku_fatura_tarihi}
                        onChange={e => setFormData({ ...formData, aku_fatura_tarihi: e.target.value })} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Depoya Ekle</button>{' '}
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/aku-depo')}>İptal</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YeniAkuPage;
