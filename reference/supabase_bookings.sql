-- Supabase SQL Editor で実行（予約 intent / 決済完了の保存・フェーズD）
-- 書き込みは Next.js Server Actions + service_role のみ想定。anon からの直接 INSERT は不可。

-- お支払い手前（ステップ3到達時）の予約意思
create table if not exists public.booking_intents (
  attempt_id text primary key,
  created_at timestamptz not null default now(),
  email text not null,
  booker_name text,
  wedding_date text not null,
  date_undecided boolean not null default false,
  venue_name text not null default '',
  venue_area text not null default '',
  start_time text not null default '',
  start_time_undecided boolean not null default false,
  coverage_scope text not null default 'ceremony_reception' check (coverage_scope in ('ceremony_only', 'ceremony_reception', 'through_afterparty')),
  couple_name text not null default '',
  timeline_note text,
  requested_scenes text,
  delivery_channels text[] not null default '{}',
  reference_video_urls text[] not null default '{}',
  venue_restrictions text,
  emergency_contact text,
  plan_id text not null,
  plan_label text not null,
  price_label text not null
);

comment on table public.booking_intents is '予約フロー・お支払い前の確定（ステップ3）';

alter table if exists public.booking_intents add column if not exists venue_name text not null default '';
alter table if exists public.booking_intents add column if not exists venue_area text not null default '';
alter table if exists public.booking_intents add column if not exists start_time text not null default '';
alter table if exists public.booking_intents add column if not exists start_time_undecided boolean not null default false;
alter table if exists public.booking_intents add column if not exists coverage_scope text not null default 'ceremony_reception';
alter table if exists public.booking_intents add column if not exists couple_name text not null default '';
alter table if exists public.booking_intents add column if not exists timeline_note text;
alter table if exists public.booking_intents add column if not exists requested_scenes text;
alter table if exists public.booking_intents add column if not exists delivery_channels text[] not null default '{}';
alter table if exists public.booking_intents add column if not exists reference_video_urls text[] not null default '{}';
alter table if exists public.booking_intents add column if not exists venue_restrictions text;
alter table if exists public.booking_intents add column if not exists emergency_contact text;
alter table if exists public.booking_intents drop constraint if exists booking_intents_coverage_scope_check;
alter table if exists public.booking_intents add constraint booking_intents_coverage_scope_check check (coverage_scope in ('ceremony_only', 'ceremony_reception', 'through_afterparty'));

-- 決済完了後（成功画面）。Stripe を正とし、session_id は任意で後から追記可能
create table if not exists public.booking_payments (
  attempt_id text primary key references public.booking_intents (attempt_id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null,
  booker_name text,
  wedding_date text not null,
  date_undecided boolean not null default false,
  plan_id text not null,
  plan_label text not null,
  price_label text not null,
  stripe_checkout_session_id text unique,
  source text not null default 'success_page'
);

comment on table public.booking_payments is '予約・決済完了（成功画面 / 将来 Webhook 連携）';

-- 個別見積（Quote / Invoice）管理（フェーズ1）
create table if not exists public.booking_quotes (
  id bigserial primary key,
  attempt_id text not null references public.booking_intents (attempt_id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'sent', 'approved', 'paid', 'expired', 'cancelled')),

  -- 金額内訳（税抜）
  base_price_ex_tax integer not null default 0 check (base_price_ex_tax >= 0),
  option_fee_ex_tax integer not null default 0 check (option_fee_ex_tax >= 0),
  travel_fee_ex_tax integer not null default 0 check (travel_fee_ex_tax >= 0),
  lodging_fee_ex_tax integer not null default 0 check (lodging_fee_ex_tax >= 0),
  discount_ex_tax integer not null default 0 check (discount_ex_tax >= 0),
  subtotal_ex_tax integer not null default 0 check (subtotal_ex_tax >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  total_in_tax integer not null default 0 check (total_in_tax >= 0),

  stripe_customer_id text,
  stripe_quote_id text,
  stripe_invoice_id text,
  payment_url text,
  expires_at timestamptz,
  sent_at timestamptz,
  paid_at timestamptz
);

alter table if exists public.booking_quotes add column if not exists stripe_customer_id text;

comment on table public.booking_quotes is '予約ごとの個別見積（Quote / Invoice）の管理';

create unique index if not exists booking_quotes_attempt_id_idx on public.booking_quotes (attempt_id);
create unique index if not exists booking_quotes_stripe_quote_id_idx on public.booking_quotes (stripe_quote_id) where stripe_quote_id is not null;
create unique index if not exists booking_quotes_stripe_invoice_id_idx on public.booking_quotes (stripe_invoice_id) where stripe_invoice_id is not null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists booking_quotes_set_updated_at on public.booking_quotes;
create trigger booking_quotes_set_updated_at
before update on public.booking_quotes
for each row execute function public.set_updated_at();

create index if not exists booking_intents_created_at_idx on public.booking_intents (created_at desc);
create index if not exists booking_payments_created_at_idx on public.booking_payments (created_at desc);
create index if not exists booking_intents_email_idx on public.booking_intents (email);
create index if not exists booking_quotes_created_at_idx on public.booking_quotes (created_at desc);
create index if not exists booking_quotes_status_idx on public.booking_quotes (status);

alter table public.booking_intents enable row level security;
alter table public.booking_payments enable row level security;
alter table public.booking_quotes enable row level security;

-- 匿名・認証ユーザーからの直接アクセスは付与しない（service_role は RLS をバイパス）
