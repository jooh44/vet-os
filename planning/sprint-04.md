# Sprint 4: O Farejador (Market Intelligence)

**Sprint Goal:** Implementar a inteligência de mercado ("Farejador") para monitorar concorrentes e gerar insights estratégicos para a clínica.

**Focus**: Diferenciação competitiva. Transformar o VetOS de um sistema operacional para um parceiro estratégico.

## 📅 Schedule
- **Start Date:** [Current Date]
- **Duration:** 2 Weeks

## 📝 Committed Backlog

### 1. Google Grounding Engine (Enhanced)
*Goal: Encontrar e analisar concorrentes com profundidade (PRD 3.9.2).*
- [x] **Service Integration**: Implementar `GroundingService` usando **Gemini 2.5 Flash**.
- [ ] **Data Extraction**: Expandir Prompt para extrair Telefone, Instagram, Horários e Serviços.
- [ ] **Persistence**: Criar modelos Prisma `Competitor` e `CompetitorSnapshot` para histórico.

### 2. Onboarding Farejador Inteligente (PRD 3.9.1 Enhanced)
*Goal: Experiência "Uau" de descoberta de mercado.*
- [ ] **Step 1: Identificação**: Input (Nome, Bairro, Cidade) -> Gemini busca a clínica do usuário.
- [ ] **Step 2: Confirmação**: Usuário confirma "Sim, sou eu".
- [ ] **Step 3: Análise de Mercado**: Gemini busca concorrentes e gera um **Panorama de Mercado** (Resumo textual: "Sua região tem X concorrentes, preço médio Y...").
- [ ] **Step 4: Seleção & Deep Dive**: Usuário escolhe rivais -> Sistema salva e faz "pesquisa profunda" (extrai dados detalhados).

### 3. Dashboard Inteligente (PRD 3.9.4)
*Goal: Visualizar o mercado em tempo real.*
- [ ] **Competitor List**: UI para listar/adicionar/remover concorrentes monitorados.
- [ ] **Metrics**: Comparativo de Nota Google (Você vs Média).
- [ ] **Notifications**: Alertas de mudança de preço ou nota.

### 4. Jornal do Fred (PRD 3.9.3)
*Goal: Entregar valor passivo ao veterinário.*
- [ ] **Daily Digest**: Componente UI com "Resumo do Dia", "Novidades Mercado", "Insights do Concorrente".
- [ ] **Content Generation**: Server Action que usa Gemini para gerar o texto do jornal baseado nos dados do banco.

## ✅ Definition of Done (DoD)
- [ ] Fluxo de Onboarding (PRD 3.9.1) completo e funcional.
- [ ] Dados de concorrentes salvos no PostgreSQL.
- [ ] "Jornal do Fred" gerado com dados reais do banco.
- [ ] UI segue o padrão Digital Dog / VetOS.

## 🛠️ Stack Técnica
- **AI**: Gemini 2.5 Flash (`@google/genai`).
- **Database**: Prisma (PostgreSQL).
- **Backend**: Server Actions + CRON (simulado ou Vercel Cron).
- **Frontend**: Shadcn UI + Wizard Steps.
