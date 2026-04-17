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
  plan_id text not null,
  plan_label text not null,
  price_label text not null
);

comment on table public.booking_intents is '予約フロー・お支払い前の確定（ステップ3）';

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

create index if not exists booking_intents_created_at_idx on public.booking_intents (created_at desc);
create index if not exists booking_payments_created_at_idx on public.booking_payments (created_at desc);
create index if not exists booking_intents_email_idx on public.booking_intents (email);

alter table public.booking_intents enable row level security;
alter table public.booking_payments enable row level security;

-- 匿名・認証ユーザーからの直接アクセスは付与しない（service_role は RLS をバイパス）
