import { useState } from 'react';
import type { User, PontoColeta, Material } from '../types';
import { db } from '../db';
import {
  ShieldAlert,
  Users,
  MapPin,
  DollarSign,
  PlusCircle,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  Database,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface Props {
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

export function AdminPanel({ onRefresh, showToast }: Props) {
  const [adminTab, setAdminTab] = useState<'usuarios' | 'ecopontos' | 'precos' | 'auditoria'>('usuarios');

  // Database states
  const [usuarios, setUsuarios] = useState<User[]>(() => db.getUsuarios());
  const [pontos, setPontos] = useState<PontoColeta[]>(() => db.getPontos());
  const [materiais, setMateriais] = useState<Material[]>(() => db.getMateriais());
  const despachos = db.getDespachos();

  // Modal Novo Ponto
  const [modalNovoPonto, setModalNovoPonto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoTipo, setNovoTipo] = useState<PontoColeta['tipo']>('Ecoponto Municipal');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [novoMunicipio, setNovoMunicipio] = useState('Porto Velho - RO');
  const [novoBairro, setNovoBairro] = useState('Zona Leste');
  const [novoCapacidade, setNovoCapacidade] = useState('1500');

  // Edit Material State
  const [editandoMaterial, setEditandoMaterial] = useState<Material | null>(null);

  // Toggle user block status
  const handleToggleStatus = (u: User) => {
    db.alternarStatusUsuario(u.id);
    const atualizados = db.getUsuarios();
    setUsuarios(atualizados);
    onRefresh();
    showToast(`Status do usuário "${u.nome}" alterado para ${u.status === 'Ativo' ? 'Bloqueado' : 'Ativo'}.`);
  };

  // Change user role
  const handleChangeRole = (u: User, newRole: User['tipo']) => {
    const atualizados = usuarios.map(item => item.id === u.id ? { ...item, tipo: newRole } : item);
    localStorage.setItem('ecoponto_db_users_v2', JSON.stringify(atualizados));
    setUsuarios(atualizados);
    onRefresh();
    showToast(`Perfil de "${u.nome}" atualizado para ${newRole.toUpperCase()}.`);
  };

  // Update IoT Sensor Slider in Real Time
  const handleIoTSlider = (pontoId: string, novoValorPct: number) => {
    const atualizados = pontos.map(p => {
      if (p.id === pontoId) {
        return {
          ...p,
          ocupacaoAtualPct: novoValorPct,
          status: novoValorPct >= 90 ? ('Lotado' as const) : ('Ativo' as const),
        };
      }
      return p;
    });
    localStorage.setItem('ecoponto_db_pontos_v2', JSON.stringify(atualizados));
    setPontos(atualizados);
    onRefresh();
  };

  // Excluir Ponto
  const handleExcluirPonto = (id: string, nome: string) => {
    if (confirm(`Confirma a desativação permanente do ecoponto "${nome}"?`)) {
      db.excluirPonto(id);
      setPontos(db.getPontos());
      onRefresh();
      showToast(`Ecoponto "${nome}" desativado.`);
    }
  };

  // Criar Ponto
  const handleCriarPonto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEndereco) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const novo: PontoColeta = {
      id: `ponto-${Date.now()}`,
      nome: novoNome,
      tipo: novoTipo,
      endereco: novoEndereco,
      municipio: novoMunicipio,
      bairro: novoBairro,
      xPct: Math.floor(30 + Math.random() * 50),
      yPct: Math.floor(30 + Math.random() * 50),
      latitude: -8.7619 + (Math.random() - 0.5) * 0.04,
      longitude: -63.9039 + (Math.random() - 0.5) * 0.04,
      materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-metal'],
      horarioFuncionamento: 'Segunda a Sexta, das 08h às 16h',
      capacidadeMaxKg: parseInt(novoCapacidade) || 1000,
      ocupacaoAtualPct: 15,
      status: 'Ativo',
      contato: '(69) 3901-3200',
      responsavel: 'SEMA / Coordenação Municipal',
    };

    db.salvarPonto(novo);
    setPontos(db.getPontos());
    setModalNovoPonto(false);
    setNovoNome('');
    setNovoEndereco('');
    onRefresh();
    showToast(`📍 Novo Ecoponto "${novo.nome}" cadastrado com sucesso!`);
  };

  // Save edited material
  const handleSalvarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoMaterial) return;

    db.atualizarMaterial(editandoMaterial);
    setMateriais(db.getMateriais());
    setEditandoMaterial(null);
    onRefresh();
    showToast(`Tabela de preços e fatores para "${editandoMaterial.nome}" atualizada!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Codigo Comprovante', 'Usuario', 'Ponto Coleta', 'Material', 'Quantidade (kg)', 'Data/Hora', 'CO2 Evitado (kg)', 'Renda Catadores (R$)'];
    const rows = despachos.map(d => [
      d.id,
      d.codigoComprovante,
      `"${d.usuarioNome}"`,
      `"${d.pontoNome}"`,
      `"${d.materialNome}"`,
      d.quantidadeKg,
      `"${d.dataHora}"`,
      d.co2EvitadoKg.toFixed(2),
      d.rendaGeradaEstimadaR$.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_auditoria_ecoponto_ro_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📁 Relatório CSV gerado e baixado com sucesso!');
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      usuarios,
      pontos,
      materiais,
      despachos
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `backup_banco_ecoponto_ro_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('💾 Backup completo JSON exportado com sucesso!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Admin Top Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '18px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#dc2626', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
              ÁREA RESTRITA
            </span>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>SEMA • Governo de Rondônia</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Painel de Controle e Auditoria Geral</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Gerenciamento centralizado de usuários, telemetria de sensores IoT, precificação de cooperativas e relatórios oficiais.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileSpreadsheet size={16} /> Exportar CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            style={{
              background: '#334155',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Database size={16} /> Backup JSON
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '10px', background: '#ffffff', padding: '10px', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setAdminTab('usuarios')}
          style={{
            background: adminTab === 'usuarios' ? '#ecfdf5' : 'transparent',
            color: adminTab === 'usuarios' ? '#059669' : '#64748b',
            border: `1px solid ${adminTab === 'usuarios' ? '#a7f3d0' : 'transparent'}`,
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <Users size={16} /> Gestão de Usuários ({usuarios.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('ecopontos')}
          style={{
            background: adminTab === 'ecopontos' ? '#ecfdf5' : 'transparent',
            color: adminTab === 'ecopontos' ? '#059669' : '#64748b',
            border: `1px solid ${adminTab === 'ecopontos' ? '#a7f3d0' : 'transparent'}`,
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <MapPin size={16} /> Ecopontos & Sensores IoT ({pontos.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('precos')}
          style={{
            background: adminTab === 'precos' ? '#ecfdf5' : 'transparent',
            color: adminTab === 'precos' ? '#059669' : '#64748b',
            border: `1px solid ${adminTab === 'precos' ? '#a7f3d0' : 'transparent'}`,
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <DollarSign size={16} /> Preços & Fatores CO₂
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('auditoria')}
          style={{
            background: adminTab === 'auditoria' ? '#ecfdf5' : 'transparent',
            color: adminTab === 'auditoria' ? '#059669' : '#64748b',
            border: `1px solid ${adminTab === 'auditoria' ? '#a7f3d0' : 'transparent'}`,
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <ShieldAlert size={16} /> Auditoria de Cargas ({despachos.length})
        </button>
      </div>

      {/* ================= 1. GESTÃO DE USUÁRIOS ================= */}
      {adminTab === 'usuarios' && (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nome / E-mail</th>
                <th>Município / Bairro</th>
                <th>Perfil de Acesso</th>
                <th>Pontos Verdes</th>
                <th>Status</th>
                <th>Ações do Gestor</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.nome}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td>
                    <div>{u.instituicaoOuBairro}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{u.municipio}</div>
                  </td>
                  <td>
                    <select
                      value={u.tipo}
                      onChange={e => handleChangeRole(u, e.target.value as any)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: '#f8fafc',
                      }}
                    >
                      <option value="cidadao">Cidadão</option>
                      <option value="escola">Escola / Condomínio</option>
                      <option value="cooperativa">Cooperativa</option>
                      <option value="admin">Administrador (SEMA)</option>
                    </select>
                  </td>
                  <td>
                    <span className="badge badge-success">+{u.pontosAcumulados} pts</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: u.status === 'Ativo' ? '#dcfce7' : '#fee2e2',
                        color: u.status === 'Ativo' ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      style={{
                        background: u.status === 'Ativo' ? '#fee2e2' : '#dcfce7',
                        color: u.status === 'Ativo' ? '#b91c1c' : '#15803d',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {u.status === 'Ativo' ? <Lock size={12} /> : <Unlock size={12} />}
                      {u.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= 2. GESTÃO DE ECOPONTOS & IOT ================= */}
      {adminTab === 'ecopontos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Simule a telemetria dos sensores ultrassônicos IoT em tempo real ajustando a barra de ocupação de cada contêiner.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ width: 'auto' }}
              onClick={() => setModalNovoPonto(true)}
            >
              <PlusCircle size={16} /> Cadastrar Novo Ecoponto
            </button>
          </div>

          <div className="grid-cards">
            {pontos.map(p => {
              const isLotado = p.ocupacaoAtualPct >= 90;
              return (
                <div key={p.id} className="card" style={{ borderColor: isLotado ? '#fca5a5' : '#e2e8f0' }}>
                  <div className="card-header">
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669' }}>{p.tipo}</span>
                      <h4 className="card-title">{p.nome}</h4>
                    </div>
                    <span className={`badge ${isLotado ? 'badge-danger' : 'badge-success'}`}>
                      {p.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '12px' }}>
                    📍 {p.endereco} • {p.municipio}
                  </p>

                  {/* IoT Telemetry Controller */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
                        <Layers size={14} /> Nível de Ocupação Sensor IoT:
                      </span>
                      <span style={{ color: isLotado ? '#dc2626' : '#0f172a' }}>
                        {p.ocupacaoAtualPct}% ({Math.round((p.ocupacaoAtualPct / 100) * p.capacidadeMaxKg)} kg)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={p.ocupacaoAtualPct}
                      onChange={e => handleIoTSlider(p.id, parseInt(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: isLotado ? '#dc2626' : '#059669' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                      <span>Vazio (0%)</span>
                      <span>Alerta Coleta (90%)</span>
                      <span>Lotado (100%)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Capacidade: <strong>{p.capacidadeMaxKg} kg</strong></span>
                    <button
                      type="button"
                      onClick={() => handleExcluirPonto(p.id, p.nome)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Excluir Ponto
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 3. TABELA DE PREÇOS E FATORES ================= */}
      {adminTab === 'precos' && (
        <div>
          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '20px', fontSize: '0.88rem', color: '#166534' }}>
            <strong>💡 Gestão Econômica de Cooperativas:</strong> Estes valores definem o cálculo de renda estimada gerada para os catadores de Rondônia e a pegada de carbono evitada a cada entrega registrada no sistema.
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Material Reciclável</th>
                  <th>Categoria</th>
                  <th>Preço Médio Pago ao Catador (R$/kg)</th>
                  <th>Fator CO₂ Evitado (kg CO₂e/kg)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: m.cor }} />
                        <strong>{m.nome}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{m.categoria}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#059669', fontSize: '1rem' }}>
                        R$ {m.precoMedioKgCooperativa.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#0284c7' }}>
                        {m.impactoPorKg.toFixed(2)} kg CO₂
                      </strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEditandoMaterial(m)}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit2 size={13} /> Editar Valores
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 4. AUDITORIA GERAL ================= */}
      {adminTab === 'auditoria' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Registro auditável completo de todos os despachos realizados na rede por cidadãos e instituições.
            </p>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Data/Hora</th>
                  <th>Cidadão / Entidade</th>
                  <th>Ecoponto</th>
                  <th>Material</th>
                  <th>Peso</th>
                  <th>Renda Gerada</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map(d => (
                  <tr key={d.id}>
                    <td><span className="badge badge-info">{d.codigoComprovante}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{d.dataHora}</td>
                    <td><strong>{d.usuarioNome}</strong></td>
                    <td>{d.pontoNome}</td>
                    <td><span className="chip" style={{ fontWeight: 700 }}>{d.materialNome}</span></td>
                    <td><strong>{d.quantidadeKg.toFixed(1)} kg</strong></td>
                    <td style={{ color: '#ca8a04', fontWeight: 700 }}>R$ {d.rendaGeradaEstimadaR$.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Editar Material */}
      {editandoMaterial && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
            <div className="card-header">
              <h3>Editar Valores de Mercado</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setEditandoMaterial(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSalvarMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Material:</label>
                <input type="text" value={editandoMaterial.nome} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Preço Pago ao Catador por kg (R$):</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={editandoMaterial.precoMedioKgCooperativa}
                  onChange={e => setEditandoMaterial({ ...editandoMaterial, precoMedioKgCooperativa: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>Fator de Emissão Evitada (kg CO₂e/kg):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editandoMaterial.impactoPorKg}
                  onChange={e => setEditandoMaterial({ ...editandoMaterial, impactoPorKg: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                <Save size={16} /> Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar Novo Ponto */}
      {modalNovoPonto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="card-header">
              <h3>Cadastrar Novo Ecoponto (SEMA)</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setModalNovoPonto(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCriarPonto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nome da Unidade *:</label>
                <input type="text" required placeholder="Ex: Ecoponto Zona Sul - Porto Velho" value={novoNome} onChange={e => setNovoNome(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tipo:</label>
                  <select value={novoTipo} onChange={e => setNovoTipo(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                    <option value="Ecoponto Municipal">Ecoponto Municipal</option>
                    <option value="Cooperativa de Catadores">Cooperativa de Catadores</option>
                    <option value="Ponto Escolar">Ponto Escolar</option>
                    <option value="Comércio Parceiro">Comércio Parceiro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Capacidade (kg):</label>
                  <input type="number" value={novoCapacidade} onChange={e => setNovoCapacidade(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Endereço Completo *:</label>
                <input type="text" required placeholder="Ex: Av. Jatuarana, 2100" value={novoEndereco} onChange={e => setNovoEndereco(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Bairro:</label>
                  <input type="text" value={novoBairro} onChange={e => setNovoBairro(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Município em RO:</label>
                  <input type="text" value={novoMunicipio} onChange={e => setNovoMunicipio(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Salvar Ecoponto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
