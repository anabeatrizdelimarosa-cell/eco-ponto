import type { User, PontoColeta, Material, Despacho, Campanha } from '../types';
import {
  Leaf,
  Navigation,
  PlusCircle,
  Shield,
  Recycle,
  Award,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  DollarSign,
  ExternalLink,
  Sparkles,
  MapPin,
  LogIn
} from 'lucide-react';

interface Props {
  currentUser?: User;
  pontos?: PontoColeta[];
  materiais: Material[];
  despachos: Despacho[];
  campanhas?: Campanha[];
  onNavigate: (tab: any) => void;
  onOpenAuth?: (mode?: 'login' | 'cadastro' | 'recuperar') => void;
}

export function LandingPage({
  materiais,
  despachos,
  onNavigate,
  onOpenAuth,
}: Props) {
  const totalKg = despachos.reduce((acc, curr) => acc + curr.quantidadeKg, 0);
  const totalCO2 = despachos.reduce((acc, curr) => acc + curr.co2EvitadoKg, 0);
  const totalRenda = despachos.reduce((acc, curr) => acc + curr.rendaGeradaEstimadaR$, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '32px' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '48px 36px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Sparkles size={16} />
            SIMULADO CENTELHA 3 RONDÔNIA • EDITAL Nº 03/2026
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}
          >
            EcoPonto Inteligente: Coleta Seletiva Rastreável & IoT em Rondônia
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#d1fae5',
              marginBottom: '28px',
              maxWidth: '740px',
            }}
          >
            Conectando cidadãos, escolas e cooperativas de catadores para solucionar o déficit de coleta seletiva em Rondônia. Rastreabilidade com <strong>QR Code oficial</strong>, telemetria de <strong>sensores inteligentes</strong> e geração direta de renda para catadores locais.
          </p>

          {/* CTA Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: '2px solid #6ee7b7',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <LogIn size={18} />
                Entrar no Sistema / Login
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('mapa')}
              style={{
                background: '#ffffff',
                color: '#065f46',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Navigation size={18} />
              Explorar Mapa de Ecopontos
            </button>

            <button
              type="button"
              onClick={() => onNavigate('registrar')}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 22px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <PlusCircle size={18} />
              Registrar Despacho
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin')}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#fee2e2',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                backdropFilter: 'blur(6px)',
                padding: '14px 20px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Shield size={18} />
              Painel Admin (SEMA)
            </button>
          </div>
        </div>

        {/* Decorative Watermark Background */}
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-40px',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        >
          <Leaf size={320} />
        </div>
      </section>

      {/* Live Impact Counters Bar */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        <div className="kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="kpi-header">
            <span>DEFASAGEM EM RONDÔNIA</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>57,7%</div>
          <div className="kpi-footer">Municípios de RO sem coleta seletiva (Dado Edital / SINIR)</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="kpi-header">
            <span>TOTAL RECICLADO NA REDE</span>
            <Recycle size={18} color="#059669" />
          </div>
          <div className="kpi-value">{totalKg.toFixed(1)} kg</div>
          <div className="kpi-footer">Desviados de aterros e lixões de Rondônia</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div className="kpi-header">
            <span>CO₂ EVITADO</span>
            <Leaf size={18} color="#0284c7" />
          </div>
          <div className="kpi-value">{totalCO2.toFixed(1)} kg</div>
          <div className="kpi-footer">Redução direta de pegada de carbono</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #ca8a04' }}>
          <div className="kpi-header">
            <span>RENDA GERADA P/ CATADORES</span>
            <DollarSign size={18} color="#ca8a04" />
          </div>
          <div className="kpi-value">R$ {totalRenda.toFixed(2)}</div>
          <div className="kpi-footer">Incentivo econômico p/ cooperativas locais</div>
        </div>
      </section>

      {/* The Problem in Rondônia & The Solution */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
            CONTEXTO REGIONAL & INOVAÇÃO
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            O Desafio da Gestão de Resíduos em Rondônia
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '6px' }}>
            Segundo levantamento divulgado pelo Governo do Estado em 2025 e relatórios do SINIR+, a maior parte dos municípios rondonienses descarta recicláveis misturados ao lixo comum.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>
              <AlertTriangle size={22} />
              O Cenário Atual (Sem Plataforma)
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: '#7f1d1d', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>57,7% dos municípios sem qualquer serviço regular de triagem de recicláveis.</li>
              <li>A população não sabe como separar os resíduos ou onde ficam os pontos de entrega.</li>
              <li>Materiais com alto valor de reciclagem (como latinhas de alumínio e PET) são enterrados em aterros.</li>
              <li>Cooperativas de catadores enfrentam escassez de material e baixos rendimentos.</li>
            </ul>
          </div>

          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>
              <CheckCircle2 size={22} />
              A Solução EcoPonto Inteligente
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: '#14532d', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Geolocalização Interativa:</strong> Mapa de Rondônia que destaca onde você já realizou entregas.</li>
              <li><strong>QR Code de Verdade:</strong> Certificados auditáveis com código único e leitura imediata.</li>
              <li><strong>Telemetria IoT:</strong> Sensores inteligentes para monitorar o nível de lotação dos recipientes.</li>
              <li><strong>Gamificação & Inclusão:</strong> Pontos Verdes para escolas e cálculo de renda gerada para catadores.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
            PASSO A PASSO
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            Como Funciona o Ciclo Sustentável
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Recycle size={26} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>PASSO 1</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Separe os Resíduos</h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Consulte nosso Guia Oficial CONAMA para higienizar garrafas, desmontar papelão e acondicionar óleo usado.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <MapPin size={26} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', marginBottom: '4px' }}>PASSO 2</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Localize no Mapa</h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Encontre o Ecoponto ou Cooperativa mais próximo e confira a lotação em tempo real pelo sensor IoT.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <PlusCircle size={26} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', marginBottom: '4px' }}>PASSO 3</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Pese e Despache</h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Entregue o material e registre o peso no sistema. A cooperativa recebe o reciclável pronto para venda.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <QrCode size={26} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce', marginBottom: '4px' }}>PASSO 4</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Emita seu Certificado</h4>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Receba seu comprovante oficial com QR Code real, acumule Pontos Verdes e audite seu impacto de CO₂ evitado.
            </p>
          </div>
        </div>
      </section>

      {/* Materials Supported */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CLASSIFICAÇÃO OFICIAL
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              6 Categorias de Resíduos Monitoradas
            </h3>
          </div>
          <button
            type="button"
            className="filter-pill"
            onClick={() => onNavigate('guia')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Ver Guia Completo CONAMA →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {materiais.map(m => (
            <div
              key={m.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: `5px solid ${m.cor}`,
                background: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{m.nome}</strong>
                <span className="badge badge-info" style={{ background: `${m.cor}20`, color: m.cor }}>
                  {m.categoria}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                {m.descricao}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span>Preço Médio: <strong>R$ {m.precoMedioKgCooperativa.toFixed(2)}/kg</strong></span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Evita {m.impactoPorKg} kg CO₂/kg</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners & Academic Identification */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '20px',
          border: '1px solid #cbd5e1',
          padding: '28px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
              REDES E PARCERIAS EM RONDÔNIA
            </span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Instituições Integradas ao Projeto
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px', maxWidth: '640px' }}>
              Projeto idealizado no âmbito da <strong>EEEFM Carmela Dutra (Turma 3°B Informática)</strong> por <strong>Ana Beatriz de Lima Rosa</strong>, conectando a <strong>Cooperativa CATANORTE</strong>, <strong>ASPREVEL</strong>, <strong>SEMA Porto Velho</strong> e <strong>SEDAM-RO</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ width: 'auto', padding: '12px 20px' }}
              onClick={() => onNavigate('centelha')}
            >
              <Award size={16} />
              Ver Ficha Centelha 3
            </button>
            <a
              href="https://youtube.com/shorts/jQ7sv5xjBv8"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#dc2626',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
            >
              <ExternalLink size={16} />
              Assistir Pitch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
