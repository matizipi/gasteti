"use client";

import { useState } from 'react';
import { ShoppingCart, Film, Home, Zap, Utensils, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import './components.css';

const CATEGORIES = [
  { id: 'Supermercado', icon: ShoppingCart, color: '#ffb7b2' },
  { id: 'Cine', icon: Film, color: '#b5ead7' },
  { id: 'Alquiler', icon: Home, color: '#c7ceea' },
  { id: 'Servicios', icon: Zap, color: '#e2f0cb' },
  { id: 'Salidas', icon: Utensils, color: '#ffdac1' },
];

export default function ExpenseForm({ onExpenseAdded }: { onExpenseAdded: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('Matu'); 
  
  // Advanced fields
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFullyPersonal, setIsFullyPersonal] = useState(false);
  const [personalAmount, setPersonalAmount] = useState('');
  const [personalFor, setPersonalFor] = useState('Matu');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseAmount = (val: string) => Number(val.replace(',', '.'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseAmount(amount);
    if (!amount || isNaN(parsedAmount)) return;
    
    setIsSubmitting(true);
    
    // Si es 100% personal, el monto personal es igual al monto total.
    const finalPersonalAmount = isFullyPersonal ? parsedAmount : (personalAmount ? parseAmount(personalAmount) : 0);
    const finalPersonalFor = (isFullyPersonal || finalPersonalAmount > 0) ? personalFor : '';

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          category,
          description,
          date: new Date(date),
          paidBy,
          personalAmount: finalPersonalAmount,
          personalFor: finalPersonalFor,
        })
      });
      if (res.ok) {
        setAmount('');
        setDescription('');
        setPersonalAmount('');
        setIsFullyPersonal(false);
        setShowAdvanced(false);
        onExpenseAdded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    // Solo permitir números, puntos y comas
    const val = e.target.value.replace(/[^0-9.,]/g, '');
    setter(val);
  };

  return (
    <div className="card form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
        <Heart style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
        Nuevo Gasto
      </h2>
      <form onSubmit={handleSubmit} className="expense-form">
        
        <div className="form-group">
          <label>Monto Total</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input 
              type="text" 
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e, setAmount)}
              placeholder="0.00"
              required
              style={{ paddingLeft: '40px', fontSize: '1.5rem', fontWeight: 'bold' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <div className="category-grid">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <div 
                  key={cat.id} 
                  className={`category-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setCategory(cat.id)}
                  style={{ backgroundColor: isSelected ? cat.color : '#faf7fa' }}
                >
                  <Icon size={24} color={isSelected ? '#fff' : 'var(--text-muted)'} />
                  <span>{cat.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Descripción (Opcional)</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Compra mensual, Entradas Deadpool..."
          />
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>¿Quién pagó el total?</label>
          <div className="user-toggle">
             <button 
                type="button" 
                className={`toggle-btn ${paidBy === 'Matu' ? 'active' : ''}`}
                onClick={() => setPaidBy('Matu')}
             >
                Matu
             </button>
             <button 
                type="button" 
                className={`toggle-btn ${paidBy === 'Florcita' ? 'active' : ''}`}
                onClick={() => setPaidBy('Florcita')}
             >
                Florcita
             </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Más detalles (Gasto personal)
          </button>
          
          {showAdvanced && (
            <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#faf7fa', borderRadius: '16px' }}>
              
              <div className="form-group" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ margin: 0, flex: 1, cursor: 'pointer' }} htmlFor="fully-personal-checkbox">
                  ¿Es un gasto 100% personal?
                </label>
                <div 
                  className={`toggle-switch ${isFullyPersonal ? 'active' : ''}`}
                  onClick={() => setIsFullyPersonal(!isFullyPersonal)}
                >
                  <div className="toggle-switch-handle"></div>
                </div>
              </div>

              {!isFullyPersonal && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Monto Personal Parcial (No se divide)</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-symbol" style={{ fontSize: '1rem', left: '12px' }}>$</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={personalAmount}
                      onChange={(e) => handleAmountChange(e, setPersonalAmount)}
                      placeholder="0.00"
                      style={{ paddingLeft: '28px' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Ej: De los $2000 del súper, $500 son tuyos.
                  </p>
                </div>
              )}

              {(isFullyPersonal || Number(parseAmount(personalAmount)) > 0) && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>¿Para quién es este monto personal?</label>
                  <div className="user-toggle">
                    <button 
                        type="button" 
                        className={`toggle-btn ${personalFor === 'Matu' ? 'active' : ''}`}
                        onClick={() => setPersonalFor('Matu')}
                    >
                        Matu
                    </button>
                    <button 
                        type="button" 
                        className={`toggle-btn ${personalFor === 'Florcita' ? 'active' : ''}`}
                        onClick={() => setPersonalFor('Florcita')}
                    >
                        Florcita
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
        </button>
      </form>
    </div>
  );
}
