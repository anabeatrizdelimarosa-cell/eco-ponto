import { useState, useMemo } from 'react';
import type { PontoColeta, Despacho, User } from '../types';
import {
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  Compass,
  FileCheck2
} from 'lucide-react';

interface Props {
  pontos: PontoColeta[];
  despachosDoUsuario: Despacho[];
  usuarioAtivo: User;
  onSelecionarPontoParaDespacho: (pontoId: string) => void;
  onVerComprovante: (despacho: Despacho) => void;
}

export function MapaLocalidade({
  pontos,
  despachosDoUsuario,
  usuarioAtivo,
  onSelecionarPontoParaDespacho,
  onVerComprovante
}: Props) {
  const [selectedPonto, setSelectedPonto] = useState<PontoColeta | null>(pontos[0] || null);
  const [filterMode, setFilterMode] = useState<'todos' | 'meus_despachos' | 'ativos'>('todos');

  // Group user drop-offs by point
  const despachosPorPonto = useMemo(() => {
    const map: Record<string, Despacho[]> = {};
    despachosDoUsuario.forEach(d => {
      if (!map[d.pontoId]) map[d.pontoId] = [];
      map[d.pontoId].push(d);
    });
    return map;
  }, [despachosDoUsuario]);

  const pontosVisiveis = useMemo(() => {
    return pontos.filter(p => {
      if (filterMode === 'meus_despachos') {
        return !!despachosPorPonto[p.id];
      }
      if (filterMode === 'ativos') {
        return p.status === 'Ativo';
      }
      return true;
    });
  }, [pontos, filterMode, despachosPorPonto]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Map Filter and Header */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Compass size={14} /> GEOLOCALIZAÇÃO RONDÔNIA
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Base Cartográfica: Porto Velho & Região Central
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
            Mapa Interativo de Ecopontos & Seus Despachos
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Acompanhe a malha de coleta seletiva e veja em destaque <strong>onde {usuarioAtivo.nome} já realizou entregas de resíduos</strong>.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setFilterMode('todos')}
            style={{
              background: filterMode === 'todos' ? '#ffffff' : 'transparent',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: filterMode === 'todos' ? '#059669' : '#64748b',
              cursor: 'pointer',
              boxShadow: filterMode === 'todos' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Todos os Pontos ({pontos.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('meus_despachos')}
            style={{
              background: filterMode === 'meus_despachos' ? '#ffffff' : 'transparent',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: filterMode === 'meus_despachos' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              boxShadow: filterMode === 'meus_despachos' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={15} color="#0284c7" />
            Onde Já Despachei ({Object.keys(despachosPorPonto).length})
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas Map on Left, Point Inspector on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Map Canvas Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Schematic Geographic Map Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '480px',
              backgroundColor: '#e2e8f0',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              border: '2px solid #cbd5e1',
            }}
          >
            {/* River Madeira (Geographic Feature) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '32%',
                height: '100%',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                clipPath: 'polygon(0 0, 80% 0, 40% 100%, 0% 100%)',
                opacity: 0.25,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 24,
                  left: 20,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#0369a1',
                  letterSpacing: '1px',
                }}
              >
                CALHA DO RIO MADEIRA
              </span>
            </div>

            {/* Grid overlay roads */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '10%',
                right: '10%',
                height: '4px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '15%',
                bottom: '15%',
                left: '55%',
                width: '4px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            />
            <span style={{ position: 'absolute', top: '37%', left: '15%', fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>
              AV. SETE DE SETEMBRO
            </span>
            <span style={{ position: 'absolute', top: '18%', left: '57%', fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>
              AV. RIO MADEIRA (BR-364)
            </span>

            {/* Markers */}
            {pontosVisiveis.map(p => {
              const meusDespachosAqui = despachosPorPonto[p.id] || [];
              const jaDespachou = meusDespachosAqui.length > 0;
              const isSelected = selectedPonto?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPonto(p)}
                  style={{
                    position: 'absolute',
                    top: `${p.yPct}%`,
                    left: `${p.xPct}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: isSelected ? 30 : jaDespachou ? 20 : 10,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Pin Graphic */}
                  <div
                    style={{
                      width: isSelected ? '46px' : '38px',
                      height: isSelected ? '46px' : '38px',
                      borderRadius: '50%',
                      background: jaDespachou
                        ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected
                        ? '0 0 0 4px rgba(16, 185, 129, 0.4), 0 8px 16px rgba(0,0,0,0.3)'
                        : '0 4px 10px rgba(0,0,0,0.25)',
                      border: '3px solid #ffffff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {jaDespachou ? <CheckCircle2 size={isSelected ? 24 : 20} /> : <MapPin size={isSelected ? 24 : 20} />}
                  </div>

                  {/* Marker Label */}
                  <div
                    style={{
                      background: isSelected ? '#0f172a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      marginTop: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{p.nome.split(' - ')[0]}</span>
                    {jaDespachou && (
                      <span
                        style={{
                          background: '#0284c7',
                          color: '#fff',
                          borderRadius: '9999px',
                          padding: '1px 5px',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                        }}
                      >
                        {meusDespachosAqui.length} entregas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.78rem',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                Ecoponto Parceiro
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} />
                Onde Você Já Fez Despachos
              </span>
            </div>
            <span>Clique nos pinos para ver o histórico do local</span>
          </div>
        </div>

        {/* Selected Point Inspector */}
        {selectedPonto && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                    {selectedPonto.tipo}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                    {selectedPonto.nome}
                  </h3>
                </div>
                <span
                  style={{
                    background: selectedPonto.status === 'Ativo' ? '#dcfce7' : '#fee2e2',
                    color: selectedPonto.status === 'Ativo' ? '#15803d' : '#991b1b',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {selectedPonto.status}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
                📍 {selectedPonto.endereco} — {selectedPonto.bairro}, {selectedPonto.municipio}
              </p>

              {/* Geo Coordinates */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#475569',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  fontFamily: 'monospace',
                }}
              >
                <span>Lat: {selectedPonto.latitude.toFixed(4)}</span>
                <span>Long: {selectedPonto.longitude.toFixed(4)}</span>
              </div>

              {/* Occupancy / IoT Sensor preview */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
                    <Layers size={14} /> Telemetria de Lotação IoT:
                  </span>
                  <span>{selectedPonto.ocupacaoAtualPct}% ({Math.round((selectedPonto.ocupacaoAtualPct / 100) * selectedPonto.capacidadeMaxKg)}/{selectedPonto.capacidadeMaxKg} kg)</span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${selectedPonto.ocupacaoAtualPct}%`,
                      background: selectedPonto.ocupacaoAtualPct > 85 ? '#ef4444' : selectedPonto.ocupacaoAtualPct > 60 ? '#f59e0b' : '#10b981',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>

              {/* USER DROP-OFFS AT THIS SPECIFIC LOCATION */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} color="#0284c7" />
                  <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                    Seus Despachos Neste Ecoponto:
                  </strong>
                </div>

                {despachosPorPonto[selectedPonto.id] && despachosPorPonto[selectedPonto.id].length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {despachosPorPonto[selectedPonto.id].map(d => (
                      <div
                        key={d.id}
                        style={{
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>
                            {d.materialNome} • {d.quantidadeKg} kg
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {d.dataHora} • Cód: {d.codigoComprovante}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onVerComprovante(d)}
                          style={{
                            background: '#0284c7',
                            color: '#fff',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FileCheck2 size={12} />
                          Comprovante
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                    Você ainda não realizou entregas neste ponto. Realize seu primeiro despacho abaixo!
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => onSelecionarPontoParaDespacho(selectedPonto.id)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)',
                }}
              >
                Registrar Despacho Aqui
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
