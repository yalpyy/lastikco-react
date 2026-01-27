-- Test kullanıcısı ve temel RLS/policy tanımları

-- RLS aktif et
alter table if exists public.cars enable row level security;
alter table if exists public.axles enable row level security;
alter table if exists public.tires enable row level security;
alter table if exists public.tire_details enable row level security;
alter table if exists public.app_users enable row level security;

-- Authenticated kullanıcılara geniş erişim (örnek/demo amaçlı)
drop policy if exists "authenticated_select_cars" on public.cars;
create policy "authenticated_select_cars" on public.cars
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_insert_cars" on public.cars;
create policy "authenticated_insert_cars" on public.cars
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_cars" on public.cars;
create policy "authenticated_update_cars" on public.cars
  for update using (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_cars" on public.cars;
create policy "authenticated_delete_cars" on public.cars
  for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated_select_axles" on public.axles;
create policy "authenticated_select_axles" on public.axles
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_axles" on public.axles;
create policy "authenticated_modify_axles" on public.axles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_select_tires" on public.tires;
create policy "authenticated_select_tires" on public.tires
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_tires" on public.tires;
create policy "authenticated_modify_tires" on public.tires
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_select_tire_details" on public.tire_details;
create policy "authenticated_select_tire_details" on public.tire_details
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_tire_details" on public.tire_details;
create policy "authenticated_modify_tire_details" on public.tire_details
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_select_app_users" on public.app_users;
create policy "authenticated_select_app_users" on public.app_users
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_modify_app_users" on public.app_users;
create policy "authenticated_modify_app_users" on public.app_users
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Test kullanıcısı (Auth kaydı gerektirir; burada yalnızca app_users kaydı eklenir)
insert into public.app_users (username, email)
values ('testkullanici', 'test@lastik.co')
on conflict (email) do nothing;

comment on policy "authenticated_select_cars" on public.cars is 'Demo amaçlı: tüm authenticated kullanıcılar için tam erişim. Üretimde daraltılmalı.';
