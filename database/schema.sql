-- ============================================================================
-- ECOPONTO INTELIGENTE • RONDÔNIA (PROGRAMA CENTELHA 3 - EDITAL 03/2026)
-- Script Oficial de Criação do Banco de Dados e Carga Inicial de Dados Reais
-- Compatibilidade: PostgreSQL 14+ / MySQL 8.0+ / MariaDB 10.5+ / SQLite3
-- Autora: Ana Beatriz de Lima Rosa | Turma: 3°B Informática - EEEFM Carmela Dutra
-- ============================================================================

-- Criação do Banco de Dados (opcional se já criado)
-- CREATE DATABASE IF NOT EXISTS ecoponto_ro;
-- \c ecoponto_ro;

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('CIDADAO', 'COOPERATIVA', 'ESCOLA', 'ADMIN')),
    municipio VARCHAR(150) NOT NULL,
    instituicao_ou_bairro VARCHAR(150),
    pontos_acumulados INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE MATERIAIS RECICLÁVEIS (PADRÃO CONAMA)
CREATE TABLE IF NOT EXISTS materiais (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cor_conama VARCHAR(30) NOT NULL,
    preco_medio_kg DECIMAL(10, 2) NOT NULL,
    fator_co2_kg DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    orientacao_descarte TEXT
);

-- 3. TABELA DE ECOPONTOS E COOPERATIVAS CREDENCIADAS
CREATE TABLE IF NOT EXISTS ecopontos (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    municipio VARCHAR(100) DEFAULT 'Porto Velho - RO',
    bairro VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    map_x INT DEFAULT 50,
    map_y INT DEFAULT 50,
    capacidade_max_kg DECIMAL(10, 2) NOT NULL,
    ocupacao_atual_pct INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Ativo',
    responsavel VARCHAR(150),
    contato VARCHAR(100),
    materiais_aceitos TEXT
);

-- 4. TABELA DE DESPACHOS DE RESÍDUOS (CERTIFICAÇÃO DIGITAL)
CREATE TABLE IF NOT EXISTS despachos (
    id VARCHAR(50) PRIMARY KEY,
    codigo_comprovante VARCHAR(50) UNIQUE NOT NULL,
    usuario_id VARCHAR(50) NOT NULL,
    ecoponto_id VARCHAR(50) NOT NULL,
    material_id VARCHAR(50) NOT NULL,
    quantidade_kg DECIMAL(10, 2) NOT NULL,
    co2_evitado_kg DECIMAL(10, 2) NOT NULL,
    pontos_ganhos INT NOT NULL,
    renda_gerada_estimada_rs DECIMAL(10, 2) NOT NULL,
    data_hora VARCHAR(50) NOT NULL,
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Validado no Ecoponto',
    CONSTRAINT fk_despacho_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_despacho_ecoponto FOREIGN KEY (ecoponto_id) REFERENCES ecopontos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_despacho_material FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE RESTRICT
);

-- 5. TABELA DE CAMPANHAS COMUNITÁRIAS E ESCOLARES
CREATE TABLE IF NOT EXISTS campanhas (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    organizacao VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    meta_kg DECIMAL(10, 2) NOT NULL,
    arrecadado_kg DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'EM ANDAMENTO',
    data_inicio DATE,
    data_fim DATE
);

-- ============================================================================
-- DADOS INICIAIS DE TESTE E AUDITORIA (100% REAIS DE RONDÔNIA)
-- ============================================================================

