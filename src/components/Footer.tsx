import React from 'react';
import { ShieldAlert, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-dark)',
      color: '#94A3B8',
      padding: '3rem 0 2rem',
      marginTop: '4rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        {/* Medical and Legal Disclaimer */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
          marginBottom: '2.5rem'
        }}>
          <ShieldAlert size={24} color="#E58E26" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Aviso Regulatorio y de Salud Pública
            </h4>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.5, color: '#CBD5E1' }}>
              Esta plataforma es una herramienta independiente y de carácter estrictamente informativo y de transparencia de precios. 
              No comercializa productos médicos ni sustituye la consulta, diagnóstico o prescripción de un profesional de la salud colegiado. 
              Los Precios Máximos de Venta al Público (PVMP) son referenciados de conformidad con la normativa de la 
              <strong> Superintendencia de Regulación Sanitaria (SRS)</strong> de la República de El Salvador.
            </p>
          </div>
        </div>

        {/* Links and Sources Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <h5 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Fuentes Oficiales Monitoreadas
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a href="https://www.farmaciasannicolas.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Farmacias San Nicolás <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://portal.farmaciascefafa.com.sv" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Farmacias CEFAFA <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.farmaciaseconomicaselsalvador.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Farmacias Económicas <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.farmaciascamila.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Farmacias Camila <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Marco Regulatorio
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a href="http://info.medicamentos.gob.sv" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Superintendencia de Regulación Sanitaria (SRS) <ExternalLink size={12} />
                </a>
              </li>
              <li>Precios Máximos de Venta al Público (PVMP)</li>
              <li>Consulta Integral de Registros Sanitarios</li>
              <li>Código Homologado de Medicamentos (CHM)</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Plataforma Técnica
            </h5>
            <p style={{ lineHeight: 1.6, color: '#94A3B8' }}>
              Arquitectura de microservicios contenerizada lista para Railway con Spring Boot 3.3, PostgreSQL, scrapers automatizados y Frontend en React con Vite.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} Comparador de Precios de Medicamentos — El Salvador.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Desarrollado para El Salvador con <Heart size={14} color="#E55039" fill="#E55039" />
          </div>
        </div>
      </div>
    </footer>
  );
};
