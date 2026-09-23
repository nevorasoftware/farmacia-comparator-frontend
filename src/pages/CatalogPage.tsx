import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductSearch } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Pill, RotateCcw, Sparkles } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<ProductSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync state if URL query changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

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

  // Handle autocomplete suggestions
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const sugg = await api.getSuggestions(searchTerm.trim());
        setSuggestions(sugg);
      } catch (e) {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Calculate similar products when exact search produces 0 results
  const similarProducts = React.useMemo(() => {
    if (filteredProducts.length > 0 || !searchTerm.trim()) return [];
    const tokens = searchTerm.trim().toLowerCase().split(/\s+/).filter(t => t.length >= 3);
    if (tokens.length === 0) return [];
    return products.filter(p => {
      const pName = p.name.toLowerCase();
      const pIng = (p.activeIngredient || '').toLowerCase();
      const pBrand = (p.brand || '').toLowerCase();
      return tokens.some(t => pName.includes(t) || pIng.includes(t) || pBrand.includes(t));
    });
  }, [filteredProducts, products, searchTerm]);

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSearchParams({ q: suggestion });
    setShowSuggestions(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIngredient('');
    setSelectedForm('');
    setSortBy('name');
    setSearchParams({});
    setShowSuggestions(false);
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
            {/* Search Input with Autocomplete */}
            <div ref={searchContainerRef} style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input
                type="text"
                placeholder="Buscar producto (ej. Ensure, Aspirina, MK)..."
                value={searchTerm}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                    Sugerencias de productos
                  </div>
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSuggestion(item)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(25, 167, 160, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Sparkles size={14} color="var(--teal)" />
                      <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
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
                ? `Buscando "${searchTerm}" en tiempo real en Farmacias San Nicolás, Económicas, CEFAFA y Camila...` 
                : 'Cargando catálogo de medicamentos...'}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div>
            {/* If similar products exist */}
            {similarProducts.length > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  backgroundColor: 'rgba(25, 167, 160, 0.08)',
                  border: '1px solid rgba(25, 167, 160, 0.25)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <Sparkles size={18} color="var(--teal)" />
                    Productos con nombres parecidos a "{searchTerm}":
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    No hubo coincidencia exacta con todos los filtros, pero encontramos estos productos similares en las farmacias:
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {similarProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Pill size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
                  {searchTerm ? `No encontramos resultados exactos para "${searchTerm}"` : 'No se encontraron medicamentos'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                  Puedes probar seleccionando una de las sugerencias más consultadas en farmacias de El Salvador:
                </p>

                {/* Suggestions Chips with Ensure included */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
                  {['Ensure', 'Aspirina', 'Acetaminofén', 'Ibuprofeno', 'Amoxicilina', 'Loratadina', 'Losartán', 'Omeprazol', 'Metformina'].map(term => (
                    <button
                      key={term}
                      onClick={() => handleSelectSuggestion(term)}
                      className="btn btn-outline"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '999px',
                        borderColor: 'var(--teal)',
                        color: 'var(--teal)',
                        backgroundColor: term.toLowerCase() === 'ensure' ? 'rgba(25, 167, 160, 0.1)' : 'transparent',
                        fontWeight: term.toLowerCase() === 'ensure' ? 700 : 500
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
            )}
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
