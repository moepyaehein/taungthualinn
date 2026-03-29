-- ============================================================
-- TaungThu A Linn — Seed Data
-- Run AFTER schema.sql in Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── REGIONS ─────────────────────────────────────────────────
insert into regions (name_mm, name_en) values
  ('မန္တလေးတိုင်း', 'Mandalay Region'),
  ('စစ်ကိုင်းတိုင်း', 'Sagaing Region'),
  ('မကွေးတိုင်း', 'Magway Region'),
  ('ရန်ကုန်တိုင်း', 'Yangon Region'),
  ('ရှမ်းပြည်နယ်', 'Shan State'),
  ('ပဲခူးတိုင်း', 'Bago Region'),
  ('မွန်ပြည်နယ်', 'Mon State');

-- ─── MARKETS ─────────────────────────────────────────────────
insert into markets (name_mm, name_en, region_id) values
  ('မန္တလေး', 'Mandalay', 1),
  ('မိတ္ထီလာ', 'Meiktila', 1),
  ('ပြင်ဦးလွင်', 'Pyin Oo Lwin', 1),
  ('စစ်ကိုင်း', 'Sagaing', 2),
  ('မုံရွာ', 'Monywa', 2),
  ('မကွေး', 'Magway', 3),
  ('ပခုက္ကူ', 'Pakokku', 3),
  ('ရန်ကုန်', 'Yangon', 4),
  ('သန်လျင်', 'Thanlyin', 4),
  ('လားရှိုး', 'Lashio', 5),
  ('ကျောက်မဲ', 'Kyaukme', 5),
  ('သီပေါ', 'Hsipaw', 5),
  ('မော်လမြိုင်', 'Mawlamyine', 7);

-- ─── CATEGORIES ──────────────────────────────────────────────
insert into categories (name_mm, name_en, sort_order) values
  ('ဆီထွက်သီးနှံ', 'Oilseed Crops', 1),
  ('ပဲအမျိုးမျိုး', 'Pulses / Beans', 2),
  ('စပါး/ဆန်', 'Rice / Paddy', 3),
  ('ဟင်းသီးဟင်းရွက်', 'Vegetables', 4),
  ('သစ်သီးများ', 'Fruits', 5);

-- ─── PRODUCTS ────────────────────────────────────────────────
insert into products (name_mm, name_en, category_id, sort_order) values
  -- ─ Oilseeds (cat 1)
  ('နှမ်း', 'Sesame', 1, 1),
  ('မြေပဲ', 'Groundnut', 1, 2),
  ('နေကြာ', 'Sunflower', 1, 3),
  ('မုန်ညင်း', 'Mustard', 1, 4),
  -- ─ Pulses (cat 2)
  ('ပဲတီစိမ်း', 'Green Gram', 2, 1),
  ('ပဲစင်းငုံ', 'Pigeon Pea', 2, 2),
  ('မတ်ပဲ', 'Black Gram', 2, 3),
  -- ─ Rice (cat 3)
  ('ဆန်', 'Rice', 3, 1),
  ('ကောက်ပဲ', 'Paddy', 3, 2),
  -- ─ Vegetables (cat 4)
  ('ခရမ်းချဉ်', 'Tomato', 4, 1),
  ('ပဲငပိ', 'Chili', 4, 2),
  -- ─ Fruits (cat 5)
  ('သရက်', 'Mango', 5, 1),
  ('ငှက်ပျော', 'Banana', 5, 2);

-- ============================================================
-- SAMPLE DATA (matches the hardcoded UI)
-- NOTE: The UUIDs below are placeholders. In production these
--       come from auth.users when users sign up.
-- ============================================================

-- Create sample auth-compatible UUIDs
-- (In production, run after users sign up via Supabase Auth)
do $$
declare
  farmer_id   uuid := '00000000-0000-0000-0000-000000000001';
  merchant1   uuid := '00000000-0000-0000-0000-000000000002';
  merchant2   uuid := '00000000-0000-0000-0000-000000000003';
  merchant3   uuid := '00000000-0000-0000-0000-000000000004';
  admin_id    uuid := '00000000-0000-0000-0000-000000000005';
