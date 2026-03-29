export const metadata = { title: 'တောင်သူအလင်း — AI အကြံပြု' };

export default function RecommendationPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">AI ရောင်းချမှု အကြံပြုချက်</h1>
      <p className="page-subtitle">သင့်နှမ်းအတွက် AI ခန့်မှန်းတွက်ချက်မှု</p>

      {/* Product Summary */}
      <div className="card mb-lg" style={{ background: 'linear-gradient(135deg,var(--primary-50),#fff)' }}>
        <div className="flex items-center gap-md">
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>နှမ်း — မန္တလေးစျေးကွက်</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>ယနေ့စျေး: 52,500 ကျပ်/တင်း</div>
          </div>
        </div>
      </div>

      {/* Trend & Forecast */}
      <div className="grid-3 mb-lg">
        <div className="forecast-card">
          <div className="forecast-period">ယခုလက်ရှိ</div>
          <div className="forecast-direction up">↑</div>
          <div className="forecast-label">တက်နေသည်</div>
          <div className="forecast-confidence">ယခင် 7 ရက်: +3.2%</div>
        </div>
        <div className="forecast-card">
          <div className="forecast-period">လာမည့် 7 ရက် ခန့်မှန်း</div>
          <div className="forecast-direction up">↑</div>
          <div className="forecast-label">ဆက်တက်နိုင်</div>
          <div className="forecast-confidence">ယုံကြည်မှု: 75%</div>
        </div>
        <div className="forecast-card">
          <div className="forecast-period">လာမည့် 30 ရက် ခန့်မှန်း</div>
          <div className="forecast-direction stable">→</div>
          <div className="forecast-label">တည်ငြိမ်နိုင်</div>
          <div className="forecast-confidence">ယုံကြည်မှု: 60%</div>
        </div>
      </div>

      {/* Main Recommendation */}
      <div className="recommendation-card wait mb-lg">
        <div className="recommendation-action" style={{ color: 'var(--earth-700)' }}>စောင့်ပါ</div>
        <div className="recommendation-reason">နှမ်းစျေးနှုန်း လာမည့် 7 ရက်အတွင်း 5-8% ထပ်တက်နိုင်ခြေရှိပါသည်။ ဝယ်လိုအား မြင့်တက်နေပြီး ရာသီဥတုအခြေအနေ ကောင်းမွန်နေပါသည်။</div>
      </div>

      {/* Why This Recommendation */}
      <div className="card mb-lg">
        <div className="card-title mb-md">ဘာကြောင့် &quot;စောင့်ပါ&quot; ဟု အကြံပြုရသနည်း?</div>
        <div className="flex flex-col gap-md">
          <div className="insight-card" style={{ borderLeftColor: 'var(--trend-up)' }}>
            <div className="insight-text"><strong>စျေးကွက်လမ်းကြောင်း:</strong> ယခင် 7 ရက်အတွင်း စျေးနှုန်း အဆက်မပြတ် တက်နေပါသည်။</div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="insight-text"><strong>ရာသီဥတု:</strong> မိုးရွာသွန်းမှု နည်းပါးပြီး ရိတ်သိမ်းရေး/သယ်ယူပို့ဆောင်ရေး ကောင်းမွန်ပါသည်။</div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--earth-500)' }}>
            <div className="insight-text"><strong>ရာသီကာလ:</strong> ဧပြီလဆန်းတွင် နှမ်းဝယ်လိုအား ပိုမြင့်တတ်သည့် ကာလဖြစ်ပါသည်။</div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="insight-text"><strong>ပမာဏ:</strong> ယခုနှစ် ထုတ်လုပ်မှုပမာဏ နည်းပါးသဖြင့် ဝယ်လိုအားက ရောင်းလိုအားထက် ပိုများနေပါသည်။</div>
          </div>
        </div>
      </div>
    </div>
  );
}
