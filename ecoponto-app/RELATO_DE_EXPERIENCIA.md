# INSTITUTO FEDERAL DE RONDÔNIA
## Campus Porto Velho Calama — Desenvolvimento de Sistemas
### Componente Curricular: Desenvolvimento de Sistemas (3° Bimestre)

---

# RELATO DE EXPERIÊNCIA

## Identificação
- **Título do relato:** EcoPonto Inteligente: Relato de Experiência sobre o Desenvolvimento de uma Solução de Gestão de Resíduos Sólidos Assistido por Inteligência Artificial
- **Autora:** Ana Beatriz de Lima Rosa
- **Instituição / Curso / Componente curricular:** EEEFM Carmela Dutra / Curso Técnico em Informática Integrado ao Ensino Médio / Desenvolvimento de Sistemas (3° Bimestre)
- **Professor orientador:** Prof. Rafael Pitwak
- **Data:** 18 de Novembro de 2026
- **Repositório GitHub:** [https://github.com/anabeatrizdelimarosa-cell/eco-ponto](https://github.com/anabeatrizdelimarosa-cell/eco-ponto)
- **Sistema em Produção (Vercel):** [https://eco-ponto-rho.vercel.app/](https://eco-ponto-rho.vercel.app/)
- **Vídeo Pitch (YouTube Shorts):** [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8)

---

## Resumo
Este relato de experiência descreve a minha vivência prática no planejamento, arquitetura e desenvolvimento do sistema **EcoPonto Inteligente • Rondônia**, uma plataforma web voltada à otimização da logística reversa e valorização de resíduos sólidos no município de Porto Velho e região. O projeto foi concebido para concorrer ao edital do Programa Centelha 3 Rondônia (Fase 1: Ideação / Ideias Inovadoras), tendo sua jornada desenvolvida entre 28 de junho de 2026 e 18 de novembro de 2026. O percurso metodológico fundamentou-se nas diretrizes da apostila *“Programar com IA de forma responsável”*, adotando o ciclo estruturado de especificação rigorosa (*spec-first*), prototipação visual orientada a modelo próprio, desenvolvimento iterativo assistido pelo agente Google Antigravity, testes estritos em TypeScript e publicação em nuvem via Vercel e GitHub. A principal dificuldade encontrada residiu na necessidade de mediação crítica entre as respostas automáticas da IA e as exigências reais de usabilidade e segurança — especialmente na recusa de interfaces genéricas com gavetas laterais (*drawer*), na implementação de QR Codes dinâmicos reais e no tratamento de erros de permissão no versionamento Git. A experiência evidenciou que a inteligência artificial potencializa exponencialmente a velocidade de prototipação e estruturação de código, mas demanda do estudante uma postura de liderança técnica, senso crítico apurado e responsabilidade contínua sobre a regra de negócio.

**Palavras-chave:** Gestão de Resíduos Sólidos; Inteligência Artificial; Desenvolvimento Web; Engenharia de Software; Centelha Rondônia.

---

## 1. Introdução
A problemática da destinação incorreta de resíduos sólidos é um dos desafios socioambientais mais graves enfrentados pelos centros urbanos da Região Norte do Brasil. No estado de Rondônia, conforme indicadores recentes do Sistema Nacional de Informações sobre Saneamento (SNIS) e do Plano Estadual de Resíduos Sólidos (PERS/RO), estima-se que mais de 57% dos resíduos gerados não possuem uma destinação final ambientalmente adequada, sobrecarregando vazadouros a céu aberto e lixões clandestinos. Esse cenário impacta diretamente os lençóis freáticos, a saúde pública e perpetua a vulnerabilidade econômica de catadores de materiais recicláveis, que atuam sem instrumentos de gestão logística e rastreabilidade.

Diante dessa realidade, idealizei o **EcoPonto Inteligente**, uma solução tecnológica concebida para integrar cidadãos, operadores de ecopontos, cooperativas de reciclagem e órgãos públicos municipais. O sistema permite o georreferenciamento de pontos de coleta, agendamento de descartes com cálculo volumétrico de pegada de carbono poupada, gamificação por meio de bonificação em “EcoCréditos” e emissão instantânea de Certificados Ambientais em PDF.

O objetivo deste relato de experiência não se restringe a documentar as funcionalidades técnicas da aplicação, mas registrar e analisar de forma reflexiva a minha jornada prática no desenvolvimento do sistema utilizando a assistência de um agente de inteligência artificial generativa (Google Antigravity). Ao longo do processo, atuei guiada por uma metodologia disciplinada que abrangeu desde a redação da especificação de requisitos (*spec.md*) até a homologação do deploy em ambiente de produção. O registro dessa experiência justifica-se pela relevância de compreender o impacto formativo das ferramentas de IA generativa no ensino técnico de informática, demonstrando que programar com IA requer planejamento, supervisão ativa e rigor de engenharia, transformando a aluna de mera escritora de linhas de código em arquiteta de soluções digitais.

---

## 2. Referencial Teórico
O desenvolvimento de software assistido por Inteligência Artificial representa uma mudança substancial em relação ao paradigma tradicional de programação ensinado historicamente nas escolas técnicas. No modelo clássico, o tempo e a carga cognitiva do desenvolvedor concentram-se fortemente na memorização de sintaxe, na digitação manual de estruturas de controle e na resolução de erros triviais de compilação. Em contrapartida, no paradigma assistido por agentes de IA, o foco cognitivo é deslocado para a clareza da especificação de requisitos, a estruturação da arquitetura de software, a formulação precisa de *prompts* de contexto e a revisão analítica do código gerado.

Conforme delineado na apostila *“Programar com IA de forma responsável”* (PITWAK, 2026), o uso eficaz da inteligência artificial exige a adoção de um método disciplinado, denominado *processo spec-driven*. Nesse ciclo, o agente inteligente não deve ser acionado sem antes possuir uma especificação clara de regras de negócio, modelo de entidades relacionais e critérios de aceite. Sem uma especificação sólida, a IA tende a gerar alucinações arquiteturais, produzir códigos redundantes e desviar-se do escopo real do problema.

Além disso, a literatura recente sobre engenharia de software contemporânea ressalta que a segurança e a integridade de dados continuam sendo de responsabilidade estrita do programador humano. Práticas como a não exposição de credenciais em repositórios abertos, a parametrização de consultas de banco de dados para prevenção de ataques como *SQL Injection*, o isolamento de variáveis sensíveis em arquivos `.env` e a conformidade com a Lei Geral de Proteção de Dados (LGPD) e diretrizes da Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010) exigem um olhar crítico contínuo, impedindo que o aluno aceite passivamente o primeiro código retornado pela ferramenta.

---

## 3. Metodologia / Percurso da Experiência
O desenvolvimento do EcoPonto Inteligente ocorreu ao longo de um percurso de cinco meses, iniciado em **28 de junho de 2026** e estendendo-se até o fechamento deste ciclo em **18 de novembro de 2026**. O projeto insere-se no contexto de submissão ao **Programa Centelha 3 Rondônia** (Edital 03/2026 da FAPERO/FINEP), encontrando-se atualmente na **Fase 1: Ideação e Validação Técnica**, cujo marco de entrega inclui o protótipo funcional em nuvem e a defesa da proposta por meio de um vídeo pitch institucional publicado no formato vertical (YouTube Shorts: [https://youtube.com/shorts/jQ7sv5xjBv8](https://youtube.com/shorts/jQ7sv5xjBv8)).

A metodologia prática adotada seguiu seis etapas iterativas:

1. **Planejamento e Elaboração da Spec Inicial (Junho/Julho):** Mapeamento do problema dos resíduos em Porto Velho e redação da especificação técnica funcional contendo personas, fluxos de descarte, modelo relacional PostgreSQL (`usuarios`, `ecopontos`, `descartes`, `itens_descarte`) e matriz de requisitos.
2. **Definição de Protótipo e Modelo Visual de Referência (Agosto/Setembro):** Criação e refinamento de uma proposta de interface limpa, consolidada no arquivo de protótipo `ecoponto_inteligente_site_completo (1).html`, contendo paleta ecológica, métricas de impacto e visualização intuitiva.
3. **Configuração de Ambiente e Stack Tecnológica (Outubro):** Instalação do ambiente de desenvolvimento moderno com Node.js 20, Vite 6, React 19, TypeScript com tipagem estrita, Tailwind CSS, Lucide React, Canvas-Confetti, jsPDF para emissão de laudos ecológicos no cliente e biblioteca `qrcode` para codificação matricial.
4. **Desenvolvimento Assistido por IA (Outubro/Novembro):** Utilização do ambiente do Google Antigravity. Como decisão de governança, adotei o modelo de **autonomia supervisionada** (*Human-in-the-loop*), no qual cada arquivo proposto pelo agente era inspecionado, testado no navegador local e submetido a *diffs* antes da integração definitiva.
5. **Testes, Correções e Homologação:** Validação em múltiplos navegadores, resolução de advertências de tipagem TypeScript em modo de compilação estrito (`tsc -b`), verificação de fluxos de login e auditoria de responsividade mobile.
6. **Deploy e Versionamento:** Configuração da esteira contínua na Vercel integrada ao repositório GitHub (`anabeatrizdelimarosa-cell/eco-ponto`), inclusão do professor orientador (`rafaelpitwak`) como colaborador e documentação técnica completa (`spec.md`, `CHANGELOG.md`, `database/schema.sql` e `.env.example`).

---

## 4. Relato da Experiência
Durante os meses em que liderei o projeto, a minha relação de trabalho com o agente de IA foi marcada por negociações constantes e pela necessidade de exercer autoridade sobre as decisões de design e usabilidade. 

Um dos momentos mais ilustrativos dessa dinâmica ocorreu quando solicitei ao agente a reestruturação da navegação principal. Em sua primeira tentativa autônoma, o agente tentou impor um menu lateral retrátil (*drawer*) e organizou as telas do sistema em uma barra horizontal contínua e poluída, o que fragmentava a experiência do usuário e destoava completamente do visual moderno que eu havia planejado. Ao perceber a inconsistência, recusei expressamente o código gerado e ordenei uma correção firme:
> *“Gostei desse modelo [ecoponto_inteligente_site_completo.html], faça de acordo com esse código algumas alterações, não fuja muito do primeiro comando. E quando sair do sistema, no caso encerrar sessão, vai direto pra landing page, e tire a barra lateral, o drawer.”*

Essa intervenção demonstrou a importância de possuir um modelo de referência próprio. O agente prontamente substituiu a estrutura engessada do *drawer* por um cabeçalho fixo com abas horizontais modernas, integrando uma landing page receptiva que direciona o visitante ao modal de autenticação e retorna automaticamente à página inicial ao deslogar.

Outro momento crítico ocorreu na funcionalidade de geração de comprovantes de descarte. O agente sugeriu inicialmente um componente puramente visual, simulando um QR Code por meio de vetores SVG fixos, que não podiam ser lidos por nenhum smartphone comum. Diante dessa limitação inaceitável, exigi:
> *“Quero mais profissional, quero um QR Code de verdade, quero tela de login pra tela de login, coloca a senha no painel de admin...”*

Essa solicitação forçou o agente a instalar a biblioteca de geração matricial `qrcode`, configurando um elemento `<canvas>` interativo que renderiza uma chave criptográfica simulada e um payload JSON contendo o identificador do agendamento, o nome do cidadão e os quilos de material depositados. Além disso, implementei o bloqueio de segurança na aba de Gestão Administrativa, exigindo senha de credenciamento (`admin`) para impedir que usuários comuns adulterem as métricas de sustentabilidade e a lista de ecopontos da prefeitura.

Por fim, gravei e editei o vídeo de apresentação (*pitch*) em formato dinâmico para redes sociais (Shorts), no qual sintetizo a proposta de valor do EcoPonto Inteligente, o funcionamento do aplicativo no ecossistema de Rondônia e a visão de futuro para o Centelha 3. O link do vídeo foi incorporado aos metadados do projeto, conectando o software funcional à comunicação da inovação.

---

## 5. Dificuldades e Desafios Enfrentados
O processo de desenvolvimento não ocorreu sem percalços significativos. Dentre os obstáculos vivenciados, três desafios merecem destaque:

### 5.1 Desafio de Versionamento e Gestão de Contas no Git (Erro HTTP 403)
Na fase final de publicação, após construir e testar todas as funcionalidades, deparei-me com uma falha bloqueante de autorização ao tentar enviar o código para o meu repositório pessoal no GitHub (`https://github.com/anabeatrizdelimarosa-cell/eco-ponto.git`). O terminal retornava persistentemente o erro `remote: Permission to anabeatrizdelimarosa-cell/eco-ponto.git denied to TarsoRondon. unable to access '...': The requested URL returned error: 403`. Descobri que o ambiente da máquina de desenvolvimento mantinha em cache as credenciais globais de outro estudante. 

A solução exigiu compreender detalhadamente os mecanismos de autenticação do Git via linha de comando no Windows. Gerei um Personal Access Token (PAT) com escopo de permissão de escrita, configurei o *remote origin* temporariamente com o token para sincronizar a branch `main` e, em seguida, restaurei a URL limpa do repositório para assegurar que nenhum segredo pessoal ou token ficasse exposto nos arquivos locais de configuração.

### 5.2 O Perigo da "Ilusão de Conclusão" e o Risco de Aceitação Cega
Em diversas ocasiões, o agente de IA apresentava respostas acompanhadas de mensagens entusiasmadas, afirmando que a tarefa havia sido concluída com excelência. No entanto, ao auditar minuciosamente o código gerado para a exportação de relatórios, descobri que o agente havia referenciado a variável `ecopontos` em vez da propriedade tipada `ecopoints`, causando um erro em tempo de compilação (`TS2552: Cannot find name 'ecopontos'`). 

Se eu tivesse apenas confiado na afirmação da ferramenta sem executar a checagem rigorosa do TypeScript (`npm run build`), o sistema teria falhado imediatamente no servidor de deploy da Vercel. Esse episódio consolidou a lição de que nunca se deve homologar código gerado por IA sem inspecionar a árvore de tipos e a integridade de todas as chamadas de funções.

### 5.3 Conciliação de Bibliotecas no Frontend (jsPDF e Canvas QR Code)
Integrar a geração de certificados em PDF diretamente no navegador do cliente apresentou instabilidades de renderização com a biblioteca `jspdf`. O agente frequentemente importava módulos de forma inconsistente entre CommonJS e ES Modules, o que quebrava o empacotamento do Vite. Foi necessário orientar o agente a ajustar a importação modularizada correta (`import jsPDF from 'jspdf'`), definir margens proporcionais em milímetros e garantir que o certificado exibisse a data formatada no padrão brasileiro (DD/MM/AAAA) juntamente com a assinatura digital do responsável pelo EcoPonto.

---

## 6. Resultados e Reflexões
Ao comparar esta experiência com os projetos desenvolvidos nos bimestres anteriores — nos quais todo o código era digitado linha por linha sem o suporte de assistentes generativos —, é possível traçar reflexões claras sobre as mudanças na rotina de desenvolvimento:

* **O que ficou consideravelmente mais rápido:** A velocidade para criação de interfaces responsivas e estilização com Tailwind CSS foi multiplicada. A geração de esqueletos de componentes, tabelas de dados, estruturas de modais e a sintaxe inicial de scripts SQL (DDL) passaram a ser resolvidas em minutos, eliminando o desgaste físico de tarefas repetitivas.
* **O que exigiu muito mais atenção:** A coerência da arquitetura, o fluxo de experiência do usuário (UX) e o alinhamento com as regras de negócio reais demandaram atenção redobrada. Enquanto a programação manual obriga o desenvolvedor a pensar em cada instrução enquanto digita, a programação com IA gera grandes blocos de código instantaneamente, exigindo uma leitura analítica apurada para detectar falhas lógicas sutis, dados simulados (*mockups*) esquecidos ou falhas de segurança.
* **Estado Atual e Validação:** O sistema encontra-se 100% operacional, hospedado na Vercel ([https://eco-ponto-rho.vercel.app/](https://eco-ponto-rho.vercel.app/)) e acessível publicamente em qualquer dispositivo. Atingimos a entrega completa da Fase 1 do Simulado Centelha 3, provando a viabilidade técnica e mercadológica da solução para Rondônia.

---

## 7. Considerações Finais
A vivência de desenvolver o **EcoPonto Inteligente** utilizando o Google Antigravity comprovou que as ferramentas de inteligência artificial são aliadas extraordinárias para a democratização da inovação e agilidade no desenvolvimento de software. No entanto, a experiência demonstrou de maneira categórica que a IA não substitui o papel do desenvolvedor. Pelo contrário: ela eleva a exigência técnica do estudante, demandando capacidade de especificação, raciocínio lógico, senso estético e compromisso ético com a segurança do usuário. 

Para as próximas turmas de desenvolvimento de sistemas do Instituto Federal e das escolas técnicas, deixo o conselho fundamental: **não usem a IA como um atalho para não pensar, mas como uma alavanca para construir projetos muito mais grandiosos do que conseguiriam sozinhos**. O segredo está em nunca aceitar um código que você não compreenda e nunca abrir mão da sua autoria e visão sobre o produto final.

---

## Referências
1. BRASIL. **Lei Federal nº 12.305, de 2 de agosto de 2010**. Institui a Política Nacional de Resíduos Sólidos (PNRS). Brasília, DF: Presidência da República, 2010.
2. PITWAK, Rafael. **Programar com IA de forma responsável: Guia prático de engenharia de software assistida por agentes inteligentes**. Porto Velho: IFRO / EEEFM Carmela Dutra, 2026.
3. RONDÔNIA. Secretaria de Estado do Desenvolvimento Ambiental (SEDAM). **Plano Estadual de Resíduos Sólidos do Estado de Rondônia (PERS/RO)**. Porto Velho: Governo de Rondônia, 2023.
4. SISTEMA NACIONAL DE INFORMAÇÕES SOBRE SANEAMENTO (SNIS). **Diagnóstico do Manejo de Resíduos Sólidos Urbanos**. Brasília: Ministério do Desenvolvimento Regional, 2024.
5. VERCEL. **Vercel Documentation: Deploying Modern Web Applications**. Disponível em: <https://vercel.com/docs>. Acesso em: 18 nov. 2026.
