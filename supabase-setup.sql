-- مملكة العطور: إعداد التخزين السحابي الدائم على Supabase
-- شغّل هذا الملف مرة واحدة داخل SQL Editor في مشروع Supabase الخاص بك.
-- تنبيه: عطّل التسجيل العام للمستخدمين من Authentication > Settings قبل الاعتماد على سياسات الكتابة.

create extension if not exists pgcrypto;

create table if not exists public.mamlaka_products (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.mamlaka_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mamlaka_products enable row level security;
alter table public.mamlaka_settings enable row level security;

grant select on public.mamlaka_products to anon, authenticated;
grant insert, update, delete on public.mamlaka_products to authenticated;
grant select on public.mamlaka_settings to anon, authenticated;
grant insert, update, delete on public.mamlaka_settings to authenticated;

drop policy if exists "Public can read Mamlaka products" on public.mamlaka_products;
create policy "Public can read Mamlaka products"
  on public.mamlaka_products for select to anon, authenticated
  using (true);

drop policy if exists "Signed-in admin can insert Mamlaka products" on public.mamlaka_products;
create policy "Signed-in admin can insert Mamlaka products"
  on public.mamlaka_products for insert to authenticated
  with check (true);

drop policy if exists "Signed-in admin can update Mamlaka products" on public.mamlaka_products;
create policy "Signed-in admin can update Mamlaka products"
  on public.mamlaka_products for update to authenticated
  using (true) with check (true);

drop policy if exists "Signed-in admin can delete Mamlaka products" on public.mamlaka_products;
create policy "Signed-in admin can delete Mamlaka products"
  on public.mamlaka_products for delete to authenticated
  using (true);

drop policy if exists "Public can read Mamlaka settings" on public.mamlaka_settings;
create policy "Public can read non-sensitive Mamlaka settings"
  on public.mamlaka_settings for select to anon, authenticated
  using (key !~* '(pin|password|token|secret|credential)');

drop policy if exists "Signed-in admin can insert Mamlaka settings" on public.mamlaka_settings;
create policy "Signed-in admin can insert Mamlaka settings"
  on public.mamlaka_settings for insert to authenticated
  with check (true);

drop policy if exists "Signed-in admin can update Mamlaka settings" on public.mamlaka_settings;
create policy "Signed-in admin can update Mamlaka settings"
  on public.mamlaka_settings for update to authenticated
  using (true) with check (true);

drop policy if exists "Signed-in admin can delete Mamlaka settings" on public.mamlaka_settings;
create policy "Signed-in admin can delete Mamlaka settings"
  on public.mamlaka_settings for delete to authenticated
  using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mamlakat-images',
  'mamlakat-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view Mamlaka images" on storage.objects;
create policy "Public can view Mamlaka images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'mamlakat-images');

drop policy if exists "Signed-in admin can upload Mamlaka images" on storage.objects;
create policy "Signed-in admin can upload Mamlaka images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'mamlakat-images');

drop policy if exists "Signed-in admin can update Mamlaka images" on storage.objects;
create policy "Signed-in admin can update Mamlaka images"
  on storage.objects for update to authenticated
  using (bucket_id = 'mamlakat-images')
  with check (bucket_id = 'mamlakat-images');

drop policy if exists "Signed-in admin can delete Mamlaka images" on storage.objects;
create policy "Signed-in admin can delete Mamlaka images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'mamlakat-images');
