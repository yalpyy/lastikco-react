# PHP -> React Migrasyon Kontrol Listesi

Bu dosya, `lastikco-second` (PHP) projesindeki dosyaların `lastikco-react` (React/TypeScript) projesine taşınma durumunu takip eder.

## Durum Sembolleri
- [x] = Tamamlandı (React karşılığı mevcut)
- [ ] = Henüz yapılmadı / Backend entegrasyonu bekleniyor
- N/A = Taşınması gerekmiyor (backend-only script, Mail kütüphanesi vb.)

---

## UI Sayfaları (PHP -> React)

### Daha Önce Mevcut Olan Sayfalar
| PHP Dosyası | React Karşılığı | Route | Durum |
|---|---|---|---|
| `index.php` | `HomePage.tsx` | `/` | [x] Tamamlandı |
| `addcar.php` / `newcar.php` | `AracEklePage.tsx` | `/arac-ekle` | [x] Tamamlandı |
| `toplam_arac.php` | `TotalCarsPage.tsx` | `/toplam-arac` | [x] Tamamlandı |
| `toplam_lastik.php` | `TotalTiresPage.tsx` | `/toplam-lastik` | [x] Tamamlandı |
| `pasifcar.php` | `AracPasifPage.tsx` | `/arac-pasif` | [x] Tamamlandı |
| `depodaki_lastikler.php` | `LastikDepoPage.tsx` | `/lastik-depo` | [x] Tamamlandı |
| `hurda_lastikler.php` | `LastikHurdaPage.tsx` | `/lastik-hurda` | [x] Tamamlandı |
| `servis_lastik.php` | `LastikServisPage.tsx` | `/lastik-servis` | [x] Tamamlandı |
| `depoaku.php` | `AkuDepoPage.tsx` | `/aku-depo` | [x] Tamamlandı |
| `newregion.php` | `BolgeEklePage.tsx` | `/bolge-ekle` | [x] Tamamlandı |
| `lastikbilgi.php` | `LastikBilgiPage.tsx` | `/lastik-bilgi` | [x] Tamamlandı |
| `newtire.php` | `LastikSifirPage.tsx` | `/lastik-sifir` | [x] Tamamlandı |
| `alert.php` | `AlertPage.tsx` | `/alert` | [x] Tamamlandı |
| `login/login.php` | `LoginPage.tsx` | `/giris` | [x] Tamamlandı |

### Yeni Eklenen Sayfalar (Bu Sprint)
| PHP Dosyası | React Karşılığı | Route | Durum |
|---|---|---|---|
| `caredit.php` | `CarEditPage.tsx` | `/arac-duzenle/:carId` | [x] Sayfa oluşturuldu |
| `caredit2.php` | `CarEditPage.tsx` (dinamik aks) | `/arac-duzenle/:carId` | [x] Birleştirildi |
| `caredit3.php` | `CarEditPage.tsx` (dinamik aks) | `/arac-duzenle/:carId` | [x] Birleştirildi |
| `akuedit.php` | `AkuEditPage.tsx` | `/aku-duzenle/:carId` | [x] Sayfa oluşturuldu |
| `arac_gecmisi.php` | `AracGecmisiPage.tsx` | `/arac-gecmisi/:carId` | [x] Sayfa oluşturuldu |
| `aracbolge.php` | `AracBolgePage.tsx` | `/arac-bolge/:carId` | [x] Sayfa oluşturuldu |
| `depodan_aku_getir.php` | `DepodanAkuGetirPage.tsx` | `/depodan-aku-getir/:carId` | [x] Sayfa oluşturuldu |
| `depodan_lastik_getir.php` | `DepodanLastikGetirPage.tsx` | `/depodan-lastik-getir/:carId` | [x] Sayfa oluşturuldu |
| `detay_sayfa.php` | `DetaySayfaPage.tsx` | `/detay-sayfa/:tireId` | [x] Sayfa oluşturuldu |
| `dis_derinligi.php` | `DisDerinligiPage.tsx` | `/dis-derinligi/:tireId` | [x] Sayfa oluşturuldu |
| `km_bilgi.php` | `KmBilgiPage.tsx` | `/km-bilgi/:tireId` | [x] Sayfa oluşturuldu |
| `newaku.php` | `YeniAkuPage.tsx` | `/yeni-aku` | [x] Sayfa oluşturuldu |
| `tire_gecmis.php` | `LastikGecmisiPage.tsx` | `/lastik-gecmisi/:tireId` | [x] Sayfa oluşturuldu |
| `yeni_sayfa.php` | `LastikHavuzPage.tsx` | `/lastik-havuz` | [x] Sayfa oluşturuldu |

