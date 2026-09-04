"use client";

import { useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import BalanceSummary from '@/components/BalanceSummary';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="container" style={{ paddingTop: '80px' }}>
      <h1 style={{ textAlign: 'center', margin: '20px 0 30px 0', color: 'var(--primary)', fontSize: '2.5rem' }}>
        Kawaii Expenses 🌸
      </h1>
      
      <BalanceSummary refreshTrigger={refreshTrigger} />
      
      <ExpenseForm onExpenseAdded={handleExpenseAdded} />

      <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
        <p>Hecho con ❤️ para que las cuentas claras conserven el amor.</p>
      </div>
    </main>
  );
}
