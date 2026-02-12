import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Region {
  id: number;
  bolge_adi: string;
}

const AracBolgePage = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [carName, setCarName] = useState('');
  const [currentRegion, setCurrentRegion] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase'den araç ve bölge verilerini çek
    setTimeout(() => {
      setCarName('34 ABC 123');
      setCurrentRegion('Marmara');
      setRegions([
        { id: 1, bolge_adi: 'Marmara' },
        { id: 2, bolge_adi: 'Ege' },
        { id: 3, bolge_adi: 'Akdeniz' },
        { id: 4, bolge_adi: 'İç Anadolu' },
        { id: 5, bolge_adi: 'Karadeniz' },
        { id: 6, bolge_adi: 'Doğu Anadolu' },
        { id: 7, bolge_adi: 'Güneydoğu Anadolu' },
      ]);
      setLoading(false);
    }, 500);
  }, [carId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRegion) return;
    // TODO: Supabase'de araç bölgesini güncelle ve log kaydet
    toast.success('Bölge başarıyla güncellendi!');
    navigate(-1);
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title">
            <h2>Bölge Değiştir - {carName}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="white_shd full margin_bottom_30">
            <div className="full graph_head">
              <div className="heading1 margin_0">
                <h2>Bölge Ataması</h2>
              </div>
            </div>
            <div className="padding_infor_info">
              <p><strong>Mevcut Bölge:</strong> {currentRegion || 'Atanmamış'}</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Yeni Bölge:</label>
                  <select className="form-control" value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)} required>
                    <option value="">Bölge Seçiniz</option>
                    {regions.map(r => (
                      <option key={r.id} value={r.bolge_adi}>{r.bolge_adi}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-success">Güncelle</button>{' '}
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Geri Dön</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AracBolgePage;
