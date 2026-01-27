-- Kaynak MySQL dump mevcut değil; PHP sorgularından çıkarılan tahmini şema.
-- Varsayımlar: kimlik alanları bigserial, created_at/updated_at timestamptz, Supabase Auth üzerinden oturum.

create extension if not exists "uuid-ossp";

create table if not exists public.cars (
    id bigserial primary key,
    car_name varchar(150) not null,
    car_model varchar(150) not null,
    created_by text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.axles (
    id bigserial primary key,
    car_id bigint not null references public.cars(id) on delete cascade,
    axle_count smallint not null check (axle_count > 0),
    created_at timestamptz not null default now(),
    unique (car_id)
);

create table if not exists public.tires (
    id bigserial primary key,
    car_id bigint not null references public.cars(id) on delete cascade,
    axle_number smallint not null check (axle_number > 0),
    tire_position text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.tire_details (
    id bigserial primary key,
    tire_id bigint not null references public.tires(id) on delete cascade,
    tire_serino text,
    tire_marka text,
    tire_desen text,
    tire_olcu text,
    tire_disderinligi text,
    tire_durum text,
    tire_olcumtarihi date,
    tire_olcumkm integer,
    created_at timestamptz not null default now()
);

create table if not exists public.app_users (
    id bigserial primary key,
    auth_user_id uuid references auth.users(id) on delete cascade,
    username text unique,
    email text unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Güncelleme zamanını otomatikleyen yardımcı
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_cars_updated_at
before update on public.cars
for each row execute procedure public.set_updated_at();

create trigger trg_app_users_updated_at
before update on public.app_users
for each row execute procedure public.set_updated_at();

-- Sık kullanılan alanlar için indeksler
create index if not exists idx_cars_name on public.cars (car_name);
create index if not exists idx_tires_car on public.tires (car_id);
create index if not exists idx_axles_car on public.axles (car_id);
create index if not exists idx_tiredetails_tire on public.tire_details (tire_id);

-- Araç + aks özet görünümü (JOIN sorguları için)
create or replace view public.car_axle_summary as
select
  c.id,
  c.car_name,
  c.car_model,
  c.created_by,
  c.created_at,
  c.updated_at,
  coalesce(a.axle_count, 0) as axle_count
from public.cars c
left join public.axles a on a.car_id = c.id;

comment on view public.car_axle_summary is 'cars ile axles birleşimi; PHP tarafındaki car_id + axle_count sorgularını karşılar.';

-- UYARI: PHP kodunda görülen şifre sıfırlama ve düz metin parola kullanımı Supabase Auth ile yer değiştirdi.
-- Parolalar app_users tablosunda saklanmaz; Supabase Auth üzerinden yönetilir.
