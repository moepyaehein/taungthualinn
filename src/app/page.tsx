import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <>
      <div className="landing-container">
        <div className="landing-logo">
          <Image src="/logo.png" alt="TaungThu Alin" width={48} height={48} style={{ objectFit: 'contain' }} />
          တောင်သူအလင်း
        </div>
        <p className="landing-subtitle">မြန်မာ့စိုက်ပျိုးရေးအတွက် AI အခြေပြု စျေးကွက် ပလက်ဖောင်း</p>

        <div className="portal-cards">
          <Link href="/farmer" className="portal-card farmer">
            <h2>တောင်သူပို့တယ်</h2>
            <p>စျေးနှုန်းကြည့်ရှုရန်၊ AI အကြံပြုချက်ရယူရန်၊ ရောင်းချမှတ်တမ်းခွဲခြမ်းစိတ်ဖြာရန်</p>
          </Link>
          <Link href="/merchant" className="portal-card merchant">
            <h2>ကုန်သည်ပို့တယ်</h2>
            <p>စျေးနှုန်းတင်သွင်းရန်၊ ဝယ်ယူကမ်းလှမ်းချက်စီမံရန်၊ စျေးအတည်ပြုရန်</p>
          </Link>
          <Link href="/admin" className="portal-card admin">
            <h2>စီမံခန့်ခွဲမှု</h2>
            <p>စျေးနှုန်းအတည်ပြုရန်၊ ပလက်ဖောင်းကြီးကြပ်ရန်၊ အရေးပေါ်စီမံရန်</p>
          </Link>
        </div>
      </div>
      <div className="landing-footer">© 2026 တောင်သူအလင်း — AI စိုက်ပျိုးရေးစျေးကွက် ပလက်ဖောင်း</div>
    </>
  );
}
