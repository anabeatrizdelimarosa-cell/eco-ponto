import { useState, useMemo, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { LandingPage } from './components/LandingPage';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import { AuthScreen } from './components/AuthScreen';
import {
  Compass,
  MapPin,
  FileCheck2,
  PlusCircle,
  ScanLine,
  ShieldCheck,
  Recycle,
  Award,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  Printer,
  Download,
  X,
  Lock,
  Unlock,
  Users,
  DollarSign,
  Database,
  AlertTriangle,
  ExternalLink,
  LogIn,
  LogOut,
  QrCode,
  Leaf,
  Home
} from 'lucide-react';

interface UserData {
  id: string;
  nome: string;
  email: string;
  municipio: string;
  perfil: 'CIDADAO' | 'COOPERATIVA' | 'ESCOLA' | 'ADMIN';
  pontos: number;
  ativo: boolean;
}

interface EcopointData {
  id: string;
  nome: string;
  tipo: string;
  endereco: string;
  lat: string;
  lng: string;
  capacidadeMax: number;
  ocupacaoPct: number;
  materiais: string[];
  mapX: number;
  mapY: number;
}

interface MaterialData {
  id: string;
  nome: string;
  categoria: string;
  corConama: string;
  borderColor: string;
  badgeColor: string;
  descricao: string;
  preparo: string;
  precoKg: number;
  fatorCo2: number;
}

interface DispatchData {
  codigo: string;
  dataHora: string;
  userId: string;
  usuarioNome: string;
  ecopontoId: string;
  ecopontoNome: string;
  materialNome: string;
  categoria: string;
  peso: number;
  co2Evitado: number;
  pontos: number;
  rendaGerada: number;
  observacao?: string;
}

interface CampaignData {
  id: string;
  org: string;
  titulo: string;
  descricao: string;
  atual: number;
  meta: number;
  status: string;
}

const INITIAL_USERS: UserData[] = [
  {
    id: 'u1',
    nome: 'Ana Beatriz de Lima Rosa',
    email: 'anabeatriz@escola.ro.gov.br',
    municipio: '3°B Informática - EEEFM Carmela Dutra • Porto Velho - RO',
    perfil: 'CIDADAO',
    pontos: 380,
    ativo: true,
  },
  {
    id: 'u2',
    nome: 'Cooperativa CATANORTE (Catadores de RO)',
    email: 'triagem@catanorte.org.br',
    municipio: 'Bairro Lagoa - Porto Velho / RO',
    perfil: 'COOPERATIVA',
    pontos: 1850,
    ativo: true,
  },
  {
    id: 'u3',
    nome: 'EEEFM Carmela Dutra (Direção Escolar)',
    email: 'carmeladutra@seduc.ro.gov.br',
    municipio: 'Av. Farquar, Panair - Porto Velho / RO',
    perfil: 'ESCOLA',
    pontos: 1240,
    ativo: true,
  },
  {
    id: 'u4',
    nome: 'SEMA / Auditoria Governamental RO',
    email: 'gestao.residuos@sema.portovelho.ro.gov.br',
    municipio: 'Centro - Porto Velho / RO',
    perfil: 'ADMIN',
    pontos: 500,
    ativo: true,
  },
];

const INITIAL_ECOPOINTS: EcopointData[] = [
  {
    id: 'ep1',
    nome: 'SEMA – Secretaria Municipal de Meio Ambiente de Porto Velho',
    tipo: 'ECOPONTO MUNICIPAL',
    endereco: 'Rua Duque de Caxias, 186 - Bairro São Cristóvão • Centro, Porto Velho - RO',
    lat: '-8.7595',
    lng: '-63.9012',
    capacidadeMax: 3000,
    ocupacaoPct: 48,
    materiais: ['Plásticos', 'Papel', 'Vidros', 'Metais', 'Eletrônicos'],
    mapX: 36,
    mapY: 74,
  },
  {
    id: 'ep2',
    nome: 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis',
    tipo: 'COOPERATIVA DE CATADORES',
    endereco: 'Rua da Beira, 4520 - Bairro Lagoa (próximo à BR-364) • Porto Velho - RO',
    lat: '-8.7742',
    lng: '-63.8615',
    capacidadeMax: 10000,
    ocupacaoPct: 74,
    materiais: ['Plásticos', 'Papel', 'Metais', 'Óleo'],
    mapX: 78,
    mapY: 72,
  },
  {
    id: 'ep3',
    nome: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    tipo: 'PONTO ESCOLAR',
    endereco: 'Av. Farquar, 2550 - Bairro Panair (CEP 76801-329) • Porto Velho - RO',
    lat: '-8.7480',
    lng: '-63.9088',
    capacidadeMax: 1200,
    ocupacaoPct: 38,
    materiais: ['Plásticos', 'Papel', 'Metais', 'Eletrônicos'],
    mapX: 34,
    mapY: 50,
  },
  {
    id: 'ep4',
    nome: 'SEDAM – Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    tipo: 'PONTO GOVERNAMENTAL',
    endereco: 'Av. Farquar, 2986 - Bairro Pedrinhas • Porto Velho - RO',
    lat: '-8.7412',
    lng: '-63.9065',
    capacidadeMax: 2000,
    ocupacaoPct: 31,
    materiais: ['Eletrônicos', 'Papel', 'Plásticos'],
    mapX: 46,
    mapY: 28,
  },
  {
    id: 'ep5',
    nome: 'ASPREVEL – Associação de Catadores de Porto Velho',
    tipo: 'ASSOCIAÇÃO PARCEIRA',
    endereco: 'Av. dos Imigrantes, 4100 - São Sebastião • Porto Velho - RO',
    lat: '-8.7320',
    lng: '-63.8820',
    capacidadeMax: 6000,
    ocupacaoPct: 55,
    materiais: ['Plásticos', 'Papel', 'Vidros', 'Metais'],
    mapX: 68,
    mapY: 45,
  },
  {
    id: 'ep6',
    nome: 'SEMAM Ji-Paraná – Ecoponto Central do Interior',
    tipo: 'ECOPONTO REGIONAL (RO)',
    endereco: 'Av. Marechal Rondon, 890 - Centro • Ji-Paraná - RO',
    lat: '-10.8853',
    lng: '-61.9517',
    capacidadeMax: 5000,
    ocupacaoPct: 42,
    materiais: ['Plásticos', 'Papel', 'Vidros', 'Metais', 'Eletrônicos', 'Óleo'],
    mapX: 84,
    mapY: 22,
  },
];

const INITIAL_MATERIALS: MaterialData[] = [
  {
    id: 'm1',
    nome: 'Plásticos (PET, PEAD, PEBD, PP)',
    categoria: 'Plásticos',
    corConama: 'VERMELHO',
    borderColor: 'border-l-red-500',
    badgeColor: 'text-red-600 bg-red-50',
    descricao: 'Garrafas PET de refrigerante/água, embalagens de xampu, potes de margarina, baldes e sacolas limpas.',
    preparo: 'Enxágue com água de reúso para retirar restos orgânicos. Deixe secar, amasse a garrafa para retirar o ar e rosqueie a tampa.',
    precoKg: 2.40,
    fatorCo2: 1.53,
  },
  {
    id: 'm2',
    nome: 'Papel, Papelão e Embalagens Longa Vida',
    categoria: 'Papel',
    corConama: 'AZUL',
    borderColor: 'border-l-blue-600',
    badgeColor: 'text-blue-700 bg-blue-50',
    descricao: 'Caixas de papelão ondulado desmontadas, folhas de papel A4/caderno, livros desincorporados e jornais.',
    preparo: 'Desmonte e achate as caixas de papelão para otimizar espaço de carga. Mantenha os papéis em local seco; papel molhado perde valor.',
    precoKg: 0.65,
    fatorCo2: 0.92,
  },
  {
    id: 'm3',
    nome: 'Vidros (Garrafas, Potes de Conserva e Frascos)',
    categoria: 'Vidros',
    corConama: 'VERDE',
    borderColor: 'border-l-emerald-600',
    badgeColor: 'text-emerald-700 bg-emerald-50',
    descricao: 'Garrafas de cerveja, refrigerante, sucos, potes de molho, conserva de palmito e frascos de café.',
    preparo: 'Esvazie e enxágue bem. Remova tampas. Em caso de quebra, embale em caixa identificada com "VIDRO QUEBRADO" para proteger catadores.',
    precoKg: 0.35,
    fatorCo2: 0.31,
  },
  {
    id: 'm4',
    nome: 'Metais (Latinhas de Alumínio e Aço)',
    categoria: 'Metais',
    corConama: 'AMARELO',
    borderColor: 'border-l-amber-500',
    badgeColor: 'text-amber-700 bg-amber-50',
    descricao: 'Latinhas de alumínio (líder nacional com 98,7% de reciclagem), latas de milho/ervilha e tampas metálicas.',
    preparo: 'Esvazie completamente e amasse as latinhas para reduzir volume. Dobre tampas cortantes de aço para o interior da lata.',
    precoKg: 6.80,
    fatorCo2: 9.13,
  },
  {
    id: 'm5',
    nome: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    categoria: 'Eletrônicos',
    corConama: 'LARANJA',
    borderColor: 'border-l-orange-500',
    badgeColor: 'text-orange-700 bg-orange-50',
    descricao: 'Cabos, carregadores, celulares antigos, placas-mãe, mouses, teclados, pilhas e baterias portáteis.',
    preparo: 'Nunca descarte no lixo comum devido a metais pesados (chumbo/mercúrio). Entregue intacto nos PEVs da SEDAM ou SEMA.',
    precoKg: 4.50,
    fatorCo2: 4.80,
  },
  {
    id: 'm6',
    nome: 'Óleo Vegetal de Fritura Usado',
    categoria: 'Óleo',
    corConama: 'MARROM / ESPECIAL',
    borderColor: 'border-l-amber-800',
    badgeColor: 'text-amber-900 bg-amber-100',
    descricao: 'Óleo de cozinha residual proveniente de residências, cantinas escolares e restaurantes.',
    preparo: 'Espere esfriar, coe para retirar resíduos sólidos e armazene em garrafa PET bem fechada. 1 litro contamina até 25 mil litros de água.',
    precoKg: 1.80,
    fatorCo2: 2.45,
  },
];

const INITIAL_DISPATCHES: DispatchData[] = [
  {
    codigo: 'ECO-RO-2026-001',
    dataHora: '2026-10-10 10:20',
    userId: 'u1',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'ep3',
    ecopontoNome: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    materialNome: 'Plásticos (PET, PEAD, PEBD, PP)',
    categoria: 'Plásticos',
    peso: 8.5,
    co2Evitado: 13.0,
    pontos: 85,
    rendaGerada: 20.40,
    observacao: 'Garrafas PET limpas arrecadadas na gincana da turma 3°B.',
  },
  {
    codigo: 'ECO-RO-2026-002',
    dataHora: '2026-10-11 14:15',
    userId: 'u1',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'ep1',
    ecopontoNome: 'SEMA – Secretaria Municipal de Meio Ambiente de Porto Velho',
    materialNome: 'Papel, Papelão e Embalagens Longa Vida',
    categoria: 'Papel',
    peso: 14.0,
    co2Evitado: 12.88,
    pontos: 140,
    rendaGerada: 9.10,
    observacao: 'Caixas de papelão desmontadas e cadernos antigos.',
  },
  {
    codigo: 'ECO-RO-2026-003',
    dataHora: '2026-10-12 16:40',
    userId: 'u1',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'ep4',
    ecopontoNome: 'SEDAM – Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    materialNome: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    categoria: 'Eletrônicos',
    peso: 3.2,
    co2Evitado: 15.36,
    pontos: 95,
    rendaGerada: 14.40,
    observacao: 'Cabos USB, fontes queimadas e celulares sem uso.',
  },
  {
    codigo: 'ECO-RO-2026-004',
    dataHora: '2026-10-12 18:00',
    userId: 'u2',
    usuarioNome: 'Cooperativa CATANORTE (Catadores de RO)',
    ecopontoId: 'ep5',
    ecopontoNome: 'ASPREVEL – Associação de Catadores de Porto Velho',
    materialNome: 'Metais (Latinhas de Alumínio e Aço)',
    categoria: 'Metais',
    peso: 32.5,
    co2Evitado: 296.7,
    pontos: 325,
    rendaGerada: 221.00,
    observacao: 'Lote consolidado de alumínio prensado.',
  },
  {
    codigo: 'ECO-RO-2026-005',
    dataHora: '2026-10-13 11:30',
    userId: 'u1',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    ecopontoId: 'ep2',
    ecopontoNome: 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis',
    materialNome: 'Óleo Vegetal de Fritura Usado',
    categoria: 'Óleo',
    peso: 6.0,
    co2Evitado: 14.7,
    pontos: 60,
    rendaGerada: 10.80,
    observacao: 'Garrafas PET com óleo de fritura filtrado.',
  },
];

const CAMPAIGNS: CampaignData[] = [
  {
    id: 'c1',
    org: 'EEEFM Carmela Dutra & Turma 3°B',
    titulo: 'Gincana Escolar 3°B Informática: Rondônia Sustentável',
    descricao: 'Mobilização pedagógica dos estudantes do curso técnico em informática com destinação direta para a cooperativa CATANORTE.',
    atual: 384,
    meta: 500,
    status: 'EM ANDAMENTO',
  },
  {
    id: 'c2',
    org: 'Condomínios de Porto Velho & SEMA',
    titulo: 'Campanha Óleo no Rio Nunca Mais: Protegendo o Rio Madeira',
    descricao: 'Coleta voluntária de óleo de cozinha usado em garrafas PET para impedir a contaminação da bacia do Rio Madeira e converter em sabão ecológico.',
    atual: 215,
    meta: 300,
    status: 'EM ANDAMENTO',
  },
  {
    id: 'c3',
    org: 'Governo de Rondônia / Simulado Centelha 3',
    titulo: 'Mutirão Estadual de E-Lixo: Logística Reversa SEDAM-RO',
    descricao: 'Coleta de pilhas, celulares e equipamentos eletrônicos para reciclagem tecnológica e neutralização de metais pesados.',
    atual: 640,
    meta: 1200,
    status: 'EM ANDAMENTO',
  },
];

export type AppTab =
  | 'inicio'
  | 'mapa'
  | 'pontos'
  | 'historico'
  | 'registrar'
  | 'validar'
  | 'admin'
  | 'guia'
  | 'centelha';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [adminSubTab, setAdminSubTab] = useState<'usuarios' | 'iot' | 'precos' | 'auditoria'>('usuarios');
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('u1');
  const [ecopoints, setEcopoints] = useState<EcopointData[]>(INITIAL_ECOPOINTS);
  const [materials, setMaterials] = useState<MaterialData[]>(INITIAL_MATERIALS);
  const [dispatches, setDispatches] = useState<DispatchData[]>(INITIAL_DISPATCHES);

  // Filters & State
  const [mapFilter, setMapFilter] = useState<'todos' | 'meus'>('todos');
  const [selectedMapPointId, setSelectedMapPointId] = useState<string>('ep1');
  const [pointSearch, setPointSearch] = useState('');
  const [pointMatFilter, setPointMatFilter] = useState('Todos');

  // Modals
  const [selectedCertificate, setSelectedCertificate] = useState<DispatchData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null);

  // Admin Security
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminSecurityModal, setShowAdminSecurityModal] = useState(false);

  // Validator
  const [hashQuery, setHashQuery] = useState('ECO-RO-2026-001');
  const [validatedCert, setValidatedCert] = useState<DispatchData | null>(null);
  const [hashNotFound, setHashNotFound] = useState(false);
  const [validatedQrUrl, setValidatedQrUrl] = useState<string>('');

  // Dispatch Form
  const [formEcoponto, setFormEcoponto] = useState('ep1');
  const [formMaterial, setFormMaterial] = useState('m1');
  const [formPeso, setFormPeso] = useState('');
  const [formData, setFormData] = useState('2026-10-20 15:30');
  const [formObs, setFormObs] = useState('');

  // New Ecopoint Modal
  const [showNewPointModal, setShowNewPointModal] = useState(false);
  const [newPointName, setNewPointName] = useState('');
  const [newPointAddress, setNewPointAddress] = useState('');
  const [newPointCap, setNewPointCap] = useState('2500');

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || users[0],
    [users, currentUserId]
  );

  const userDispatches = useMemo(
    () => dispatches.filter((d) => d.userId === currentUser.id),
    [dispatches, currentUser.id]
  );

  const userVisitedPointIds = useMemo(
    () => [...new Set(userDispatches.map((d) => d.ecopontoId))],
    [userDispatches]
  );

  const stats = useMemo(() => {
    const userKg = userDispatches.reduce((acc, d) => acc + d.peso, 0);
    const userCo2 = userDispatches.reduce((acc, d) => acc + d.co2Evitado, 0);
    const globalKg = dispatches.reduce((acc, d) => acc + d.peso, 0);
    return {
      userKg: userKg.toFixed(1),
      userCo2: userCo2.toFixed(1),
      userPoints: currentUser.pontos,
      globalKg: globalKg.toFixed(1),
    };
  }, [userDispatches, dispatches, currentUser.pontos]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Generate QR Code data URL when a certificate is opened
  useEffect(() => {
    if (!selectedCertificate) {
      setQrCodeDataUrl('');
      return;
    }

    const payload = JSON.stringify({
      projeto: 'EcoPonto Inteligente',
      edital: 'Centelha 3 Rondônia (03/2026)',
      codigo: selectedCertificate.codigo,
      titular: selectedCertificate.usuarioNome,
      ecoponto: selectedCertificate.ecopontoNome,
      material: selectedCertificate.materialNome,
      pesoKg: selectedCertificate.peso,
      co2EvitadoKg: selectedCertificate.co2Evitado,
      dataHora: selectedCertificate.dataHora,
      validacao: `http://localhost:3011/validar?hash=${selectedCertificate.codigo}`,
    }, null, 2);

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: { dark: '#064e3b', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => {
        // Fallback to online generator
        setQrCodeDataUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&margin=8&data=${encodeURIComponent(payload)}`
        );
      });
  }, [selectedCertificate]);

  // Generate QR code for validated certificate
  useEffect(() => {
    if (!validatedCert) {
      setValidatedQrUrl('');
      return;
    }

    const payload = JSON.stringify({
      projeto: 'EcoPonto Inteligente - Auditoria',
      codigo: validatedCert.codigo,
      titular: validatedCert.usuarioNome,
      pesoKg: validatedCert.peso,
      status: 'AUTENTICADO_SEMA_RO',
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: { dark: '#0369a1', light: '#ffffff' },
    })
      .then((url) => setValidatedQrUrl(url))
      .catch(() => {
        setValidatedQrUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`
        );
      });
  }, [validatedCert]);

  // Tab change handler with Admin password check
  const handleSelectTab = (tab: AppTab) => {
    if (tab === 'admin' && !isAdminUnlocked) {
      setShowAdminSecurityModal(true);
      return;
    }
    setActiveTab(tab);
  };

  // Logout handler: goes directly to Landing Page ("vai direto pra landpagy")
  const handleLogout = () => {
    setIsAdminUnlocked(false);
    setActiveTab('inicio');
    showToast('👋 Sessão encerrada. Você retornou à página inicial.');
  };

  // Hash Validator
  const handleValidateHash = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = hashQuery.trim().toUpperCase();
    const found = dispatches.find((d) => d.codigo.toUpperCase() === cleaned);
    if (found) {
      setValidatedCert(found);
      setHashNotFound(false);
    } else {
      setValidatedCert(null);
      setHashNotFound(true);
    }
  };

  // Real PDF Download with jsPDF
  const handleDownloadRealPDF = async (cert: DispatchData) => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Outer & Inner Borders
      doc.setDrawColor(15, 76, 46);
      doc.setLineWidth(1.2);
      doc.rect(10, 10, 190, 277);
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.4);
      doc.rect(13, 13, 184, 271);

      // Header Box
      doc.setFillColor(15, 76, 46);
      doc.rect(13, 13, 184, 38, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('GOVERNO DO ESTADO DE RONDÔNIA • SEMA / PROGRAMA CENTELHA 3 (EDITAL 03/2026)', 105, 23, { align: 'center' });

      doc.setFontSize(16);
      doc.text('CERTIFICADO DIGITAL DE DESTINAÇÃO ECOLÓGICA', 105, 33, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Sistema Oficial EcoPonto Inteligente — Rastreabilidade de Resíduos Recicláveis', 105, 42, { align: 'center' });

      // Hash Box
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(22, 57, 166, 13, 2, 2, 'FD');
      doc.setTextColor(6, 95, 70);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`CÓDIGO HASH DE AUDITORIA: ${cert.codigo}`, 28, 65.5);
      doc.setFontSize(8.5);
      doc.text('STATUS: VALIDADO NO ECOPONTO', 182, 65.5, { align: 'right' });

      // Text intro
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const introText = doc.splitTextToSize(
        `Certificamos, para os devidos fins de comprovação socioambiental, educação ecológica e auditoria de logística reversa no Estado de Rondônia, que o(a) titular abaixo identificado(a) realizou a entrega rastreada de resíduos sólidos recicláveis em ponto credenciado da rede EcoPonto Inteligente:`,
        166
      );
      doc.text(introText, 22, 80);

      // Data Card Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(22, 102, 166, 78, 3, 3, 'FD');

      const drawRow = (label: string, value: string, y: number, highlight = false) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label, 28, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(highlight ? 15 : 15, highlight ? 118 : 23, highlight ? 110 : 42);
        const wrapped = doc.splitTextToSize(String(value), 108);
        doc.text(wrapped, 76, y);
      };

      drawRow('TITULAR / ENTIDADE:', cert.usuarioNome, 112);
      drawRow('DATA E HORA:', cert.dataHora, 124);
      drawRow('ECOPONTO RECEPTOR:', cert.ecopontoNome, 136);
      drawRow('MATERIAL TRIADO:', cert.materialNome, 150);
      drawRow('PESO VERIFICADO:', `${cert.peso} kg`, 162, true);
      drawRow('IMPACTO CLIMÁTICO:', `-${cert.co2Evitado} kg CO2e evitados (+${cert.pontos} Pontos Verdes)`, 173, true);

      // Embed QR Code
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(148, 163, 184);
      doc.roundedRect(22, 188, 166, 48, 3, 3, 'FD');

      if (qrCodeDataUrl) {
        doc.addImage(qrCodeDataUrl, 'PNG', 27, 193, 38, 38);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 76, 46);
      doc.text('VALIDAÇÃO DIGITAL POR QR CODE (ISO/IEC 18004)', 72, 201);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const qrDesc = doc.splitTextToSize(
        'Aponte a câmera de qualquer smartphone para o QR Code ao lado para ler instantaneamente os metadados autenticados desta entrega ou valide o código hash na plataforma oficial EcoPonto Inteligente.',
        110
      );
      doc.text(qrDesc, 72, 208);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(3, 105, 161);
      doc.text(`HASH: ${cert.codigo} | RENDA COOPERATIVA: R$ ${Number(cert.rendaGerada || 0).toFixed(2)}`, 72, 228);

      // Signature Lines
      doc.setDrawColor(148, 163, 184);
      doc.line(32, 255, 95, 255);
      doc.line(115, 255, 178, 255);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Ana Beatriz de Lima Rosa', 63.5, 260, { align: 'center' });
      doc.text('Rede EcoPonto Inteligente • SEMA/RO', 146.5, 260, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Idealizadora • 3°B Informática (EEEFM Carmela Dutra)', 63.5, 264, { align: 'center' });
      doc.text('Auditoria Digital e Telemetria IoT • Porto Velho - RO', 146.5, 264, { align: 'center' });

      doc.save(`Certificado_${cert.codigo}_EcoPonto_RO.pdf`);
      showToast(`Arquivo PDF oficial "${cert.codigo}.pdf" baixado com sucesso!`);
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Submit delivery
  const handleRegisterDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const pesoNum = parseFloat(formPeso);
    if (!pesoNum || pesoNum <= 0) {
      showToast('Informe um peso válido maior que 0 kg.', 'error');
      return;
    }
    const ep = ecopoints.find((item) => item.id === formEcoponto);
    const mat = materials.find((item) => item.id === formMaterial);
    if (!ep || !mat) return;

    const pontosGanhos = Math.round(pesoNum * 10);
    const co2 = parseFloat((pesoNum * mat.fatorCo2).toFixed(2));
    const renda = parseFloat((pesoNum * mat.precoKg).toFixed(2));
    const nextNum = String(dispatches.length + 1).padStart(3, '0');
    const newCode = `ECO-RO-2026-${nextNum}`;

    const newRecord: DispatchData = {
      codigo: newCode,
      dataHora: formData.replace('T', ' '),
      userId: currentUser.id,
      usuarioNome: currentUser.nome,
      ecopontoId: ep.id,
      ecopontoNome: ep.nome,
      materialNome: mat.nome,
      categoria: mat.categoria,
      peso: pesoNum,
      co2Evitado: co2,
      pontos: pontosGanhos,
      rendaGerada: renda,
      observacao: formObs || 'Entrega registrada via plataforma EcoPonto Inteligente.',
    };

    setDispatches([newRecord, ...dispatches]);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, pontos: u.pontos + pontosGanhos } : u))
    );
    setEcopoints((prev) =>
      prev.map((p) => {
        if (p.id !== ep.id) return p;
        const currentKg = (p.ocupacaoPct / 100) * p.capacidadeMax + pesoNum;
        const newPct = Math.min(100, Math.round((currentKg / p.capacidadeMax) * 100));
        return { ...p, ocupacaoPct: newPct };
      })
    );

    setFormPeso('');
    setFormObs('');
    showToast(`Despacho ${newCode} registrado! +${pontosGanhos} Pontos Verdes creditados.`);
    setSelectedCertificate(newRecord);
    setActiveTab('historico');
  };

  // CSV Export
  const handleExportCSV = () => {
    const header = 'Codigo;DataHora;Usuario;Ecoponto;Material;PesoKg;CO2EvitadoKg;RendaGeradaBRL\n';
    const rows = dispatches
      .map(
        (d) =>
          `${d.codigo};${d.dataHora};"${d.usuarioNome}";"${d.ecopontoNome}";"${d.materialNome}";${d.peso};${d.co2Evitado};${d.rendaGerada}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auditoria_ecoponto_rondonia_2026.csv';
    a.click();
    showToast('Relatório oficial CSV baixado com sucesso!');
  };

  // JSON Backup
  const handleExportJSON = () => {
    const payload = {
      sistema: 'EcoPonto Inteligente - Rondônia',
      edital: 'Centelha 3 Rondônia - Edital 03/2026',
      exportadoEm: new Date().toISOString(),
      ecopontos: ecopoints,
      despachos: dispatches,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_ecoponto_ro_2026.json';
    a.click();
    showToast('Backup completo JSON gerado!');
  };

  const inspectedPoint = useMemo(
    () => ecopoints.find((p) => p.id === selectedMapPointId) || ecopoints[0],
    [ecopoints, selectedMapPointId]
  );

  const displayedMapPoints = useMemo(() => {
    if (mapFilter === 'meus') {
      return ecopoints.filter((p) => userVisitedPointIds.includes(p.id));
    }
    return ecopoints;
  }, [ecopoints, mapFilter, userVisitedPointIds]);

  const filteredPointsList = useMemo(() => {
    return ecopoints.filter((p) => {
      const matchText =
        p.nome.toLowerCase().includes(pointSearch.toLowerCase()) ||
        p.endereco.toLowerCase().includes(pointSearch.toLowerCase());
      const matchMat = pointMatFilter === 'Todos' || p.materiais.includes(pointMatFilter);
      return matchText && matchMat;
    });
  }, [ecopoints, pointSearch, pointMatFilter]);

  const selectedMatObj = materials.find((m) => m.id === formMaterial) || materials[0];
  const previewPeso = parseFloat(formPeso) || 0;
  const previewPontos = Math.round(previewPeso * 10);
  const previewCo2 = (previewPeso * selectedMatObj.fatorCo2).toFixed(2);
  const previewRenda = (previewPeso * selectedMatObj.precoKg).toFixed(2);

  // Convert for LandingPage compatibility
  const compatMateriais = useMemo(() => {
    return materials.map((m) => ({
      id: m.id,
      nome: m.nome,
      categoria: 'plastico' as const,
      cor: m.corConama,
      descricao: m.descricao,
      orientacao_descarte: m.preparo,
      dicas: [],
      impactoPorKg: m.fatorCo2,
      precoMedioKgCooperativa: m.precoKg,
    }));
  }, [materials]);

  const compatDespachos = useMemo(() => {
    return dispatches.map((d) => ({
      id: d.codigo,
      codigoComprovante: d.codigo,
      usuarioId: d.userId,
      usuarioNome: d.usuarioNome,
      pontoId: d.ecopontoId,
      pontoNome: d.ecopontoNome,
      materialId: d.categoria,
      materialNome: d.materialNome,
      quantidadeKg: d.peso,
      dataHora: d.dataHora,
      pontosGanhos: d.pontos,
      co2EvitadoKg: d.co2Evitado,
      rendaGeradaEstimadaR$: d.rendaGerada,
      status: 'Validado no Ecoponto' as const,
    }));
  }, [dispatches]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all ${
            toast.type === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-emerald-900 text-emerald-50 border-emerald-600'
          }`}
        >
          <Sparkles className="w-5 h-5 text-emerald-300" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* TOPBAR HEADER (Design fiel ao modelo ecoponto_inteligente_site_completo) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                EcoPonto Inteligente
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sistema Oficial de Coleta Seletiva & Rastreabilidade • RO
              </p>
            </div>
          </div>

          {/* User Account / Profile Box */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              {currentUser.nome.charAt(0)}
            </div>
            <div className="text-left pr-2">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.nome}
              </div>
              <div className="text-[11px] font-bold text-emerald-700">
                {currentUser.perfil} • {currentUser.pontos} pts
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              title="Trocar Perfil / Usuário"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Trocar Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
              title="Encerrar Sessão e Ir para Landing Page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL SUBHEADER TABS (Sem barra lateral / Sem drawer, conforme solicitado) */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'inicio', label: 'Início (Visão Geral)', icon: Home },
              { id: 'mapa', label: 'Mapa Interativo & Meus Despachos', icon: Compass },
              { id: 'pontos', label: `Pontos de Coleta (${ecopoints.length})`, icon: MapPin },
              { id: 'historico', label: `Histórico & Comprovantes (${userDispatches.length})`, icon: FileCheck2 },
              { id: 'registrar', label: 'Registrar Despacho', icon: PlusCircle },
              { id: 'validar', label: 'Validar Certificado', icon: ScanLine },
              { id: 'admin', label: 'Painel Administrativo (SEMA)', icon: ShieldCheck, highlight: true },
              { id: 'guia', label: 'Guia & Campanhas', icon: Recycle },
              { id: 'centelha', label: 'Ficha Centelha 3', icon: Award },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id as AppTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                      : tab.highlight
                      ? 'border-transparent text-red-700 hover:bg-red-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'admin' && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                      {isAdminUnlocked ? '🔓' : '🔒 Senha'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* HERO BANNER INSTITUCIONAL (Exibido nas telas do sistema exceto na Landing Page) */}
      {activeTab !== 'inicio' && (
        <section className="bg-gradient-to-r from-[#0f4c2e] via-[#14532d] to-[#166534] text-white border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Plataforma Oficial Centelha 3 Rondônia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Gestão Inteligente & Rastreabilidade de Resíduos
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Você está conectado como <strong className="text-white">{currentUser.nome}</strong> ({currentUser.municipio}). O sistema rastreia cada quilo entregue em cooperativas e ecopontos com certificação digital auditável.
              </p>
            </div>

            <div className="w-full lg:w-80 bg-black/20 backdrop-blur-sm border border-white/15 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Seus Despachos:</span>
                <span className="font-extrabold text-emerald-300 text-sm">{stats.userKg} kg entregues</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Seu CO₂ Evitado:</span>
                <span className="font-bold text-white">{stats.userCo2} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Seus Pontos Verdes:</span>
                <span className="font-extrabold text-amber-300">{stats.userPoints} pts</span>
              </div>
              <div className="border-t border-white/15 pt-2 flex items-center justify-between">
                <span className="text-emerald-200">Total Global na Rede:</span>
                <span className="font-extrabold text-white">{stats.globalKg} kg</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ================= ABA 0: LANDING PAGE ================= */}
        {activeTab === 'inicio' && (
          <LandingPage
            materiais={compatMateriais}
            despachos={compatDespachos}
            onNavigate={(t) => handleSelectTab(t as AppTab)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {/* ================= ABA 1: MAPA INTERATIVO ================= */}
        {activeTab === 'mapa' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <Compass className="w-4 h-4" />
                  <span>GEOLOCALIZAÇÃO RONDÔNIA • Base Cartográfica: Porto Velho & Região Central</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Mapa Interativo de Ecopontos & Seus Despachos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acompanhe a malha de coleta seletiva e veja em destaque azul <strong>onde {currentUser.nome} já realizou entregas</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMapFilter('todos')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    mapFilter === 'todos' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos os Pontos ({ecopoints.length})
                </button>
                <button
                  onClick={() => setMapFilter('meus')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    mapFilter === 'meus' ? 'bg-sky-700 text-white shadow-sm' : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Onde Já Despachei ({userVisitedPointIds.length})</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Mapa Cartográfico Interativo */}
              <div className="lg:col-span-7 bg-[#e6f0ec] border border-slate-300 rounded-2xl relative h-[430px] overflow-hidden shadow-inner select-none">
                {/* Calha do Rio Madeira */}
                <div
                  className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-[#93c5fd] to-[#bfdbfe] border-r-2 border-blue-300/70 flex items-center justify-center"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0% 100%)' }}
                >
                  <span className="-rotate-90 text-[11px] font-extrabold tracking-widest text-blue-900/60 uppercase whitespace-nowrap">
                    CALHA DO RIO MADEIRA
                  </span>
                </div>

                {/* Vias Principais de Porto Velho */}
                <div className="absolute top-0 bottom-0 left-[46%] w-3 bg-white/80 border-x border-slate-300" />
                <span className="absolute top-8 left-[48%] text-[10px] font-bold text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
                  AV. RIO MADEIRA (BR-364)
                </span>

                <div className="absolute left-[18%] right-0 top-[62%] h-3 bg-white/80 border-y border-slate-300" />
                <span className="absolute top-[64%] left-[25%] text-[10px] font-bold text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
                  AV. SETE DE SETEMBRO
                </span>

                {/* Marcadores Interativos */}
                {displayedMapPoints.map((pt) => {
                  const hasDeliveredHere = userVisitedPointIds.includes(pt.id);
                  const userDeliveriesCount = userDispatches.filter((d) => d.ecopontoId === pt.id).length;
                  const isSelected = inspectedPoint.id === pt.id;

                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedMapPointId(pt.id)}
                      style={{ left: `${pt.mapX}%`, top: `${pt.mapY}%` }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute flex flex-col items-center group transition-transform ${
                        isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                          hasDeliveredHere ? 'bg-sky-600 text-white ring-4 ring-sky-400/40' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {hasDeliveredHere ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-300 px-2 py-0.5 rounded-lg shadow text-[10px] font-extrabold text-slate-800 whitespace-nowrap">
                        <span>{pt.nome.split('–')[0].trim()}</span>
                        {hasDeliveredHere && (
                          <span className="bg-sky-600 text-white px-1.5 py-0.2 rounded-full text-[9px]">
                            {userDeliveriesCount} entrega{userDeliveriesCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" /> Onde Você Já Despachou
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> Ecoponto Ativo na Rede
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">Clique em um pino para inspecionar</span>
                </div>
              </div>

              {/* Painel de Inspeção do Ecoponto */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                      {inspectedPoint.tipo}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        inspectedPoint.ocupacaoPct >= 90 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inspectedPoint.ocupacaoPct >= 90 ? 'Lotado (Alerta IoT)' : 'Ativo'}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {inspectedPoint.nome}
                  </h4>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{inspectedPoint.endereco}</span>
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                    <span>Lat: {inspectedPoint.lat}</span>
                    <span>Long: {inspectedPoint.lng}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                        Telemetria de Lotação IoT:
                      </span>
                      <span className={inspectedPoint.ocupacaoPct >= 90 ? 'text-red-600' : 'text-emerald-700'}>
                        {inspectedPoint.ocupacaoPct}% ({Math.round((inspectedPoint.ocupacaoPct / 100) * inspectedPoint.capacidadeMax)}/{inspectedPoint.capacidadeMax} kg)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          inspectedPoint.ocupacaoPct >= 90 ? 'bg-red-500' : inspectedPoint.ocupacaoPct >= 70 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${inspectedPoint.ocupacaoPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Materiais Aceitos:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectedPoint.materiais.map((m) => (
                        <span key={m} className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormEcoponto(inspectedPoint.id);
                    setActiveTab('registrar');
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Despacho Neste Ecoponto</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: PONTOS DE COLETA ================= */}
        {activeTab === 'pontos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <span>Rede de Ecopontos e Cooperativas</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ecopontos municipais, pontos escolares e cooperativas de catadores credenciadas em Rondônia.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <span className="absolute left-3.5 top-2.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nome, bairro ou município..."
                  value={pointSearch}
                  onChange={(e) => setPointSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['Todos', 'Plásticos', 'Papel', 'Vidros', 'Metais', 'Eletrônicos', 'Óleo'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPointMatFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      pointMatFilter === cat ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'Todos' ? 'Todos os Materiais' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPointsList.map((pt) => {
                const visited = userVisitedPointIds.includes(pt.id);
                return (
                  <div key={pt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700">{pt.tipo}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${pt.ocupacaoPct >= 90 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {pt.ocupacaoPct >= 90 ? 'LOTADO' : 'ATIVO'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">{pt.nome}</h4>
                      <p className="text-xs text-slate-500 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        <span>{pt.endereco}</span>
                      </p>
                      {visited && (
                        <div className="bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Você já realizou despachos de lixo neste ecoponto!</span>
                        </div>
                      )}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Capacidade / Ocupação IoT:</span>
                          <span>{pt.ocupacaoPct}% ({Math.round((pt.ocupacaoPct / 100) * pt.capacidadeMax)}/{pt.capacidadeMax} kg)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${pt.ocupacaoPct >= 90 ? 'bg-red-500' : pt.ocupacaoPct >= 70 ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${pt.ocupacaoPct}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {pt.materiais.slice(0, 3).map((m) => (
                          <span key={m} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{m}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setFormEcoponto(pt.id);
                          setActiveTab('registrar');
                        }}
                        className="text-xs font-extrabold text-emerald-700 hover:underline"
                      >
                        Despachar →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ABA 3: HISTÓRICO & COMPROVANTES ================= */}
        {activeTab === 'historico' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" />
                  <span>Seu Histórico de Despachos & Comprovantes</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Clique no código do comprovante para abrir a folha A4 com <strong>QR Code real escaneável</strong> e <strong>download de .PDF</strong>.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('registrar')}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Novo Despacho</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                      <th className="py-3.5 px-4">Data / Hora</th>
                      <th className="py-3.5 px-4">Ecoponto de Destino</th>
                      <th className="py-3.5 px-4">Material</th>
                      <th className="py-3.5 px-4">Quantidade</th>
                      <th className="py-3.5 px-4">Impacto CO₂</th>
                      <th className="py-3.5 px-4">Pontos</th>
                      <th className="py-3.5 px-4">Comprovante PDF / QR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {userDispatches.map((d) => (
                      <tr key={d.codigo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">{d.dataHora}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{d.ecopontoNome}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">{d.materialNome}</span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{d.peso} kg</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">-{d.co2Evitado.toFixed(2)} kg</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full">+{d.pontos} PTS</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedCertificate(d)}
                            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-mono font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{d.codigo}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: REGISTRAR DESPACHO ================= */}
        {activeTab === 'registrar' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                <PlusCircle className="w-6 h-6 text-emerald-600" />
                <span>Registrar Despacho de Resíduos Recicláveis</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gere rastreabilidade oficial, ganhe Pontos Verdes (+10 pts/kg) e emita seu Certificado PDF + QR Code.
              </p>
            </div>

            <form onSubmit={handleRegisterDispatch} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Usuário / Entidade Autenticada:</label>
                <input type="text" disabled value={`${currentUser.nome} (${currentUser.perfil})`} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Ecoponto de Destino *</label>
                  <select value={formEcoponto} onChange={(e) => setFormEcoponto(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800">
                    {ecopoints.map((ep) => (
                      <option key={ep.id} value={ep.id}>{ep.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Material Reciclável *</label>
                  <select value={formMaterial} onChange={(e) => setFormMaterial(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800">
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Peso Verificado (kg) *</label>
                  <input type="number" step="0.1" min="0.1" required placeholder="Ex: 8.5" value={formPeso} onChange={(e) => setFormPeso(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Data / Hora do Despacho:</label>
                  <input type="text" value={formData} onChange={(e) => setFormData(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Observações do Despacho (opcional):</label>
                <textarea rows={2} placeholder="Ex: Garrafas limpas e sem tampas; entregue para triagem de cooperativa..." value={formObs} onChange={(e) => setFormObs(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800" />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 block">Pontos Verdes</span>
                  <strong className="text-base font-extrabold text-emerald-900">+{previewPontos} pts</strong>
                </div>
                <div className="border-x border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-700 block">CO₂ Evitado</span>
                  <strong className="text-base font-extrabold text-emerald-900">{previewCo2} kg</strong>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 block">Renda Catadores</span>
                  <strong className="text-base font-extrabold text-emerald-900">R$ {previewRenda}</strong>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-colors">
                Confirmar Despacho & Emitir Certificado PDF + QR Code
              </button>
            </form>
          </div>
        )}

        {/* ================= ABA 5: VALIDAR CERTIFICADO ================= */}
        {activeTab === 'validar' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">Auditoria Pública • SEMA / Rondônia</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Validador Oficial de Certificados Digitais</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Insira o código hash impresso no comprovante (ex: <strong>ECO-RO-2026-001</strong>) ou escaneie o QR Code com a câmera do seu smartphone.
                  </p>
                </div>
              </div>

              <form onSubmit={handleValidateHash} className="flex flex-col sm:flex-row gap-3">
                <input type="text" required placeholder="Digite o código hash (Ex: ECO-RO-2026-001)" value={hashQuery} onChange={(e) => setHashQuery(e.target.value)} className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold uppercase text-slate-900" />
                <button type="submit" className="bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verificar Autenticidade</span>
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Códigos ativos na rede:</span>
                {dispatches.slice(0, 5).map((d) => (
                  <button
                    key={d.codigo}
                    type="button"
                    onClick={() => {
                      setHashQuery(d.codigo);
                      setValidatedCert(d);
                      setHashNotFound(false);
                    }}
                    className="font-mono text-[11px] font-bold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    {d.codigo}
                  </button>
                ))}
              </div>
            </div>

            {hashNotFound && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 text-red-800 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Nenhum registro encontrado para o código "{hashQuery}".</span>
              </div>
            )}

            {validatedCert && (
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DOCUMENTO AUTÊNTICO E AUDITADO</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Registro {validatedCert.codigo}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div><span className="text-slate-400 block">Titular / Entidade:</span><strong className="text-slate-900">{validatedCert.usuarioNome}</strong></div>
                    <div><span className="text-slate-400 block">Data / Hora:</span><strong className="text-slate-900">{validatedCert.dataHora}</strong></div>
                    <div className="sm:col-span-2"><span className="text-slate-400 block">Ecoponto Receptor:</span><strong className="text-slate-900">{validatedCert.ecopontoNome}</strong></div>
                    <div><span className="text-slate-400 block">Resíduo & Peso:</span><strong className="text-emerald-700">{validatedCert.categoria} ({validatedCert.peso} kg)</strong></div>
                    <div><span className="text-slate-400 block">Impacto Ambiental:</span><strong className="text-emerald-700">-{validatedCert.co2Evitado} kg CO₂e (+{validatedCert.pontos} pts)</strong></div>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center text-center space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {validatedQrUrl ? (
                    <img src={validatedQrUrl} alt={`QR Code ${validatedCert.codigo}`} className="w-40 h-40 rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm" />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center bg-white rounded-xl border border-slate-300">
                      <QrCode className="w-20 h-20 text-slate-300 animate-pulse" />
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-slate-600">Aponte a câmera do celular para ler os dados</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 6: PAINEL ADMINISTRATIVO (SEMA) ================= */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">ÁREA RESTRITA</span>
                  <span className="text-slate-300">SEMA • Governo de Rondônia</span>
                </div>
                <h3 className="text-xl font-extrabold">Painel de Controle e Auditoria Geral</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gerenciamento de usuários, telemetria IoT, preços de cooperativas e relatórios.</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl">
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
                <button onClick={handleExportJSON} className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl">
                  <Database className="w-3.5 h-3.5" />
                  <span>Backup JSON</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminUnlocked(false);
                    setActiveTab('inicio');
                    showToast('🔒 Sessão de Administrador bloqueada.');
                  }}
                  className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                  title="Bloquear Painel de Administrador"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Admin</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              {[
                { id: 'usuarios', label: `Gestão de Usuários (${users.length})`, icon: Users },
                { id: 'iot', label: `Ecopontos & Sensores IoT (${ecopoints.length})`, icon: SlidersHorizontal },
                { id: 'precos', label: 'Preços & Fatores CO₂', icon: DollarSign },
                { id: 'auditoria', label: `Auditoria de Cargas (${dispatches.length})`, icon: ShieldCheck },
              ].map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setAdminSubTab(sub.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      adminSubTab === sub.id ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <SubIcon className="w-4 h-4" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-aba 1: Gestão de Usuários */}
            {adminSubTab === 'usuarios' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                        <th className="py-3.5 px-4">Nome / E-mail</th>
                        <th className="py-3.5 px-4">Município / Instituição</th>
                        <th className="py-3.5 px-4">Perfil de Acesso</th>
                        <th className="py-3.5 px-4">Pontos Verdes</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Ações do Gestor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="py-3.5 px-4"><div className="font-bold text-slate-900">{u.nome}</div><div className="text-[11px] text-slate-500">{u.email}</div></td>
                          <td className="py-3.5 px-4 text-slate-600">{u.municipio}</td>
                          <td className="py-3.5 px-4">
                            <select value={u.perfil} onChange={(e) => { const val = e.target.value as any; setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, perfil: val } : item))); showToast(`Perfil alterado para ${val}.`); }} className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700">
                              <option value="CIDADAO">Cidadão</option>
                              <option value="COOPERATIVA">Cooperativa</option>
                              <option value="ESCOLA">Escola</option>
                              <option value="ADMIN">Admin SEMA</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4"><span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full">+{u.pontos} PTS</span></td>
                          <td className="py-3.5 px-4"><span className={`font-bold px-2 py-0.5 rounded text-[11px] ${u.ativo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>{u.ativo ? 'Ativo' : 'Bloqueado'}</span></td>
                          <td className="py-3.5 px-4">
                            <button onClick={() => { setUsers((prev) => prev.map((item) => item.id === u.id ? { ...item, ativo: !item.ativo } : item)); showToast('Status atualizado.'); }} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-[11px] ${u.ativo ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                              {u.ativo ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              <span>{u.ativo ? 'Bloquear' : 'Desbloquear'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-aba 2: Telemetria de Sensores IoT */}
            {adminSubTab === 'iot' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-600">Simule a telemetria dos <strong>sensores ultrassônicos IoT</strong> em tempo real (alerta automático a partir de 90%).</p>
                  <button onClick={() => setShowNewPointModal(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap">+ Cadastrar Novo Ecoponto</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ecopoints.map((pt) => {
                    const isFull = pt.ocupacaoPct >= 90;
                    return (
                      <div key={pt.id} className={`bg-white border rounded-2xl p-5 space-y-4 shadow-sm ${isFull ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700">{pt.tipo}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${isFull ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'}`}>{isFull ? 'ALERTA: LOTADO' : 'ATIVO'}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{pt.nome}</h4>
                        <p className="text-[11px] text-slate-500">{pt.endereco}</p>
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-700">Sensor Ultrassônico IoT:</span>
                            <span className={isFull ? 'text-red-600' : 'text-emerald-700'}>{pt.ocupacaoPct}% ({Math.round((pt.ocupacaoPct / 100) * pt.capacidadeMax)} kg)</span>
                          </div>
                          <input type="range" min="0" max="100" value={pt.ocupacaoPct} onChange={(e) => { const val = Number(e.target.value); setEcopoints((prev) => prev.map((item) => item.id === pt.id ? { ...item, ocupacaoPct: val } : item)); }} className="w-full accent-emerald-600 cursor-pointer" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-aba 3: Preços & Fatores CO2 */}
            {adminSubTab === 'precos' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                      <th className="py-3.5 px-4">Material Reciclável</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Preço Médio Catador (R$/kg)</th>
                      <th className="py-3.5 px-4">Fator CO₂ Evitado (kg CO₂e/kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {materials.map((m) => (
                      <tr key={m.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{m.nome}</td>
                        <td className="py-3.5 px-4"><span className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${m.badgeColor}`}>{m.categoria}</span></td>
                        <td className="py-3.5 px-4"><input type="number" step="0.05" value={m.precoKg} onChange={(e) => { const val = parseFloat(e.target.value) || 0; setMaterials((prev) => prev.map((item) => (item.id === m.id ? { ...item, precoKg: val } : item))); }} className="w-24 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-emerald-700" /></td>
                        <td className="py-3.5 px-4"><input type="number" step="0.01" value={m.fatorCo2} onChange={(e) => { const val = parseFloat(e.target.value) || 0; setMaterials((prev) => prev.map((item) => (item.id === m.id ? { ...item, fatorCo2: val } : item))); }} className="w-24 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-sky-700" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-aba 4: Auditoria de Cargas */}
            {adminSubTab === 'auditoria' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                        <th className="py-3.5 px-4">Código</th>
                        <th className="py-3.5 px-4">Data / Hora</th>
                        <th className="py-3.5 px-4">Cidadão / Entidade</th>
                        <th className="py-3.5 px-4">Ecoponto</th>
                        <th className="py-3.5 px-4">Peso</th>
                        <th className="py-3.5 px-4">Renda Gerada</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {dispatches.map((d) => (
                        <tr key={d.codigo}>
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-700">{d.codigo}</td>
                          <td className="py-3.5 px-4 text-slate-600">{d.dataHora}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{d.usuarioNome}</td>
                          <td className="py-3.5 px-4 text-slate-600">{d.ecopontoNome}</td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">{d.peso} kg</td>
                          <td className="py-3.5 px-4 font-extrabold text-amber-600">R$ {d.rendaGerada.toFixed(2)}</td>
                          <td className="py-3.5 px-4"><span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full">VALIDADO NO ECOPONTO</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 7: GUIA & CAMPANHAS ================= */}
        {activeTab === 'guia' && (
          <div className="space-y-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Recycle className="w-6 h-6 text-emerald-600" />
                  <span>Guia Oficial de Orientação de Descarte (CONAMA)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Padrão técnico CONAMA para separação, higienização e preservação de recicláveis em Rondônia.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {materials.map((m) => (
                  <div key={m.id} className={`bg-white border border-slate-200 border-l-4 ${m.borderColor} rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4`}>
                    <div className="space-y-3">
                      <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded ${m.badgeColor}`}>COLETA CONAMA • {m.corConama}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{m.nome}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{m.descricao}</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                        <p className="text-[11px] font-bold text-slate-800">📋 Como preparar:</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{m.preparo}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700">🌱 Evita aprox. <strong>{m.fatorCo2} kg</strong> CO₂/kg</span>
                      <button onClick={() => { setFormMaterial(m.id); setActiveTab('registrar'); }} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl">Despachar Este</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Campanhas Comunitárias e Escolares em Rondônia</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {CAMPAIGNS.map((c) => {
                  const pct = Math.round((c.atual / c.meta) * 100);
                  return (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700">{c.org}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{c.status}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug">{c.titulo}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.descricao}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>Meta de Arrecadação:</span>
                          <span className="text-emerald-700">{c.atual} de {c.meta} kg ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 8: FICHA CENTELHA 3 ================= */}
        {activeTab === 'centelha' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full">EDITAL Nº 03/2026 • CENTELHA 3 RONDÔNIA</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">EcoPonto Inteligente — Fase 1 (Ideias Inovadoras)</h3>
                </div>
                <a href="https://youtube.com/shorts/jQ7sv5xjBv8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm">
                  <span>Assistir Vídeo Pitch Oficial</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h4 className="font-extrabold text-emerald-800 text-sm">1. Identificação do Projeto</h4>
                  <p><strong>Estudante / Autora:</strong> Ana Beatriz de Lima Rosa</p>
                  <p><strong>Turma e Curso:</strong> 3°B Técnico em Informática</p>
                  <p><strong>Instituição:</strong> EEEFM Carmela Dutra — Porto Velho / RO</p>
                  <p><strong>Área do Conhecimento:</strong> Desenvolvimento de Software, IoT e Ciência de Dados</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h4 className="font-extrabold text-emerald-800 text-sm">2. Problema e Evidências em Rondônia</h4>
                  <p className="leading-relaxed text-slate-600">
                    Em Rondônia, <strong>57,7% dos municípios do estado não possuíam coleta seletiva</strong> segundo dados oficiais divulgados pelo Governo de Rondônia / SINIR+ (2025). Porto Velho gera cerca de 450 a 500 toneladas diárias de resíduos sólidos urbanos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CERTIFICADO FOLHA A4 + PDF REAL (jsPDF) + QR CODE */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-100 border border-slate-300 rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold">Visualizador Oficial PDF • {selectedCertificate.codigo}.pdf</h4>
                  <span className="text-[11px] text-slate-400">Formato A4 Institucional pronto para impressão ou download direto</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleDownloadRealPDF(selectedCertificate)} disabled={isGeneratingPdf} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow">
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Arquivo .PDF'}</span>
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow">
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Folha A4</span>
                </button>
                <button onClick={() => setSelectedCertificate(null)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-slate-200/80">
              <div id="printable-a4-certificate" className="bg-white w-full max-w-[720px] border-4 border-double border-emerald-800 rounded-xl p-6 sm:p-10 shadow-xl space-y-6 text-slate-800">
                <div className="bg-gradient-to-r from-[#0f4c2e] to-[#166534] text-white rounded-xl p-5 text-center space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">
                    Governo do Estado de Rondônia • SEMA / Programa Centelha 3 (Edital 03/2026)
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">CERTIFICADO DIGITAL DE DESTINAÇÃO ECOLÓGICA</h2>
                  <p className="text-xs text-emerald-100">Plataforma Oficial EcoPonto Inteligente — Rastreabilidade de Resíduos Recicláveis</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-emerald-900">
                    CÓDIGO HASH: <strong className="font-mono text-sky-800">{selectedCertificate.codigo}</strong>
                  </span>
                  <span className="bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">✓ VALIDADO NO ECOPONTO</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                  Certificamos, para os devidos fins de comprovação socioambiental, educação ecológica e auditoria de logística reversa no Estado de Rondônia, que o(a) titular abaixo identificado(a) efetuou a destinação ambientalmente adequada de resíduos sólidos recicláveis em ponto credenciado da rede <strong>EcoPonto Inteligente</strong>:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Titular / Entidade:</span><strong className="sm:col-span-2 text-slate-900 text-sm">{selectedCertificate.usuarioNome}</strong></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Data e Hora:</span><strong className="sm:col-span-2 text-slate-900">{selectedCertificate.dataHora}</strong></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Ecoponto Receptor:</span><strong className="sm:col-span-2 text-slate-900">{selectedCertificate.ecopontoNome}</strong></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Material Triado:</span><strong className="sm:col-span-2 text-slate-900">{selectedCertificate.materialNome}</strong></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 uppercase">Peso Verificado:</span><strong className="sm:col-span-2 text-emerald-700 font-black text-sm">{selectedCertificate.peso} kg</strong></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3"><span className="font-bold text-slate-500 uppercase">Impacto Ambiental:</span><strong className="sm:col-span-2 text-emerald-700 font-extrabold">-{selectedCertificate.co2Evitado} kg CO₂e evitados • +{selectedCertificate.pontos} Pontos Verdes</strong></div>
                </div>

                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-slate-300 shrink-0 shadow-sm">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt={`QR Code ${selectedCertificate.codigo}`} className="w-28 h-28 object-contain" />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center bg-slate-100 rounded">
                        <QrCode className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 text-center sm:text-left">
                    <p className="font-extrabold text-emerald-900 flex items-center justify-center sm:justify-start gap-1.5">
                      <ScanLine className="w-4 h-4 text-emerald-600" />
                      <span>Validação Digital por QR Code Real (ISO/IEC 18004)</span>
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      Aponte a câmera do seu celular para o QR Code ao lado para ler instantaneamente todos os dados auditáveis deste despacho ou consulte o hash na aba <strong>Validar Certificado</strong>.
                    </p>
                    <p className="font-mono text-[11px] font-bold text-sky-700">
                      Hash: {selectedCertificate.codigo} • Renda Gerada Cooperativa: R$ {Number(selectedCertificate.rendaGerada || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 text-center text-[11px]">
                  <div>
                    <div className="border-t border-slate-400 pt-1.5 font-extrabold text-slate-800">Ana Beatriz de Lima Rosa</div>
                    <div className="text-slate-500 text-[10px]">Idealizadora • 3°B Informática (EEEFM Carmela Dutra)</div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-1.5 font-extrabold text-slate-800">Rede EcoPonto Inteligente • SEMA/RO</div>
                    <div className="text-slate-500 text-[10px]">Auditoria Digital e Telemetria IoT • Porto Velho - RO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OFICIAL DE LOGIN / CADASTRO / RECUPERAÇÃO DE SENHA */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-[620px] my-auto">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-6 top-6 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
              title="Fechar tela de login"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthScreen
              initialMode="login"
              onLoginSuccess={(u) => {
                const found = users.find((item) => item.id === u.id);
                if (!found) {
                  const newUser: UserData = {
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                    municipio: u.municipio || u.instituicaoOuBairro || 'Porto Velho - RO',
                    perfil: (u.tipo.toUpperCase() as any),
                    pontos: u.pontosAcumulados || 50,
                    ativo: u.status === 'Ativo',
                  };
                  setUsers((prev) => [...prev, newUser]);
                }
                setCurrentUserId(u.id);
                setShowAuthModal(false);
                setActiveTab('mapa');
                showToast(`👋 Bem-vindo(a), ${u.nome}! Sessão iniciada.`);
              }}
              onCancel={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* MODAL NOVO ECOPONTO */}
      {showNewPointModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newPointName || !newPointAddress) return;
              const newEp: EcopointData = {
                id: `ep${Date.now()}`,
                nome: newPointName,
                tipo: 'ECOPONTO MUNICIPAL',
                endereco: newPointAddress,
                lat: '-8.7610',
                lng: '-63.8950',
                capacidadeMax: Number(newPointCap) || 2500,
                ocupacaoPct: 15,
                materiais: ['Plásticos', 'Papel', 'Vidros', 'Metais'],
                mapX: 55,
                mapY: 58,
              };
              setEcopoints([...ecopoints, newEp]);
              setNewPointName('');
              setNewPointAddress('');
              setShowNewPointModal(false);
              showToast('Novo ecoponto cadastrado no mapa!');
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h4 className="text-lg font-extrabold text-slate-900">Cadastrar Novo Ecoponto</h4>
            <input required placeholder="Nome do Ecoponto ou Cooperativa" value={newPointName} onChange={(e) => setNewPointName(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs" />
            <input required placeholder="Endereço completo em Rondônia" value={newPointAddress} onChange={(e) => setNewPointAddress(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs" />
            <input type="number" placeholder="Capacidade Máxima (kg)" value={newPointCap} onChange={(e) => setNewPointCap(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs" />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl">Salvar Ecoponto</button>
              <button type="button" onClick={() => setShowNewPointModal(false)} className="px-4 bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE SEGURANÇA DO PAINEL ADMIN (Senha: admin) */}
      <AdminSecurityModal
        isOpen={showAdminSecurityModal}
        onClose={() => setShowAdminSecurityModal(false)}
        onUnlock={() => {
          setIsAdminUnlocked(true);
          setShowAdminSecurityModal(false);
          setActiveTab('admin');
          showToast('🔓 Acesso de Administrador (SEMA) autenticado com sucesso!');
        }}
        activeUserRole={currentUser.perfil.toLowerCase()}
      />

      {/* FOOTER OFICIAL */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-5 px-4 sm:px-6 text-xs mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-white">EcoPonto Inteligente — Simulado Centelha 3 Rondônia (Edital 03/2026)</strong>
            <span className="block text-slate-400 mt-0.5">Estudante: Ana Beatriz de Lima Rosa | Turma: 3°B Informática — EEEFM Carmela Dutra</span>
          </div>
          <div className="font-mono text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            Porto Velho — Rondônia • Amazônia Sustentável
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
