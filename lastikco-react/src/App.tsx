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
import { supabase } from './lib/supabaseClient';
import { useAuthStore } from './store/auth';

const App = () => {
  const { setSession, setLoading } = useAuthStore();

  useEffect(() => {
    const syncSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
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
      <Route element={<MainLayout />}>
        <Route path="/giris" element={<LoginPage />} />

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

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/cikis" element={<Navigate to="/giris" />} />
      </Route>
    </Routes>
  );
};

export default App;
