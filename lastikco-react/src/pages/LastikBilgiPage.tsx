import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

const LastikBilgiPage = () => {
  const [formData, setFormData] = useState({
    car_id: '',
    tire_position: '',
  });
  const [loading, setLoading] = useState(false);
  const [tireInfo, setTireInfo] = useState<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Supabase'den araç ve lastik bilgilerini çek
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTireInfo({
        car_name: '34 ABC 123',
        car_model: 'Volvo FH',
        tire_serino: 'DOT1234',
        tire_marka: 'Michelin',
        tire_desen: 'X Multi',
        tire_olcu: '315/80R22.5',
        tire_dis_derinlik: 12.5,
        tire_ic_derinlik: 12.2,
        tire_orta_derinlik: 12.3,
        tire_tarih: '2024-01-10',
        tire_fiyat: 2500.00,
      });
    } catch (error) {
      console.error('Lastik bilgisi alınamadı:', error);
      toast.error('Lastik bilgisi alınamadı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Lastik Bilgisi Sorgulama</h2>
          </div>
        </div>
      </div>

      <div className="midde_cont" style={{ marginTop: '20px' }}>
        <div className="white_shd full margin_bottom_30">
          <div className="full graph_head">
            <div className="heading1 margin_0">
              <h2>Araç ve Pozisyon Seçimi</h2>
            </div>
          </div>
          <div className="padding_infor_info">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="car_id">Araç Seçiniz:</label>
                    <select
                      className="form-control"
                      id="car_id"
                      name="car_id"
                      value={formData.car_id}
                      onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                      required
                    >
                      <option value="">Araç Seçiniz...</option>
                      <option value="1">34 ABC 123 - Volvo FH</option>
                      <option value="2">06 XYZ 789 - Mercedes Actros</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="tire_position">Lastik Pozisyonu:</label>
                    <select
                      className="form-control"
                      id="tire_position"
                      name="tire_position"
                      value={formData.tire_position}
                      onChange={(e) => setFormData({ ...formData, tire_position: e.target.value })}
                      required
                    >
                      <option value="">Pozisyon Seçiniz...</option>
                      <option value="on_sol_dis">Ön Sol Dış</option>
                      <option value="on_sol_ic">Ön Sol İç</option>
                      <option value="on_sag_dis">Ön Sağ Dış</option>
                      <option value="on_sag_ic">Ön Sağ İç</option>
                      <option value="arka_sol_dis">Arka Sol Dış</option>
                      <option value="arka_sol_ic">Arka Sol İç</option>
                      <option value="arka_sag_dis">Arka Sağ Dış</option>
                      <option value="arka_sag_ic">Arka Sağ İç</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sorgulanıyor...' : 'Bilgileri Getir'}
              </button>
            </form>
          </div>
        </div>

        {tireInfo && (
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Lastik Detay Bilgileri</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Araç Plakası:</strong> {tireInfo.car_name}</p>
                  <p><strong>Araç Modeli:</strong> {tireInfo.car_model}</p>
                  <p><strong>Seri No:</strong> {tireInfo.tire_serino}</p>
                  <p><strong>Marka:</strong> {tireInfo.tire_marka}</p>
                  <p><strong>Desen:</strong> {tireInfo.tire_desen}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Ölçü:</strong> {tireInfo.tire_olcu}</p>
                  <p><strong>Dış Derinlik:</strong> {tireInfo.tire_dis_derinlik} mm</p>
                  <p><strong>Orta Derinlik:</strong> {tireInfo.tire_orta_derinlik} mm</p>
                  <p><strong>İç Derinlik:</strong> {tireInfo.tire_ic_derinlik} mm</p>
                  <p><strong>Fiyat:</strong> {tireInfo.tire_fiyat.toFixed(2)} ₺</p>
                  <p><strong>Takılma Tarihi:</strong> {tireInfo.tire_tarih}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LastikBilgiPage;
