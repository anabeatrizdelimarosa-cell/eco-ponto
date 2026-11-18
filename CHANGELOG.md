# 📋 CHANGELOG & REGISTRO DE DECISÕES TÉCNICAS
## Projeto: EcoPonto Inteligente • Rondônia (Edital Centelha 3 nº 03/2026)
**Estudante / Desenvolvedora:** Ana Beatriz de Lima Rosa  
**Turma:** 3°B Informática — EEEFM Carmela Dutra • Porto Velho - RO  
**Orientador / Avaliador:** Prof. Rafael Pitwak  
**Metodologia:** Apostila *“Programar com IA de forma responsável”* (Google Antigravity & Spec-Driven Development)  

---

### Visão Geral da Auditoria de Revisão Humana
Conforme estabelecido nas diretrizes da disciplina, todas as entregas e código gerados com o apoio do agente inteligente Google Antigravity passaram por **revisão crítica, validação de segurança e intervenções humanas deliberadas**, rejeitando sugestões genéricas e adequando cada funcionalidade ao contexto socioambiental de Rondônia.

---

### [v1.4.0] - 18/11/2026 (Versão Final de Entrega para o Avaliador)
#### 🔄 Revisão Humana & Decisões Críticas
- **Publicação em Produção:** Deploy automatizado e verificado no ar via Vercel na URL: [https://eco-ponto-rho.vercel.app](https://eco-ponto-rho.vercel.app), funcional sem necessidade de instalação local pelo avaliador.
- **Estruturação do Banco de Dados Relacional:** Criação do script `database/schema.sql` com 5 tabelas normalizadas (`usuarios`, `materiais`, `ecopontos`, `despachos`, `campanhas`), constraints de chave estrangeira (`ON DELETE CASCADE` e `RESTRICT`) e carga inicial de dados 100% reais de Porto Velho e Ji-Paraná.
- **Spec Final Completa:** Elaboração da seção obrigatória *“Instalação e execução”* no `spec.md`, cobrindo ambiente, SGBD, variáveis de ambiente (`.env.example`), roteiro numerado de instalação e contas de teste.
- **Versionamento no GitHub:** Repositório oficial configurado e compartilhado com o professor `rafaelpitwak` no endereço: [https://github.com/anabeatrizdelimarosa-cell/eco-ponto](https://github.com/anabeatrizdelimarosa-cell/eco-ponto).

---

### [v1.3.0] - 18/11/2026
#### 🔄 Revisão Humana & Decisões Críticas
- **Tela de Autenticação Unificada (Login, Cadastro & Recuperação):**
  - *Proposta inicial do agente:* Modal simples de alternância com 4 botões de perfis rápidos.
  - *Intervenção humana:* Rejeitado. Foi exigida uma tela de autenticação completa (`AuthScreen.tsx`) com campos reais de e-mail e senha, máscara de exibição, validação de regras de negócio, aba de cadastro com bônus de 50 Pontos Verdes e aba de recuperação de senha com código de auditoria `2026`.
- **Fluxo de Logout & Redirecionamento para Landing Page:**
  - *Intervenção humana:* Implementada regra expressa para que o encerramento de sessão desative a autenticação e redirecione imediatamente o visitante para a Landing Page pública, evitando permanência em telas operacionais deslogadas.

---

### [v1.2.0] - 18/11/2026
#### 🔄 Revisão Humana & Decisões Críticas
- **Eliminação da Barra Lateral (Sidebar/Drawer):**
  - *Proposta inicial do agente:* Implementação de menu vertical recolhível (sidebar lateral esquerda).
  - *Intervenção humana:* Rejeitado pelo usuário após testes visuais no navegador. Foi restabelecida a barra superior de navegação por abas horizontais com design limpo, inspirado no modelo `ecoponto_inteligente_site_completo.html`.
- **Remoção de Poluição Visual no Topo:**
  - *Intervenção humana:* Remoção definitiva do banner verde escuro superior de status do Centelha (`.top-banner`), liberando espaço de tela e priorizando a experiência do usuário.

---

### [v1.1.0] - 18/11/2026
#### 🔄 Revisão Humana & Decisões Críticas
- **QR Code Real vs. Ícone Ilustrativo:**
  - *Proposta inicial do agente:* Exibição de imagem vetorial genérica de QR Code.
  - *Intervenção humana:* Rejeitado. Exigiu-se a instalação da biblioteca oficial `qrcode` para sintetizar um payload JSON estruturado (hash, cidadão, ecoponto, quilos e link de validação) renderizado dinamicamente em DataURL, 100% legível por qualquer smartphone.
- **Emissão Real de Certificado PDF Client-Side:**
  - Integração da biblioteca `jspdf` para montagem de certificado A4 oficial com cabeçalho institucional do Governo de Rondônia, moldura dupla, carimbo de autenticidade, QR Code embarcado e assinaturas digitais, permitindo download direto do arquivo `.pdf` sem falhas de conexão.
- **Proteção do Painel SEMA com Senha:**
  - *Intervenção humana:* Inclusão obrigatória de modal com senha administrativa (`admin`), bloqueando acesso não autorizado aos controles de governança e telemetria IoT.

---

### [v1.0.0] - 10/10/2026 a 17/11/2026
#### 🚀 Concepção da Arquitetura & MVP
- Elaboração da especificação de requisitos baseada nos dados oficiais de Rondônia (déficit de 57,7% dos municípios sem coleta seletiva).
- Construção do Mapa Cartográfico interativo de Porto Velho, mapeando os acidentes geográficos locais (Calha do Rio Madeira, BR-364 e Av. Sete de Setembro).
- Criação dos módulos operacionais: Rede de Ecopontos, Registro de Despachos, Histórico de Entregas, Validador de Hash de Auditoria e Campanhas Comunitárias Escolares.
