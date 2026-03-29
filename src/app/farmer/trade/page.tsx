'use client';

import TradeTransactionForm from '@/components/TradeTransactionForm';

export default function FarmerTradePage() {
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: 'var(--space-md)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <TradeTransactionForm role="farmer" />
      </div>
    </div>
  );
}
