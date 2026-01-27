PROJE GÖREVİ (TÜRKÇE)
Elimde “lastikco-second” klasörü içinde çalışan bir web projesi var. Daha önce başlattığımız React dönüşüm çalışmasını da dikkate alarak, bu klasördeki tüm dosyaları analiz et ve React (TypeScript + Vite) projemize taşı. Ama en kritik şart: UI/UX birebir aynı kalacak. Navbar, sol menü, anasayfa duruşu, menüler, sayfa layout’ları, sayfa içi görseller ve stiller aynı görünsün.

ÖNEMLİ KURALLAR
- lastikco-second içindeki dosyalara dokunma. Yeni çıktıyı React projesi altında üret.
- Kullanıcıya görünen tüm metinler Türkçe kalsın (zaten projede TR ise aynen).
- Görsel düzen (navbar/sol menü/content alanı) birebir aynı olsun.
- Projede solda duran menüye göre sayfaları route’la ve component yapısını buna göre kur.
- “menu” dosyasındaki navbar/menü yapısını kaynak kabul et: menü başlıkları, linkler, ikonlar, aktif sayfa stilleri, hover vb.
- lastikco-second/images klasöründeki tüm görselleri React projesine taşı (src/assets veya public/images) ve ilgili sayfalarda doğru yerde kullan.
- CSS’i “basitçe incele”: mevcut CSS/HTML düzenini bozmadan React bileşenlerine aktar. Tailwind CSS kullanabilirsin; ancak birebir görünüm için gerekiyorsa mevcut CSS’i de taşıyıp kullan.
- Önce ANALİZ RAPORU çıkar, sonra dönüşümü uygula.

HEDEF TEKNOLOJİ
- React + TypeScript + Vite
- React Router
- Tailwind CSS (tercihen) + gerekirse mevcut CSS dosyalarının taşınması
- Sayfa iskeleti: Sol sidebar menu + üstte navbar + sağda içerik alanı (orijinalde nasılsa)

✅ ADIM 1: DOSYA ANALİZİ (TAMAMLANDI - 2026-01-26)
lastikco-second içerisindeki her şeyi tara:
- Tüm .php/.html/.css/.js dosyaları ✅
- include/require edilen parçalar ✅
- menu/navbar dosyası (menu/navbar.php) ✅
- sayfa dosyaları (39 PHP dosyası analiz edildi) ✅
- images klasörü (43 görsel) ✅
Çıktı: "ANALIZ.md" ✅ OLUŞTURULDU
- Sayfa listesi ✅
- Menu yapısı ✅
- Layout yapısı ✅
- Ortak component parçaları ✅
- Görseller ve path eşlemesi ✅
- CSS dosyaları (30+ dosya) ✅

