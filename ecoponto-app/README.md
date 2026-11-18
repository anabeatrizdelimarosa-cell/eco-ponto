# EcoPonto Inteligente — Simulado Centelha 3 Rondônia

**Estudante:** Ana Beatriz de Lima Rosa  
**Turma:** 3°B Informática  
**Edital:** Edital nº 03/2026 — Programa Centelha 3 Rondônia (Fase 1: Ideias Inovadoras)  
**Pitch no YouTube:** https://youtube.com/shorts/jQ7sv5xjBv8  

---

## 🎯 Status do Sistema: 10% Concluído (Marco MVP Inicial)

Este projeto implementa a base funcional do **EcoPonto Inteligente**, abordando o problema diagnosticado no edital onde **57,7% dos municípios de Rondônia não possuem coleta seletiva estruturada**.

### 🚀 O que está implementado (10% Inicial):
1. **Rede de Pontos de Coleta**:
   - Mapeamento e listagem de ecopontos em Porto Velho e Ji-Paraná.
   - Filtros inteligentes por tipo de material aceito (Plástico, Papelão, Vidro, Metal, E-lixo, Óleo).
   - Simulação de telemetria de sensores IoT com barra de ocupação percentual e status de lotação.
   - Cadastro de novos pontos de coleta via perfil Administrador.

2. **Guia Oficial de Orientação de Descarte (CONAMA)**:
   - Fichas técnicas com instruções de preparo (lavagem, secagem e desmontagem).
   - Alertas contra contaminação de resíduos recicláveis.
   - Cálculo de impacto ecológico por kg reciclado (fator de CO₂ evitado).

3. **Registro de Entregas e Histórico Rastreável**:
   - Formulário interativo para munícipes e entidades registrarem peso e data.
   - Gamificação ambiental com Pontos Verdes (+10 pontos/kg).
   - Histórico com persistência local (`localStorage`).

4. **Painel de Indicadores Socioambientais**:
   - Total em kg reciclados e desvio de resíduos de lixões.
   - Estimativa de kg de CO₂ evitados na atmosfera amazônica.
   - Gráfico de barras de volume por tipo de resíduo.

5. **Campanhas Comunitárias**:
   - Acompanhamento de gincanas escolares do 3°B e mutirões de descarte de e-lixo e óleo.

6. **Ficha Oficial Centelha 3**:
   - Síntese das 17 questões do formulário do edital e link do pitch.

---

## 🌐 Como Executar

O servidor já está ativo e escutando na porta solicitada:

- **Endereço Local:** [http://localhost:3011](http://localhost:3011)

### Comandos manuais:
```bash
cd ecoponto-app
npm install
npm run dev
```
