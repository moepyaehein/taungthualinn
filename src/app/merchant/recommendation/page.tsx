'use client';

import { useState } from 'react';

/* ── Crop categories & products (mirroring DB schema) ── */
const cropCategories = [
  {
    id: 'oilseed',
    name: 'ဆီထွက်သီးနှံ',
    nameEn: 'Oilseeds',
    icon: '🌻',
    products: [
      { id: 'sesame', name: 'နှမ်း', nameEn: 'Sesame' },
      { id: 'groundnut', name: 'မြေပဲ', nameEn: 'Groundnut' },
      { id: 'sunflower', name: 'နေကြာ', nameEn: 'Sunflower' },
      { id: 'mustard', name: 'မုန်ညင်း', nameEn: 'Mustard' },
    ],
  },
  {
    id: 'pulses',
    name: 'ပဲမျိုးစုံ',
    nameEn: 'Pulses',
    icon: '🫘',
    products: [
      { id: 'greengram', name: 'ပဲတီစိမ်း', nameEn: 'Green Gram' },
      { id: 'chickpea', name: 'ကုလားပဲ', nameEn: 'Chickpea' },
      { id: 'blackgram', name: 'မတ်ပဲ', nameEn: 'Black Gram' },
      { id: 'pigeonpea', name: 'ပဲစင်းငုံ', nameEn: 'Pigeon Pea' },
    ],
  },
  {
    id: 'cereals',
    name: 'ကောက်နှံမျိုးစုံ',
    nameEn: 'Cereals',
    icon: '🌾',
    products: [
      { id: 'rice', name: 'ဆန်', nameEn: 'Rice' },
      { id: 'corn', name: 'ပြောင်း', nameEn: 'Corn' },
      { id: 'wheat', name: 'ဂျုံ', nameEn: 'Wheat' },
    ],
  },
  {
    id: 'spices',
    name: 'မြန်မာ့ဟင်းခတ်',
    nameEn: 'Spices',
    icon: '🌶️',
    products: [
      { id: 'chili', name: 'ငရုတ်', nameEn: 'Chili' },
      { id: 'turmeric', name: 'နံနံ', nameEn: 'Turmeric' },
      { id: 'onion', name: 'ကြက်သွန်', nameEn: 'Onion' },
    ],
  },
  {
    id: 'industrial',
    name: 'စက်မှုသီးနှံ',
    nameEn: 'Industrial Crops',
    icon: '🏭',
    products: [
      { id: 'cotton', name: 'ဝါ', nameEn: 'Cotton' },
      { id: 'sugarcane', name: 'ကြံ', nameEn: 'Sugarcane' },
      { id: 'rubber', name: 'ရာဘာ', nameEn: 'Rubber' },
    ],
  },
];

/* ── Simulated AI data per product ── */
type RecommendationType = 'buy' | 'wait' | 'watch';
type TrendDirection = 'up' | 'down' | 'stable';

interface AIRecommendation {
  currentPrice: string;
  market: string;
  trend7d: { direction: TrendDirection; pct: string };
  forecast7d: { direction: TrendDirection; label: string; confidence: string };
  forecast30d: { direction: TrendDirection; label: string; confidence: string };
  action: RecommendationType;
  actionLabel: string;
  reason: string;
  insights: { color: string; title: string; text: string }[];
  bestBuyPrice: string;
  supplyLevel: string;
}

