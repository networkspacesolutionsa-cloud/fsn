-- =====================================================================
-- FSN | فضاء الشبكات — database setup for the website + control panel
--
-- Run this whole file once in Supabase: Dashboard → SQL Editor → New query → Run.
-- It is safe to run again (it skips anything that already exists).
--
-- After running it:
--   1. Authentication → Users → "Add user" → create your admin email + password
--      (tick "Auto Confirm User").
--   2. Run the line at the very bottom of this file with that email.
-- =====================================================================

-- ---------- Admin accounts ----------
-- Only users listed here can change content or read bookings.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admin_users enable row level security;
drop policy if exists "admins can see themselves" on public.admin_users;
create policy "admins can see themselves" on public.admin_users
  for select using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------- Editable website content (contact, services, gallery, projects) ----------
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "anyone can read content" on public.site_content;
create policy "anyone can read content" on public.site_content
  for select using (true);
drop policy if exists "admins manage content" on public.site_content;
create policy "admins manage content" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Booking requests from the website form ----------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ref text check (char_length(ref) <= 20),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 6 and 30),
  department text check (char_length(department) <= 100),
  service text check (char_length(service) <= 200),
  site_type text check (char_length(site_type) <= 100),
  city text check (char_length(city) <= 100),
  location text check (char_length(location) <= 300),
  notes text check (char_length(notes) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'done', 'cancelled'))
);
alter table public.bookings enable row level security;
drop policy if exists "visitors can submit bookings" on public.bookings;
create policy "visitors can submit bookings" on public.bookings
  for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Customer reviews (shown on the site only after approval) ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  location text check (char_length(location) <= 100),
  service text check (char_length(service) <= 200),
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 1 and 1500),
  approved boolean not null default false
);
alter table public.reviews enable row level security;
drop policy if exists "visitors can submit reviews" on public.reviews;
create policy "visitors can submit reviews" on public.reviews
  for insert to anon, authenticated with check (approved = false);
drop policy if exists "anyone can read approved reviews" on public.reviews;
create policy "anyone can read approved reviews" on public.reviews
  for select using (approved or public.is_admin());
drop policy if exists "admins manage reviews" on public.reviews;
create policy "admins manage reviews" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- Start with the reviews that were already on the website (only if the table is empty)
insert into public.reviews (name, location, service, rating, comment, approved, created_at)
select * from (values
  ('عبدالله السبيعي', 'الرياض - حي النرجس', 'تمديد شبكة كابلات + تقوية واي فاي', 5,
   'تعامل احترافي وراقي جداً. تم التمديد في فيلا 3 أدوار بدون أي أسلاك ظاهرة، وشبكة الواي فاي الآن فل في كل الغرف والحوش. أعجبني وضوح التكلفة من البداية بدون أي زيادات.',
   true, now() - interval '14 days'),
  ('م. فهد الغامدي', 'الرياض - حي حطين', 'تركيب 8 كاميرات مراقبة 4K', 5,
   'الفني جاء في الموعد بالضبط وعاين الموقع وحدد أماكن الكاميرات والزوايا بعناية فائقة. الصورة واضحة جداً في الليل والنهار وتطبيق الجوال سريع وممتاز.',
   true, now() - interval '30 days'),
  ('خالد بن ناصر العتيبي', 'الرياض - حي الياسمين', 'تركيب وبرمجة إنتركوم ذكي', 5,
   'خدمة ممتازة، تم ربط شاشة الإنتركوم مع الجوال لجميع أفراد الأسرة، والآن أستطيع فتح البوابة والرد على الزوار حتى وأنا خارج المنزل. شكراً لفريق فضاء الشبكات.',
   true, now() - interval '21 days'),
  ('سلطان القحطاني', 'الرياض - حي الملقا', 'تغطية المنزل بالإنترنت ومقويات الشبكة', 5,
   'كانت الفيلا تعاني من ضعف شديد في الدور الثاني والملحق بسبب العوازل. ركبوا مقويات شبكة متصلة بسلاسة، والسرعة كاملة 500 ميجا في كل مكان.',
   true, now() - interval '4 days')
) as seed(name, location, service, rating, comment, approved, created_at)
where not exists (select 1 from public.reviews);

-- ---------- Image storage for gallery / service photos ----------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "admins upload site images" on storage.objects;
create policy "admins upload site images" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admins update site images" on storage.objects;
create policy "admins update site images" on storage.objects
  for update to authenticated using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admins delete site images" on storage.objects;
create policy "admins delete site images" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());

-- =====================================================================
-- LAST STEP — after creating your user in Authentication → Users,
-- put your email below and run just this statement:
--
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'YOUR-EMAIL@example.com'
-- on conflict do nothing;
-- =====================================================================