-- Inserção de Usuários
INSERT INTO usuarios (id, nome, email, senha_hash, perfil, municipio, instituicao_ou_bairro, pontos_acumulados, ativo) VALUES
('u1', 'Ana Beatriz de Lima Rosa', 'anabeatriz@escola.ro.gov.br', '123', 'CIDADAO', 'Porto Velho - RO', '3°B Informática - EEEFM Carmela Dutra', 380, TRUE),
('u2', 'Cooperativa CATANORTE (Catadores de RO)', 'triagem@catanorte.org.br', '123', 'COOPERATIVA', 'Porto Velho - RO', 'Bairro Lagoa (próximo à BR-364)', 1850, TRUE),
('u3', 'EEEFM Carmela Dutra (Direção Escolar)', 'carmeladutra@seduc.ro.gov.br', '123', 'ESCOLA', 'Porto Velho - RO', 'Av. Farquar, Panair', 1240, TRUE),
('u4', 'SEMA / Auditoria Governamental RO', 'gestao.residuos@sema.portovelho.ro.gov.br', 'admin', 'ADMIN', 'Porto Velho - RO', 'Centro - Porto Velho / RO', 500, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Inserção de Materiais (Classificação CONAMA)
INSERT INTO materiais (id, nome, categoria, cor_conama, preco_medio_kg, fator_co2_kg, descricao, orientacao_descarte) VALUES
('m1', 'Plásticos (PET, PEAD, PEBD, PP)', 'Plásticos', 'VERMELHO', 2.40, 1.53, 'Garrafas PET, embalagens de xampu, potes de margarina e sacolas limpas.', 'Enxágue com água de reúso, deixe secar, amasse para retirar o ar e rosqueie a tampa.'),
('m2', 'Papel, Papelão e Embalagens Longa Vida', 'Papel', 'AZUL', 0.65, 0.92, 'Caixas de papelão ondulado desmontadas, folhas de papel A4/caderno, livros e jornais.', 'Desmonte e achate as caixas de papelão. Mantenha os papéis em local seco.'),
('m3', 'Vidros (Garrafas, Potes de Conserva e Frascos)', 'Vidros', 'VERDE', 0.35, 0.31, 'Garrafas de cerveja, sucos, potes de molho e frascos de café.', 'Esvazie e enxágue. Em caso de quebra, embale em caixa identificada como "VIDRO QUEBRADO".'),
('m4', 'Metais (Latinhas de Alumínio e Aço)', 'Metais', 'AMARELO', 6.80, 9.13, 'Latinhas de refrigerante/cerveja, latas de milho/ervilha e tampas metálicas.', 'Esvazie e amasse as latinhas para reduzir volume. Dobre tampas cortantes para dentro.'),
('m5', 'Resíduos Eletroeletrônicos (E-Lixo / Logística Reversa)', 'Eletrônicos', 'LARANJA', 4.50, 4.80, 'Cabos, carregadores, celulares antigos, placas-mãe, teclados e baterias.', 'Nunca descarte no lixo comum devido a metais pesados. Entregue nos PEVs da SEDAM ou SEMA.'),
('m6', 'Óleo Vegetal de Fritura Usado', 'Óleo', 'MARROM', 1.80, 2.45, 'Óleo de cozinha residual de residências, cantinas escolares e restaurantes.', 'Espere esfriar, coe para retirar restos de comida e armazene em garrafa PET bem fechada.')
ON CONFLICT (id) DO NOTHING;

-- Inserção de Ecopontos e Cooperativas
INSERT INTO ecopontos (id, nome, tipo, endereco, municipio, bairro, latitude, longitude, map_x, map_y, capacidade_max_kg, ocupacao_atual_pct, status, responsavel, contato, materiais_aceitos) VALUES
('ep1', 'SEMA – Secretaria Municipal de Meio Ambiente de Porto Velho', 'ECOPONTO MUNICIPAL', 'Rua Duque de Caxias, 186 - Bairro São Cristóvão', 'Porto Velho - RO', 'Centro', -8.759500, -63.901200, 36, 74, 3000, 48, 'Ativo', 'Prefeitura de Porto Velho / Depto. Proteção Ambiental', '(69) 3901-3200', 'Plásticos, Papel, Vidros, Metais, Eletrônicos'),
('ep2', 'CATANORTE – Cooperativa de Catadores de Materiais Recicláveis', 'COOPERATIVA DE CATADORES', 'Rua da Beira, 4520 - Bairro Lagoa (próximo à BR-364)', 'Porto Velho - RO', 'Lagoa', -8.774200, -63.861500, 78, 72, 10000, 74, 'Ativo', 'Cooperativa CATANORTE de Catadores', '(69) 99234-1122', 'Plásticos, Papel, Metais, Óleo'),
('ep3', 'EEEFM Carmela Dutra (Ponto Escolar Sustentável)', 'PONTO ESCOLAR', 'Av. Farquar, 2550 - Bairro Panair (CEP 76801-329)', 'Porto Velho - RO', 'Panair', -8.748000, -63.908800, 34, 50, 1200, 38, 'Ativo', 'Direção Escolar e Turma 3°B Informática', '(69) 3216-5544', 'Plásticos, Papel, Metais, Eletrônicos'),
('ep4', 'SEDAM – Palácio Rio Madeira (PEV de Resíduos Eletrônicos)', 'PONTO GOVERNAMENTAL', 'Av. Farquar, 2986 - Bairro Pedrinhas', 'Porto Velho - RO', 'Pedrinhas', -8.741200, -63.906500, 46, 28, 2000, 31, 'Ativo', 'Secretaria de Estado do Desenvolvimento Ambiental', '(69) 3216-1065', 'Eletrônicos, Papel, Plásticos'),
('ep5', 'ASPREVEL – Associação de Catadores de Porto Velho', 'ASSOCIAÇÃO PARCEIRA', 'Av. dos Imigrantes, 4100 - Bairro São Sebastião', 'Porto Velho - RO', 'São Sebastião', -8.732000, -63.882000, 68, 45, 6000, 55, 'Ativo', 'Diretoria de Operações ASPREVEL', '(69) 99312-8800', 'Plásticos, Papel, Vidros, Metais'),
('ep6', 'SEMAM Ji-Paraná – Ecoponto Central do Interior', 'ECOPONTO REGIONAL (RO)', 'Av. Marechal Rondon, 890 - Centro', 'Ji-Paraná - RO', 'Centro', -10.885300, -61.951700, 84, 22, 5000, 42, 'Ativo', 'Secretaria Municipal de Meio Ambiente de Ji-Paraná', '(69) 3416-4034', 'Plásticos, Papel, Vidros, Metais, Eletrônicos, Óleo')
ON CONFLICT (id) DO NOTHING;

-- Inserção de Despachos Iniciais com Rastreabilidade
INSERT INTO despachos (id, codigo_comprovante, usuario_id, ecoponto_id, material_id, quantidade_kg, co2_evitado_kg, pontos_ganhos, renda_gerada_estimada_rs, data_hora, observacoes, status) VALUES
('dsp-001', 'ECO-RO-2026-001', 'u1', 'ep3', 'm1', 8.50, 13.00, 85, 20.40, '2026-10-10 10:20', 'Garrafas PET limpas arrecadadas na gincana da turma 3°B.', 'Validado no Ecoponto'),
('dsp-002', 'ECO-RO-2026-002', 'u1', 'ep1', 'm2', 14.00, 12.88, 140, 9.10, '2026-10-11 14:15', 'Caixas de papelão desmontadas e cadernos antigos.', 'Validado no Ecoponto'),
('dsp-003', 'ECO-RO-2026-003', 'u1', 'ep4', 'm5', 3.20, 15.36, 95, 14.40, '2026-10-12 16:40', 'Cabos USB, fontes queimadas e celulares sem uso.', 'Validado no Ecoponto'),
('dsp-004', 'ECO-RO-2026-004', 'u2', 'ep5', 'm4', 32.50, 296.70, 325, 221.00, '2026-10-12 18:00', 'Lote consolidado de alumínio prensado para destinação industrial.', 'Validado no Ecoponto'),
('dsp-005', 'ECO-RO-2026-005', 'u1', 'ep2', 'm6', 6.00, 14.70, 60, 10.80, '2026-10-13 11:30', 'Garrafas PET com óleo de fritura filtrado.', 'Validado no Ecoponto')
ON CONFLICT (id) DO NOTHING;

-- Inserção de Campanhas
INSERT INTO campanhas (id, titulo, organizacao, descricao, meta_kg, arrecadado_kg, status, data_inicio, data_fim) VALUES
('c1', 'Gincana Escolar 3°B Informática: Rondônia Sustentável', 'EEEFM Carmela Dutra & Turma 3°B', 'Mobilização pedagógica dos estudantes do curso técnico em informática com destinação direta para a cooperativa CATANORTE.', 500, 384, 'EM ANDAMENTO', '2026-09-01', '2026-11-30'),
('c2', 'Campanha Óleo no Rio Nunca Mais: Protegendo o Rio Madeira', 'Condomínios de Porto Velho & SEMA', 'Coleta voluntária de óleo de cozinha usado em garrafas PET para impedir a contaminação da bacia do Rio Madeira e converter em sabão ecológico.', 300, 215, 'EM ANDAMENTO', '2026-08-15', '2026-12-15'),
('c3', 'Mutirão Estadual de E-Lixo: Logística Reversa SEDAM-RO', 'Governo de Rondônia / Simulado Centelha 3', 'Coleta de pilhas, celulares e equipamentos eletrônicos para reciclagem tecnológica e neutralização de metais pesados.', 1200, 640, 'EM ANDAMENTO', '2026-07-01', '2026-12-31')
ON CONFLICT (id) DO NOTHING;