const aiData: Record<string, AIRecommendation> = {
  sesame: {
    currentPrice: '52,500 ကျပ်/တင်း',
    market: 'မန္တလေးစျေး',
    trend7d: { direction: 'up', pct: '+3.2%' },
    forecast7d: { direction: 'up', label: 'ဆက်တက်နိုင်', confidence: '75%' },
    forecast30d: { direction: 'stable', label: 'တည်ငြိမ်နိုင်', confidence: '60%' },
    action: 'buy',
    actionLabel: 'ဝယ်ပါ',
    reason: 'နှမ်းစျေးနှုန်း လာမည့် 7 ရက်အတွင်း 5-8% ထပ်တက်နိုင်ခြေရှိပါသည်။ ယခုဝယ်ယူပါက အမြတ်ကောင်း ရနိုင်ပါသည်။',
    insights: [
      { color: 'var(--trend-up)', title: 'စျေးကွက်လမ်းကြောင်း', text: 'ယခင် 7 ရက်အတွင်း စျေးနှုန်း အဆက်မပြတ် တက်နေပါသည်။' },
      { color: 'var(--info)', title: 'ရာသီဥတု', text: 'မိုးရွာသွန်းမှု နည်းပါးပြီး ထုတ်လုပ်မှု ပုံမှန်ဖြစ်နေပါသည်။' },
      { color: 'var(--earth-500)', title: 'ရာသီကာလ', text: 'ဧပြီလဆန်းတွင် နှမ်းဝယ်လိုအား ပိုမြင့်တတ်သည့် ကာလဖြစ်ပါသည်။' },
      { color: 'var(--warning)', title: 'ထုတ်လုပ်မှု', text: 'ယခုနှစ် ထုတ်လုပ်မှုပမာဏ နည်းပါးသဖြင့် supply တင်းမာနေပါသည်။' },
    ],
    bestBuyPrice: '50,000 - 51,500 ကျပ်',
    supplyLevel: 'နည်း',
  },
  groundnut: {
    currentPrice: '45,000 ကျပ်/တင်း',
    market: 'မန္တလေးစျေး',
    trend7d: { direction: 'down', pct: '-1.8%' },
    forecast7d: { direction: 'down', label: 'ဆက်ကျနိုင်', confidence: '65%' },
    forecast30d: { direction: 'up', label: 'ပြန်တက်နိုင်', confidence: '55%' },
    action: 'wait',
    actionLabel: 'စောင့်ပါ',
    reason: 'မြေပဲစျေး ယခု ကျဆင်းနေသဖြင့် နောက်တစ်ပတ် စောင့်ပြီးမှ ဝယ်ယူပါက ပိုသက်သာနိုင်ပါသည်။',
    insights: [
      { color: 'var(--trend-down)', title: 'စျေးကျဆင်းမှု', text: 'ရိတ်သိမ်းရာသီ ကာလကြောင့် ပမာဏ များပြားနေပါသည်။' },
      { color: 'var(--info)', title: 'ရာသီဥတု', text: 'ရာသီဥတု ကောင်းမွန်ပြီး ထုတ်လုပ်မှုအားကောင်းပါသည်။' },
      { color: 'var(--earth-500)', title: 'တင်ပို့မှု', text: 'တရုတ်ဝယ်လိုအား ကျဆင်းနေသဖြင့် ပြည်တွင်းစျေး အနိမ့်ဆင်းနိုင်ပါသည်။' },
      { color: 'var(--warning)', title: 'သိုလှောင်မှု', text: 'ကြာကြာ သိုလှောင်ရန် မသင့်တော်သည့် အချိန်ဖြစ်ပါသည်။' },
    ],
    bestBuyPrice: '42,000 - 43,500 ကျပ်',
    supplyLevel: 'များ',
  },
  greengram: {
    currentPrice: '68,000 ကျပ်/တင်း',
    market: 'ရန်ကုန်စျေး',
    trend7d: { direction: 'up', pct: '+5.1%' },
    forecast7d: { direction: 'up', label: 'ဆက်တက်နိုင်', confidence: '80%' },
    forecast30d: { direction: 'up', label: 'ဆက်တက်နိုင်', confidence: '70%' },
    action: 'buy',
    actionLabel: 'အမြန်ဝယ်ပါ',
    reason: 'ပဲတီစိမ်းစျေး ပြည်တွင်းဝယ်လိုအား မြင့်တက်မှုကြောင့် လျင်မြန်စွာ တက်နေပါသည်။ ယခုဝယ်ပါက အမြတ်ကောင်း ရနိုင်ပါသည်။',
    insights: [
      { color: 'var(--trend-up)', title: 'ပြည်တွင်း ဝယ်လိုအား', text: 'ပြည်တွင်း စျေးကွက် လိုအပ်ချက် တိုးမြှင့်ထားပါသည်။' },
      { color: 'var(--info)', title: 'ပြည်တွင်းစျေး', text: 'ပြည်တွင်းပဲတီစိမ်းစျေး လွန်ခဲ့သည့် ၃ နှစ်အတွင်း အမြင့်ဆုံးဖြစ်ပါသည်။' },
      { color: 'var(--earth-500)', title: 'ပမာဏ', text: 'တင်ပို့ရန် ပဲပမာဏ လိုအပ်ချက် မြင့်မားနေပါသည်။' },
      { color: 'var(--warning)', title: 'ယှဉ်ပြိုင်မှု', text: 'အခြား ကုန်သည်များလည်း ဝယ်ယူမှု တိုးခြင်းရှိပါသည်။' },
    ],
    bestBuyPrice: '65,000 - 67,000 ကျပ်',
    supplyLevel: 'အလယ်အလတ်',
  },
  chickpea: {
    currentPrice: '55,000 ကျပ်/တင်း',
    market: 'မန္တလေးစျေး',
    trend7d: { direction: 'stable', pct: '+0.3%' },
    forecast7d: { direction: 'stable', label: 'တည်ငြိမ်', confidence: '70%' },
    forecast30d: { direction: 'up', label: 'တက်နိုင်', confidence: '55%' },
    action: 'watch',
    actionLabel: 'စောင့်ကြည့်ပါ',
    reason: 'ကုလားပဲစျေး ယခု တည်ငြိမ်နေပြီး လာမည့်လတွင် တက်နိုင်ခြေရှိပါသည်။ စျေးကွက်အခြေအနေ ဆက်လက်စောင့်ကြည့်ပါ။',
    insights: [
      { color: 'var(--trend-stable)', title: 'စျေးတည်ငြိမ်', text: 'လက်ရှိ ရောင်းလိုအားနှင့် ဝယ်လိုအား ညီမျှနေပါသည်။' },
      { color: 'var(--info)', title: 'ရာသီခြေအနေ', text: 'ရိတ်သိမ်းချိန် ကုန်ဆုံးသဖြင့် ပမာဏ တည်ငြိမ်ပါသည်။' },
      { color: 'var(--earth-500)', title: 'ပြည်တွင်းလမ်းကြောင်း', text: 'ပြည်တွင်း ရောင်းဝယ်မှု ထပ်မံတိုးနိုင်ပါသည်။' },
      { color: 'var(--warning)', title: 'စျေးပြောင်းလဲမှု', text: 'ရုတ်တရက် ပြောင်းလဲနိုင်ခြေ ရှိသဖြင့် သတိထားပါ။' },
    ],
    bestBuyPrice: '53,500 - 54,800 ကျပ်',
    supplyLevel: 'အလယ်အလတ်',
  },
  rice: {
    currentPrice: '38,000 ကျပ်/အိတ်',
    market: 'ဗိုလ်ချုပ်စျေး',
    trend7d: { direction: 'stable', pct: '+0.5%' },
    forecast7d: { direction: 'stable', label: 'တည်ငြိမ်', confidence: '85%' },
    forecast30d: { direction: 'stable', label: 'တည်ငြိမ်', confidence: '75%' },
    action: 'watch',
    actionLabel: 'စောင့်ကြည့်ပါ',
    reason: 'ဆန်စျေး တည်ငြိမ်နေပြီး အစိုးရထိန်းချုပ်မှုကြောင့် ကြီးမားသော ပြောင်းလဲမှု မရှိနိုင်ပါ။',
    insights: [
      { color: 'var(--trend-stable)', title: 'အစိုးရမူဝါဒ', text: 'ဆန်တင်ပို့မှု ထိန်းချုပ်ထားသဖြင့် စျေး တည်ငြိမ်နေပါသည်။' },
      { color: 'var(--info)', title: 'ထုတ်လုပ်မှု', text: 'နွေစပါး ရိတ်သိမ်းချိန် ကာလဖြစ်ပါသည်။' },
      { color: 'var(--earth-500)', title: 'သိုလှောင်မှု', text: 'အစိုးရ ဆန်သိုလှောင်မှု ပြည့်ဝနေပါသည်။' },
      { color: 'var(--warning)', title: 'အကြံပြု', text: 'အနည်းငယ်သာ ဝယ်ယူပြီး စျေးကွက်ကို စောင့်ကြည့်ပါ။' },
    ],
    bestBuyPrice: '37,000 - 37,800 ကျပ်',
    supplyLevel: 'များ',
  },
};

