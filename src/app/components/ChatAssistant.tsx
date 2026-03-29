'use client';

import { useState } from 'react';

const chatResponses: Record<string, string> = {
  'ယနေ့ နှမ်းစျေး ဘယ်လောက်လဲ?': 'ယနေ့ မန္တလေးစျေးကွက်တွင် နှမ်းတစ်တင်းလျှင် 52,500 ကျပ် ဖြစ်ပါသည်။ ယမန်နေ့ထက် 1,500 ကျပ် (3.2%) တက်လာပါသည်။',
  'ရောင်းရမလား?': 'လက်ရှိ AI ခွဲခြမ်းစိတ်ဖြာချက်အရ "စောင့်ပါ" ဟု အကြံပြုပါသည်။ လာမည့် 7 ရက်အတွင်း စျေးနှုန်း 5-8% ထပ်တက်နိုင်ခြေရှိပါသည်။',
  'ဘယ်စျေးကွက်က ပိုကောင်းလဲ?': 'မကွေးစျေးကွက်တွင် နှမ်းစျေး အမြင့်ဆုံး 53,000 ကျပ်ဖြစ်ပြီး သင့်ဒေသ(မန္တလေး)ထက် 500 ကျပ် ပိုမြင့်ပါသည်။ သယ်ယူစရိတ်နှင့်တွက်ချက်ပြီး ဆုံးဖြတ်ပါ။',
  'ရေကြီးမှု အန္တရာယ်ရှိလား?': 'ရှမ်းပြည်နယ်မြောက်ပိုင်းတွင် လာမည့် 5 ရက်အတွင်း မိုးသည်းထန်နိုင်ပါသည်။ သင့်ဒေသ(မန္တလေး)တွင် လက်ရှိ ရာသီဥတုအခြေအနေ ကောင်းမွန်ပါသည်။',
};

export interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', text: 'မင်္ဂလာပါ! ကျွန်ုပ်သည် သင့်အတွက် AI လယ်သမား အကူအညီ ဖြစ်ပါသည်။ စျေးနှုန်း၊ ရောင်းချအကြံပြု၊ ရာသီဥတု စသည်တို့ကို မေးမြန်းနိုင်ပါသည်။' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const suggestions = [
    { short: 'ယနေ့ နှမ်းစျေး?', full: 'ယနေ့ နှမ်းစျေး ဘယ်လောက်လဲ?' },
    { short: 'ရောင်းရမလား?', full: 'ရောင်းရမလား?' },
    { short: 'ဘယ်စျေးကွက်ကောင်းလဲ?', full: 'ဘယ်စျေးကွက်က ပိုကောင်းလဲ?' },
    { short: 'ရေကြီးမှု ရှိလား?', full: 'ရေကြီးမှု အန္တရာယ်ရှိလား?' },
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { type: 'user', text };
    const response = chatResponses[text] || 'ကျေးဇူးတင်ပါသည်။ သင့်မေးခွန်းကို စစ်ဆေးပြီး အမြန်ဆုံး ပြန်ကြားပေးပါမည်။';
    const botMsg: ChatMessage = { type: 'bot', text: response };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputValue('');
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)} aria-label="AI Assistant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <div className="fab-pulse"></div>
      </button>

      <div className={`chat-popup${isOpen ? ' open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-text">
              <h4>AI လယ်သမား အကူအညီ</h4>
              <span>မြန်မာဘာသာ • အသံ/စာ</span>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>{msg.text}</div>
          ))}
        </div>

        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="chat-suggestion-chip" onClick={() => sendMessage(s.full)}>{s.short}</button>
          ))}
        </div>

        <div style={{ padding: '0 var(--space-md) var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'var(--gray-50)', borderRadius: 'var(--radius-full)', padding: '4px 4px 4px 16px' }}>
            <input
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="သင့်မေးခွန်းကို ရိုက်ထည့်ပါ..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 0', fontSize: 'var(--font-sm)', outline: 'none' }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            သို့မဟုတ် ပြောရန် နှိပ်ပါ
          </div>

          <button
            className={`chat-voice-btn-large${isRecording ? ' recording' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
            style={{ width: 64, height: 64, borderRadius: '50%', background: isRecording ? 'var(--danger)' : '#1a3a2a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: 'var(--space-sm)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
