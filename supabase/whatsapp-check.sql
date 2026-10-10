-- Run in Supabase → SQL Editor to see why booking WhatsApp messages aren't arriving.
-- Read the "problem" column of the first row.
select
  case
    when to_regclass('private.whatsapp_settings') is null
      then '❌ whatsapp-notify.sql has not been run yet'
    when not exists (select 1 from pg_trigger where tgname = 'bookings_whatsapp_notify')
      then '❌ trigger missing — run whatsapp-notify.sql again'
    when (select apikey from private.whatsapp_settings where id = 1) = 'CHANGE-ME'
      then '❌ API key is still CHANGE-ME — put your TextMeBot key in and run whatsapp-notify.sql again'
    when not (select enabled from private.whatsapp_settings where id = 1)
      then '❌ notifications are paused (enabled = false)'
    when not exists (select 1 from net._http_response)
      then '⚠️ set up correctly, but no message has been sent since — submit a new booking, then run this again'
    when (select error_msg from net._http_response order by created desc limit 1) is not null
      then '❌ the request to TextMeBot failed — see "network_error"'
    else 'ℹ️ TextMeBot answered — read "textmebot_reply" (it says why if the message was not sent)'
  end as problem,
  (select phone from private.whatsapp_settings where id = 1) as phone_used,
  (select count(*) from public.bookings) as bookings_saved,
  (select max(created_at) from public.bookings) as last_booking_at,
  (select left(content, 300) from net._http_response order by created desc limit 1) as textmebot_reply,
  (select error_msg from net._http_response order by created desc limit 1) as network_error;
