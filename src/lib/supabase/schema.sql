-- ============================================================
-- TaungThu A Linn (တောင်သူအလင်း) — Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── ENUM TYPES ──────────────────────────────────────────────
create type user_role        as enum ('farmer', 'merchant', 'admin');
create type price_status     as enum ('pending', 'peer_verified', 'admin_verified', 'flagged', 'rejected');
create type upload_status    as enum ('pending', 'approved', 'rejected');
create type listing_type     as enum ('buy', 'sell');
create type listing_status   as enum ('active', 'paused', 'fulfilled', 'expired');
create type risk_level       as enum ('high', 'medium', 'low');
create type broadcast_type   as enum ('announcement', 'warning', 'emergency', 'recommendation');
create type broadcast_target as enum ('all', 'farmers', 'merchants');
create type trust_level      as enum ('trusted', 'standard', 'flagged', 'suspended');
create type quality_grade    as enum ('standard', 'high', 'low');
create type price_unit       as enum ('basket', 'viss', 'ton');
create type update_frequency as enum ('daily', 'weekly');
create type availability_window as enum ('immediate', '1_week', '2_weeks');
create type notification_type as enum ('info', 'warning', 'emergency', 'price', 'system');

-- ─── PROFILES ────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'farmer',
  region_id   int,
  phone       text,
  email       text,
  trust_level trust_level not null default 'standard',
  is_active   boolean not null default true,
  last_login  timestamptz,
  created_at  timestamptz not null default now()
);

-- ─── REGIONS ─────────────────────────────────────────────────
create table regions (
  id      serial primary key,
  name_mm text not null unique,
  name_en text
);

-- ─── MARKETS ─────────────────────────────────────────────────
create table markets (
  id        serial primary key,
  name_mm   text not null,
  name_en   text,
  region_id int not null references regions(id) on delete cascade
);

-- ─── CATEGORIES ──────────────────────────────────────────────
create table categories (
  id         serial primary key,
  name_mm    text not null unique,
  name_en    text,
  sort_order int not null default 0
);

-- ─── PRODUCTS ────────────────────────────────────────────────
create table products (
  id          serial primary key,
  name_mm     text not null,
  name_en     text,
  category_id int not null references categories(id) on delete cascade,
  sort_order  int not null default 0
);

