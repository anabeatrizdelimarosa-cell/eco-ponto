export type UserRole = 'cidadao' | 'cooperativa' | 'escola' | 'admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: UserRole;
  cpfOrCnpj?: string;
  telefone?: string;
  instituicaoOuBairro: string;
  municipio: string;
  pontosAcumulados: number;
  dataCadastro: string;
  avatarUrl?: string;
  status: 'Ativo' | 'Bloqueado';
}

export interface Material {
  id: string;
  nome: string;
  categoria: 'plastico' | 'papel' | 'vidro' | 'metal' | 'eletronico' | 'oleo';
  cor: string;
  descricao: string;
  orientacao_descarte: string;
  dicas: string[];
  impactoPorKg: number; // kg CO2 evitados por kg reciclado
  precoMedioKgCooperativa: number; // R$ gerado para catadores
}

export interface PontoColeta {
  id: string;
  nome: string;
  tipo: 'Ecoponto Municipal' | 'Cooperativa de Catadores' | 'Ponto Escolar' | 'Comércio Parceiro';
  endereco: string;
  municipio: string;
  bairro: string;
  xPct: number; // Posicionamento percentual no mapa (0-100)
  yPct: number;
  latitude: number;
  longitude: number;
  materiaisAceitos: string[]; // ids dos materiais
  horarioFuncionamento: string;
  capacidadeMaxKg: number;
  ocupacaoAtualPct: number; // % simulando sensor IoT
  status: 'Ativo' | 'Lotado' | 'Em Manutenção';
  contato: string;
  responsavel: string;
}

export interface Despacho {
  id: string;
  codigoComprovante: string;
  usuarioId: string;
  usuarioNome: string;
  pontoId: string;
  pontoNome: string;
  materialId: string;
  materialNome: string;
  quantidadeKg: number;
  dataHora: string;
  observacoes?: string;
  pontosGanhos: number;
  co2EvitadoKg: number;
  rendaGeradaEstimadaR$: number;
  status: 'Validado no Ecoponto' | 'Aguardando Coleta';
}

export interface Campanha {
  id: string;
  titulo: string;
  instituicao: string;
  descricao: string;
  metaKg: number;
  arrecadadoKg: number;
  dataInicio: string;
  dataFim: string;
  status: 'Em Andamento' | 'Concluída' | 'Prevista';
}
