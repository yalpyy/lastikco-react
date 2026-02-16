import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './routes/LoginPage';
import NotFoundPage from './routes/NotFoundPage';
import HomePage from './pages/HomePage';
import AracEklePage from './pages/AracEklePage';
import AracAktifPage from './pages/AracAktifPage';
import AracPasifPage from './pages/AracPasifPage';
import LastikSifirPage from './pages/LastikSifirPage';
import LastikDepoPage from './pages/LastikDepoPage';
import LastikServisPage from './pages/LastikServisPage';
import LastikHurdaPage from './pages/LastikHurdaPage';
import AkuDepoPage from './pages/AkuDepoPage';
import BolgeEklePage from './pages/BolgeEklePage';
import LastikBilgiPage from './pages/LastikBilgiPage';
import DestekPage from './pages/DestekPage';
import TotalCarsPage from './pages/TotalCarsPage';
import TotalTiresPage from './pages/TotalTiresPage';
import AlertPage from './pages/AlertPage';
import CarEditPage from './pages/CarEditPage';
import AkuEditPage from './pages/AkuEditPage';
import AracGecmisiPage from './pages/AracGecmisiPage';
import AracBolgePage from './pages/AracBolgePage';
import DepodanAkuGetirPage from './pages/DepodanAkuGetirPage';
import DepodanLastikGetirPage from './pages/DepodanLastikGetirPage';
import DetaySayfaPage from './pages/DetaySayfaPage';
import DisDerinligiPage from './pages/DisDerinligiPage';
import KmBilgiPage from './pages/KmBilgiPage';
import YeniAkuPage from './pages/YeniAkuPage';
import LastikGecmisiPage from './pages/LastikGecmisiPage';
import LastikHavuzPage from './pages/LastikHavuzPage';
import BasincBilgiPage from './pages/BasincBilgiPage';
import SabitlerPage from './pages/SabitlerPage';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { useAuthStore } from './store/auth';

const App = () => {
  const { setSession, setLoading } = useAuthStore();

  useEffect(() => {
    // Skip Supabase auth check if not configured
    if (!isSupabaseConfigured) {
      console.warn('Supabase yapılandırılmadı - giriş sayfasına yönlendiriliyor');
      setLoading(false);
      return;
    }

    const syncSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Oturum alınamadı:', error);
        }
        setSession(data.session ?? null);
      } catch (err) {
        console.error('Supabase bağlantı hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    void syncSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setLoading, setSession]);

  return (
    <Routes>
      {/* Login sayfası layout dışında - sidebar/navbar görünmez */}
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/cikis" element={<Navigate to="/giris" />} />

      {/* Authenticated layout - sidebar + navbar ile */}
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-ekle"
          element={
            <ProtectedRoute>
              <AracEklePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-aktif"
          element={
            <ProtectedRoute>
              <AracAktifPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-pasif"
          element={
            <ProtectedRoute>
              <AracPasifPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-sifir"
          element={
            <ProtectedRoute>
              <LastikSifirPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-depo"
          element={
            <ProtectedRoute>
              <LastikDepoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-servis"
          element={
            <ProtectedRoute>
              <LastikServisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-hurda"
          element={
            <ProtectedRoute>
              <LastikHurdaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aku-depo"
          element={
            <ProtectedRoute>
              <AkuDepoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bolge-ekle"
          element={
            <ProtectedRoute>
              <BolgeEklePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-bilgi"
          element={
            <ProtectedRoute>
              <LastikBilgiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/destek"
          element={
            <ProtectedRoute>
              <DestekPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/toplam-arac"
          element={
            <ProtectedRoute>
              <TotalCarsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/toplam-lastik"
          element={
            <ProtectedRoute>
              <TotalTiresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alert"
          element={
            <ProtectedRoute>
              <AlertPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-duzenle/:carId"
          element={
            <ProtectedRoute>
              <CarEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aku-duzenle/:carId"
          element={
            <ProtectedRoute>
              <AkuEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-gecmisi/:carId"
          element={
            <ProtectedRoute>
              <AracGecmisiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/arac-bolge/:carId"
          element={
            <ProtectedRoute>
              <AracBolgePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/depodan-aku-getir/:carId"
          element={
            <ProtectedRoute>
              <DepodanAkuGetirPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/depodan-lastik-getir/:carId"
          element={
            <ProtectedRoute>
              <DepodanLastikGetirPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detay-sayfa/:tireId"
          element={
            <ProtectedRoute>
              <DetaySayfaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dis-derinligi/:tireId"
          element={
            <ProtectedRoute>
              <DisDerinligiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/km-bilgi/:tireId"
          element={
            <ProtectedRoute>
              <KmBilgiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yeni-aku"
          element={
            <ProtectedRoute>
              <YeniAkuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-gecmisi/:tireId"
          element={
            <ProtectedRoute>
              <LastikGecmisiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastik-havuz"
          element={
            <ProtectedRoute>
              <LastikHavuzPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basinc-bilgi/:tireId"
          element={
            <ProtectedRoute>
              <BasincBilgiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sabitler"
          element={
            <ProtectedRoute>
              <SabitlerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
