-- Supabase SQL Editor で実行（問い合わせフォーム Step3）
-- アプリはサーバーから service_role で insert する想定。anon の直接 INSERT は不要。

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  partner_name text,
  email text not null,
  phone text not null,
  wedding_date_first date not null,
  wedding_date_second date,
  wedding_date_third date,
  venue text,
  guest_count integer,
  budget text,
  message text not null
);

comment on table public.contact_inquiries is 'お問い合わせフォーム送信（WCC site）';

alter table public.contact_inquiries enable row level security;

-- ダッシュボードの Table Editor から閲覧する場合は service_role で見える。
-- 匿名・ログインユーザー向けポリシーは付けない（公開 API 経由の読取を防ぐ）。