/* Default fallback for products without specific data */
const defaultAI: AIRecommendation = {
  currentPrice: '—',
  market: 'မန္တလေးစျေး',
  trend7d: { direction: 'stable', pct: '0%' },
  forecast7d: { direction: 'stable', label: 'ဒေတာမရှိသေး', confidence: '—' },
  forecast30d: { direction: 'stable', label: 'ဒေတာမရှိသေး', confidence: '—' },
  action: 'watch',
  actionLabel: 'စောင့်ကြည့်ပါ',
  reason: 'ဤထုတ်ကုန်အတွက် လုံလောက်သော ဒေတာ မရှိသေးပါ။ စျေးကွက်အချက်အလက်များ ထပ်မံစုဆောင်းနေပါသည်။',
  insights: [
    { color: 'var(--gray-400)', title: 'ဒေတာ', text: 'ဤထုတ်ကုန်အတွက် AI ခန့်မှန်းရန် ဒေတာ ပိုမိုလိုအပ်ပါသည်။' },
  ],
  bestBuyPrice: '—',
  supplyLevel: '—',
};

const directionArrow: Record<TrendDirection, string> = { up: '↑', down: '↓', stable: '→' };
const directionLabel: Record<TrendDirection, string> = { up: 'တက်နေသည်', down: 'ကျနေသည်', stable: 'တည်ငြိမ်' };

