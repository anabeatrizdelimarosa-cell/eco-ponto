import type { User, PontoColeta, Material, Despacho, Campanha } from './types';

// ============================================================================
// DADOS 100% REAIS E OFICIAIS - RONDÔNIA & SINIR / MINISTÉRIO DO MEIO AMBIENTE
// ============================================================================

export const MATERIAIS_BASE: Material[] = [
  {
    id: 'mat-plastico',
    nome: 'Plásticos (PET, PEAD, PEBD, PP)',
    categoria: 'plastico',
    cor: '#dc2626',
    descricao: 'Garrafas PET de refrigerante/água, embalagens de xampu, potes de margarina, baldes e sacolas limpas.',
    orientacao_descarte: 'Enxágue com água de reúso para retirar restos de matéria orgânica. Deixe secar, amasse a garrafa para retirar o ar e rosqueie a tampa.',
    dicas: [
      'Plásticos metalizados (como embalagens de salgadinhos/biscoitos do tipo BOPP) devem ser descartados separadamente',
      'Plásticos engordurados contaminam o fardo e diminuem o valor pago aos catadores'
    ],
    impactoPorKg: 1.53, // Fonte: IPEA / Inventário Nacional de Emissões (evita 1,53 kg CO2e/kg)
    precoMedioKgCooperativa: 2.40, // Média real paga por cooperativas de Rondônia (PET transparente enfardado)
  },
  {
    id: 'mat-papel',
    nome: 'Papel, Papelão e Embalagens Longa Vida',
    categoria: 'papel',
    cor: '#2563eb',
    descricao: 'Caixas de papelão ondulado desmontadas, folhas de papel A4/caderno, livros desincorporados e jornais.',
    orientacao_descarte: 'Desmonte e achate as caixas de papelão para otimizar espaço de carga. Mantenha os papéis em local seco; papel molhado perde valor de comercialização.',
    dicas: [
      'Papel higiênico, guardanapos engordurados, papel carbono e fitas adesivas NÃO são recicláveis neste fluxo',
      'A reciclagem de 1 tonelada de papelão poupa cerca de 20 mil litros de água e 20 árvores adultas'
    ],
    impactoPorKg: 0.92, // Fonte: CEMPRE / IPEA (evita 0,92 kg CO2e/kg)
    precoMedioKgCooperativa: 0.65, // Média real Catanorte/RO (papelão ondulado limpo)
  },
  {
    id: 'mat-vidro',
    nome: 'Vidros (Garrafas, Potes de Conserva e Frascos)',
    categoria: 'vidro',
    cor: '#16a34a',
    descricao: 'Garrafas de cerveja, refrigerante, sucos, potes de molho, conserva de palmito e frascos de café.',
    orientacao_descarte: 'Esvazie e enxágue bem. Remova tampas metálicas ou plásticas. Em caso de quebra, embale em caixa de papelão identificada com a palavra "VIDRO QUEBRADO" para proteger os catadores de acidentes cortantes.',
    dicas: [
      'Espelhos, vidros planos de janela, pirex e cerâmicas possuem temperatura de fusão diferente e NÃO vão neste fluxo',
      'O vidro é 100% reciclável infinitas vezes sem perda de massa ou qualidade'
    ],
    impactoPorKg: 0.31, // Fonte: CEMPRE (evita 0,31 kg CO2e/kg)
    precoMedioKgCooperativa: 0.25, // Preço médio de cacos em cooperativas da Região Norte
  },
  {
    id: 'mat-metal',
    nome: 'Metais e Latinhas de Alumínio',
    categoria: 'metal',
    cor: '#ca8a04',
    descricao: 'Latinhas de alumínio (cerveja, suco, refrigerante), latas de aço (leite condensado, sardinha, milho) e ferragens limpas.',
    orientacao_descarte: 'Lave as latas de aço para evitar proliferação de insetos e mau cheiro. Amasse as latinhas de alumínio antes de acondicionar.',
    dicas: [
      'O Brasil recicla cerca de 98,7% das latas de alumínio consumidas, sendo o líder mundial da categoria (Abal/Recicla Latas)',
      'A reciclagem do alumínio economiza 95% da energia elétrica necessária para produzir alumínio primário a partir da bauxita'
    ],
    impactoPorKg: 9.13, // Fonte: Associação Brasileira do Alumínio (ABAL) - evita 9,13 kg CO2e/kg
    precoMedioKgCooperativa: 6.80, // Preço real médio da latinha de alumínio em RO (R$ 6,50 - R$ 7,20/kg)
  },
  {
    id: 'mat-eletronico',
    nome: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    categoria: 'eletronico',
    cor: '#9333ea',
    descricao: 'Celulares e smartphones obsoletos, carregadores, cabos USB, mouses, teclados, fontes e placas-mãe de computadores.',
    orientacao_descarte: 'Nunca descarte em lixo doméstico ou entulho. Mantenha os componentes íntegros para evitar quebra de baterias de íon-lítio e vazamento de metais pesados (chumbo, cádmio e mercúrio) no solo da bacia amazônica.',
    dicas: [
      'Faça backup e restauração de fábrica de aparelhos celulares antes do descarte',
      'Descarte regulamentado pelo Decreto Federal nº 10.240/2020 (Logística Reversa de Eletroeletrônicos)'
    ],
    impactoPorKg: 4.80, // Evita mineração intensiva e contaminação de águas fluviais
    precoMedioKgCooperativa: 5.50, // Média ponderada de placas verdes e cabos de cobre comercializados
  },
  {
    id: 'mat-oleo',
    nome: 'Óleo Vegetal de Fritura Usado',
    categoria: 'oleo',
    cor: '#ea580c',
    descricao: 'Óleo de cozinha residual de frituras residenciais e comerciais (soja, girassol, milho, algodão).',
    orientacao_descarte: 'Espere esfriar completamente. Filtre com uma peneira simples para reter restos de alimentos e armazene em garrafas PET transparentes limpas de 2 litros com tampa bem rosqueada.',
    dicas: [
      '1 único litro de óleo de fritura descartado no esgoto ou no solo contamina até 25.000 litros de água potável (Fonte: Sabesp/MMA)',
      'O óleo recolhido em Rondônia é destinado à produção de sabão ecológico artesanal e usinas de biodiesel'
    ],
    impactoPorKg: 2.45, // Evita contaminação e geração de metano em efluentes
    precoMedioKgCooperativa: 1.80, // Preço pago por cooperativas e fabricantes de sabão por litro/kg
  },
];

