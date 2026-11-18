import type { User } from '../types';
import {
  Leaf,
  Home,
  Navigation,
  MapPin,
  FileCheck2,
  PlusCircle,
  ShieldCheck,
  Lock,
  Recycle,
  BarChart3,
  Users,
  Award,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from 'lucide-react';

export type TabType =
  | 'inicio'
  | 'mapa'
  | 'pontos'
  | 'meus_despachos'
  | 'registrar'
  | 'admin'
  | 'guia'
  | 'indicadores'
  | 'campanhas'
  | 'centelha';

interface Props {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User;
  isAdminUnlocked: boolean;
  onOpenAuth: (mode?: 'login' | 'cadastro' | 'recuperar') => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  despachosCount: number;
  pontosCount: number;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  currentUser,
  isAdminUnlocked,
  onOpenAuth,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  despachosCount,
  pontosCount,
}: Props) {
  const isTabActive = (tab: TabType) => activeTab === tab;

  return (
    <aside
      style={{
        width: isCollapsed ? '80px' : '270px',
        minWidth: isCollapsed ? '80px' : '270px',
        background: '#0b1a15', // Modern deep emerald-slate
        color: '#f8fafc',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 12px' : '22px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          onClick={() => onSelectTab('inicio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Leaf size={24} />
          </div>

          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap',
                }}
              >
                EcoPonto
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.5px' }}>
                INTELIGENTE • RO
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            title="Recolher barra lateral"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Active User Card */}
      {!isCollapsed ? (
        <div
          style={{
            margin: '16px',
            padding: '12px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#059669',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {currentUser.nome.charAt(0)}
            </div>

            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentUser.nome}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: currentUser.tipo === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: currentUser.tipo === 'admin' ? '#f87171' : '#34d399',
                  }}
                >
                  {currentUser.tipo.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fef08a', fontWeight: 700 }}>
                  {currentUser.pontosAcumulados} pts
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
              title="Trocar de conta ou fazer login"
            >
              <UserCircle size={13} />
              Trocar Perfil
            </button>
            <button
              type="button"
              onClick={onLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#f87171',
                cursor: 'pointer',
              }}
              title="Sair do sistema"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
            title="Expandir barra lateral"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* SECTION 1: NAVEGAÇÃO PRINCIPAL */}
        {!isCollapsed && (
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', padding: '12px 10px 4px', letterSpacing: '1px' }}>
            NAVEGAÇÃO PRINCIPAL
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectTab('inicio')}
          style={getSidebarItemStyle(isTabActive('inicio'), isCollapsed)}
          title="Início / Landing Page"
        >
          <Home size={18} color={isTabActive('inicio') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && <span>Início (Apresentação)</span>}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('mapa')}
          style={getSidebarItemStyle(isTabActive('mapa'), isCollapsed)}
          title="Mapa de Ecopontos e Despachos"
        >
          <Navigation size={18} color={isTabActive('mapa') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Mapa Interativo</span>
              <span style={{ fontSize: '0.68rem', background: '#0284c7', color: '#ffffff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>
                RO
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('pontos')}
          style={getSidebarItemStyle(isTabActive('pontos'), isCollapsed)}
          title="Rede de Ecopontos"
        >
          <MapPin size={18} color={isTabActive('pontos') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Ecopontos & Unidades</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>({pontosCount})</span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('meus_despachos')}
          style={getSidebarItemStyle(isTabActive('meus_despachos'), isCollapsed)}
          title="Histórico de Despachos"
        >
          <FileCheck2 size={18} color={isTabActive('meus_despachos') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Meus Despachos</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>({despachosCount})</span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('registrar')}
          style={{
            ...getSidebarItemStyle(isTabActive('registrar'), isCollapsed),
            background: isTabActive('registrar') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            marginTop: '4px',
          }}
          title="Registrar Novo Despacho"
        >
          <PlusCircle size={18} color="#10b981" />
          {!isCollapsed && <span style={{ color: '#34d399', fontWeight: 700 }}>Registrar Despacho</span>}
        </button>

        {/* SECTION 2: GESTÃO & GOVERNANÇA */}
        {!isCollapsed && (
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', padding: '16px 10px 4px', letterSpacing: '1px' }}>
            GESTÃO & GOVERNANÇA
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectTab('admin')}
          style={{
            ...getSidebarItemStyle(isTabActive('admin'), isCollapsed),
            background: isTabActive('admin') ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            borderColor: isTabActive('admin') ? 'rgba(239, 68, 68, 0.4)' : 'transparent',
          }}
          title="Painel Administrativo (SEMA) - Protegido por Senha"
        >
          {isAdminUnlocked ? (
            <ShieldCheck size={18} color="#34d399" />
          ) : (
            <Lock size={18} color="#f87171" />
          )}
          {!isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ color: isTabActive('admin') ? '#ffffff' : '#fca5a5' }}>Painel Admin (SEMA)</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  background: isAdminUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: isAdminUnlocked ? '#34d399' : '#f87171',
                }}
              >
                {isAdminUnlocked ? 'ATIVO' : 'SENHA'}
              </span>
            </div>
          )}
        </button>

        {/* SECTION 3: EDUCAÇÃO & IMPACTO */}
        {!isCollapsed && (
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', padding: '16px 10px 4px', letterSpacing: '1px' }}>
            INFORMAÇÃO & IMPACTO
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectTab('guia')}
          style={getSidebarItemStyle(isTabActive('guia'), isCollapsed)}
          title="Guia Oficial de Descarte (CONAMA)"
        >
          <Recycle size={18} color={isTabActive('guia') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && <span>Guia de Descarte</span>}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('indicadores')}
          style={getSidebarItemStyle(isTabActive('indicadores'), isCollapsed)}
          title="Indicadores Socioambientais"
        >
          <BarChart3 size={18} color={isTabActive('indicadores') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && <span>Indicadores RO</span>}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('campanhas')}
          style={getSidebarItemStyle(isTabActive('campanhas'), isCollapsed)}
          title="Campanhas Comunitárias e Escolares"
        >
          <Users size={18} color={isTabActive('campanhas') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && <span>Campanhas & Escolas</span>}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('centelha')}
          style={getSidebarItemStyle(isTabActive('centelha'), isCollapsed)}
          title="Ficha Oficial Simulado Centelha 3"
        >
          <Award size={18} color={isTabActive('centelha') ? '#10b981' : '#94a3b8'} />
          {!isCollapsed && <span>Ficha Centelha 3</span>}
        </button>

        {/* SECTION 4: AUTENTICAÇÃO */}
        {!isCollapsed && (
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', padding: '16px 10px 4px', letterSpacing: '1px' }}>
            ACESSO
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          style={getSidebarItemStyle(false, isCollapsed)}
          title="Tela de Login / Cadastro"
        >
          <LogIn size={18} color="#94a3b8" />
          {!isCollapsed && <span>Tela de Login / Senha</span>}
        </button>
      </nav>

      {/* Footer info pill */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.72rem',
          color: '#64748b',
          textAlign: isCollapsed ? 'center' : 'left',
        }}
      >
        {!isCollapsed ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, marginBottom: '2px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Servidor Ativo :3011
            </div>
            <span>Edital 03/2026 • Rondônia</span>
          </div>
        ) : (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} title="Online :3011" />
        )}
      </div>
    </aside>
  );
}

function getSidebarItemStyle(isActive: boolean, isCollapsed: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: isCollapsed ? '10px 0' : '10px 14px',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
    color: isActive ? '#ffffff' : '#cbd5e1',
    border: '1px solid',
    borderColor: isActive ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
    borderRadius: '10px',
    fontSize: '0.86rem',
    fontWeight: isActive ? 700 : 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
  };
}
