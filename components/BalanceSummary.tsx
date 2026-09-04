"use client";

import { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';
import './components.css';

interface Expense {
  _id: string;
  amount: number;
  paidBy: string;
}

export default function BalanceSummary({ refreshTrigger }: { refreshTrigger: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Using placeholders. We will update these if the user provides names
  const user1 = 'Matu';
  const user2 = 'Florcita';

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch('/api/expenses');
        const json = await res.json();
        if (json.success) {
          setExpenses(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="card balance-card">Calculando...</div>;
  }


  let totalGastado = 0;
  let matuNet = 0;

  expenses.forEach((exp: any) => {
    totalGastado += exp.amount;
    const personal = exp.personalAmount || 0;
    const sharedAmount = exp.amount - personal;

    // Shared calculations
    if (exp.paidBy === user1) {
      matuNet += sharedAmount / 2;
    } else if (exp.paidBy === user2) {
      matuNet -= sharedAmount / 2;
    }

    // Personal calculations
    if (personal > 0) {
      if (exp.paidBy === user1 && exp.personalFor === user2) {
        matuNet += personal; // Matu paid for Florcita
      } else if (exp.paidBy === user2 && exp.personalFor === user1) {
        matuNet -= personal; // Florcita paid for Matu
      }
    }
  });

  let balanceText = "Están a mano 😊";
  let balanceAmount = 0;

  if (matuNet > 0) {
    balanceAmount = matuNet;
    balanceText = `${user2} le debe a ${user1}`;
  } else if (matuNet < 0) {
    balanceAmount = Math.abs(matuNet);
    balanceText = `${user1} le debe a ${user2}`;
  }

  return (
    <div className="card balance-card">
      <PiggyBank size={48} color="var(--primary)" style={{ margin: '0 auto', display: 'block', marginBottom: '10px' }} />
      <h3 style={{ color: 'var(--text-muted)' }}>Balance Total</h3>
      <div className="balance-amount">
        ${balanceAmount > 0 ? balanceAmount.toFixed(2) : '0.00'}
      </div>
      <div className="balance-text">
        {balanceText}
      </div>
      <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Total gastado este mes: ${totalGastado.toFixed(2)}
      </div>
    </div>
  );
}
