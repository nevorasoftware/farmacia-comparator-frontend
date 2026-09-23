import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProductComparison } from '../types';
import { 
  Pill, 
  ShieldCheck, 
  ExternalLink, 
  TrendingDown, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Store,
  Layers,
  Sparkles,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const ComparePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProductComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComparison() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const result = await api.getProductComparison(parseInt(id, 10));
        setData(result);
      } catch (err: any) {
        console.error('Error loading comparison:', err);
        setError('No se pudo cargar la información comparativa del medicamento.');
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Cargando datos comparativos y referencias regulatorias...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Medicamento no encontrado</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || 'El producto solicitado no está disponible.'}</p>
        <Link to="/medicamentos" className="btn btn-primary">
          <ArrowLeft size={16} /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  // Format chart data
  const chartDataMap: { [key: string]: any } = {};
  if (data.priceHistory && data.priceHistory.length > 0) {
    data.priceHistory.forEach(point => {
      const dateStr = new Date(point.checkedAt).toLocaleDateString('es-SV', { month: 'short', day: 'numeric' });
      if (!chartDataMap[dateStr]) {
        chartDataMap[dateStr] = { date: dateStr };
      }
      chartDataMap[dateStr][point.pharmacyName] = point.offerPrice || point.price;
    });
  }
  const chartData = Object.values(chartDataMap);

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/medicamentos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Volver a la búsqueda de medicamentos
          </Link>
        </div>

        {/* Product Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">
                  <Pill size={12} /> {data.pharmaceuticalForm || 'Medicamento'}
                </span>
                {data.brand && <span className="badge badge-neutral">Marca: {data.brand}</span>}
                {data.chm && <span className="badge badge-info">CHM: {data.chm}</span>}
                {data.healthRegistration && (
                  <span className="badge badge-neutral">Reg. Sanitario: {data.healthRegistration}</span>
                )}
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {data.name}
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong>Principio Activo:</strong> {data.activeIngredient} &nbsp;|&nbsp; 
                <strong> Concentración:</strong> {data.concentration || 'N/A'} &nbsp;|&nbsp; 
                <strong> Vía:</strong> {data.administrationRoute || 'Oral'} &nbsp;|&nbsp; 
                <strong> Laboratorio:</strong> {data.laboratory || 'No especificado'}
              </p>
            </div>

            {/* Quick Price Indicator */}
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.75rem',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Rango en Farmacias
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal-dark)' }}>
                ${data.lowestPrice?.toFixed(2)} - ${data.highestPrice?.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Comparando {data.pharmacyPrices.length} cadenas
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory SRS Box */}
        {data.srsReference && (
          <div style={{
            background: 'linear-gradient(135deg, #112A46 0%, #183957 100%)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--teal)', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                <ShieldCheck size={22} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  Referencia Oficial: Superintendencia de Regulación Sanitaria (SRS)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--teal-light)' }}>
                  Ley de Medicamentos — Precios Máximos de Venta al Público (PVMP) Regulados
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>PVMP Regulado</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8' }}>
                  ${data.srsReference.pvmp.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Precio techo legal</div>
              </div>

              {data.srsReference.pvmpUnit && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>PVMP Unitario</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                    ${data.srsReference.pvmpUnit.toFixed(3)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Por unidad dosificada</div>
                </div>
              )}

              {data.srsReference.marketPrice && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Precio de Mercado SRS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                    ${data.srsReference.marketPrice.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Promedio reportado</div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Registro Sanitario</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>
                  {data.srsReference.healthRegistration}
                </div>
                {data.srsReference.sourceUrl && (
                  <a
                    href={data.srsReference.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}
                  >
                    Ver en portal SRS <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pharmacy Price Comparison Table */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="section-title">Comparativa de Precios en Farmacias</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Actualizado periódicamente vía scrapers automáticos
            </span>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Farmacia</th>
                  <th style={{ padding: '1rem' }}>Producto Reportado</th>
                  <th style={{ padding: '1rem' }}>Presentación</th>
                  <th style={{ padding: '1rem' }}>Precio Actual</th>
                  <th style={{ padding: '1rem' }}>Diferencia vs PVMP</th>
                  <th style={{ padding: '1rem' }}>Disponibilidad</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.pharmacyPrices.map((item, index) => {
                  const effectivePrice = item.offerPrice || item.price;
                  const isBelowPvmp = data.srsReference && effectivePrice && effectivePrice < data.srsReference.pvmp;
                  const pvmpDiff = (data.srsReference && effectivePrice) ? data.srsReference.pvmp - effectivePrice : null;

                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                      }}
                    >
                      <td style={{ padding: '1.2rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Store size={18} color="var(--teal)" />
                          {item.pharmacyName}
                        </div>
                      </td>

                      <td style={{ padding: '1.2rem 1rem', color: 'var(--text-main)', maxWidth: '250px' }}>
                        {item.originalName}
                      </td>

                      <td style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {item.presentation || 'Estándar'}
                      </td>

                      <td style={{ padding: '1.2rem 1rem' }}>
                        {item.offerPrice ? (
                          <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)' }}>
                              ${item.offerPrice.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                              ${item.price?.toFixed(2)}
                            </span>
                            <span className="badge badge-danger" style={{ display: 'block', marginTop: '0.2rem', width: 'fit-content' }}>
                              Oferta
                            </span>
                          </div>
                        ) : item.price ? (
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            ${item.price.toFixed(2)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Consultar</span>
                        )}
                      </td>

                      <td style={{ padding: '1.2rem 1rem' }}>
                        {pvmpDiff !== null ? (
                          pvmpDiff > 0 ? (
                            <span className="badge badge-success">
                              <TrendingDown size={13} />
                              -${pvmpDiff.toFixed(2)} ahorro
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              En el límite PVMP
                            </span>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin PVMP</span>
                        )}
                      </td>

                      <td style={{ padding: '1.2rem 1rem' }}>
                        {item.isAvailable ? (
                          <span className="badge badge-success">
                            <CheckCircle size={12} /> En Stock
                          </span>
                        ) : (
                          <span className="badge badge-danger">
                            <XCircle size={12} /> Agotado
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          Ver en farmacia <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price History Chart */}
        {chartData.length > 0 && (
          <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  Tendencia Histórica de Precios
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Evolución de precios en dólares (USD) por cadena de farmacias
                </p>
              </div>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Precio']} />
                  <Legend />
                  <Line type="monotone" dataKey="Farmacias San Nicolás" stroke="#112A46" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Farmacias CEFAFA" stroke="#19A7A0" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Farmacias Económicas" stroke="#E58E26" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Farmacias Camila" stroke="#316B9E" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Equivalent / Substitute Medications */}
        {data.equivalentProducts && data.equivalentProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} color="var(--teal)" />
              <h2 className="section-title" style={{ margin: 0 }}>
                Medicamentos Equivalentes / Alternativas Genéricas
              </h2>
            </div>
            <p className="section-subtitle">
              Productos con el mismo principio activo ({data.activeIngredient}) y concentración similar. 
              Consulte a su médico o farmacéutico antes de realizar cualquier cambio en su tratamiento.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {data.equivalentProducts.map((eq) => (
                <div key={eq.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge badge-neutral" style={{ marginBottom: '0.5rem' }}>
                      {eq.brand || 'Genérico'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                      {eq.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {eq.laboratory && `Lab: ${eq.laboratory}`}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Desde</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal-dark)' }}>
                        ${eq.minPrice ? eq.minPrice.toFixed(2) : '--'}
                      </div>
                    </div>
                    <Link to={`/comparar/${eq.id}`} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                      Ver Comparativa
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
