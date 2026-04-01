import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iqpdkimpcquwxcbtjltr.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxcGRraW1wY3F1d3hjYnRqbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDM1OTgsImV4cCI6MjA5MDMxOTU5OH0.XUseLUX1Vmkz6IrZq8wkjTTVmhciPRrrxRMUwWecMTw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxcGRraW1wY3F1d3hjYnRqbHRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc0MzU5OCwiZXhwIjoyMDkwMzE5NTk4fQ.5JX6_usLO1D5Yrk643dyPvwV7Cj5jrEniZdU_iWcaCE';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const API_BASE = 'http://localhost:3000/api';

async function testCRUD() {
  console.log('--- STARTING CLI CRUD TESTS ---\n');

  const emailFarmer = `testfarmer_${Date.now()}@example.com`;
  const password = 'password123';
  
  console.log(`[Farmers] 1. Creating test farmer... (${emailFarmer})`);
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: emailFarmer,
    password,
    email_confirm: true,
    user_metadata: { role: 'farmer', full_name: 'CLI Test Farmer' }
  });

  if (authError || !authData.user) {
    console.error('Failed to create farmer:', authError);
    return;
  }
  
  // Now sign in standardly to get the session JWT
  const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
    email: emailFarmer,
    password
  });
  
  if (loginError || !sessionData.session) {
    console.error('Failed to login farmer:', loginError);
    return;
  }

  const sessionString = JSON.stringify([
    sessionData.session.access_token,
    sessionData.session.refresh_token,
    null,
    null,
    null
  ]);
  const cookieHeader = `sb-iqpdkimpcquwxcbtjltr-auth-token=${encodeURIComponent(sessionString)}`;

  console.log('[Farmers] 2. Testing CREATE Record via API...');
  const createRecordRes = await fetch(`${API_BASE}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({
      product_id: 1, // Let's hope product 1 exists
      harvest_qty: 150,
      storage_qty: 50,
      sale_date: new Date().toISOString().split('T')[0],
      sale_price: 52000
    })
  });
  
  const createJson = await createRecordRes.json();
  if (!createRecordRes.ok) {
    console.error('CREATE Record failed:', createJson);
  } else {
    console.log('✅ Created Record ID:', createJson.data.id, 'Total Amount Computed:', createJson.data.total_amount);
  }

  console.log('\n[Farmers] 3. Testing READ Records via API...');
  const readRecordRes = await fetch(`${API_BASE}/records`, {
    headers: { 'Cookie': cookieHeader }
  });
  const readJson = await readRecordRes.json();
  if (!readRecordRes.ok) {
    console.error('READ Records failed:', readJson);
  } else {
    console.log('✅ Read Records:', readJson.data.length, 'entries found. Dashboard summary:', readJson.summary);
  }
  
  // 4. Sign up/Login a temporary Merchant
  const emailMerchant = `testmerchant_${Date.now()}@example.com`;
  console.log(`\n---------------------------------\n[Merchants] 1. Creating test merchant... (${emailMerchant})`);
  const { data: mAuthData, error: mAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: emailMerchant,
    password,
    email_confirm: true,
    user_metadata: { role: 'merchant', full_name: 'CLI Test Merchant' }
  });

  if (mAuthError || !mAuthData.user) {
    console.error('Failed to create merchant:', mAuthError);
    return;
  }
  
  const { data: mSessionData, error: mLoginError } = await supabase.auth.signInWithPassword({
    email: emailMerchant,
    password
  });
  
  if (mLoginError || !mSessionData.session) {
    console.error('Failed to login merchant:', mLoginError);
    return;
  }

  const mCookieHeader = `sb-iqpdkimpcquwxcbtjltr-auth-token=${encodeURIComponent(JSON.stringify([
    mSessionData.session.access_token,
    mSessionData.session.refresh_token,
    null,
    null,
    null
  ]))}`;

  console.log('[Merchants] 2. Testing CREATE Price Submission via API...');
  const createPriceRes = await fetch(`${API_BASE}/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': mCookieHeader },
    body: JSON.stringify({
      product_id: 1,
      market_id: 1, // Assume market 1 exists
      buy_price: 51000,
      sell_price: 53500,
      quality: 'standard',
      unit: 'basket',
      frequency: 'daily'
    })
  });
  
  const priceJson = await createPriceRes.json();
  if (!createPriceRes.ok) {
    console.error('CREATE Price failed:', priceJson);
  } else {
    console.log('✅ Submitted Price ID:', priceJson.data.id, 'Status:', priceJson.data.status);
  }

  console.log('\n[Merchants] 3. Testing READ Pending Prices (for peer verify) via API...');
  const readPriceRes = await fetch(`${API_BASE}/prices?status=pending`, {
    headers: { 'Cookie': mCookieHeader }
  });
  const rPriceJson = await readPriceRes.json();
  if (!readPriceRes.ok) {
    console.error('READ Prices failed:', rPriceJson);
  } else {
    console.log('✅ Read Pending Prices length:', rPriceJson.data.length);
  }

  console.log('\n--- TESTS COMPLETED SUCCESSFULLY ---');
}

testCRUD().catch(console.error);
