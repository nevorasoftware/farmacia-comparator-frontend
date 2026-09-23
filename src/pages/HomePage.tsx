import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProductSearch, Pharmacy } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  ShieldCheck, 
  TrendingDown, 
  Activity, 
  Store, 
  Layers, 
  Clock, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductSearch[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  const POPULAR_SEARCHES = ['Acetaminofén', 'Ibuprofeno', 'Loratadina', 'Amoxicilina', 'Metformina', 'Losartán'];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodList, pharmList] = await Promise.all([
          api.getProducts(),
          api.getPharmacies()
        ]);
        setProducts(prodList);
        setPharmacies(pharmList);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/medicamentos?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleChipClick = (term: string) => {
    setSearchTerm(term);
    navigate(`/medicamentos?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
        color: 'white',
        padding: '4.5rem 0 3.5rem',
        position: 'relative'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(25, 167, 160, 0.18)',
            border: '1px solid rgba(25, 167, 160, 0.4)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            color: 'var(--teal-light)'
          }}>
            <ShieldCheck size={16} color="var(--teal)" />
            Transparencia y Consulta Oficial de Precios en El Salvador
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.03em'
          }}>
            Compara precios de medicamentos y verifica el <span style={{ color: 'var(--teal)' }}>PVMP oficial</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#CBD5E1',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Monitoreo en tiempo real de <strong>Farmacias San Nicolás, CEFAFA, Camila y Económicas</strong>, 
            contrastado contra los Precios Máximos Regulados por la Superintendencia de Regulación Sanitaria (SRS).
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
            }}>
              <Search size={22} color="var(--text-muted)" style={{ margin: '0 0.75rem' }} />
              <input
                type="text"
                placeholder="Busca por nombre, principio activo (ej. Acetaminofén, Ibuprofeno, MK)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                  padding: '0.5rem 0'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.825rem', color: '#94A3B8' }}>Búsquedas frecuentes:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleChipClick(term)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#F8FAFC',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Stats Section */}
      <section style={{ transform: 'translateY(-25px)', marginBottom: '1rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--teal-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <Layers size={24} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {products.length || 8}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Medicamentos Esenciales</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--info-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <Store size={24} color="var(--info)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {pharmacies.length || 4}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Farmacias Conectadas</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--success-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={24} color="var(--success)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Referencia Oficial PVMP SRS</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--warning-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <Activity size={24} color="var(--warning)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Activo
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scrapers Cada Hora (SV)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="section-title">Medicamentos de Alta Demanda</h2>
              <p className="section-subtitle">Precios actualizados en farmacias de El Salvador y ahorro contra precio de referencia</p>
            </div>
            <button
              onClick={() => navigate('/medicamentos')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Ver Catálogo Completo
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Cargando comparativas de precios...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Monitored Pharmacies Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#F1F5F9', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
            <h2 className="section-title">Cadenas de Farmacias Monitoreadas</h2>
            <p className="section-subtitle">
              Conexión directa mediante scrapers automáticos con los catálogos en línea de las principales cadenas del país.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* San Nicolás */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> En línea
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blazor SSR / HTML</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Farmacias San Nicolás
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Monitoreo de productos, ofertas con tarjeta y stock en tiempo real en todo El Salvador.
              </p>
              <a
                href="https://www.farmaciasannicolas.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Visitar sitio oficial <ExternalLink size={14} />
              </a>
            </div>

            {/* CEFAFA */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> En línea
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>API REST / HMAC</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Farmacias CEFAFA
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Conexión segura al API oficial del portal de CEFAFA con precios regulares y de descuento.
              </p>
              <a
                href="https://portal.farmaciascefafa.com.sv"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Visitar sitio oficial <ExternalLink size={14} />
              </a>
            </div>

            {/* Farmacias Económicas */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> En línea
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web API POST</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Farmacias Económicas
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Monitoreo automático de catálogo genérico, marcas económicas (Ecomed) y promociones.
              </p>
              <a
                href="https://www.farmaciaseconomicaselsalvador.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Visitar sitio oficial <ExternalLink size={14} />
              </a>
            </div>

            {/* Farmacias Camila */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-warning">
                  <AlertTriangle size={12} /> Catálogo semilla
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web Estática</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Farmacias Camila
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Monitoreo adaptativo con manejo de certificados SSL y datos de referencia mientras habilitan tienda online interactiva.
              </p>
              <a
                href="https://www.farmaciascamila.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Visitar sitio oficial <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
