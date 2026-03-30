'use client';

import { useState } from 'react';

const uploadedFiles = [
  {
    id: 1,
    merchant: 'ဦးကျော်မင်း',
    fileName: 'prices_mar28.csv',
    fileType: 'CSV',
    fileSize: '၁၂ KB',
    items: 15,
    date: '၂၀၂၆ မတ် ၂၈',
    status: 'pending' as const,
    products: ['နှမ်း', 'မြေပဲ', 'နှမ်းနက်'],
    market: 'မန္တလေး',
  },
  {
    id: 2,
    merchant: 'ဒေါ်ခင်လှိုင်',
    fileName: 'weekly_prices.xlsx',
    fileType: 'Excel',
    fileSize: '၂၈ KB',
    items: 8,
    date: '၂၀၂၆ မတ် ၂၇',
    status: 'reviewed' as const,
    products: ['ပဲတီစိမ်း', 'ပဲစင်းငုံ'],
    market: 'မိတ္ထီလာ',
  },
  {
    id: 3,
    merchant: 'ကုမ္ပဏီ ABC',
    fileName: 'bulk_data.csv',
    fileType: 'CSV',
    fileSize: '၄၅ KB',
    items: 35,
    date: '၂၀၂၆ မတ် ၂၆',
    status: 'flagged' as const,
    products: ['ဆန်', 'ပဲလွန်း', 'ကုလားပဲ', 'ပဲပုပ်'],
    market: 'စစ်ကိုင်း',
  },
  {
    id: 4,
    merchant: 'ဦးမင်းထွေး',
    fileName: 'sesame_prices.csv',
    fileType: 'CSV',
    fileSize: '၈ KB',
    items: 5,
    date: '၂၀၂၆ မတ် ၂၈',
    status: 'pending' as const,
    products: ['နှမ်း', 'နှမ်းနက်'],
    market: 'မန္တလေး',
  },
  {
    id: 5,
    merchant: 'ဦးသန်းဝင်း',
    fileName: 'rice_market.xlsx',
    fileType: 'Excel',
    fileSize: '၃၂ KB',
    items: 12,
    date: '၂၀၂၆ မတ် ၂၅',
    status: 'approved' as const,
    products: ['ဆန်', 'ဆန်ကျိုး'],
    market: 'စစ်ကိုင်း',
  },
  {
    id: 6,
    merchant: 'ဒေါ်နွယ်နွယ်',
    fileName: 'photo_receipt_001.jpg',
    fileType: 'ဓာတ်ပုံ',
    fileSize: '၁.၂ MB',
    items: 1,
    date: '၂၀၂၆ မတ် ၂၈',
    status: 'pending' as const,
    products: ['ပဲတီစိမ်း'],
    market: 'ပြင်ဦးလွင်',
  },
];

const statusLabels: Record<string, string> = {
  pending: 'စောင့်ဆဲ',
  reviewed: 'စစ်ပြီး',
  approved: 'အတည်ပြုပြီး',
  flagged: 'သံသယ',
};

const statusColors: Record<string, string> = {
  pending: 'var(--warning)',
  reviewed: 'var(--info, #3b82f6)',
  approved: 'var(--success)',
  flagged: 'var(--danger)',
};

const fileTypeIcons: Record<string, string> = {
  CSV: '📄',
  Excel: '📊',
  'ဓာတ်ပုံ': '🖼️',
};