---

## Backend İşlem Dosyaları (PHP -> Supabase Service)
Bu dosyalar doğrudan UI sayfası değil, AJAX/form işlemcileridir. React sayfalarındaki TODO yorumları ile Supabase entegrasyonuna hazırdır.

| PHP Dosyası | Açıklama | Karşılık Gelen React Sayfa | Durum |
|---|---|---|---|
| `deletecar.php` | Araç silme | `CarEditPage.tsx` (sil butonu) | [ ] Supabase entegrasyonu bekleniyor |
| `update_aku_to_car.php` | Akü araca atama | `DepodanAkuGetirPage.tsx` | [ ] Supabase entegrasyonu bekleniyor |
| `update_tire_to_car.php` | Lastik araca atama | `DepodanLastikGetirPage.tsx` | [ ] Supabase entegrasyonu bekleniyor |
| `update_tire_details.php` | Lastik detay güncelleme | `CarEditPage.tsx` (düzenle) | [ ] Supabase entegrasyonu bekleniyor |
| `get_tire_details.php` | Lastik detay API | `CarEditPage.tsx` | [ ] Supabase entegrasyonu bekleniyor |
| `ekle.php` | Diş derinliği ekleme | `DisDerinligiPage.tsx` | [ ] Supabase entegrasyonu bekleniyor |
| `add_depth.php` | Diş derinliği ekleme | `DisDerinligiPage.tsx` | [ ] Supabase entegrasyonu bekleniyor |
| `all_process.php` | Genel CRUD işlemleri | `vehicleService.ts` | [ ] Supabase entegrasyonu bekleniyor |
| `lastik_çıkart.php` | Lastik çıkarma | `CarEditPage.tsx` (çıkart butonu) | [ ] Dosya bulunamadı, UI hazır |

---

## Taşınması Gerekmeyen Dosyalar
| PHP Dosyası | Sebep |
|---|---|
| `Taslak.php` | Boş taslak sayfa, içerik yok |
| `başınc_bilgi.php` | Dosya bulunamadı (referans var ama dosya eksik) |
| `database/db_conn.php` | Supabase client ile değiştirildi (`supabaseClient.ts`) |
| `menu/navbar.php` | React `SidebarMenu.tsx` + `TopNavbar.tsx` ile değiştirildi |
| `login/login_process.php` | Supabase Auth ile değiştirildi (`authService.ts`) |
| `login/logout.php` | Supabase Auth ile değiştirildi |
| `login/userlogin.php` | Supabase Auth ile değiştirildi |
| `Mail/*.php` (7 dosya) | PHPMailer kütüphanesi, React'ta gerekli değil |

---

## Entegrasyon Durumu

### Routing (App.tsx)
- [x] Tüm yeni sayfalar için route tanımları eklendi
- [x] ProtectedRoute ile sarmalandı
- [x] Dinamik parametreler (`:carId`, `:tireId`) doğru tanımlandı

### Sidebar Menü (SidebarMenu.tsx)
- [x] Lastik Havuzu menü linki eklendi
- [x] Yeni Akü Ekle menü linki eklendi
- [x] Diğer sayfalar (araç düzenle, akü düzenle, geçmiş vb.) sayfalar arası navigasyon ile erişiliyor

### Sayfa İçi Navigasyon
- [x] `CarEditPage` -> Akü Yönetimi, Araç Geçmişi, Bölge Değiştir, Diş Derinliği, KM Bilgi, Depodan Lastik Getir
- [x] `AkuEditPage` -> Depodan Akü Getir
- [x] `DisDerinligiPage` -> Detay Sayfa
- [x] `AracAktifPage` -> Lastik, Akü, Bölge, Pasif Yap, Sil butonları
- [x] `AracPasifPage` -> Aktifleştir, Düzenle, Sil butonları
- [x] `AkuDepoPage` -> Araçta Görüntüle, Depoya Gönder, Sil butonları
- [x] `AracGecmisiPage` -> Geri Dön butonu
- [x] `LastikGecmisiPage` -> Geri Dön butonu
- [x] `YeniAkuPage` -> Fatura tarihi alanı eklendi

