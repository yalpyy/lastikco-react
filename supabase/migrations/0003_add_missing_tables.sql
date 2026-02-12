-- Yeni React sayfalarına göre eksik tabloların eklenmesi
-- PHP kaynak dosyaları: aracbolge.php, akuedit.php, dis_derinligi.php, km_bilgi.php,
--   arac_gecmisi.php, tire_gecmis.php, yeni_sayfa.php, newaku.php, depodan_aku_getir.php,
--   depodan_lastik_getir.php, caredit.php, deletecar.php

-- ============================================================
-- 1. BÖLGE TABLOSU (aracbolge.php, newregion.php -> BolgeEklePage)
-- ============================================================
create table if not exists public.bolge (
    id bigserial primary key,
    bolge_adi varchar(150) not null unique,
    created_at timestamptz not null default now()
);

comment on table public.bolge is 'Araç bölge/lokasyon tanımları. PHP: bolge tablosu.';

-- ============================================================
-- 2. CARS TABLOSUNA YENİ ALANLAR
--    - bolge: Aracın bağlı olduğu bölge (aracbolge.php)
--    - status: Araç aktif/pasif durumu (pasifcar.php)
-- ============================================================
alter table public.cars
    add column if not exists bolge_id bigint references public.bolge(id) on delete set null,
    add column if not exists status varchar(20) not null default 'aktif';

comment on column public.cars.bolge_id is 'Aracın atandığı bölge. NULL = bölge atanmamış.';
comment on column public.cars.status is 'Araç durumu: aktif veya pasif.';

create index if not exists idx_cars_bolge on public.cars (bolge_id);
create index if not exists idx_cars_status on public.cars (status);

