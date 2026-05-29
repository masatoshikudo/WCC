-- booking_intents: 日程未定時の希望挙式月（2026-05-30）
alter table if exists public.booking_intents
  add column if not exists preferred_wedding_month text;

comment on column public.booking_intents.preferred_wedding_month is
  'date_undecided=true のときの希望挙式月（YYYY-MM）。枠カウントに使用';

create index if not exists booking_intents_preferred_wedding_month_idx
  on public.booking_intents (preferred_wedding_month)
  where date_undecided = true;
