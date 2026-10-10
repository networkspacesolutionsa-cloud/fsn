-- =====================================================================
-- FSN | فضاء الشبكات — send every new booking to your WhatsApp automatically
--
-- How it works: when the website saves a booking, the database itself calls the
-- TextMeBot WhatsApp API (api.textmebot.com), which messages YOUR number. The customer
-- doesn't need to press anything, and a WhatsApp failure never blocks the booking.
--
-- Before running:
--   1. Have a TextMeBot API key with your WhatsApp number linked to it
--      (https://api.textmebot.com/addphone.php?apikey=YOUR-KEY).
--   2. Put your phone and API key in the INSERT below (search for CHANGE-ME), then run
--      this whole file in Supabase → SQL Editor → New query → Run.
--
-- Safe to run again (e.g. to change the number or key).
-- =====================================================================

create extension if not exists pg_net with schema extensions;

-- Settings live in a private schema that the website's public API can't read
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.whatsapp_settings (
  id int primary key default 1 check (id = 1),
  phone text not null,
  apikey text not null,
  enabled boolean not null default true
);

insert into private.whatsapp_settings (id, phone, apikey)
values (
  1,
  '+966505964469',   -- CHANGE-ME: the WhatsApp number that receives bookings (with + and country code)
  'c99jFdPuzCmY'     -- CHANGE-ME: your TextMeBot API key
)
on conflict (id) do update set phone = excluded.phone, apikey = excluded.apikey, enabled = true;

create or replace function private.notify_booking_whatsapp()
returns trigger
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  s private.whatsapp_settings;
  msg text;
begin
  select * into s from private.whatsapp_settings where id = 1;
  if not found or not s.enabled or s.apikey = 'CHANGE-ME' then
    return new;
  end if;

  msg := concat_ws(E'\n',
    '🔔 طلب حجز جديد - فضاء الشبكات',
    'رقم الطلب: ' || coalesce(new.ref, '-'),
    'الاسم: ' || new.name,
    'الجوال: ' || new.phone,
    'القسم: ' || coalesce(new.department, '-'),
    'الخدمة: ' || coalesce(new.service, 'حسب المعاينة'),
    'نوع الموقع: ' || coalesce(new.site_type, '-'),
    'المدينة: ' || coalesce(new.city, '-'),
    'الموقع: ' || coalesce(new.location, '-'),
    'ملاحظات: ' || coalesce(new.notes, '-')
  );

  -- Asynchronous: queued now, sent right after the booking is saved (TextMeBot)
  perform net.http_get(
    url := 'https://api.textmebot.com/send.php',
    params := jsonb_build_object('recipient', s.phone, 'apikey', s.apikey, 'text', msg),
    timeout_milliseconds := 15000
  );
  return new;
exception when others then
  -- Never lose a booking because of a WhatsApp problem
  raise warning 'WhatsApp booking notification failed: %', sqlerrm;
  return new;
end;
$$;

drop trigger if exists bookings_whatsapp_notify on public.bookings;
create trigger bookings_whatsapp_notify
  after insert on public.bookings
  for each row execute function private.notify_booking_whatsapp();

-- =====================================================================
-- Useful later:
--
-- Pause notifications:   update private.whatsapp_settings set enabled = false;
-- Resume:                update private.whatsapp_settings set enabled = true;
-- Check recent sends (TextMeBot answers HTTP 200 even for errors, so read "content"):
--   select created, status_code, content, error_msg
--   from net._http_response order by created desc limit 5;
-- =====================================================================