export default function AdminVerifyPage() {
  const [filter, setFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<number | null>(null);

  const filtered = filter === 'all' ? uploadedFiles : uploadedFiles.filter(f => f.status === filter);

  const counts = {
    all: uploadedFiles.length,
    pending: uploadedFiles.filter(f => f.status === 'pending').length,
    reviewed: uploadedFiles.filter(f => f.status === 'reviewed').length,
    approved: uploadedFiles.filter(f => f.status === 'approved').length,
    flagged: uploadedFiles.filter(f => f.status === 'flagged').length,
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">ဈေးနှုန်းစစ်ဆေးခြင်း</h1>
      <p className="page-subtitle">ကုန်သည်များ တင်သွင်းထားသော ဖိုင်များနှင့် စျေးနှုန်းများကို စစ်ဆေးရန်</p>

      {/* Stats */}
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ဖိုင်</div><div className="stat-value">{counts.all}</div></div>
        <div className="stat-card"><div className="stat-label">စစ်ဆေးရန် စောင့်ဆဲ</div><div className="stat-value" style={{ color: 'var(--warning)' }}>{counts.pending}</div></div>
        <div className="stat-card"><div className="stat-label">အတည်ပြုပြီး</div><div className="stat-value" style={{ color: 'var(--success)' }}>{counts.approved}</div></div>
        <div className="stat-card"><div className="stat-label">သံသယ</div><div className="stat-value" style={{ color: 'var(--danger)' }}>{counts.flagged}</div></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-md mb-lg flex-wrap">
        {([['all', 'အားလုံး'], ['pending', 'စောင့်ဆဲ'], ['reviewed', 'စစ်ပြီး'], ['approved', 'အတည်ပြုပြီး'], ['flagged', 'သံသယ']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px', padding: '6px 16px', fontSize: 'var(--font-sm)' }}
          >
            {label} ({counts[key as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* File List */}
      <div className="card">
        <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>ကုန်သည် Upload ဖိုင်များ</span>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', fontWeight: 400 }}>
            {filtered.length} ဖိုင်
          </span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ကုန်သည်</th>
                <th>ဖိုင်အမည်</th>
                <th>အမျိုးအစား</th>
                <th>အရေအတွက်</th>
                <th>စျေးကွက်</th>
                <th>ရက်စွဲ</th>
                <th>အခြေအနေ</th>
                <th>လုပ်ဆောင်</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file) => (
                <tr
                  key={file.id}
                  style={{
                    background: file.status === 'flagged' ? 'var(--danger-bg, rgba(239,68,68,0.06))' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                >
                  <td style={{ fontWeight: 600 }}>{file.merchant}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{fileTypeIcons[file.fileType] || '📄'}</span>
                      <span>
                        <div style={{ fontWeight: 500 }}>{file.fileName}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>{file.fileSize}</div>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: 'var(--font-xs)',
                      fontWeight: 600,
                      background: file.fileType === 'CSV' ? 'rgba(59,130,246,0.1)' : file.fileType === 'Excel' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: file.fileType === 'CSV' ? '#3b82f6' : file.fileType === 'Excel' ? '#10b981' : '#f59e0b',
                    }}>
                      {file.fileType}
                    </span>
                  </td>
                  <td>{file.items} ခု</td>
                  <td>{file.market}</td>
                  <td style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{file.date}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: 'var(--font-xs)',
                      fontWeight: 700,
                      background: `${statusColors[file.status]}18`,
                      color: statusColors[file.status],
                      border: `1px solid ${statusColors[file.status]}33`,
                    }}>
                      {statusLabels[file.status]}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {file.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }}>အတည်ပြု</button>
                        <button className="btn btn-sm btn-outline">ပယ်</button>
                      </>
                    )}
                    {file.status === 'reviewed' && (
                      <>
                        <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }}>ပြု</button>
                        <button className="btn btn-sm btn-outline">ပယ်</button>
                      </>
                    )}
                    {file.status === 'flagged' && (
                      <>
                        <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }}>ခွင့်ပြု</button>
                        <button className="btn btn-sm btn-danger">ပယ်ငြင်း</button>
                      </>
                    )}
                    {file.status === 'approved' && (
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>✓ ပြီးပြီ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Detail Expandable Panel */}
      {selectedFile && (() => {
        const file = uploadedFiles.find(f => f.id === selectedFile);
        if (!file) return null;
        return (
          <div className="card" style={{ marginTop: 'var(--space-md)', border: '2px solid var(--primary-200)', animation: 'fadeIn 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <div className="card-title">📎 {file.fileName} — အသေးစိတ်</div>
              <button onClick={() => setSelectedFile(null)} className="btn btn-sm btn-outline" style={{ borderRadius: '50%', width: 28, height: 28, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>ကုန်သည်</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{file.merchant}</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>ဖိုင်အမျိုးအစား / အရွယ်</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{file.fileType} — {file.fileSize}</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>စျေးကွက်</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{file.market}</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>ထုတ်ကုန်များ</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {file.products.map((p, i) => (
                    <span key={i} style={{ padding: '3px 10px', borderRadius: '8px', fontSize: 'var(--font-xs)', fontWeight: 600, background: 'rgba(5,150,105,0.1)', color: 'var(--primary-700)' }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
