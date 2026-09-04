"use client";

import { ShoppingCart, Film, Home, Zap, Utensils, Tag, Trash2 } from 'lucide-react';
import './components.css';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
  description?: string;
  personalAmount?: number;
  personalFor?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Supermercado': return { icon: ShoppingCart, color: '#ffb7b2' };
    case 'Cine': return { icon: Film, color: '#b5ead7' };
    case 'Alquiler': return { icon: Home, color: '#c7ceea' };
    case 'Servicios': return { icon: Zap, color: '#e2f0cb' };
    case 'Salidas': return { icon: Utensils, color: '#ffdac1' };
    default: return { icon: Tag, color: '#f0e6f0' };
  }
};

export default function ExpenseList({ expenses, onDelete }: { expenses: Expense[], onDelete?: (id: string) => void }) {
  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        No hay gastos para este mes. ¡Qué ahorro! 💸
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => {
        const { icon: Icon, color } = getCategoryIcon(expense.category);
        const date = new Date(expense.date).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'short'
        });

        return (
          <div key={expense._id} className="expense-item card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ backgroundColor: color, padding: '12px', borderRadius: '16px', color: 'white' }}>
              <Icon size={24} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {expense.category}
                {expense.personalAmount && expense.personalAmount > 0 && (
                  <span style={{ fontSize: '0.7rem', background: '#ffe4e1', color: 'var(--danger)', padding: '2px 8px', borderRadius: '10px' }}>
                    Incluye ${expense.personalAmount} de {expense.personalFor}
                  </span>
                )}
              </h4>
              
              {expense.description && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: '4px 0', fontStyle: 'italic' }}>
                  "{expense.description}"
                </div>
              )}

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {date} • Pagó: <strong>{expense.paidBy}</strong>
              </div>
            </div>
            
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              ${expense.amount.toFixed(2)}
              {onDelete && (
                <button 
                  onClick={() => onDelete(expense._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  title="Eliminar gasto"
                >
                  <Trash2 size={20} color="var(--danger)" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