-- ============================================================
-- 3. AKÜ TABLOSU (akuedit.php, newaku.php, depodan_aku_getir.php)
-- ============================================================
create table if not exists public.aku (
    id bigserial primary key,
    car_id bigint references public.cars(id) on delete set null,
    aku_marka varchar(100) not null,
    aku_volt varchar(10) not null default '12V',
    aku_amper varchar(10) not null default '72Ah',
    aku_durum varchar(50) not null default 'İyi',
    aku_fatura_tarihi date,
    created_by text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.aku is 'Akü envanter tablosu. car_id NULL ise depoda, dolu ise araca atanmış. PHP: aku tablosu.';

create trigger trg_aku_updated_at
before update on public.aku
for each row execute procedure public.set_updated_at();

create index if not exists idx_aku_car on public.aku (car_id);
create index if not exists idx_aku_durum on public.aku (aku_durum);

-- ============================================================
-- 4. TIRES TABLOSU car_id NULLABLE YAPMA
--    Depodaki lastikler car_id = NULL olarak saklanır
--    (depodan_lastik_getir.php, depodaki_lastikler.php)
-- ============================================================
alter table public.tires
    alter column car_id drop not null;

-- car_id set null on delete (cascade yerine)
-- Mevcut FK'yı düşürüp yeniden oluşturuyoruz
alter table public.tires
    drop constraint if exists tires_car_id_fkey;

alter table public.tires
    add constraint tires_car_id_fkey
    foreign key (car_id) references public.cars(id) on delete set null;

comment on column public.tires.car_id is 'Lastiğin bağlı olduğu araç. NULL = depoda.';

-- ============================================================
-- 5. DİŞ DERİNLİĞİ TABLOSU (dis_derinligi.php, detay_sayfa.php, add_depth.php, ekle.php)
-- ============================================================
create table if not exists public.dis_derinligi (
    id bigserial primary key,
    tire_id bigint not null references public.tires(id) on delete cascade,
    depth_value numeric(5,2) not null check (depth_value >= 0),
    measurement_date date not null default current_date,
    created_at timestamptz not null default now()
);

comment on table public.dis_derinligi is 'Lastik diş derinliği ölçüm geçmişi. Her ölçüm bir satır. PHP: dis_derinligi tablosu.';

create index if not exists idx_disderinligi_tire on public.dis_derinligi (tire_id);
create index if not exists idx_disderinligi_date on public.dis_derinligi (measurement_date);

-- ============================================================
-- 6. KİLOMETRE BİLGİ TABLOSU (km_bilgi.php)
-- ============================================================
create table if not exists public.km_bilgi (
    id bigserial primary key,
    tire_id bigint not null references public.tires(id) on delete cascade,
    km_value integer not null check (km_value >= 0),
    measurement_date date not null default current_date,
    created_at timestamptz not null default now()
);

comment on table public.km_bilgi is 'Lastik kilometre ölçüm geçmişi. PHP: km_bilgi tablosu.';

create index if not exists idx_kmbilgi_tire on public.km_bilgi (tire_id);

-- ============================================================
-- 7. LOG TABLOSU (arac_gecmisi.php, tire_gecmis.php)
-- ============================================================
create table if not exists public.logs (
    id bigserial primary key,
    car_id bigint references public.cars(id) on delete set null,
    tire_id bigint references public.tires(id) on delete set null,
    message text not null,
    created_at timestamptz not null default now()
);

comment on table public.logs is 'İşlem geçmişi / audit log. car_id ve/veya tire_id ile ilişkilendirilir. PHP: logs tablosu.';

create index if not exists idx_logs_car on public.logs (car_id);
create index if not exists idx_logs_tire on public.logs (tire_id);
create index if not exists idx_logs_created on public.logs (created_at desc);

-- ============================================================
-- 8. LASTİK HAVUZU TABLOSU (yeni_sayfa.php -> LastikHavuzPage)
-- ============================================================
create table if not exists public.lastik_havuz (
    id bigserial primary key,
    tire_serino text,
    tire_marka text,
    tire_desen text,
    tire_olcu text,
    tire_durum varchar(50) not null default 'Beklemede',
    created_at timestamptz not null default now()
);

comment on table public.lastik_havuz is 'Lastik havuzu / bekleme deposu. Aktif envantere taşınmadan önceki lastikler. PHP: lastik_havuz tablosu.';

-- ============================================================
-- 9. TIRE_DETAILS TABLOSUNA YENİ ALANLAR
--    PHP caredit.php: firma, lastik_resim (base64)
-- ============================================================
alter table public.tire_details
    add column if not exists tire_firma text,
    add column if not exists tire_resim text;

comment on column public.tire_details.tire_firma is 'Lastiğin tedarikçi firması.';
comment on column public.tire_details.tire_resim is 'Lastik fotoğrafı, base64 encoded.';

-- ============================================================
-- 10. LASTIK BİLGİ TABLOSU (lastikbilgi.php -> LastikBilgiPage)
--     Marka/desen/ölçü referans verisi
-- ============================================================
create table if not exists public.lastik_info (
    id bigserial primary key,
    marka varchar(100) not null,
    desen varchar(100),
    olcu varchar(50),
    created_at timestamptz not null default now()
);

comment on table public.lastik_info is 'Lastik marka/desen/ölçü referans kataloğu. PHP: lastik_info tablosu.';

-- ============================================================
-- 11. car_axle_summary VIEW GÜNCELLEME
--     bolge_id ve status alanlarını dahil et
-- ============================================================
create or replace view public.car_axle_summary as
select
    c.id,
    c.car_name,
    c.car_model,
    c.created_by,
    c.created_at,
    c.updated_at,
    c.status,
    c.bolge_id,
    b.bolge_adi,
    coalesce(a.axle_count, 0) as axle_count
from public.cars c
left join public.axles a on a.car_id = c.id
left join public.bolge b on b.id = c.bolge_id;

comment on view public.car_axle_summary is 'Araç + aks + bölge birleşimi. Güncellendi: status ve bolge alanları eklendi.';

-- ============================================================
-- 12. YENİ TABLOLAR İÇİN RLS & POLİCY
-- ============================================================

-- bolge
alter table public.bolge enable row level security;

drop policy if exists "authenticated_select_bolge" on public.bolge;
create policy "authenticated_select_bolge" on public.bolge
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_bolge" on public.bolge;
create policy "authenticated_modify_bolge" on public.bolge
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- aku
alter table public.aku enable row level security;

drop policy if exists "authenticated_select_aku" on public.aku;
create policy "authenticated_select_aku" on public.aku
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_aku" on public.aku;
create policy "authenticated_modify_aku" on public.aku
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- dis_derinligi
alter table public.dis_derinligi enable row level security;

drop policy if exists "authenticated_select_dis_derinligi" on public.dis_derinligi;
create policy "authenticated_select_dis_derinligi" on public.dis_derinligi
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_dis_derinligi" on public.dis_derinligi;
create policy "authenticated_modify_dis_derinligi" on public.dis_derinligi
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- km_bilgi
alter table public.km_bilgi enable row level security;

drop policy if exists "authenticated_select_km_bilgi" on public.km_bilgi;
create policy "authenticated_select_km_bilgi" on public.km_bilgi
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_km_bilgi" on public.km_bilgi;
create policy "authenticated_modify_km_bilgi" on public.km_bilgi
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- logs
alter table public.logs enable row level security;

drop policy if exists "authenticated_select_logs" on public.logs;
create policy "authenticated_select_logs" on public.logs
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_logs" on public.logs;
create policy "authenticated_modify_logs" on public.logs
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- lastik_havuz
alter table public.lastik_havuz enable row level security;

drop policy if exists "authenticated_select_lastik_havuz" on public.lastik_havuz;
create policy "authenticated_select_lastik_havuz" on public.lastik_havuz
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_lastik_havuz" on public.lastik_havuz;
create policy "authenticated_modify_lastik_havuz" on public.lastik_havuz
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- lastik_info
alter table public.lastik_info enable row level security;

drop policy if exists "authenticated_select_lastik_info" on public.lastik_info;
create policy "authenticated_select_lastik_info" on public.lastik_info
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_lastik_info" on public.lastik_info;
create policy "authenticated_modify_lastik_info" on public.lastik_info
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- 13. ÖRNEK BÖLGE VERİLERİ
-- ============================================================
insert into public.bolge (bolge_adi) values
    ('Marmara'),
    ('Ege'),
    ('Akdeniz'),
    ('İç Anadolu'),
    ('Karadeniz'),
    ('Doğu Anadolu'),
    ('Güneydoğu Anadolu')
on conflict (bolge_adi) do nothing;
