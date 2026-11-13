-- =====================================================================
-- FSN | فضاء الشبكات — Tamara payments (pay in instalments)
--
-- Run this whole file once in Supabase: Dashboard → SQL Editor → New query → Run.
-- Safe to run again.
--
-- One row per amount a customer is asked to pay:
--   source = 'online' → the customer chose "pay with Tamara" in the booking form (fixed-price service)
--   source = 'link'   → you created a payment link for a booking in the control panel
--
-- Only the Tamara edge functions (service role) create payments and change their status.
-- Admins can read them and cancel a link that hasn't been paid. Visitors can't read anything.
-- =====================================================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  booking_id uuid references public.bookings (id) on delete set null,
  booking_ref text,
  source text not null check (source in ('online', 'link')),
  amount numeric(10, 2) not null check (amount >= 1 and amount <= 100000),
  currency text not null default 'SAR',
  description text not null check (char_length(description) between 1 and 200),
  -- pending: waiting for the customer · paid: Tamara approved and we captured it
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  -- Latest Tamara order for this payment and its raw status (approved, declined, expired, fully_captured, ...)
  tamara_order_id text,
  tamara_status text,
  paid_at timestamptz
);

create index if not exists payments_booking_id_idx on public.payments (booking_id);
create index if not exists payments_tamara_order_id_idx on public.payments (tamara_order_id);

alter table public.payments enable row level security;

drop policy if exists "admins read payments" on public.payments;
create policy "admins read payments" on public.payments
  for select using (public.is_admin());

drop policy if exists "admins cancel unpaid payments" on public.payments;
create policy "admins cancel unpaid payments" on public.payments
  for update using (public.is_admin() and status = 'pending')
  with check (public.is_admin() and status in ('pending', 'cancelled'));

drop policy if exists "admins delete unpaid payments" on public.payments;
create policy "admins delete unpaid payments" on public.payments
  for delete using (public.is_admin() and status <> 'paid');
