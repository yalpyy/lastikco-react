-- ============================================================
-- tire_constants tablosu: Lastik marka, desen ve ölçü sabitleri
-- SabitlerPage ve lastik ekleme formları tarafından kullanılır.
-- ============================================================

create table if not exists public.tire_constants (
    id bigserial primary key,
    type varchar(20) not null check (type in ('marka', 'desen', 'olcu')),
    value varchar(200) not null,
    created_at timestamptz not null default now(),
    unique (type, value)
);

comment on table public.tire_constants is 'Lastik sabitleri: marka, desen ve ölçü dropdown değerleri.';
comment on column public.tire_constants.type is 'Sabit türü: marka, desen veya olcu.';
comment on column public.tire_constants.value is 'Sabit değeri (örn: Michelin, 315/80R22.5).';

create index if not exists idx_tire_constants_type on public.tire_constants (type);
create index if not exists idx_tire_constants_type_value on public.tire_constants (type, value);

-- ============================================================
-- RLS & Policy
-- ============================================================
alter table public.tire_constants enable row level security;

drop policy if exists "authenticated_select_tire_constants" on public.tire_constants;
create policy "authenticated_select_tire_constants" on public.tire_constants
    for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_tire_constants" on public.tire_constants;
create policy "authenticated_modify_tire_constants" on public.tire_constants
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
