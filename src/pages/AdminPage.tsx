import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminDashboard, ScrapingStatus } from '../types';
import { 
  Database, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Store, 
  Play,
  FileCheck,
  Server
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleTriggerScraper = async (pharmacyCode?: string) => {
    try {
      setTriggering(pharmacyCode || 'ALL');
      await api.triggerScraping(pharmacyCode);
      setNotification({
        message: `Scraper ${pharmacyCode ? `(${pharmacyCode})` : 'general'} disparado exitosamente.`,
        type: 'success'
      });
      // Refresh dashboard after a short delay
      setTimeout(() => {
        loadDashboard();
        setTriggering(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error triggering scraping:', err);
      setNotification({
        message: 'No se pudo iniciar el scraper. Verifica si el servicio está en línea.',
        type: 'error'
      });
      setTriggering(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Title and Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">Centro de Control y Monitoreo de Scrapers</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Estado en tiempo real de recolección de precios, auditoría y ejecución de microservicios
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={loadDashboard}
              className="btn btn-outline"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refrescar
            </button>

            <button
              onClick={() => handleTriggerScraper()}
              className="btn btn-primary"
              disabled={triggering !== null}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Play size={15} />
              {triggering === 'ALL' ? 'Ejecutando...' : 'Ejecutar Todos'}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div style={{
            backgroundColor: notification.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            color: notification.type === 'success' ? 'var(--success)' : 'var(--danger)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {notification.message}
          </div>
        )}

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--teal-light)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <Layers size={22} color="var(--teal)" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Catálogo Maestro</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {dashboard?.totalMasterProducts || 8}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medicamentos unificados</div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--info-light)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <FileCheck size={22} color="var(--info)" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Precios Monitoreados</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {dashboard?.totalPharmacyProducts || 11}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Publicaciones en farmacias</div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--warning-light)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <Store size={22} color="var(--warning)" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cadenas Activas</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {dashboard?.totalPharmacies || 4}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>San Nicolás, CEFAFA, Económicas, Camila</div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--success-light)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                <Server size={22} color="var(--success)" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ejecuciones Totales</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {dashboard?.totalScrapingExecutions || 4}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Historial registrado</div>
          </div>
        </div>

        {/* Scrapers Table */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
              Estado de Scrapers por Farmacia
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Detalle de la última ejecución, cantidad de registros encontrados y control manual.
            </p>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Farmacia</th>
                  <th style={{ padding: '1rem' }}>Estado</th>
                  <th style={{ padding: '1rem' }}>Encontrados</th>
                  <th style={{ padding: '1rem' }}>Nuevos</th>
                  <th style={{ padding: '1rem' }}>Actualizados</th>
                  <th style={{ padding: '1rem' }}>Última Ejecución</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.latestScrapingStatus?.map((status, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {status.pharmacyName}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Código: {status.pharmacyCode}
                      </span>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {status.status === 'COMPLETED' ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Completado
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <AlertCircle size={12} /> Error
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: 600 }}>{status.recordsFound}</td>
                    <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 600 }}>+{status.recordsCreated}</td>
                    <td style={{ padding: '1rem', color: 'var(--info)', fontWeight: 600 }}>{status.recordsUpdated}</td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} />
                        {new Date(status.startedAt).toLocaleString('es-SV', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleTriggerScraper(status.pharmacyCode)}
                        disabled={triggering === status.pharmacyCode}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {triggering === status.pharmacyCode ? 'Ejecutando...' : 'Re-ejecutar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
