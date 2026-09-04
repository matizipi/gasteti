"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ExpenseList from '@/components/ExpenseList';

function GastosContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'current';
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // If view is 'current', always force current month/year
  useEffect(() => {
    if (view === 'current') {
      const d = new Date();
      setSelectedMonth(d.getMonth() + 1);
      setSelectedYear(d.getFullYear());
    }
  }, [view]);

  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        const res = await fetch(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`);
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
  }, [selectedMonth, selectedYear, view]);

  const requestDelete = (id: string) => {
    setExpenseToDelete(id);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      const res = await fetch(`/api/expenses/${expenseToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenses(prev => prev.filter((exp: any) => exp._id !== expenseToDelete));
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
    } finally {
      setExpenseToDelete(null);
    }
  };

  const totalGastado = expenses.reduce((acc, exp: any) => acc + exp.amount, 0);

  let matuNet = 0;
  const user1 = 'Matu';
  const user2 = 'Florcita';

  expenses.forEach((exp: any) => {
    const personal = exp.personalAmount || 0;
    const sharedAmount = exp.amount - personal;

    if (exp.paidBy === user1) {
      matuNet += sharedAmount / 2;
    } else if (exp.paidBy === user2) {
      matuNet -= sharedAmount / 2;
    }

    if (personal > 0) {
      if (exp.paidBy === user1 && exp.personalFor === user2) {
        matuNet += personal;
      } else if (exp.paidBy === user2 && exp.personalFor === user1) {
        matuNet -= personal;
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

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <main className="container" style={{ paddingTop: '80px' }}>
      <h1 style={{ textAlign: 'center', margin: '0 0 20px 0', color: 'var(--primary)', fontSize: '2rem' }}>
        {view === 'current' ? 'Gastos del Mes' : 'Histórico de Gastos'}
      </h1>

      {view === 'history' && (
        <div className="card" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))}
            style={{ width: 'auto', flex: 1 }}
          >
            {monthNames.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
            style={{ width: 'auto', flex: 1 }}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      <div className="card" style={{ textAlign: 'center', background: 'var(--secondary)', color: 'white', border: 'none', padding: '16px' }}>
        <h3 style={{ margin: 0, opacity: 0.9 }}>Total del Mes</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          ${totalGastado.toFixed(2)}
        </div>
      </div>
      
      {totalGastado > 0 && (
        <div className="card" style={{ textAlign: 'center', background: 'white', border: '2px solid var(--primary)', padding: '16px', marginTop: '-12px', borderRadius: '16px' }}>
          <h4 style={{ margin: 0, color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Balance de Cuentas</h4>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
            ${balanceAmount.toFixed(2)}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {balanceText}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Cargando...</div>
      ) : (
        <ExpenseList expenses={expenses} onDelete={requestDelete} />
      )}

      {expenseToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Eliminar gasto? 🥺</h3>
            <p>Se borrará este gasto permanentemente y el balance se recalculará automáticamente.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setExpenseToDelete(null)}>
                Mejor no
              </button>
              <button className="btn-confirm" onClick={confirmDelete}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import { Suspense } from 'react';

export default function GastosPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--primary)' }}>Cargando...</div>}>
      <GastosContent />
    </Suspense>
  );
}
