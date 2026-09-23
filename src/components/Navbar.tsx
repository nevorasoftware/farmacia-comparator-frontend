import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, Search, Database, Layers, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--primary)',
      color: 'white',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'var(--teal)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Pill size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Medicamentos<span style={{ color: 'var(--teal)' }}>SV</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
              Comparador de Precios y PVMP
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/') ? 'white' : '#CBD5E1',
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Search size={16} />
            Inicio
          </Link>

          <Link
            to="/medicamentos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/medicamentos') ? 'white' : '#CBD5E1',
              backgroundColor: isActive('/medicamentos') ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Layers size={16} />
            Catálogo
          </Link>

          <Link
            to="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/admin') ? 'white' : '#CBD5E1',
              backgroundColor: isActive('/admin') ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Database size={16} />
            Scrapers & Admin
          </Link>

          {/* Live Regulatory Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'rgba(25, 167, 160, 0.15)',
            border: '1px solid rgba(25, 167, 160, 0.4)',
            borderRadius: '999px',
            color: 'var(--teal-light)',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={14} color="var(--teal)" />
            SRS El Salvador
          </div>
        </nav>
      </div>
    </header>
  );
};
