import { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  activeUserRole: string;
}

export function AdminSecurityModal({ isOpen, onClose, onUnlock, activeUserRole }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Master password 'admin' or role-based check
    if (password.trim() === 'admin' || (activeUserRole === 'admin' && password.trim() === 'admin')) {
      onUnlock();
      setPassword('');
      setErrorMsg(null);
    } else {
      setErrorMsg('Senha administrativa incorreta. Utilize a senha padrão "admin" para avaliação.');
    }
  };

  const handleQuickBypass = () => {
    setPassword('admin');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2400,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '460px',
          width: '100%',
          padding: '32px 28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)',
            }}
          >
            <Lock size={30} />
          </div>

          <span
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '3px 12px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            ÁREA RESTRITA • SEMA
          </span>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            Acesso ao Painel Administrativo
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
            Este módulo permite alterar dados de usuários, calibração de sensores IoT, auditoria de coletas e precificação de materiais em Rondônia.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '16px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Senha de Segurança do Gestor (SEMA):
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha administrativa..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
                title={showPassword ? 'Ocultar' : 'Exibir'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: '#475569',
            }}
          >
            <span>Dica de Teste Acadêmico: <strong>admin</strong></span>
            <button
              type="button"
              onClick={handleQuickBypass}
              style={{
                background: '#e2e8f0',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Preencher Senha
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1.5,
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              }}
            >
              <KeyRound size={16} />
              Desbloquear Painel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