### Yapılan Düzeltmeler (Son Güncelleme)
- [x] `AracAktifPage`: Lastik/Akü/Bölge/Pasif Yap/Sil butonları çalışır hale getirildi
- [x] `AracPasifPage`: Aktifleştir/Düzenle/Sil butonları eklendi ve bağlandı
- [x] `AkuDepoPage`: Araçta Görüntüle/Depoya Gönder/Sil butonları eklendi
- [x] `CarEditPage`: Akü Yönetimi butonu eklendi
- [x] `AracGecmisiPage`: Geri Dön butonu eklendi
- [x] `LastikGecmisiPage`: Geri Dön butonu eklendi
- [x] `YeniAkuPage`: Fatura tarihi form alanı eklendi
- [x] Tüm tablolara boş veri durumu (empty state) mesajları eklendi

---

## Supabase Migration Durumu

### Mevcut Tablolar (0001_init.sql)
- [x] `cars` - Araç ana tablosu
- [x] `axles` - Aks bilgisi
- [x] `tires` - Lastik kayıtları
- [x] `tire_details` - Lastik detay bilgileri
- [x] `app_users` - Uygulama kullanıcıları
- [x] `car_axle_summary` VIEW

### Yeni Eklenen Tablolar (0003_add_missing_tables.sql)
- [x] `bolge` - Bölge/lokasyon tanımları (aracbolge.php, newregion.php)
- [x] `aku` - Akü envanter tablosu (akuedit.php, newaku.php, depodan_aku_getir.php)
- [x] `dis_derinligi` - Diş derinliği ölçüm geçmişi (dis_derinligi.php, detay_sayfa.php)
- [x] `km_bilgi` - Kilometre ölçüm geçmişi (km_bilgi.php)
- [x] `logs` - İşlem geçmişi / audit log (arac_gecmisi.php, tire_gecmis.php)
- [x] `lastik_havuz` - Lastik havuzu/bekleme deposu (yeni_sayfa.php)
- [x] `lastik_info` - Lastik marka/desen/ölçü referans kataloğu (lastikbilgi.php)

### Mevcut Tablo Güncellemeleri (0003_add_missing_tables.sql)
- [x] `cars` tablosuna `bolge_id` ve `status` alanları eklendi
- [x] `tires.car_id` nullable yapıldı (depodaki lastikler için)
- [x] `tires` FK cascade -> set null olarak değiştirildi
- [x] `tire_details` tablosuna `tire_firma` ve `tire_resim` alanları eklendi
- [x] `car_axle_summary` VIEW güncellendi (status, bolge_id, bolge_adi dahil)

### RLS & Policy
- [x] Tüm yeni tablolara RLS aktif edildi
- [x] Authenticated kullanıcılar için CRUD policy'leri oluşturuldu

### Seed Data
- [x] 7 bölge kaydı eklendi (Marmara, Ege, Akdeniz, vb.)

---

## Sonraki Adımlar (TODO)
1. [ ] Tüm sayfalarda mock data yerine Supabase sorguları bağlanacak
2. [x] ~~Supabase'de gerekli tablolar oluşturulacak~~ (`0003_add_missing_tables.sql` ile tamamlandı)
3. [x] ~~`AracAktifPage` ve `AracPasifPage`'den araç düzenleme sayfalarına link eklenecek~~
4. [ ] Lastik çıkarma (lastik_çıkart) işlemi için Supabase service fonksiyonu yazılacak
5. [ ] Form validasyonları güçlendirilecek
6. [ ] Hata yönetimi (error handling) eklenecek
7. [ ] DataTables benzeri tablo sıralama/filtreleme özelliği eklenecek
8. [ ] Chart.js veya benzeri kütüphane ile grafik görselleştirme iyileştirilecek (DisDerinligiPage, KmBilgiPage, DetaySayfaPage'de CSS bar chart mevcut)
9. [ ] Export (Excel/PDF) özelliği eklenecek
10. [ ] Lastik resim yükleme (base64) desteği eklenecek

---

## Özet

| Kategori | Toplam | Tamamlanan | Kalan |
|---|---|---|---|
| UI Sayfaları (önceki) | 14 | 14 | 0 |
| UI Sayfaları (yeni) | 12 | 12 | 0 |
| Backend Entegrasyon | 9 | 0 | 9 |
| Taşınmayacak | 12 | N/A | N/A |
| **Toplam PHP Dosya** | **52** | **26 (UI)** | **9 (backend)** |

**Not:** caredit.php, caredit2.php ve caredit3.php tek bir dinamik `CarEditPage.tsx` bileşeninde birleştirildi. Aks sayısına göre otomatik olarak doğru layout gösteriliyor.
