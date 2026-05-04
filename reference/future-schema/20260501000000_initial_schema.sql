-- WCC Initial Schema
-- テーブル定義: docs/WCC_ARCHITECTURE.md セクション 3.1 に基づく

create table if not exists clients (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  partner_name   text,
  email          text,
  phone          text,
  line_user_id   text,
  notes          text,
  created_at     timestamptz not null default now()
);

create table if not exists venues (
  id                          uuid        primary key default gen_random_uuid(),
  name                        text        not null,
  address                     text,
  prefecture                  text,
  external_vendor_allowed     boolean,
  drone_allowed               boolean,
  notes                       text,
  created_at                  timestamptz not null default now()
);

create table if not exists bookings (
  id                  uuid        primary key default gen_random_uuid(),
  client_id           uuid        references clients(id) on delete restrict,
  venue_id            uuid        references venues(id)  on delete restrict,
  wedding_date        date,
  shoot_start_at      timestamptz,
  shoot_end_at        timestamptz,
  guest_count         int,
  status              text        not null default 'inquiry'
                        check (status in ('inquiry', 'quoted', 'confirmed', 'completed', 'cancelled')),
  package_price       int,
  travel_fee          int         not null default 0,
  accommodation_fee   int         not null default 0,
  total_price         int,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists deliveries (
  id                uuid        primary key default gen_random_uuid(),
  booking_id        uuid        references bookings(id) on delete restrict,
  status            text        not null default 'editing'
                      check (status in ('editing', 'delivered')),
  short_video_url   text,
  long_video_url    text,
  making_video_url  text,
  raw_archive_url   text,
  delivery_password text,
  delivered_at      timestamptz,
  created_at        timestamptz not null default now()
);

create table if not exists payments (
  id                    uuid        primary key default gen_random_uuid(),
  booking_id            uuid        references bookings(id) on delete restrict,
  stripe_payment_link   text,
  stripe_session_id     text,
  amount                int,
  status                text        not null default 'pending'
                          check (status in ('pending', 'paid', 'refunded')),
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

create table if not exists messages (
  id          uuid        primary key default gen_random_uuid(),
  booking_id  uuid        references bookings(id) on delete set null,
  client_id   uuid        references clients(id)  on delete set null,
  channel     text        not null check (channel   in ('line', 'form', 'email')),
  direction   text        not null check (direction in ('inbound', 'outbound')),
  body        text        not null,
  created_at  timestamptz not null default now()
);

-- bookings.updated_at を自動更新するトリガー
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();
