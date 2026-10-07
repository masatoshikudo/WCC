-- booking_intents: 問い合わせ時に入力されたクーポンコード（2026-10-07）
-- Wedding TODO アプリから配る割引クーポン。値引きは Stripe の請求書作成時に手動で付ける。
alter table if exists public.booking_intents
  add column if not exists coupon_code text;

comment on column public.booking_intents.coupon_code is
  '問い合わせフォームで入力されたクーポンコード（大文字化・前後空白除去済み）。未入力は null。Stripe の Promotion code と照合する';
