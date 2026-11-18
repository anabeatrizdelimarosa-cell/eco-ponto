# 🌱 EcoPonto Inteligente • Rondônia
> **Sistema Oficial de Coleta Seletiva, Rastreabilidade de Resíduos & Telemetria IoT**  
> Submetido ao **Programa Centelha 3 Rondônia (Edital nº 03/2026)**  
> **Estudante / Autora:** Ana Beatriz de Lima Rosa  
> **Turma:** 3°B Técnico em Informática — EEEFM Carmela Dutra • Porto Velho / RO  

---

## 📌 Sobre o Projeto
O **EcoPonto Inteligente** é uma plataforma desenvolvida para mitigar o grave problema da gestão de resíduos sólidos em Rondônia, onde **57,7% dos municípios do estado não possuem coleta seletiva estruturada** (dados oficiais SINIR+ / Governo de Rondônia).

A plataforma conecta cidadãos, escolas e cooperativas de catadores (como a **CATANORTE** e a **ASPREVEL**), oferecendo:
- 🗺️ **Mapa Interativo de Porto Velho** com demarcação da calha do Rio Madeira, BR-364 e Av. Sete de Setembro, destacando ecopontos ativos e onde o cidadão já fez despachos.
- 📱 **QR Code Real & Certificado Digital A4**: cada entrega gera um código hash único, recibo em folha A4 e download de arquivo oficial em `.pdf` gerado via `jsPDF`.
- 📡 **Telemetria de Sensores IoT**: monitoramento em tempo real do nível de ocupação dos ecopontos com alerta automático ao atingir 90%.
- 🛡️ **Painel Administrativo da SEMA**: protegido por senha de auditoria (`admin`), permitindo gerenciar usuários, simular sensores ultrassônicos, ajustar preços médios pagos aos catadores e auditar cargas com exportação em **CSV** e backup em **JSON**.
- ♻️ **Guia Oficial CONAMA**: orientações de higienização, cores oficiais de descarte e campanhas comunitárias escolares.
- 🔐 **Autenticação Completa**: tela de login, cadastro com bônus de 50 Pontos Verdes e recuperação de senha.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm

### Passo a Passo
```bash
# 1. Acesse o diretório da aplicação
cd ecoponto-app

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse no navegador:
👉 **http://localhost:3011**

---

## 🛠️ Tecnologias Utilizadas
- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Ícones institucionais)
- **jsPDF** (Geração e download client-side de certificados A4)
- **qrcode** (Geração de QR Codes escaneáveis por câmera de smartphone)

---

## 📄 Licença e Créditos
Projeto acadêmico e de inovação social desenvolvido para o **Simulado Centelha 3 Rondônia (Edital 03/2026)**.  
EEEFM Carmela Dutra — Porto Velho / RO.
