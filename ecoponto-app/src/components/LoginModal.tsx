import { useState } from 'react';
import type { User, UserRole } from '../types';
import { db } from '../db';
import { X, Lock, Mail, UserPlus, LogIn, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<UserRole>('cidadao');
  const [instituicao, setInstituicao] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const users = db.getUsuarios();

  const handleQuickLogin = (u: User) => {
    db.setUsuarioAtivo(u);
    onLoginSuccess(u);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegister) {
      if (!nome.trim() || !email.trim() || !senha.trim()) {
        setErrorMsg('Preencha todos os campos obrigatórios.');
        return;
      }
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setErrorMsg('Este e-mail já está cadastrado no sistema.');
        return;
      }

      const novoUsuario: User = {
        id: `usr-${Date.now()}`,
        nome: nome.trim(),
        email: email.trim(),
        senha,
        tipo,
        instituicaoOuBairro: instituicao.trim() || 'Porto Velho - RO',
        municipio: 'Porto Velho - RO',
        status: 'Ativo',
        pontosAcumulados: 0,
        dataCadastro: new Date().toISOString().split('T')[0],
      };

      db.salvarUsuario(novoUsuario);
      db.setUsuarioAtivo(novoUsuario);
      onLoginSuccess(novoUsuario);
      onClose();
    } else {
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
      if (match) {
        db.setUsuarioAtivo(match);
        onLoginSuccess(match);
        onClose();
      } else {
        setErrorMsg('E-mail ou senha inválidos. Utilize uma das contas de teste ou cadastre-se.');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '16px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
            }}
          >
            {isRegister ? <UserPlus size={28} /> : <LogIn size={28} />}
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#064e3b' }}>
            {isRegister ? 'Criar Conta no EcoPonto' : 'Entrar no Sistema'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Acesso individualizado com rastreamento dos seus despachos de resíduos.
          </p>
        </div>

        {/* Quick Demo Login selector */}
        {!isRegister && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <Sparkles size={14} /> Entrar Rápido com Contas de Teste:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 10px',
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
                  <span style={{ color: '#059669', fontSize: '0.7rem', fontWeight: 600 }}>
                    {u.tipo.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '16px', border: '1px solid #fecaca' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nome Completo:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              E-mail:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Senha de Acesso:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Tipo de Usuário:
                </label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="cidadao">Cidadão / Estudante</option>
                  <option value="escola">Escola / Condomínio / Empresa</option>
                  <option value="cooperativa">Cooperativa de Catadores</option>
                  <option value="admin">Administrador Gestor (SEMA)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Bairro ou Instituição:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bairro Centro / Escola Carmela Dutra"
                  value={instituicao}
                  onChange={e => setInstituicao(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
            }}
          >
            {isRegister ? 'Criar Minha Conta' : 'Acessar Plataforma'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isRegister ? '← Já possui uma conta cadastrada? Entrar' : 'Não possui cadastro? Criar nova conta →'}
          </button>
        </div>
      </div>
    </div>
  );
}
