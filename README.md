# Lastik.co React + Supabase (Vite + TypeScript)

PHP + MySQL tabanlı Lastik.co uygulamasının modernleştirilmiş React (Vite + TS) ön yüzü ve Supabase (Postgres) veritabanı şeması. Mevcut `lastikco-main` klasörüne dokunulmadı; yeni çıktı `lastikco-react/` ve `supabase/` dizinlerine üretildi.

## Kurulum (Frontend)
1) Bağımlılıkları kurun:
```bash
cd lastikco-react
npm install
```
2) Geliştirme sunucusunu çalıştırın:
```bash
npm run dev
```

## Supabase Kurulumu
1) Supabase projesi oluşturun.
2) Proje ayarlarından `Project URL` ve `anon public` anahtarını alın.
3) `lastikco-react` kökünde `.env` oluşturun:
```bash
VITE_SUPABASE_URL=https://<proje-id>.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```
4) Şemayı yükleyin (Supabase SQL Editor veya CLI):
```bash
supabase db push --file ../supabase/migrations/0001_init.sql
# veya SQL Editor içine dosya içeriğini yapıştırın
```

## Neler Dönüştürüldü
- PHP sayfaları React Router rotalarına ayrıldı.
- MySQL sorguları Supabase `@supabase/supabase-js` çağrılarına taşındı.
- Oturum açma Supabase Auth (email/şifre) ile çalışacak şekilde yeniden kurgulandı.
- Araç/aks/lastik CRUD akışları için hizmet katmanı ve formlar eklendi.

## PHP -> React Eşleme
| PHP Sayfası            | React Route / Bileşen                   |
|------------------------|-----------------------------------------|
| `login.php`            | `/giris` (`LoginPage`)                  |
| `userlogin.php`        | `ProtectedRoute` + Zustand oturum durumu|
| `index.php` (arama)    | `/` (`DashboardPage`)                   |
| `aracekle.php`, `aractakip.php` | `/araclar/ekle` (`VehicleCreatePage`) |
| `aracsec.php`          | `/araclar/sec` (`VehicleSelectPage`)    |
| `lastik_ekle.php`      | `/araclar/:carId/lastik-ekle` (`TireCreatePage`) |
| `add_tire.php`         | `createTireWithDetails` servis çağrıları|
| `navbar.php`           | `Navbar` bileşeni                       |
| `logout.php`           | `signOut` + yönlendirme                 |
| `reset_password_email.php` | Supabase Auth şifre sıfırlama (TODO) |

## Tablolar (Postgres)
- `cars`: araç bilgisi (`created_by`, `created_at/updated_at`).
- `axles`: araç başına aks sayısı (1-1 ilişki, `unique car_id`).
- `tires`: araç + aks bazlı lastik kaydı.
- `tire_details`: lastik özellikleri ve ölçüm bilgileri.
- `app_users`: Supabase Auth kullanıcılarına profil alanı (parola burada tutulmaz).
- `car_axle_summary` view: araç + aks sayısı özetini sağlar.

## Eksikler / TODO
- Supabase Auth şifre sıfırlama akışı için UI (mevcut PHP e-posta gönderimi yerine).
- Rol bazlı yetkilendirme/policy tanımları üretimde daraltılmalı (demo için geniş RLS yazıldı).
- Form doğrulamalarını daha da sıkılaştırma (enum, maskeler, schema validation).
- Test kullanıcısı için Supabase Auth üzerinde gerçek kullanıcı oluşturulmalı (migration sadece `app_users` kaydı açar).

## Kullanım Notları
- Tüm kullanıcıya görünen metinler Türkçedir.
- Supabase URL/anon anahtarını frontend dışında paylaşmayın.
- SQL dosyasında dump olmadığı için bazı kolon tipleri tahmini olarak seçildi; gerekirse Supabase üzerinde güncellenebilir.