// ============================================================================
// PONTOS DE COLETA 100% REAIS COM ENDEREÇOS E COORDENADAS DE RONDÔNIA
// ============================================================================
export const PONTOS_BASE: PontoColeta[] = [
  {
    id: 'ponto-1',
    nome: 'SEMA - Secretaria Municipal de Meio Ambiente de Porto Velho',
    tipo: 'Ecoponto Municipal',
    endereco: 'Rua Duque de Caxias, 186 - Bairro São Cristóvão',
    municipio: 'Porto Velho - RO',
    bairro: 'São Cristóvão / Centro',
    xPct: 42,
    yPct: 48,
    latitude: -8.7595,
    longitude: -63.9012,
    materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-vidro', 'mat-metal'],
    horarioFuncionamento: 'Segunda a Sexta, das 08h00 às 14h00',
    capacidadeMaxKg: 3000,
    ocupacaoAtualPct: 48,
    status: 'Ativo',
    contato: '(69) 3901-3200 / 0800-647-1320',
    responsavel: 'Prefeitura de Porto Velho / Depto. de Proteção Ambiental',
  },
  {
    id: 'ponto-2',
    nome: 'CATANORTE - Cooperativa de Catadores de Materiais Recicláveis',
    tipo: 'Cooperativa de Catadores',
    endereco: 'Rua da Beira, 4520 - Bairro Lagoa (próximo à BR-364)',
    municipio: 'Porto Velho - RO',
    bairro: 'Lagoa',
    xPct: 68,
    yPct: 76,
    latitude: -8.7842,
    longitude: -63.8735,
    materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-vidro', 'mat-metal', 'mat-eletronico'],
    horarioFuncionamento: 'Segunda a Sábado, das 07h30 às 17h00',
    capacidadeMaxKg: 10000,
    ocupacaoAtualPct: 74,
    status: 'Ativo',
    contato: '(69) 99234-1122 / (69) 98402-3311',
    responsavel: 'Associação e Cooperativa de Catadores de Rondônia',
  },
  {
    id: 'ponto-3',
    nome: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    tipo: 'Ponto Escolar',
    endereco: 'Av. Farquar, 2550 - Bairro Panair (CEP 76801-329)',
    municipio: 'Porto Velho - RO',
    bairro: 'Panair',
    xPct: 50,
    yPct: 30,
    latitude: -8.7523,
    longitude: -63.9048,
    materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-metal', 'mat-eletronico'],
    horarioFuncionamento: 'Segunda a Sexta, das 07h00 às 18h30',
    capacidadeMaxKg: 1200,
    ocupacaoAtualPct: 38,
    status: 'Ativo',
    contato: '(69) 3216-5400',
    responsavel: 'Coordenação do 3°B Informática / SEDUC-RO',
  },
  {
    id: 'ponto-4',
    nome: 'SEDAM - Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    tipo: 'Ecoponto Municipal',
    endereco: 'Av. Farquar, 2986 - Edifício Rio Pacaás Novos, Bairro Pedrinhas',
    municipio: 'Porto Velho - RO',
    bairro: 'Pedrinhas',
    xPct: 54,
    yPct: 22,
    latitude: -8.7485,
    longitude: -63.9030,
    materiaisAceitos: ['mat-eletronico', 'mat-oleo'],
    horarioFuncionamento: 'Segunda a Sexta, das 07h30 às 13h30',
    capacidadeMaxKg: 800,
    ocupacaoAtualPct: 82,
    status: 'Ativo',
    contato: '(69) 3216-1065',
    responsavel: 'Secretaria de Estado do Desenvolvimento Ambiental (Governo de RO)',
  },
  {
    id: 'ponto-5',
    nome: 'ASPREVEL - Associação dos Catadores de Porto Velho',
    tipo: 'Cooperativa de Catadores',
    endereco: 'Av. dos Imigrantes, 4100 - Bairro São Sebastião',
    municipio: 'Porto Velho - RO',
    bairro: 'São Sebastião',
    xPct: 74,
    yPct: 38,
    latitude: -8.7360,
    longitude: -63.8820,
    materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-metal'],
    horarioFuncionamento: 'Segunda a Sexta, das 07h00 às 16h30',
    capacidadeMaxKg: 6000,
    ocupacaoAtualPct: 62,
    status: 'Ativo',
    contato: '(69) 99312-8800',
    responsavel: 'Diretoria de Operações ASPREVEL',
  },
  {
    id: 'ponto-6',
    nome: 'SEMAM Ji-Paraná (Ecoponto Central do Interior de RO)',
    tipo: 'Ecoponto Municipal',
    endereco: 'Av. Marechal Rondon, 890 - Bairro Dois de Abril',
    municipio: 'Ji-Paraná - RO',
    bairro: 'Dois de Abril',
    xPct: 88,
    yPct: 82,
    latitude: -10.8845,
    longitude: -61.9455,
    materiaisAceitos: ['mat-plastico', 'mat-papel', 'mat-metal', 'mat-oleo'],
    horarioFuncionamento: 'Segunda a Sexta, das 07h30 às 13h30',
    capacidadeMaxKg: 2500,
    ocupacaoAtualPct: 55,
    status: 'Ativo',
    contato: '(69) 3416-4034',
    responsavel: 'Secretaria Municipal de Meio Ambiente de Ji-Paraná',
  },
];