begin

  -- Insert profiles (these reference auth.users so we skip
  -- in actual Supabase — they'll be created via signup flow).
  -- For local testing, insert directly:
  insert into profiles (id, full_name, role, region_id, phone, email, trust_level) values
    (farmer_id, 'ဦးအောင်မြင့်', 'farmer', 1, '09-123-456-789', 'aungmyint@taungthu.mm', 'trusted'),
    (merchant1, 'ဦးကျော်မင်း', 'merchant', 1, '09-111-222-333', 'kyawmin@taungthu.mm', 'trusted'),
    (merchant2, 'ဒေါ်ခင်လှိုင်', 'merchant', 1, '09-222-333-444', 'khinh@taungthu.mm', 'trusted'),
    (merchant3, 'ဦးသန်းဝင်း', 'merchant', 2, '09-333-444-555', 'thanwin@taungthu.mm', 'flagged'),
    (admin_id, 'Platform Admin', 'admin', null, '09-111-222-333', 'admin@taungthu.mm', 'trusted')
  on conflict (id) do nothing;

  -- ─── PRICE SUBMISSIONS ──────────────────────────────────────
  insert into price_submissions (merchant_id, product_id, market_id, buy_price, sell_price, unit, quality, status, comparison_label, created_at) values
    -- Merchant 1 sesame Mandalay — verified
    (merchant1, 1, 1, 51000, 52500, 'basket', 'standard', 'peer_verified', 'ပုံမှန်', now() - interval '0 days'),
    -- Merchant 2 sesame Mandalay — pending
    (merchant2, 1, 1, 52000, 53500, 'basket', 'standard', 'pending', '+1,000 ↑', now() - interval '0 days'),
    -- Merchant 3 rice Sagaing — flagged (outlier)
    (merchant3, 8, 4, 25000, 26000, 'basket', 'standard', 'flagged', '-3,500 ↓ outlier', now() - interval '0 days'),
    -- Merchant 2 green gram Meiktila — peer_verified
    (merchant2, 5, 2, 37500, 38000, 'basket', 'standard', 'peer_verified', 'ပုံမှန်', now() - interval '0 days'),
    -- Historical prices for chart data (sesame, Mandalay)
    (merchant1, 1, 1, 47000, 48000, 'basket', 'standard', 'admin_verified', null, now() - interval '6 days'),
    (merchant1, 1, 1, 48200, 49200, 'basket', 'standard', 'admin_verified', null, now() - interval '5 days'),
    (merchant1, 1, 1, 49100, 50100, 'basket', 'standard', 'admin_verified', null, now() - interval '4 days'),
    (merchant1, 1, 1, 50000, 51000, 'basket', 'standard', 'admin_verified', null, now() - interval '3 days'),
    (merchant1, 1, 1, 49500, 50500, 'basket', 'standard', 'admin_verified', null, now() - interval '2 days'),
    (merchant1, 1, 1, 50500, 51500, 'basket', 'standard', 'admin_verified', null, now() - interval '1 day'),
    -- Green gram Mandalay — pending
    (merchant1, 5, 1, 38000, 39500, 'basket', 'standard', 'pending', null, now() - interval '0 days'),
    -- Groundnut Meiktila — verified
    (merchant1, 2, 2, 42000, 43000, 'basket', 'standard', 'admin_verified', null, now() - interval '1 day'),
    -- Sesame Mandalay — peer_verified
    (merchant1, 1, 1, 50500, 52000, 'basket', 'standard', 'peer_verified', null, now() - interval '1 day'),
    -- Rice Mandalay — flagged
    (merchant1, 8, 1, 28000, 29500, 'basket', 'standard', 'flagged', null, now() - interval '2 days');

  -- ─── BULK UPLOADS ──────────────────────────────────────────
  insert into bulk_uploads (merchant_id, filename, row_count, error_count, status, created_at) values
    (merchant1, 'prices_mar28.csv', 15, 0, 'pending', now()),
    (merchant2, 'weekly_prices.xlsx', 8, 2, 'pending', now() - interval '1 day'),
    (merchant3, 'bulk_data.csv', 35, 5, 'rejected', now() - interval '2 days');

  -- ─── LISTINGS ──────────────────────────────────────────────
  insert into listings (merchant_id, type, product_id, quantity, target_price, region_id, availability, is_emergency, pickup_available, status) values
    (merchant1, 'buy', 1, 500, 52000, 1, 'immediate', false, true, 'active'),
    (merchant1, 'buy', 5, 200, 39000, 2, 'immediate', false, true, 'active'),
    (merchant2, 'sell', 2, 100, 43000, 1, '1_week', false, true, 'paused'),
    -- Emergency listing
    (merchant1, 'buy', 1, 200, 48000, 1, 'immediate', true, true, 'active');

  -- ─── EMERGENCIES ───────────────────────────────────────────
  insert into emergencies (title, description, region_id, risk_level, affected_farmers, affected_merchants, crop_damage_estimate, is_active, start_date, end_date, created_by) values
    ('ရှမ်းမြောက် ရေကြီးမှု', 'ရှမ်းပြည်နယ်မြောက်ပိုင်းတွင် လာမည့် 5 ရက်အတွင်း မိုးသည်းထန်စွာ ရွာသွန်းနိုင်ပါသည်။ သီးနှံများ လုံခြုံအောင် သိုလှောင်ထားပါ။', 5, 'high', 45, 8, '500 တင်းခန့်', true, '2026-04-01', '2026-04-05', admin_id);

  -- ─── BROADCASTS ────────────────────────────────────────────
  insert into broadcasts (type, target, region_id, content, created_by, created_at) values
    ('emergency', 'all', 5, 'ရှမ်းမြောက် ရေကြီးမှု သတိပေး — သီးနှံများ လုံခြုံအောင်ထားပါ', admin_id, now() - interval '3 hours'),
    ('announcement', 'all', null, 'ဧပြီလ စနစ်မွမ်းမံမှု — ဧပြီ 1 ရက်တွင် ပြုပြင်မွမ်းမံမည်', admin_id, now() - interval '2 days'),
    ('recommendation', 'merchants', null, 'ကုန်သည်များ အပတ်စဉ်စျေး တင်ပါရန်', admin_id, now() - interval '5 days');

  -- ─── FARMER RECORDS ────────────────────────────────────────
  insert into farmer_records (farmer_id, product_id, harvest_qty, storage_qty, sale_date, sale_price, total_amount) values
    (farmer_id, 1, 100, 50, '2026-03-20', 51000, 2550000),
    (farmer_id, 1, 120, 40, '2026-02-15', 48500, 3880000),
    (farmer_id, 5, 150, 50, '2026-01-10', 45000, 4500000),
    (farmer_id, 1, 80, 20, '2025-12-05', 53000, 3180000),
    (farmer_id, 2, 80, 20, '2025-11-20', 42000, 2520000);

  -- ─── AUDIT LOG ─────────────────────────────────────────────
  insert into audit_log (user_id, action, details, created_at) values
    (admin_id, 'price_verified', 'နှမ်း (မန္တလေး) 52,500 Ks အတည်ပြုခဲ့', now() - interval '30 minutes'),
    (admin_id, 'price_flagged', 'ဆန် (စစ်ကိုင်း) 25,000 Ks သံသယမှတ်ခဲ့ — ပုံမှန်ထက် နည်းလွန်း', now() - interval '1 hour'),
    (admin_id, 'emergency_broadcast', 'ရှမ်းမြောက် အရေးပေါ်ထုတ်ပြန်ချက် ပို့ခဲ့', now() - interval '3 hours'),
    (admin_id, 'bulk_approved', 'ဦးကျော်မင်း Bulk Upload 15 ခု ခွင့်ပြုခဲ့', now() - interval '1 day'),
    (admin_id, 'user_approved', 'ကုန်သည်အသစ် "ကုမ္ပဏီ ABC" အကောင့်ခွင့်ပြုခဲ့', now() - interval '2 days');

  -- ─── NOTIFICATIONS ─────────────────────────────────────────
  insert into notifications (user_id, title, body, type, is_read, created_at) values
    (merchant1, 'အရေးပေါ်', 'ရှမ်းမြောက် သီးနှံဝယ်ယူသူ လိုအပ်', 'emergency', false, now() - interval '1 hour'),
    (merchant1, 'စျေးတင်ရန်', 'နှမ်း (မန္တလေး) ယနေ့စျေး မတင်ရသေးပါ', 'warning', false, now() - interval '3 hours'),
    (merchant1, 'အတည်ပြုပြီး', 'ပဲတီစိမ်း စျေး Admin အတည်ပြုပြီး', 'price', true, now() - interval '5 hours'),
    (merchant1, 'စစ်ဆေးကူညီရန်', 'ဦးမင်းထွေး၏ နှမ်းစျေး စစ်ဆေးကူညီရန်', 'info', true, now() - interval '1 day'),
    (merchant1, 'စနစ်မွမ်းမံ', 'စနစ်မွမ်းမံမှု — ဧပြီ 1 ရက်တွင် ပြုပြင်မွမ်းမံမည်', 'system', true, now() - interval '2 days'),
    (farmer_id, 'မိုးသတိပေး', 'ရှမ်းမြောက်တွင် မိုးသည်းထန်နိုင်', 'warning', false, now() - interval '2 hours'),
    (farmer_id, 'AI အကြံပြု', 'နှမ်းစျေး ထပ်တက်နိုင်ခြေ — စောင့်ပါ', 'info', false, now() - interval '4 hours');

end;
$$;