-- ─── PRICE SUBMISSIONS ──────────────────────────────────────
create table price_submissions (
  id               serial primary key,
  merchant_id      uuid not null references profiles(id) on delete cascade,
  product_id       int not null references products(id),
  market_id        int not null references markets(id),
  buy_price        numeric(12,2) not null,
  sell_price       numeric(12,2) not null,
  unit             price_unit not null default 'basket',
  quality          quality_grade not null default 'standard',
  frequency        update_frequency not null default 'daily',
  status           price_status not null default 'pending',
  notes            text,
  comparison_label text,          -- e.g. 'ပုံမှန်', '+1,000 ↑'
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_prices_merchant  on price_submissions(merchant_id);
create index idx_prices_product   on price_submissions(product_id);
create index idx_prices_market    on price_submissions(market_id);
create index idx_prices_status    on price_submissions(status);
create index idx_prices_created   on price_submissions(created_at desc);

-- ─── BULK UPLOADS ────────────────────────────────────────────
create table bulk_uploads (
  id          serial primary key,
  merchant_id uuid not null references profiles(id) on delete cascade,
  filename    text not null,
  row_count   int not null default 0,
  error_count int not null default 0,
  status      upload_status not null default 'pending',
  created_at  timestamptz not null default now()
);

-- ─── LISTINGS (BUY / SELL OFFERS) ────────────────────────────
create table listings (
  id               serial primary key,
  merchant_id      uuid not null references profiles(id) on delete cascade,
  type             listing_type not null,
  product_id       int not null references products(id),
  quantity         numeric(12,2) not null,
  quantity_unit    text not null default 'တင်း',
  target_price     numeric(12,2) not null,
  region_id        int not null references regions(id),
  availability     availability_window not null default 'immediate',
  is_emergency     boolean not null default false,
  pickup_available boolean not null default true,
  status           listing_status not null default 'active',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_listings_merchant on listings(merchant_id);
create index idx_listings_status   on listings(status);

-- ─── EMERGENCIES ─────────────────────────────────────────────
create table emergencies (
  id                   serial primary key,
  title                text not null,
  description          text not null,
  region_id            int not null references regions(id),
  risk_level           risk_level not null default 'medium',
  affected_farmers     int not null default 0,
  affected_merchants   int not null default 0,
  crop_damage_estimate text,
  is_active            boolean not null default true,
  start_date           date,
  end_date             date,
  created_by           uuid not null references profiles(id),
  created_at           timestamptz not null default now()
);

-- ─── BROADCASTS ──────────────────────────────────────────────
create table broadcasts (
  id         serial primary key,
  type       broadcast_type not null default 'announcement',
  target     broadcast_target not null default 'all',
  region_id  int references regions(id),
  content    text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

-- ─── FARMER RECORDS ──────────────────────────────────────────
create table farmer_records (
  id           serial primary key,
  farmer_id    uuid not null references profiles(id) on delete cascade,
  product_id   int not null references products(id),
  harvest_qty  numeric(12,2),
  storage_qty  numeric(12,2),
  sale_date    date,
  sale_price   numeric(12,2),
  total_amount numeric(14,2),
  created_at   timestamptz not null default now()
);

create index idx_frecords_farmer on farmer_records(farmer_id);

-- ─── PEER VERIFICATIONS ──────────────────────────────────────
create table peer_verifications (
  id                   serial primary key,
  price_submission_id  int not null references price_submissions(id) on delete cascade,
  verifier_id          uuid not null references profiles(id),
  is_verified          boolean not null default true,
  created_at           timestamptz not null default now(),
  unique(price_submission_id, verifier_id)
);

-- ─── AUDIT LOG ───────────────────────────────────────────────
create table audit_log (
  id         serial primary key,
  user_id    uuid references profiles(id),
  action     text not null,
  details    text,
  created_at timestamptz not null default now()
);

create index idx_audit_created on audit_log(created_at desc);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
create table notifications (
  id         serial primary key,
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  body       text not null,
  is_read    boolean not null default false,
  type       notification_type not null default 'info',
  link       text,
  created_at timestamptz not null default now()
);

create index idx_notif_user    on notifications(user_id);
create index idx_notif_unread  on notifications(user_id, is_read) where is_read = false;

-- ─── FK: profiles.region_id → regions ────────────────────────
alter table profiles add constraint fk_profiles_region
  foreign key (region_id) references regions(id);

-- ─── AUTO-UPDATE updated_at TRIGGER ──────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_prices_updated
  before update on price_submissions
  for each row execute function update_updated_at();

create trigger trg_listings_updated
  before update on listings
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles          enable row level security;
alter table regions           enable row level security;
alter table markets           enable row level security;
alter table categories        enable row level security;
alter table products          enable row level security;
alter table price_submissions enable row level security;
alter table bulk_uploads      enable row level security;
alter table listings          enable row level security;
alter table emergencies       enable row level security;
alter table broadcasts        enable row level security;
alter table farmer_records    enable row level security;
alter table peer_verifications enable row level security;
alter table audit_log         enable row level security;
alter table notifications     enable row level security;

-- ── Reference data: readable by everyone ─────────────────────
create policy "regions_read"    on regions     for select using (true);
create policy "markets_read"    on markets     for select using (true);
create policy "categories_read" on categories  for select using (true);
create policy "products_read"   on products    for select using (true);

-- ── Profiles ─────────────────────────────────────────────────
create policy "profiles_read_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_read_admin" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- ── Price submissions ────────────────────────────────────────
create policy "prices_read" on price_submissions
  for select using (true);
create policy "prices_insert_merchant" on price_submissions
  for insert with check (auth.uid() = merchant_id);
create policy "prices_update_admin" on price_submissions
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── Bulk uploads ─────────────────────────────────────────────
create policy "bulk_read_own" on bulk_uploads
  for select using (auth.uid() = merchant_id);
create policy "bulk_read_admin" on bulk_uploads
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "bulk_insert" on bulk_uploads
  for insert with check (auth.uid() = merchant_id);

-- ── Listings ─────────────────────────────────────────────────
create policy "listings_read" on listings
  for select using (true);
create policy "listings_insert" on listings
  for insert with check (auth.uid() = merchant_id);
create policy "listings_update_own" on listings
  for update using (auth.uid() = merchant_id);
create policy "listings_update_admin" on listings
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── Emergencies ──────────────────────────────────────────────
create policy "emergencies_read" on emergencies
  for select using (true);
create policy "emergencies_insert_admin" on emergencies
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── Broadcasts ───────────────────────────────────────────────
create policy "broadcasts_read" on broadcasts
  for select using (true);
create policy "broadcasts_insert_admin" on broadcasts
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── Farmer records ───────────────────────────────────────────
create policy "frecords_read_own" on farmer_records
  for select using (auth.uid() = farmer_id);
create policy "frecords_read_admin" on farmer_records
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "frecords_insert" on farmer_records
  for insert with check (auth.uid() = farmer_id);
create policy "frecords_update" on farmer_records
  for update using (auth.uid() = farmer_id);

-- ── Peer verifications ───────────────────────────────────────
create policy "peerverify_read" on peer_verifications
  for select using (true);
create policy "peerverify_insert" on peer_verifications
  for insert with check (auth.uid() = verifier_id);

-- ── Audit log ────────────────────────────────────────────────
create policy "audit_read_admin" on audit_log
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "audit_insert" on audit_log
  for insert with check (true);  -- triggered server-side

-- ── Notifications ────────────────────────────────────────────
create policy "notif_read_own" on notifications
  for select using (auth.uid() = user_id);
create policy "notif_update_own" on notifications
  for update using (auth.uid() = user_id);
create policy "notif_insert" on notifications
  for insert with check (true);  -- triggered server-side
