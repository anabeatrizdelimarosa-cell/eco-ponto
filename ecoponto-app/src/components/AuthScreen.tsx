import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { db } from '../db';
import {
  Lock,
  Mail,
  UserPlus,
  LogIn,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User) => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'cadastro' | 'recuperar';
}

export function AuthScreen({ onLoginSuccess, onCancel, initialMode = 'login' }: Props) {
  const [mode, setMode] = useState<'login' | 'cadastro' | 'recuperar'>(initialMode);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Cadastro form
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadSenha, setCadSenha] = useState('');
  const [cadConfirmaSenha, setCadConfirmaSenha] = useState('');
  const [cadTipo, setCadTipo] = useState<UserRole>('cidadao');
  const [cadCpf, setCadCpf] = useState('');
  const [cadTelefone, setCadTelefone] = useState('');
  const [cadMunicipio, setCadMunicipio] = useState('Porto Velho - RO');
  const [cadBairro, setCadBairro] = useState('');

  // Recuperação form
  const [recEmail, setRecEmail] = useState('');
  const [recEtapa, setRecEtapa] = useState<1 | 2>(1);
  const [recCodigo, setRecCodigo] = useState('');
  const [recNovaSenha, setRecNovaSenha] = useState('');
  const [recConfirmacao, setRecConfirmacao] = useState('');

  // Status & Feedback
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const usuariosCadastrados = db.getUsuarios();

  const handleQuickLogin = (u: User) => {
    db.setUsuarioAtivo(u);
    onLoginSuccess(u);
  };

  // 1. Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const match = usuariosCadastrados.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.senha === loginSenha
    );

    if (match) {
      if (match.status === 'Bloqueado') {
        setFeedback({ tipo: 'erro', texto: 'Sua conta está bloqueada pelo administrador da SEMA. Entre em contato com o suporte.' });
        return;
      }
      db.setUsuarioAtivo(match);
      onLoginSuccess(match);
    } else {
      setFeedback({
        tipo: 'erro',
        texto: 'E-mail ou senha incorretos. Utilize uma das contas de teste ou cadastre-se.'
      });
    }
  };

  // 2. Submit Cadastro
  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (cadSenha !== cadConfirmaSenha) {
      setFeedback({ tipo: 'erro', texto: 'As senhas digitadas não coincidem.' });
      return;
    }

    if (cadSenha.length < 3) {
      setFeedback({ tipo: 'erro', texto: 'A senha deve conter no mínimo 3 caracteres.' });
      return;
    }

    const jaExiste = usuariosCadastrados.find(
      u => u.email.toLowerCase() === cadEmail.toLowerCase().trim()
    );

    if (jaExiste) {
      setFeedback({ tipo: 'erro', texto: 'Este e-mail já está cadastrado no sistema.' });
      return;
    }

    const novo: User = {
      id: `usr-${Date.now()}`,
      nome: cadNome.trim(),
      email: cadEmail.toLowerCase().trim(),
      senha: cadSenha,
      tipo: cadTipo,
      cpfOrCnpj: cadCpf.trim() || undefined,
      telefone: cadTelefone.trim() || undefined,
      instituicaoOuBairro: cadBairro.trim() || 'Bairro Centro',
      municipio: cadMunicipio,
      pontosAcumulados: 50, // Bônus de boas-vindas
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'Ativo',
    };

    db.salvarUsuario(novo);
    db.setUsuarioAtivo(novo);
    setFeedback({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Você ganhou 50 Pontos Verdes de boas-vindas.' });
    setTimeout(() => {
      onLoginSuccess(novo);
    }, 1200);
  };

  // 3. Submit Recuperação
  const handleRecuperarPasso1 = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const match = usuariosCadastrados.find(u => u.email.toLowerCase() === recEmail.toLowerCase().trim());
    if (!match) {
      setFeedback({ tipo: 'erro', texto: 'Nenhum usuário localizado com este e-mail.' });
      return;
    }

    // Código simulado enviado
    setRecEtapa(2);
    setFeedback({
      tipo: 'sucesso',
      texto: `Código de verificação gerado: 2026. Digite o código e sua nova senha.`
    });
  };

  const handleRecuperarPasso2 = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (recCodigo.trim() !== '2026') {
      setFeedback({ tipo: 'erro', texto: 'Código de verificação inválido. Use o código 2026.' });
      return;
    }

    if (recNovaSenha !== recConfirmacao) {
      setFeedback({ tipo: 'erro', texto: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    const sucesso = db.redefinirSenha(recEmail, recNovaSenha);
    if (sucesso) {
      setFeedback({ tipo: 'sucesso', texto: 'Senha redefinida com sucesso! Agora você já pode entrar com a nova senha.' });
      setTimeout(() => {
        setLoginEmail(recEmail);
        setLoginSenha(recNovaSenha);
        setMode('login');
        setRecEtapa(1);
      }, 1500);
    } else {
      setFeedback({ tipo: 'erro', texto: 'Erro ao atualizar senha no banco de dados.' });
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          padding: '36px 32px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Navigation Tabs between Login, Cadastro, Recuperar */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '14px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setFeedback(null); }}
            style={{
              flex: 1,
              background: mode === 'login' ? '#ffffff' : 'transparent',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: mode === 'login' ? '#059669' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogIn size={16} /> Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('cadastro'); setFeedback(null); }}
            style={{
              flex: 1,
              background: mode === 'cadastro' ? '#ffffff' : 'transparent',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: mode === 'cadastro' ? '#059669' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'cadastro' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <UserPlus size={16} /> Criar Conta
          </button>
          <button
            type="button"
            onClick={() => { setMode('recuperar'); setFeedback(null); setRecEtapa(1); }}
            style={{
              flex: 1,
              background: mode === 'recuperar' ? '#ffffff' : 'transparent',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: mode === 'recuperar' ? '#059669' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'recuperar' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <KeyRound size={16} /> Recuperar
          </button>
        </div>

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#064e3b', lineHeight: 1.2 }}>
            {mode === 'login' && 'Acesso ao EcoPonto Inteligente'}
            {mode === 'cadastro' && 'Cadastro no Sistema • RO'}
            {mode === 'recuperar' && 'Recuperação de Senha'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '6px' }}>
            {mode === 'login' && 'Informe suas credenciais ou escolha uma das contas rápidas de teste abaixo.'}
            {mode === 'cadastro' && 'Cadastre-se para rastrear seus descartes, acumular Pontos Verdes e emitir certificados.'}
            {mode === 'recuperar' && 'Informe seu e-mail para receber o código e redefinir sua senha com segurança.'}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px',
              background: feedback.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2',
              color: feedback.tipo === 'sucesso' ? '#15803d' : '#b91c1c',
              border: `1px solid ${feedback.tipo === 'sucesso' ? '#86efac' : '#fca5a5'}`,
            }}
          >
            {feedback.texto}
          </div>
        )}

        {/* ================= FORM 1: LOGIN ================= */}
        {mode === 'login' && (
          <>
            {/* Quick Demo Accounts */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '22px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={14} /> Acesso Rápido de Teste (Clique para Entrar Direto):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {usuariosCadastrados.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#10b981')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    <strong style={{ display: 'block', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.nome.split(' ')[0]} {u.nome.split(' ')[1] || ''}
                    </strong>
                    <span style={{ color: '#059669', fontSize: '0.7rem', fontWeight: 700 }}>
                      {u.tipo.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  E-mail Cadastrado:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                    Senha:
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('recuperar')}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginSenha}
                    onChange={e => setLoginSenha(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '14px', fontSize: '0.95rem', marginTop: '6px' }}
              >
                <LogIn size={18} />
                Entrar no Sistema
              </button>
            </form>
          </>
        )}

        {/* ================= FORM 2: CADASTRO ================= */}
        {mode === 'cadastro' && (
          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nome Completo / Razão Social *:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ana Beatriz de Lima Rosa"
                value={cadNome}
                onChange={e => setCadNome(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Tipo de Perfil *:
                </label>
                <select
                  value={cadTipo}
                  onChange={e => setCadTipo(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="cidadao">Cidadão / Estudante</option>
                  <option value="escola">Escola / Condomínio</option>
                  <option value="cooperativa">Cooperativa de Catadores</option>
                  <option value="admin">Administrador (SEMA)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  CPF ou CNPJ:
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cadCpf}
                  onChange={e => setCadCpf(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                E-mail para Acesso *:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={cadEmail}
                  onChange={e => setCadEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Município em Rondônia *:
                </label>
                <input
                  type="text"
                  required
                  value={cadMunicipio}
                  onChange={e => setCadMunicipio(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Telefone / WhatsApp:
                </label>
                <input
                  type="text"
                  placeholder="(69) 99999-0000"
                  value={cadTelefone}
                  onChange={e => setCadTelefone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Bairro ou Instituição:
              </label>
              <input
                type="text"
                placeholder="Ex: Bairro Centro / Carmela Dutra"
                value={cadBairro}
                onChange={e => setCadBairro(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Senha de Acesso *:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 3 caracteres"
                  value={cadSenha}
                  onChange={e => setCadSenha(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Confirmar Senha *:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repita a senha"
                  value={cadConfirmaSenha}
                  onChange={e => setCadConfirmaSenha(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '14px', fontSize: '0.95rem', marginTop: '10px' }}
            >
              <UserPlus size={18} />
              Finalizar Cadastro e Ganhar 50 Pts
            </button>
          </form>
        )}

        {/* ================= FORM 3: RECUPERAR SENHA ================= */}
        {mode === 'recuperar' && (
          <div>
            {recEtapa === 1 ? (
              <form onSubmit={handleRecuperarPasso1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Digite seu e-mail cadastrado:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={recEmail}
                      onChange={e => setRecEmail(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                    />
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  </div>
                </div>

                <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '10px', border: '1px solid #bae6fd', fontSize: '0.82rem', color: '#0369a1' }}>
                  💡 Para fins de teste rápido, o código de recuperação pré-configurado é <strong>2026</strong>.
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '0.95rem' }}
                >
                  <KeyRound size={18} />
                  Enviar Código de Recuperação
                </button>
              </form>
            ) : (
              <form onSubmit={handleRecuperarPasso2} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Código de 4 Dígitos (Use: 2026) *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={recCodigo}
                    onChange={e => setRecCodigo(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Nova Senha *:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nova senha"
                    value={recNovaSenha}
                    onChange={e => setRecNovaSenha(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Confirme a Nova Senha *:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repita a nova senha"
                    value={recConfirmacao}
                    onChange={e => setRecConfirmacao(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '0.95rem', marginTop: '6px' }}
                >
                  <CheckCircle2 size={18} />
                  Salvar Nova Senha
                </button>
              </form>
            )}
          </div>
        )}

        {onCancel && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={14} /> Voltar para o mapa sem autenticar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
