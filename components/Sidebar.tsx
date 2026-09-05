"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Calendar, History } from 'lucide-react';
import './components.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX;
      const diffY = Math.abs(endY - startY);

      // Swipe right to open (only if starting near the left edge)
      if (diffX > 50 && diffY < 50 && startX < 50) {
        setIsOpen(true);
      }

      // Swipe left to close
      if (diffX < -50 && diffY < 50) {
        setIsOpen(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Hamburger Button (Hidden on mobile via CSS) */}
      <button 
        className="menu-btn" 
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        <Menu size={28} color="var(--primary)" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar Content */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Kawaii Expenses</h2>
          <button onClick={closeSidebar} className="close-btn">
            <X size={24} color="var(--text-muted)" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>
          
          <Link 
            href="/gastos?view=current" 
            className={`nav-link ${pathname === '/gastos' && typeof window !== 'undefined' && window.location.search.includes('view=current') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Calendar size={20} />
            <span>Gastos del Mes</span>
          </Link>
          
          <Link 
            href="/gastos?view=history" 
            className={`nav-link ${pathname === '/gastos' && typeof window !== 'undefined' && window.location.search.includes('view=history') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <History size={20} />
            <span>Histórico</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