✅ ADIM 2: REACT'TE MİMARİ KUR (TAMAMLANDI - 2026-01-26)
React projemizde şu yapıyı oluştur:
- src/layouts/MainLayout.tsx ✅ MEVCUT VE DOĞRU
- src/components/SidebarMenu.tsx ✅ GÜNCELLENDİ (collapsible menü + username eklendi)
- src/components/TopNavbar.tsx ✅ GÜNCELLENDİ (dropdown + logout eklendi)
- src/pages/* (12 sayfa) ✅ MEVCUT
- public/images/* (lastikco-second/images) ✅ TAŞINMIŞ
- public/style.css (ana CSS) ✅ TAŞINMIŞ

ROUTING ✅
- React Router rotaları App.tsx'de mevcut ✅
- Varsayılan route: HomePage (/) ✅
- Aktif menü item highlight: NavLink className ✅

🔄 ADIM 3: UI BİREBİR DÖNÜŞÜM (DEVAM EDİYOR - 2026-01-26)
Her sayfayı React'a geçirirken:
- HTML yapıyı bozmadan JSX'e taşı ✅
- Inline scriptleri/component mantığına çevir ✅
- Eğer PHP içinde sadece view/HTML varsa direkt component ✅
- Eğer PHP içinde form submit / veri çekme / backend işlemi varsa:
  - Şimdilik UI'yı birebir oluştur ✅
  - Veri tarafına TODO bırak ve sahte data (mock) ile ekranı doldur ✅
- Tüm butonlar, tablolar, kartlar, ikonlar, spacing ve hizalar aynı kalsın. ✅

✅ TAMAMLANAN SAYFALAR (2026-01-26):

**Dashboard Sayfaları:**
1. HomePage (index.php) ✅
   - 6 dashboard kartı eklendi (Toplam Araç, Toplam Lastik, Alert, Hasarlı Lastik, Toplam Akü, Depodaki Lastik)
   - Mock dashboardService.ts oluşturuldu
   - Tıklanabilir kartlar ile route yönlendirmeleri çalışıyor
   - Loading state eklendi
2. TotalCarsPage ✅ Full implementation (tüm araçlar tablosu)
3. TotalTiresPage ✅ Full implementation (tüm lastikler tablosu)
4. AlertPage ✅ Full implementation (uyarı lastikler tablosu)

**Araç İşlemleri Sayfaları:**
5. AracEklePage (newcar.php) ✅ Form + validation + success message
6. AracAktifPage (addcar.php) ✅ Table + mock data + action buttons
7. AracPasifPage (pasifcar.php) ✅ Table + mock data + activate button

**Lastik İşlemleri Sayfaları:**
8. LastikSifirPage (newtire.php) ✅ Form + all tire fields + depot option
9. LastikDepoPage (depodaki_lastikler.php) ✅ Table + mock data + actions
10. LastikServisPage (servis_lastik.php) ✅ Table + service status
11. LastikHurdaPage (hurda_lastikler.php) ✅ Table + scrap info
12. LastikBilgiPage (lastikbilgi.php) ✅ Query form + detail display

**Akü İşlemleri:**
13. AkuDepoPage (depoaku.php) ✅ Form + table combined

**Diğer Sayfalar:**
14. BolgeEklePage (newregion.php) ✅ Form with region name + description
15. DestekPage (destek.php) ✅ Support form + contact info sidebar

**Route Konfigürasyonu:**
- App.tsx ✅ Tüm 15 sayfa için route tanımlamaları eklenmiş
- Protected routes ile authentication koruması ✅

CSS STRATEJİSİ
- Öncelik: birebir görünüm.
- Eğer tailwind ile hızlıca eşleştirilebiliyorsa: tailwind class’larına çevir.
- Eğer sayfa/menü CSS’i karmaşıksa: ilgili CSS dosyalarını olduğu gibi taşı:
  - src/styles/legacy.css gibi
  - App.tsx veya main.tsx içinde import et
- Fontlar, renkler, hover efektleri ve responsive davranış mümkün olduğunca aynı olsun.

IMAGES / ASSETS
- lastikco-second/images içindeki tüm dosyaları React projesine kopyala.
- HTML/CSS içindeki tüm “images/...” path’lerini React içinde doğru path’e çevir.
- Eksik görsel referansı kalmasın. Eğer referans bulunamazsa ANALIZ.md ve README’de listele.

ADIM 4: ÇIKTI DOSYALARI
Aşağıdakileri kesin üret:
1) ANALIZ.md (Türkçe, detaylı)
2) React proje dosya ağacı
3) Önemli dosyaların TAM içeriği:
   - package.json
   - vite.config.ts
   - tailwind.config.js (tailwind varsa)
   - src/main.tsx
   - src/App.tsx
   - src/layouts/MainLayout.tsx
   - src/components/SidebarMenu.tsx
   - src/components/TopNavbar.tsx
   - src/pages/* (tüm sayfalar)
   - src/styles/* (taşınan css dosyaları)
4) README.md (Türkçe):
   - Proje açıklaması
   - Kurulum: npm i, npm run dev, npm run build
   - UI eşleşmesi notu: “lastikco-second UI birebir taşındı”
   - Görsellerin konumu ve kullanım şekli
   - Bilinen eksikler / TODO (backend, veri işlemleri)

EK KRİTERLER
- Menü solda sabit kalacak (orijinaldeki gibi).
- Navbar / menü item sıralaması birebir aynı.
- Sayfa başlıkları, breadcrumb vb varsa aynen.
- Responsive davranış varsa korunmaya çalışılsın.
- Kod okunabilir olsun: component’lere böl, tekrar eden HTML parçalarını ortaklaştır.

TESLİM FORMAT
- Önce file tree göster
- Sonra dosya içeriklerini tam ver
- En sonda “Dönüşüm Notları” bölümünde:
  - Menü kalemi -> React route -> page component eşlemesi
  - Taşınan görseller listesi
  - Eksik kalan/veri tarafı TODO listesiKALİTE KONTROL
- React build alınca kırık image linki olmamalı.
- Menüde tıklanan her item doğru sayfaya gitmeli.
- CSS çakışması varsa not düş ve çözüm öner.
- Orijinaldeki görsel hizalar bozulmasın: padding/margin/width/height eşleşsin.