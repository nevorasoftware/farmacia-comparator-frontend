import React from 'react';
import { Link } from 'react-router-dom';
import { ProductSearch } from '../types';
import { Pill, ArrowRight, ShieldCheck, Store, Tag } from 'lucide-react';

interface ProductCardProps {
  product: ProductSearch;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const savings = product.pvmpSrs && product.minPrice 
    ? Math.max(0, product.pvmpSrs - product.minPrice)
    : 0;

  return (
    <div className="card" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top badges */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="badge badge-teal">
            <Pill size={12} />
            {product.pharmaceuticalForm || 'Medicamento'}
          </span>
          {product.brand && (
            <span className="badge badge-neutral">
              {product.brand}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--primary)',
          marginBottom: '0.35rem',
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>

        {/* Active Ingredient */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem'
        }}>
          <strong>P. Activo:</strong> {product.activeIngredient} {product.concentration && `(${product.concentration})`}
        </p>

        {product.presentation && (
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            📦 {product.presentation}
          </p>
        )}
      </div>

      {/* Pricing and Action */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
        marginTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Desde
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--teal-dark)' }}>
              ${product.minPrice ? product.minPrice.toFixed(2) : '--'}
            </div>
            {product.maxPrice && product.minPrice !== product.maxPrice && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                hasta ${product.maxPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            {product.pvmpSrs && (
              <div style={{
                fontSize: '0.75rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                justifyContent: 'flex-end'
              }}>
                <ShieldCheck size={13} color="var(--info)" />
                PVMP: <strong>${product.pvmpSrs.toFixed(2)}</strong>
              </div>
            )}
            {savings > 0 && (
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                justifyContent: 'flex-end',
                marginTop: '2px'
              }}>
                <Tag size={12} />
                Ahorro hasta ${savings.toFixed(2)}
              </div>
            )}
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              justifyContent: 'flex-end',
              marginTop: '4px'
            }}>
              <Store size={12} />
              {product.availablePharmaciesCount} farmacias
            </div>
          </div>
        </div>

        {/* Comparison CTA Button */}
        <Link
          to={`/comparar/${product.id}`}
          className="btn btn-primary"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          Comparar Precios
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
