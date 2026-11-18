import { useState, useEffect } from 'react';
import type { Despacho } from '../types';
import QRCode from 'qrcode';
import { X, CheckCircle2, Printer, ShieldCheck, Download } from 'lucide-react';

interface Props {
  despacho: Despacho | null;
  onClose: () => void;
}

export function ComprovanteModal({ despacho, onClose }: Props) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (!despacho) return;

    // Payload de validação oficial para o QR Code real
    const qrPayload = JSON.stringify({
      projeto: "EcoPonto Inteligente",
      edital: "Centelha 3 Rondônia - 03/2026",
      codigo: despacho.codigoComprovante,
      cidadao: despacho.usuarioNome,
      ponto: despacho.pontoNome,
      residuo: despacho.materialNome,
      pesoKg: despacho.quantidadeKg,
      co2EvitadoKg: despacho.co2EvitadoKg,
      dataHora: despacho.dataHora,
      validacao: `http://localhost:3011/validar?cert=${despacho.codigoComprovante}&hash=RO${despacho.pontosGanhos}`
    }, null, 2);

    QRCode.toDataURL(qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url: string) => setQrCodeDataUrl(url))
      .catch((err: unknown) => console.error('Erro ao gerar QR Code:', err));
  }, [despacho]);

  if (!despacho) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `qrcode_${despacho.codigoComprovante}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          padding: '28px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            transition: 'background 0.2s',
          }}
          title="Fechar"
        >
          <X size={18} />
        </button>

        {/* Certificate Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Certificado de Destinação Ecológica
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064e3b', margin: '4px 0' }}>
            EcoPonto Inteligente • RO
          </h3>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', padding: '3px 12px', borderRadius: '9999px', marginTop: '4px' }}>
            <ShieldCheck size={14} color="#059669" />
            <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700 }}>
              Autenticação: <strong>{despacho.codigoComprovante}</strong>
            </span>
          </div>
        </div>

        {/* Real Scannable QR Code Highlight Box */}
        <div
          style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '18px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '10px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt={`QR Code Oficial - ${despacho.codigoComprovante}`}
                style={{ width: '150px', height: '150px', display: 'block' }}
              />
            ) : (
              <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                Gerando QR Code...
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#059669',
                color: '#ffffff',
                padding: '2px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              <ShieldCheck size={12} /> QR CODE OFICIAL ESCANEÁVEL
            </span>
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
              Aponte a câmera do seu celular para auditar os dados deste lote no banco de dados.
            </p>
          </div>
        </div>

        {/* Certificate Data Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Cidadão / Entidade:</span>
            <strong style={{ color: '#0f172a' }}>{despacho.usuarioNome}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Ecoponto de Entrega:</span>
            <strong style={{ color: '#0f172a', textAlign: 'right', maxWidth: '65%' }}>
              {despacho.pontoNome}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Resíduo Classificado:</span>
            <strong style={{ color: '#059669' }}>{despacho.materialNome}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Peso Verificado:</span>
            <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{despacho.quantidadeKg.toFixed(1)} kg</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Data e Hora:</span>
            <span>{despacho.dataHora}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Impacto Climático:</span>
            <strong style={{ color: '#059669' }}>-{despacho.co2EvitadoKg.toFixed(2)} kg CO₂</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Renda Estimada para Catadores:</span>
            <strong style={{ color: '#ca8a04' }}>R$ {despacho.rendaGeradaEstimadaR$.toFixed(2)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
            <span style={{ color: '#64748b' }}>Incentivo Ambiental:</span>
            <strong style={{ color: '#0284c7' }}>+{despacho.pontosGanhos} Pontos Verdes</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              flex: 1,
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Printer size={16} />
            Imprimir
          </button>

          <button
            type="button"
            onClick={handleDownloadQR}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '12px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Baixar imagem do QR Code"
          >
            <Download size={16} />
            Baixar QR
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#ffffff',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              padding: '12px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
