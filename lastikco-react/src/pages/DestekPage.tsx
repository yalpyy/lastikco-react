import { useState, type FormEvent } from 'react';

const DestekPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);

    try {
      // TODO: Supabase veya email servisi ile destek talebi gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage({ type: 'success', text: 'Destek talebiniz başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır.' });
      setFormData({ subject: '', message: '', email: '' });
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Destek talebi gönderilirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Destek ve Yardım</h2>
          </div>
        </div>
      </div>

      <div className="midde_cont" style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-md-8">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <div className="heading1 margin_0">
                  <h2>Destek Talebi Oluştur</h2>
                </div>
              </div>
              <div className="padding_infor_info">
                {submitMessage && (
                  <div className={`alert alert-${submitMessage.type === 'success' ? 'success' : 'danger'}`}>
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">E-posta Adresiniz:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <label htmlFor="subject">Konu:</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="Konu başlığı"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <label htmlFor="message">Mesajınız:</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows={6}
                      placeholder="Destek talebinizi detaylı bir şekilde açıklayın..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head">
                <div className="heading1 margin_0">
                  <h2>İletişim Bilgileri</h2>
                </div>
              </div>
              <div className="padding_infor_info">
                <p><strong>E-posta:</strong><br />destek@lastikco.com</p>
                <p><strong>Telefon:</strong><br />+90 (212) 555 0 123</p>
                <p><strong>Çalışma Saatleri:</strong><br />Pazartesi - Cuma<br />09:00 - 18:00</p>
                <hr />
                <p><strong>Sık Sorulan Sorular:</strong></p>
                <ul>
                  <li>Lastik nasıl eklenir?</li>
                  <li>Araç nasıl pasife alınır?</li>
                  <li>Raporlar nasıl indirilir?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestekPage;