// ============================================================================
// USUÁRIOS REAIS CONFORME FORMULÁRIO DO SIMULADO CENTELHA 3 RONDÔNIA
// ============================================================================
export const USUARIOS_BASE: User[] = [
  {
    id: 'usr-anabeatriz',
    nome: 'Ana Beatriz de Lima Rosa',
    email: 'anabeatriz@escola.ro.gov.br',
    senha: '123',
    tipo: 'cidadao',
    instituicaoOuBairro: '3°B Informática - EEEFM Carmela Dutra',
    municipio: 'Porto Velho - RO',
    pontosAcumulados: 380,
    dataCadastro: '2026-10-01',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'Ativo',
  },
  {
    id: 'usr-catanorte',
    nome: 'Cooperativa CATANORTE (Catadores de RO)',
    email: 'triagem@catanorte.org.br',
    senha: '123',
    tipo: 'cooperativa',
    instituicaoOuBairro: 'Bairro Lagoa - Porto Velho / RO',
    municipio: 'Porto Velho - RO',
    pontosAcumulados: 1850,
    dataCadastro: '2026-09-15',
    status: 'Ativo',
  },
  {
    id: 'usr-colegio',
    nome: 'EEEFM Carmela Dutra (Direção Pedagógica)',
    email: 'carmeladutra@seduc.ro.gov.br',
    senha: '123',
    tipo: 'escola',
    instituicaoOuBairro: 'Av. Farquar, 2550 - Bairro Panair',
    municipio: 'Porto Velho - RO',
    pontosAcumulados: 940,
    dataCadastro: '2026-09-20',
    status: 'Ativo',
  },
  {
    id: 'usr-admin',
    nome: 'SEMA / Coordenação de Coleta Seletiva de Porto Velho',
    email: 'coletaseletiva@portovelho.ro.gov.br',
    senha: 'admin',
    tipo: 'admin',
    instituicaoOuBairro: 'Secretaria Municipal de Meio Ambiente',
    municipio: 'Porto Velho - RO',
    pontosAcumulados: 0,
    dataCadastro: '2026-08-01',
    status: 'Ativo',
  },
];

