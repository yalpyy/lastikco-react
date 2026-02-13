# Lastik Yönetim Sistemi - Düzeltme Yol Haritası

**Son Güncelleme:** 2026-02-13
**Branch:** claude/migrate-php-pages-react-FEmxv

---

## Aşama 1: Navbar ve Menü Düzeltmeleri
**Öncelik:** P0 - Kritik

### Yapılacaklar:
- [ ] Navbar menü yapısını düzelt
- [ ] Eksik sayfa linklerini ekle:
  - Lastik Servis (`/lastik-servis`)
  - Lastik Havuzu (`/lastik-havuz`)
  - Yeni Akü (`/yeni-aku`)
  - Akü Hurda (`/aku-hurda`) - Sayfa oluşturulmalı
  - Bölge Yönetimi (`/bolge-ekle`)
  - Toplam Araç (`/toplam-arac`)
  - Toplam Lastik (`/toplam-lastik`)
  - Alert (`/alert`)
- [ ] Dropdown menüleri düzenle
- [ ] Mobil menü iyileştirmesi

### Dosyalar:
- `src/components/Navbar.tsx`

---

## Aşama 2: Tablo Tasarım Standardizasyonu
**Öncelik:** P0 - Kritik

### Yapılacaklar:
- [ ] Tüm tablolara koyu header (#0B5394) ekle
- [ ] Header yazılarını beyaz yap
- [ ] Zebra striping (even:bg-slate-50)
- [ ] rounded-xl wrapper
- [ ] Pagination bileşeni entegrasyonu
- [ ] Arama fonksiyonu standardizasyonu

### Dosyalar:
- `src/components/GenericTable.tsx` (referans)
- `src/pages/CarEditPage.tsx`
- `src/pages/AkuEditPage.tsx`
- Diğer tablo kullanan sayfalar

### Tablo CSS:
```css
.table-header {
  background-color: #0B5394;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.table-row:nth-child(even) {
  background-color: #f8fafc;
}
```

---

## Aşama 3: CRUD İşlemleri Düzeltme
**Öncelik:** P0 - Kritik

### 3.1 CarEditPage.tsx ✅ TAMAMLANDI
- [x] getCarWithAxles() ile araç verisi çek
- [x] listTiresByCar() ile lastikleri çek
- [x] createTireWithDetails() ile yeni lastik ekle
- [x] updateTireDetails() ile lastik güncelle
- [x] deleteTire() ile lastik sil
- [x] removeTireFromCar() ile araçtan çıkar
- [x] deleteCar() ile araç sil

### 3.2 AkuEditPage.tsx ✅ TAMAMLANDI
- [x] Akü servisini kontrol et
- [x] CRUD işlemlerini entegre et (createAku, updateAku, deleteAku, sendAkuToDepot)

### 3.3 DepodanLastikGetirPage.tsx ✅ TAMAMLANDI
- [x] Depo lastiklerini listele (listDepotTires)
- [x] assignTireToCar() ile lastiği araca ata
- [x] Aks ve pozisyon seçimi modal

### 3.4 DepodanAkuGetirPage.tsx ✅ TAMAMLANDI
- [x] Depo akülerini listele (listDepotAkus)
- [x] Akü ataması yap (assignAkuToCar)

### Dosyalar:
- `src/pages/CarEditPage.tsx`
- `src/pages/AkuEditPage.tsx`
- `src/pages/DepodanLastikGetirPage.tsx`
- `src/pages/DepodanAkuGetirPage.tsx`
- `src/services/vehicleService.ts`
- `src/services/tireService.ts`
- `src/services/akuService.ts`

---

## Aşama 4: AxleVisual Düzeltme
**Öncelik:** P1 - Yüksek

### Yapılacaklar:
- [ ] Pozisyon koordinatlarını düzelt (aks resmine göre)
- [ ] Lastik görseli ekle (daire yerine lastik şekli)
- [ ] Input seçme alanlarını lastik görünümlü yap
- [ ] Hover efektleri
- [ ] Tooltip bilgileri
- [ ] Boş pozisyonları belirginleştir

### Pozisyon Düzeltmeleri:
```typescript
// 3 Aks için örnek:
const POSITION_MAPS = {
  3: {
    '1-Sol Ön': { top: '20%', left: '15%' },
    '1-Sağ Ön': { top: '20%', left: '85%' },
    '2-Sol Dış': { top: '55%', left: '5%' },
    '2-Sol İç': { top: '55%', left: '22%' },
    '2-Sağ İç': { top: '55%', left: '78%' },
    '2-Sağ Dış': { top: '55%', left: '95%' },
    // ...
  }
}
```

### Dosyalar:
- `src/components/AxleVisual.tsx`

---

## Aşama 5: Sayfa Layout Düzeltmeleri
**Öncelik:** P1 - Yüksek

### Yapılacaklar:
- [ ] CarEditPage layout düzeltmesi (Bootstrap -> Tailwind)
- [ ] AkuEditPage layout düzeltmesi
- [ ] Tüm sayfalarda tutarlı header yapısı
- [ ] Form kartları standardizasyonu
- [ ] Buton stilleri standardizasyonu

### Standart Sayfa Yapısı:
```tsx
<div className="space-y-6">
  {/* Header */}
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Sayfa Başlığı</h1>
    <p className="text-sm text-gray-500 mt-1">Açıklama</p>
  </div>

  {/* Content Card */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="bg-[#0B5394] px-6 py-4">
      <h2 className="text-lg font-semibold text-white">Kart Başlığı</h2>
    </div>
    <div className="p-6">
      {/* İçerik */}
    </div>
  </div>
</div>
```

---

## Aşama 6: Form ve Buton Stilleri
**Öncelik:** P2 - Orta

### Yapılacaklar:
- [ ] Kaydet butonu: `bg-[#0B5394] hover:bg-[#094A84] text-white`
- [ ] İptal butonu: `bg-slate-200 hover:bg-slate-300 text-gray-700`
- [ ] Silme butonu: `bg-red-600 hover:bg-red-700 text-white`
- [ ] Input focus ring: `focus:ring-2 focus:ring-[#0B5394]/20 focus:border-[#0B5394]`
- [ ] Validasyon hataları standardizasyonu

### Dosyalar:
- Tüm form sayfaları

---

## Aşama 7: Diğer Sayfa Entegrasyonları
**Öncelik:** P2 - Orta

### Yapılacaklar:
- [ ] DisDerinligiPage - addTireDepth entegrasyonu
- [ ] KmBilgiPage - addTireKm entegrasyonu
- [ ] BasincBilgiPage - basınç kaydı ekleme
- [ ] LastikGecmisiPage - getTireHistory entegrasyonu
- [ ] AracGecmisiPage - getCarHistory entegrasyonu

---

## Aşama 8: Eksik Sayfalar
**Öncelik:** P3 - Düşük

### Yapılacaklar:
- [ ] AkuHurdaPage oluştur
- [ ] AkuEklePage oluştur (/yeni-aku -> /aku-ekle olarak değiştir)
- [ ] Raporlama sayfaları

---

## Test Listesi

Her aşama sonrası test edilecekler:

1. **Navbar Testleri:**
   - [ ] Tüm linkler çalışıyor mu?
   - [ ] Dropdown menüler açılıyor mu?
   - [ ] Mobil menü çalışıyor mu?

2. **CRUD Testleri:**
   - [ ] Araç ekleme
   - [ ] Araç güncelleme
   - [ ] Araç silme
   - [ ] Lastik ekleme
   - [ ] Lastik güncelleme
   - [ ] Lastik araçtan çıkarma
   - [ ] Lastik silme
   - [ ] Akü işlemleri

3. **Görsel Testler:**
   - [ ] Tablo header renkleri
   - [ ] Zebra striping
   - [ ] Buton renkleri
   - [ ] AxleVisual pozisyonları

---

## Notlar

- Her aşama sonrası commit yapılacak
- Değişiklikler test edildikten sonra push edilecek
- ANALIZ.md dosyası güncellenecek

---

## İlerleme Durumu

| Aşama | Durum | Tarih |
|-------|-------|-------|
| Aşama 1: Navbar | ✅ Tamamlandı | 2026-02-12 |
| Aşama 2: Tablo | ✅ Tamamlandı | 2026-02-12 |
| Aşama 3: CRUD | ✅ Tamamlandı (CarEditPage, AkuEditPage, DepodanLastikGetirPage, DepodanAkuGetirPage) | 2026-02-13 |
| Aşama 4: AxleVisual | ✅ Tamamlandı | 2026-02-12 |
| Aşama 5: Layout | ✅ Tamamlandı (CarEditPage, AkuEditPage) | 2026-02-13 |
| Aşama 6: Form/Buton | ✅ Tamamlandı | 2026-02-12 |
| Aşama 7: Entegrasyonlar | ✅ Tamamlandı (DisDerinligiPage, KmBilgiPage, BasincBilgiPage) | 2026-02-13 |
| Aşama 8: Eksik Sayfalar | ⏳ Bekliyor | - |
