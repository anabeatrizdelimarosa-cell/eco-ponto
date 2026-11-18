# 📄 ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE (SPEC FINAL)
## Projeto: EcoPonto Inteligente • Rondônia
> **Submetido ao Programa Centelha 3 Rondônia (Edital nº 03/2026)**  
> **Estudante / Autora:** Ana Beatriz de Lima Rosa  
> **Turma:** 3°B Técnico em Informática — EEEFM Carmela Dutra • Porto Velho - RO  
> **Orientador:** Prof. Rafael Pitwak  
> **Metodologia:** Apostila *“Programar com IA de forma responsável”* (Google Antigravity & Spec-Driven Development)  
> **Repositório GitHub:** [https://github.com/anabeatrizdelimarosa-cell/eco-ponto](https://github.com/anabeatrizdelimarosa-cell/eco-ponto)  
> **Sistema Publicado no Ar (Vercel):** [https://eco-ponto-rho.vercel.app](https://eco-ponto-rho.vercel.app)  

---

## 1. Objetivo do Sistema
O **EcoPonto Inteligente** é uma plataforma web progressiva e auditável projetada para enfrentar o severo déficit de gestão de resíduos sólidos em Rondônia, onde **57,7% dos municípios não possuem coleta seletiva estruturada** (dados oficiais SINIR+ / Governo de Rondônia).

A solução conecta digitalmente **cidadãos geradores de resíduos**, **escolas públicas**, **cooperativas de catadores** (como CATANORTE e ASPREVEL) e **órgãos governamentais de fiscalização (SEMA/SEDAM)**. O sistema provê:
1. **Rastreabilidade Digital Criptográfica**: Cada entrega gera um código hash auditável com comprovante em folha A4 e **QR Code real** escaneável por smartphone.
2. **Telemetria de Sensores IoT**: Simulação em tempo real de sensores ultrassônicos instalados nos ecopontos com disparo de alertas de sobrecarga (>= 90%).
3. **Logística Reversa & Inclusão Produtiva**: Cálculo instantâneo da renda direta destinada às cooperativas e do $CO_2$ evitado na atmosfera.
4. **Governança Segura**: Painel restrito para auditores da SEMA protegido por senha administrativa (`admin`).

---

## 2. Perfis de Usuários
| Perfil | Descrição e Permissões |
| :--- | :--- |
| **Cidadão / Estudante** | Realiza entregas, acumula Pontos Verdes (+10 pts/kg), emite comprovantes PDF com QR Code e consulta o mapa de pontos de descarte. |
| **Cooperativa de Catadores** | Registra lotes volumosos de materiais triados, acompanha a receita gerada e gerencia a capacidade dos ecopontos parceiros. |
| **Escola Pública** | Mobiliza a comunidade escolar em gincanas socioambientais e monitora o ranking de reciclagem da instituição. |
| **Auditor Governamental (SEMA)** | Acesso total mediante senha: gestão de usuários, telemetria de sensores IoT, calibração de preços/fatores $CO_2$ e auditoria com exportação CSV e backup JSON. |

---

## 3. Casos de Uso Principais (CU)
- **CU01 - Autenticação & Gestão de Sessão:** Login por e-mail/senha, atalhos de 1 clique para avaliação rápida, cadastro com bônus de 50 Pontos Verdes e recuperação de senha com código seguro.
- **CU02 - Consulta ao Mapa Cartográfico Interativo:** Visualização geoespacial de Porto Velho (demarcação da calha do Rio Madeira, BR-364 e Av. Sete de Setembro), filtragem entre pontos gerais e pontos onde o usuário já entregou resíduos.
- **CU03 - Registro de Despacho de Resíduos:** Seleção de ecoponto, tipo de material (CONAMA), digitação de peso verificado em balança e cálculo automático de Pontos Verdes, $CO_2$ evitado e renda gerada para cooperativas.
- **CU04 - Emissão de Certificado Digital A4:** Exibição de comprovante formatado no padrão A4 oficial com QR Code real (ISO/IEC 18004), download de arquivo `.pdf` via `jsPDF` e impressão nativa.
- **CU05 - Validação Pública por Hash:** Mecanismo de auditoria em que qualquer cidadão ou fiscal digita o código (ex: `ECO-RO-2026-001`) e valida os metadados e autenticidade da entrega.
- **CU06 - Gestão Administrativa & Telemetria IoT:** Ajuste em tempo real da ocupação percentual dos ecopontos, cadastro de novos ecopontos, alteração de status de usuários e calibração da tabela de preços pagos aos catadores.
- **CU07 - Exportação de Dados:** Exportação de relatório em formato `.csv` e backup completo dos dados em `.json`.
- **CU08 - Logout Seguro:** Encerramento imediato da sessão com redirecionamento automático para a Landing Page institucional.

---

## 4. Instalação e Execução (Guia do Avaliador)

### 4.1 Ambiente
- **Linguagem & Runtimes:** JavaScript (ES2022+) / TypeScript 5.8+ / Node.js 18.x ou 20.x (LTS).
- **Gerenciador de Pacotes:** `npm` (versão 9 ou superior).
- **Servidor Local:** Vite 6 / Vite 8 (porta padrão configurada: `3011`).
- **Sistema Operacional Homologado:** Windows 10/11, Ubuntu 22.04 LTS e macOS Sonoma.

### 4.2 Banco de Dados
- **SGBD Compatível:** PostgreSQL 14+, MySQL 8.0+, MariaDB 10.5+ ou SQLite 3.
- **Nome Sugerido do Banco de Dados:** `ecoponto_ro`
- **Caminho do Script SQL no Repositório:** `database/schema.sql`
- **Como Executar o Script:**
  - *Via PostgreSQL CLI:*
    ```bash
    psql -U postgres -d ecoponto_ro -f database/schema.sql
    ```
  - *Via MySQL CLI:*
    ```bash
    mysql -u root -p ecoponto_ro < database/schema.sql
    ```
  - *Via phpMyAdmin / DBeaver:* Abra a interface gráfica, selecione o banco `ecoponto_ro` e execute o arquivo `database/schema.sql`.

#### Modelo de Dados e Estrutura das Tabelas:
| Tabela | Campos Principais | Chave Primária (PK) | Relacionamentos (FK) |
| :--- | :--- | :--- | :--- |
| **`usuarios`** | `id`, `nome`, `email`, `senha_hash`, `perfil`, `municipio`, `pontos_acumulados`, `ativo` | `id` | — |
| **`materiais`** | `id`, `nome`, `categoria`, `cor_conama`, `preco_medio_kg`, `fator_co2_kg`, `preparo` | `id` | — |
| **`ecopontos`** | `id`, `nome`, `tipo`, `endereco`, `latitude`, `longitude`, `capacidade_max_kg`, `ocupacao_atual_pct` | `id` | — |
| **`despachos`** | `id`, `codigo_comprovante`, `usuario_id`, `ecoponto_id`, `material_id`, `quantidade_kg`, `co2_evitado_kg`, `pontos_ganhos` | `id` | `usuario_id` → `usuarios.id`<br>`ecoponto_id` → `ecopontos.id`<br>`material_id` → `materiais.id` |
| **`campanhas`** | `id`, `titulo`, `organizacao`, `meta_kg`, `arrecadado_kg`, `status`, `data_inicio`, `data_fim` | `id` | — |

*Nota: O script `database/schema.sql` já realiza a carga automática dos dados iniciais reais de Rondônia (SEMA, CATANORTE, EEEFM Carmela Dutra, ASPREVEL, etc.).*

### 4.3 Variáveis de Ambiente
O repositório inclui o arquivo de modelo `.env.example`:
```env
# Porta do Servidor Web Local
PORT=3011
VITE_PORT=3011

# Ambiente de Execução
NODE_ENV=development

# Conexão com Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecoponto_ro
DB_USER=postgres
DB_PASS=sua_senha_local
DATABASE_URL=postgresql://postgres:sua_senha_local@localhost:5432/ecoponto_ro?sslmode=prefer

# Senha de Auditoria do Painel Administrativo SEMA
ADMIN_MASTER_KEY=admin

# URL da Aplicação em Produção
VITE_PUBLIC_URL=https://eco-ponto-rho.vercel.app
```

### 4.4 Passo a Passo de Instalação (Do Clone ao Navegador)
1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/anabeatrizdelimarosa-cell/eco-ponto.git
   cd eco-ponto
   ```
2. **Acessar a pasta da aplicação:**
   ```bash
   cd ecoponto-app
   ```
3. **Instalar as dependências do projeto:**
   ```bash
   npm install
   ```
4. **Configurar as variáveis de ambiente:**
   ```bash
   copy .env.example .env
   # No Linux/macOS: cp .env.example .env
   ```
5. **(Opcional) Importar o banco de dados:**
   Execute o script `database/schema.sql` no seu SGBD conforme descrito na seção 4.2. *(A aplicação possui fallback automático em memória/localStorage com persistência reativa, permitindo avaliação imediata mesmo sem um servidor de banco de dados ativo).*
6. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
7. **Abrir a aplicação no navegador:**
   Acesse a URL exata indicada no terminal:
   👉 **http://localhost:3011**

---

### 4.5 Como Testar (Roteiro de Avaliação Rápida)

#### Contas de Teste Pré-Configuradas (Dados Fictícios de Avaliação):
| Usuário / Entidade | E-mail de Teste | Senha | Perfil |
| :--- | :--- | :--- | :--- |
| **Ana Beatriz de Lima Rosa** | `anabeatriz@escola.ro.gov.br` | `123` | Cidadão / Estudante (Turma 3°B) |
| **Cooperativa CATANORTE** | `triagem@catanorte.org.br` | `123` | Cooperativa de Catadores |
| **EEEFM Carmela Dutra** | `carmeladutra@seduc.ro.gov.br` | `123` | Escola Pública |
| **Auditoria Governamental SEMA** | `gestao.residuos@sema.portovelho.ro.gov.br` | `admin` | Administrador SEMA |

#### Roteiro do Fluxo Principal de Testes:
1. **Acessar a Landing Page:** Abra `http://localhost:3011` (ou o link publicado `https://eco-ponto-rho.vercel.app`).
2. **Efetuar Login:** Clique no botão verde **"Entrar no Sistema / Login"**. Utilize a conta da estudante `anabeatriz@escola.ro.gov.br` (senha `123`) ou use os atalhos rápidos de 1 clique.
3. **Inspecionar o Mapa:** Navegue pela aba **"Mapa Interativo"**. Clique nos pinos para ver a telemetria IoT do ecoponto e clique em *"Onde Já Despachei"* para filtrar os pontos com histórico.
4. **Registrar um Novo Despacho:** Na aba **"Registrar Despacho"**, selecione o ecoponto *"EEEFM Carmela Dutra"*, o material *"Plásticos"*, digite `10` kg e confirme.
5. **Visualizar e Baixar Certificado:** O sistema redirecionará para a aba **"Histórico"**. Clique no código hash gerado (ex: `ECO-RO-2026-006`) para abrir o certificado A4, verificar o **QR Code real** e clicar em **"Baixar Arquivo .PDF"**.
6. **Validar por Código Hash:** Copie o código gerado, abra a aba **"Validar Certificado"**, cole o código e confirme a auditoria pública com o selo verde.
7. **Acessar o Painel Administrativo:** Clique na aba vermelha **"Painel Administrativo (SEMA)"**. Quando solicitado o código de segurança, digite a senha mestra `admin` (ou clique em preenchimento de teste). Teste os sliders IoT simulando lotação e exporte o relatório em CSV.
8. **Testar Logout Seguro:** Clique no botão vermelho **"Sair"** no topo direito. O sistema encerra a sessão e retorna imediatamente à Landing Page.

#### Problemas Conhecidos e Limitações:
- Os sensores IoT físicos comunicam-se via protocolo MQTT em ambiente de produção da SEMA; na versão web acadêmica, a telemetria é simulada interativamente através de sliders de capacidade.
- A geração client-side de PDF depende dos recursos nativos do navegador (`window.print` ou `jsPDF`); recomenda-se navegadores modernos baseados em Chromium (Google Chrome, Microsoft Edge, Brave) ou Firefox.

---

## 5. Checklist de Segurança e Boas Práticas (Anexo B da Apostila)
- [x] **Credenciais Protegidas:** Nenhuma chave de API ou senha real salva no código-fonte; configurações isoladas em `.env.example`.
- [x] **Controle de Acesso Baseado em Funções (RBAC):** Painel de governança restrito por senha (`admin`).
- [x] **Sanitização de Entradas:** Validação de formato de pesos numéricos (> 0 kg), e-mails válidos e confirmação de senhas.
- [x] **Integridade Auditável:** Geração de códigos hash únicos com payload rastreável para leitura via QR Code.
- [x] **Compatibilidade com Diretrizes LGPD:** Dados institucionais públicos e preservação da privacidade de dados sensíveis.