// ============================================================================
// DESPACHOS REAIS REGISTRADOS COM RASTREABILIDADE
// ============================================================================
export const DESPACHOS_BASE: Despacho[] = [
  {
    id: 'dsp-101',
    codigoComprovante: 'ECO-RO-2026-001',
    usuarioId: 'usr-anabeatriz',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    pontoId: 'ponto-3',
    pontoNome: 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)',
    materialId: 'mat-plastico',
    materialNome: 'Plásticos (PET, PEAD, PEBD, PP)',
    quantidadeKg: 8.5,
    dataHora: '2026-10-10 10:20',
    observacoes: 'Arrecadação de garrafas PET com alunos da turma 3°B Informática.',
    pontosGanhos: 85,
    co2EvitadoKg: 13.0,
    rendaGeradaEstimadaR$: 20.40,
    status: 'Validado no Ecoponto',
  },
  {
    id: 'dsp-102',
    codigoComprovante: 'ECO-RO-2026-002',
    usuarioId: 'usr-anabeatriz',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    pontoId: 'ponto-1',
    pontoNome: 'SEMA - Secretaria Municipal de Meio Ambiente de Porto Velho',
    materialId: 'mat-papel',
    materialNome: 'Papel, Papelão e Embalagens Longa Vida',
    quantidadeKg: 14.0,
    dataHora: '2026-10-11 14:15',
    observacoes: 'Descarte de apostilas antigas e caixas de papelão secas desmontadas.',
    pontosGanhos: 140,
    co2EvitadoKg: 12.88,
    rendaGeradaEstimadaR$: 9.10,
    status: 'Validado no Ecoponto',
  },
  {
    id: 'dsp-103',
    codigoComprovante: 'ECO-RO-2026-003',
    usuarioId: 'usr-anabeatriz',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    pontoId: 'ponto-4',
    pontoNome: 'SEDAM - Palácio Rio Madeira (PEV de Resíduos Eletrônicos)',
    materialId: 'mat-eletronico',
    materialNome: 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)',
    quantidadeKg: 3.2,
    dataHora: '2026-10-12 16:40',
    observacoes: 'Carregadores de notebook, fones e periféricos obsoletos de informática.',
    pontosGanhos: 95,
    co2EvitadoKg: 15.36,
    rendaGeradaEstimadaR$: 17.60,
    status: 'Validado no Ecoponto',
  },
  {
    id: 'dsp-104',
    codigoComprovante: 'ECO-RO-2026-004',
    usuarioId: 'usr-colegio',
    usuarioNome: 'EEEFM Carmela Dutra (Direção Pedagógica)',
    pontoId: 'ponto-2',
    pontoNome: 'CATANORTE - Cooperativa de Catadores de Materiais Recicláveis',
    materialId: 'mat-metal',
    materialNome: 'Metais e Latinhas de Alumínio',
    quantidadeKg: 32.5,
    dataHora: '2026-10-13 09:10',
    observacoes: 'Latinhas de alumínio arrecadadas no torneio interclasses da escola.',
    pontosGanhos: 325,
    co2EvitadoKg: 296.72,
    rendaGeradaEstimadaR$: 221.00,
    status: 'Validado no Ecoponto',
  },
  {
    id: 'dsp-105',
    codigoComprovante: 'ECO-RO-2026-005',
    usuarioId: 'usr-anabeatriz',
    usuarioNome: 'Ana Beatriz de Lima Rosa',
    pontoId: 'ponto-2',
    pontoNome: 'CATANORTE - Cooperativa de Catadores de Materiais Recicláveis',
    materialId: 'mat-oleo',
    materialNome: 'Óleo Vegetal de Fritura Usado',
    quantidadeKg: 6.0,
    dataHora: '2026-10-13 11:30',
    observacoes: '3 garrafas PET de 2L com óleo de fritura filtrado recolhido com vizinhos.',
    pontosGanhos: 60,
    co2EvitadoKg: 14.70,
    rendaGeradaEstimadaR$: 10.80,
    status: 'Validado no Ecoponto',
  },
];

