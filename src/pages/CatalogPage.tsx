import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductSearch } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Pill, RotateCcw } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<ProductSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts(searchTerm || undefined);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchTerm]);

  // Extract unique active ingredients and forms for filters
  const ingredients = Array.from(new Set(products.map(p => p.activeIngredient))).filter(Boolean);
  const forms = Array.from(new Set(products.map(p => p.pharmaceuticalForm))).filter(Boolean);

  // Filtered & Sorted products
  const filteredProducts = products
    .filter(p => {
      const matchIngredient = !selectedIngredient || p.activeIngredient === selectedIngredient;
      const matchForm = !selectedForm || p.pharmaceuticalForm === selectedForm;
      return matchIngredient && matchForm;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.minPrice || 0) - (b.minPrice || 0);
      if (sortBy === 'price-desc') return (b.minPrice || 0) - (a.minPrice || 0);
      return a.name.localeCompare(b.name);
    });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIngredient('');
    setSelectedForm('');
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Catálogo Completo de Medicamentos</h1>
          <p className="section-subtitle">
            Explora y compara precios en farmacias salvadoreñas y consulta referencias oficiales de la SRS
          </p>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Active Ingredient Filter */}
            <div>
              <select
                value={selectedIngredient}
                onChange={(e) => setSelectedIngredient(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="">Todos los Principios Activos</option>
                {ingredients.map(ing => (
                  <option key={ing} value={ing}>{ing}</option>
                ))}
              </select>
            </div>

            {/* Form Filter */}
            <div>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="">Todas las Formas Farmacéuticas</option>
                {forms.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="name">Ordenar por: Nombre (A-Z)</option>
                <option value="price-asc">Ordenar por: Menor Precio</option>
                <option value="price-desc">Ordenar por: Mayor Precio</option>
              </select>
            </div>
          </div>

          {/* Active filter summary */}
          {(searchTerm || selectedIngredient || selectedForm) && (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Mostrando {filteredProducts.length} medicamentos filtrados
              </span>
              <button
                onClick={handleClearFilters}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
              >
                <RotateCcw size={13} /> Limpiar Filtros
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(25, 167, 160, 0.1)',
              border: '1px solid rgba(25, 167, 160, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              color: 'var(--teal)',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              <span className="spinner-border" style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                border: '2px solid currentColor',
                borderRightColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.75s linear infinite'
              }}></span>
              {searchTerm 
                ? `Buscando "${searchTerm}" en tiempo real en farmacias y normalizando con IA...` 
                : 'Cargando catálogo de medicamentos...'}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Pill size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              {searchTerm ? `No encontramos resultados exactos para "${searchTerm}"` : 'No se encontraron medicamentos'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Puedes buscar por principio activo o seleccionar una de las sugerencias más consultadas en El Salvador:
            </p>

            {/* Suggestions Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
              {['Acetaminofén', 'Ibuprofeno', 'Amoxicilina', 'Loratadina', 'Losartán', 'Omeprazol', 'Metformina', 'Aspirina'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                    setSearchParams({ q: term });
                  }}
                  className="btn btn-outline"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    borderColor: 'var(--teal)',
                    color: 'var(--teal)'
                  }}
                >
                  🔍 {term}
                </button>
              ))}
            </div>

            <button onClick={handleClearFilters} className="btn btn-primary">
              Ver Catálogo Completo
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