export default function MerchantRecommendationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const category = cropCategories.find((c) => c.id === selectedCategory);
  const product = category?.products.find((p) => p.id === selectedProduct);
  const rec = selectedProduct ? aiData[selectedProduct] || defaultAI : null;

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">AI ဝယ်ယူမှု အကြံပြုချက်</h1>
      <p className="page-subtitle">သီးနှံအမျိုးအစား ရွေးချယ်ပြီး AI ခန့်မှန်းတွက်ချက်မှုကို ကြည့်ရှုပါ</p>

      {/* ── Step 1: Category Selection ── */}
      <div className="card mb-lg" style={{ overflow: 'hidden' }}>
        <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)',
            fontWeight: 700, color: '#fff',
            background: selectedCategory ? 'var(--primary-600)' : 'var(--gray-400)',
          }}>၁</span>
          သီးနှံ အမျိုးအစား ရွေးချယ်ပါ
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {cropCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedProduct(null); }}
              className="merchant-category-chip"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', borderRadius: 'var(--radius-full)',
                border: selectedCategory === cat.id ? '2px solid #4f46e5' : '1.5px solid var(--gray-300)',
                background: selectedCategory === cat.id
                  ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)'
                  : '#fff',
                color: selectedCategory === cat.id ? '#4338ca' : 'var(--gray-700)',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                fontSize: 'var(--font-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat.id
                  ? '0 2px 12px rgba(79, 70, 229, 0.15)'
                  : 'var(--shadow-sm)',
                transform: selectedCategory === cat.id ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 2: Product Selection (shown after category) ── */}
      {selectedCategory && category && (
        <div className="card mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)',
              fontWeight: 700, color: '#fff',
              background: selectedProduct ? 'var(--primary-600)' : 'var(--gray-400)',
            }}>၂</span>
            {category.icon} {category.name} — ထုတ်ကုန် ရွေးချယ်ပါ
          </div>
          <div className="grid-4" style={{ gap: '12px' }}>
            {category.products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => handleProductSelect(prod.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedProduct === prod.id ? '2px solid #4f46e5' : '1.5px solid var(--gray-200)',
                  background: selectedProduct === prod.id
                    ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)'
                    : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProduct === prod.id
                    ? '0 4px 15px rgba(79, 70, 229, 0.15)'
                    : 'var(--shadow-sm)',
                  transform: selectedProduct === prod.id ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{
                  fontWeight: selectedProduct === prod.id ? 700 : 600,
                  color: selectedProduct === prod.id ? '#4338ca' : 'var(--gray-800)',
                  fontSize: 'var(--font-base)',
                  marginBottom: '4px',
                }}>{prod.name}</div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: selectedProduct === prod.id ? '#6366f1' : 'var(--gray-400)',
                }}>{prod.nameEn}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Loading ── */}
      {isAnalyzing && (
        <div className="card mb-lg" style={{
          textAlign: 'center', padding: 'var(--space-2xl)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto var(--space-md)',
            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse-dot 1.5s infinite',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: 'var(--gray-800)', marginBottom: '8px' }}>
            AI ခွဲခြမ်းစိတ်ဖြာနေသည်...
          </div>
          <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>
            စျေးကွက်ဒေတာ၊ ရာသီဥတုနှင့် ပြည်တွင်းစျေးကို တွက်ချက်နေပါသည်
          </div>
          <div style={{
            marginTop: 'var(--space-lg)', height: 4, background: 'var(--gray-200)',
            borderRadius: 'var(--radius-full)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
              animation: 'loading-bar 1.2s ease-in-out',
            }} />
          </div>
          <style>{`
            @keyframes loading-bar {
              0% { width: 0%; }
              60% { width: 70%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* ── Step 3: AI Recommendation Results ── */}
      {rec && product && !isAnalyzing && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Product Summary Header */}
          <div className="card mb-lg" style={{
            background: 'linear-gradient(135deg, #eef2ff, #fff)',
            borderColor: '#c7d2fe',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: 'var(--gray-900)' }}>
                  {product.name} ({product.nameEn}) — {rec.market}
                </div>
                <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)', marginTop: '4px' }}>
                  ယနေ့စျေး: <strong style={{ color: 'var(--gray-800)' }}>{rec.currentPrice}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)', fontWeight: 600,
                  background: rec.supplyLevel === 'များ' ? 'var(--success-bg)' : rec.supplyLevel === 'နည်း' ? '#fef3c7' : 'var(--gray-100)',
                  color: rec.supplyLevel === 'များ' ? '#065f46' : rec.supplyLevel === 'နည်း' ? '#92400e' : 'var(--gray-600)',
                }}>
                  Supply: {rec.supplyLevel}
                </div>
                <div style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)', fontWeight: 600,
                  background: '#e0e7ff', color: '#4338ca',
                }}>
                  အကောင်းဆုံးဝယ်စျေး: {rec.bestBuyPrice}
                </div>
              </div>
            </div>
          </div>

          {/* Trend & Forecast Cards */}
          <div className="grid-3 mb-lg">
            <div className="forecast-card">
              <div className="forecast-period">ယခုလက်ရှိ</div>
              <div className={`forecast-direction ${rec.trend7d.direction}`}>
                {directionArrow[rec.trend7d.direction]}
              </div>
              <div className="forecast-label">{directionLabel[rec.trend7d.direction]}</div>
              <div className="forecast-confidence">ယခင် ၇ ရက်: {rec.trend7d.pct}</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">လာမည့် ၇ ရက် ခန့်မှန်း</div>
              <div className={`forecast-direction ${rec.forecast7d.direction}`}>
                {directionArrow[rec.forecast7d.direction]}
              </div>
              <div className="forecast-label">{rec.forecast7d.label}</div>
              <div className="forecast-confidence">ယုံကြည်မှု: {rec.forecast7d.confidence}</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">လာမည့် ၃၀ ရက် ခန့်မှန်း</div>
              <div className={`forecast-direction ${rec.forecast30d.direction}`}>
                {directionArrow[rec.forecast30d.direction]}
              </div>
              <div className="forecast-label">{rec.forecast30d.label}</div>
              <div className="forecast-confidence">ယုံကြည်မှု: {rec.forecast30d.confidence}</div>
            </div>
          </div>

          {/* Main Recommendation Card */}
          <div className={`recommendation-card ${rec.action === 'buy' ? 'sell' : rec.action} mb-lg`}>
            <div className="recommendation-icon">
              {rec.action === 'buy' ? '🛒' : rec.action === 'wait' ? '⏳' : '👁️'}
            </div>
            <div className="recommendation-action" style={{
              color: rec.action === 'buy' ? 'var(--primary-700)' : rec.action === 'wait' ? 'var(--earth-700)' : '#1e40af',
            }}>
              {rec.actionLabel}
            </div>
            <div className="recommendation-reason">{rec.reason}</div>
          </div>

          {/* Why This Recommendation */}
          <div className="card mb-lg">
            <div className="card-title mb-md">ဘာကြောင့် &quot;{rec.actionLabel}&quot; ဟု အကြံပြုရသနည်း?</div>
            <div className="flex flex-col gap-md">
              {rec.insights.map((ins, i) => (
                <div key={i} className="insight-card" style={{ borderLeftColor: ins.color }}>
                  <div className="insight-text">
                    <strong>{ins.title}:</strong> {ins.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merchant-specific: Buying Strategy */}
          <div className="grid-2 mb-lg">
            <div className="card" style={{ borderTop: '3px solid #4f46e5' }}>
              <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span> ဝယ်ယူရေး နည်းဗျူဟာ
              </div>
              <div style={{ fontSize: 'var(--font-sm)', lineHeight: 2 }}>
                <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>အကောင်းဆုံး ဝယ်စျေး</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5' }}>{rec.bestBuyPrice}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>ဝယ်ယူရန် အကြံပြုချိန်</span>
                  <span style={{ fontWeight: 700 }}>{rec.action === 'buy' ? 'ယခုပင်' : 'နောက်တစ်ပတ်'}</span>
                </div>
                <div style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Supply အခြေအနေ</span>
                  <span style={{
                    fontWeight: 700,
                    color: rec.supplyLevel === 'များ' ? 'var(--success)' : rec.supplyLevel === 'နည်း' ? 'var(--warning)' : 'var(--gray-600)',
                  }}>{rec.supplyLevel}</span>
                </div>
              </div>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--primary-500)' }}>
              <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>📊</span> ဈေးကွက် သုံးသပ်ချက်
              </div>
              <div style={{ fontSize: 'var(--font-sm)', lineHeight: 2 }}>
                <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>လက်ရှိ ဝယ်/ရောင်း အချိုး</span>
                  <span style={{ fontWeight: 700 }}>{rec.action === 'buy' ? 'ဝယ်လိုအား > ရောင်းလိုအား' : 'ညီမျှ'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>စျေးအတက်အကျ ပြင်းအား</span>
                  <span style={{ fontWeight: 700 }}>{rec.trend7d.pct}</span>
                </div>
                <div style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>AI ခန့်မှန်း ယုံကြည်မှု</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{rec.forecast7d.confidence}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: 'var(--space-md) var(--space-lg)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)',
            fontSize: 'var(--font-xs)',
            color: 'var(--gray-400)',
            textAlign: 'center',
            lineHeight: 1.8,
          }}>
            ⚠️ ဤအကြံပြုချက်သည် AI စနစ်မှ စျေးကွက်ဒေတာ၊ ရာသီဥတုနှင့် ခေတ်ရေစီးကြောင်းများကို အခြေခံ၍ တွက်ချက်ထားခြင်း ဖြစ်ပါသည်။ နောက်ဆုံးဆုံးဖြတ်ချက်ကို သင်ကိုယ်တိုင် ချမှတ်ပါ။
          </div>
        </div>
      )}

      {/* Empty state when nothing selected */}
      {!selectedCategory && (
        <div className="card" style={{
          textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)',
          background: 'linear-gradient(135deg, var(--gray-50), #fff)',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
            fontSize: '2rem',
          }}>
            🤖
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--font-xl)', color: 'var(--gray-800)', marginBottom: '8px' }}>
            AI ဝယ်ယူမှု ပညာရှင်
          </div>
          <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)', maxWidth: 400, margin: '0 auto', lineHeight: 1.8 }}>
            အထက်ပါ သီးနှံအမျိုးအစားတစ်ခုကို ရွေးချယ်ပါ။ AI စနစ်မှ စျေးကွက်ခေတ်ရေစီးကြောင်း၊ ရာသီဥတုနှင့် ပြည်တွင်းဈေးကွက်ဒေတာကို ခွဲခြမ်းစိတ်ဖြာပြီး ဝယ်ယူရေး အကြံပြုချက် ပေးပါမည်။
          </div>
        </div>
      )}
    </div>
  );
}