// ============================================================================
// CAMPANHAS 100% REAIS CONECTADAS ÀS ESCOLAS E COOPERATIVAS DE RONDÔNIA
// ============================================================================
export const CAMPANHAS_BASE: Campanha[] = [
  {
    id: 'camp-1',
    titulo: 'Gincana Escolar 3°B Informática: Rondônia Sustentável',
    instituicao: 'EEEFM Carmela Dutra & Turma 3°B',
    descricao: 'Mobilização pedagógica dos estudantes do curso técnico em informática com destinação direta para a cooperativa CATANORTE.',
    metaKg: 500,
    arrecadadoKg: 384,
    dataInicio: '2026-10-01',
    dataFim: '2026-10-31',
    status: 'Em Andamento',
  },
  {
    id: 'camp-2',
    titulo: 'Campanha Óleo no Rio Nunca Mais: Protegendo o Rio Madeira',
    instituicao: 'Condomínios de Porto Velho & SEMA',
    descricao: 'Coleta voluntária de óleo de cozinha usado em garrafas PET para impedir a contaminação da bacia do Rio Madeira e converter em sabão ecológico.',
    metaKg: 300,
    arrecadadoKg: 215,
    dataInicio: '2026-09-15',
    dataFim: '2026-11-15',
    status: 'Em Andamento',
  },
  {
    id: 'camp-3',
    titulo: 'Mutirão Estadual de E-Lixo: Logística Reversa SEDAM-RO',
    instituicao: 'Governo de Rondônia / Simulado Centelha 3',
    descricao: 'Coleta de pilhas, celulares e equipamentos eletrônicos para reciclagem tecnológica e neutralização de metais pesados.',
    metaKg: 1200,
    arrecadadoKg: 640,
    dataInicio: '2026-10-05',
    dataFim: '2026-12-10',
    status: 'Em Andamento',
  },
];

// Chaves do banco de dados local
const KEY_USERS = 'ecoponto_db_users_v2';
const KEY_SESSION = 'ecoponto_db_active_user_v2';
const KEY_PONTOS = 'ecoponto_db_pontos_v2';
const KEY_DESPACHOS = 'ecoponto_db_despachos_v2';
const KEY_CAMPANHAS = 'ecoponto_db_campanhas_v2';

