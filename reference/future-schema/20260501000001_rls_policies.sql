-- WCC Row Level Security Policies
-- セキュリティ設計: docs/WCC_ARCHITECTURE.md セクション 7.2 に基づく
--
-- 方針:
--   - 全テーブルで RLS を有効化
--   - 認証済みユーザー (運営者) のみが全データを読み書き可能
--   - 匿名ユーザー (新郎新婦) は問い合わせフォームからの inbound insert のみ許可
--   - 納品物閲覧ページのパスワード認証はアプリケーション層で処理する

alter table clients    enable row level security;
alter table venues     enable row level security;
alter table bookings   enable row level security;
alter table deliveries enable row level security;
alter table payments   enable row level security;
alter table messages   enable row level security;

-- 運営者: 全テーブルへのフルアクセス
create policy "operator_all_clients"
  on clients for all to authenticated
  using (true) with check (true);

create policy "operator_all_venues"
  on venues for all to authenticated
  using (true) with check (true);

create policy "operator_all_bookings"
  on bookings for all to authenticated
  using (true) with check (true);

create policy "operator_all_deliveries"
  on deliveries for all to authenticated
  using (true) with check (true);

create policy "operator_all_payments"
  on payments for all to authenticated
  using (true) with check (true);

create policy "operator_all_messages"
  on messages for all to authenticated
  using (true) with check (true);

-- 匿名ユーザー: LP 問い合わせフォームからの insert のみ許可
create policy "public_contact_form_insert"
  on messages for insert to anon
  with check (
    channel   = 'form' and
    direction = 'inbound'
  );