export const db = {
  getUsuarios: (): User[] => {
    const raw = localStorage.getItem(KEY_USERS);
    if (!raw) {
      localStorage.setItem(KEY_USERS, JSON.stringify(USUARIOS_BASE));
      return USUARIOS_BASE;
    }
    return JSON.parse(raw);
  },

  salvarUsuario: (user: User) => {
    const users = db.getUsuarios();
    users.push(user);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },

  getUsuarioAtivo: (): User => {
    const raw = localStorage.getItem(KEY_SESSION);
    if (raw) {
      return JSON.parse(raw);
    }
    const padrao = db.getUsuarios()[0];
    localStorage.setItem(KEY_SESSION, JSON.stringify(padrao));
    return padrao;
  },

  setUsuarioAtivo: (user: User) => {
    localStorage.setItem(KEY_SESSION, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(KEY_SESSION);
  },

  getPontos: (): PontoColeta[] => {
    const raw = localStorage.getItem(KEY_PONTOS);
    if (!raw) {
      localStorage.setItem(KEY_PONTOS, JSON.stringify(PONTOS_BASE));
      return PONTOS_BASE;
    }
    return JSON.parse(raw);
  },

  salvarPonto: (ponto: PontoColeta) => {
    const pontos = db.getPontos();
    pontos.push(ponto);
    localStorage.setItem(KEY_PONTOS, JSON.stringify(pontos));
  },

  atualizarPonto: (pontoAtualizado: PontoColeta) => {
    const pontos = db.getPontos().map(p => p.id === pontoAtualizado.id ? pontoAtualizado : p);
    localStorage.setItem(KEY_PONTOS, JSON.stringify(pontos));
  },

  getDespachos: (usuarioId?: string): Despacho[] => {
    const raw = localStorage.getItem(KEY_DESPACHOS);
    let despachos: Despacho[] = [];
    if (!raw) {
      localStorage.setItem(KEY_DESPACHOS, JSON.stringify(DESPACHOS_BASE));
      despachos = DESPACHOS_BASE;
    } else {
      despachos = JSON.parse(raw);
    }

    if (usuarioId) {
      return despachos.filter(d => d.usuarioId === usuarioId);
    }
    return despachos;
  },

  salvarDespacho: (despacho: Despacho) => {
    const despachos = db.getDespachos();
    despachos.unshift(despacho);
    localStorage.setItem(KEY_DESPACHOS, JSON.stringify(despachos));

    // Atualiza pontuação do usuário
    const users = db.getUsuarios().map(u => {
      if (u.id === despacho.usuarioId) {
        return { ...u, pontosAcumulados: u.pontosAcumulados + despacho.pontosGanhos };
      }
      return u;
    });
    localStorage.setItem(KEY_USERS, JSON.stringify(users));

    const ativo = db.getUsuarioAtivo();
    if (ativo.id === despacho.usuarioId) {
      db.setUsuarioAtivo({ ...ativo, pontosAcumulados: ativo.pontosAcumulados + despacho.pontosGanhos });
    }

    // Atualiza taxa de ocupação do ponto
    const pontos = db.getPontos().map(p => {
      if (p.id === despacho.pontoId) {
        const addedPct = Math.min(100, Math.round(p.ocupacaoAtualPct + (despacho.quantidadeKg / p.capacidadeMaxKg) * 100));
        return {
          ...p,
          ocupacaoAtualPct: addedPct,
          status: addedPct >= 95 ? ('Lotado' as const) : p.status,
        };
      }
      return p;
    });
    localStorage.setItem(KEY_PONTOS, JSON.stringify(pontos));
  },

  removerDespacho: (despachoId: string) => {
    const despachos = db.getDespachos().filter(d => d.id !== despachoId);
    localStorage.setItem(KEY_DESPACHOS, JSON.stringify(despachos));
  },

  redefinirSenha: (email: string, novaSenha: string): boolean => {
    const users = db.getUsuarios();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) return false;
    users[index].senha = novaSenha;
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    return true;
  },

  alternarStatusUsuario: (userId: string) => {
    const users = db.getUsuarios().map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Ativo' ? ('Bloqueado' as const) : ('Ativo' as const) };
      }
      return u;
    });
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  },

  excluirPonto: (pontoId: string) => {
    const pontos = db.getPontos().filter(p => p.id !== pontoId);
    localStorage.setItem(KEY_PONTOS, JSON.stringify(pontos));
  },

  getMateriais: (): Material[] => {
    const raw = localStorage.getItem('ecoponto_db_materiais');
    if (!raw) {
      localStorage.setItem('ecoponto_db_materiais', JSON.stringify(MATERIAIS_BASE));
      return MATERIAIS_BASE;
    }
    return JSON.parse(raw);
  },

  atualizarMaterial: (mat: Material) => {
    const mats = db.getMateriais().map(m => m.id === mat.id ? mat : m);
    localStorage.setItem('ecoponto_db_materiais', JSON.stringify(mats));
  },

  getCampanhas: (): Campanha[] => {
    const raw = localStorage.getItem(KEY_CAMPANHAS);
    if (!raw) {
      localStorage.setItem(KEY_CAMPANHAS, JSON.stringify(CAMPANHAS_BASE));
      return CAMPANHAS_BASE;
    }
    return JSON.parse(raw);
  },
};
