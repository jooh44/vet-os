# Sprint 4: Fred Copilot (AI Assistant)

**Sprint Goal:** Implementar o "Fred", o assistente IA flutuante que atua como copiloto do veterinário, gerenciando contexto e ações rápidas.

**Focus:** Produtividade e Assistência em Tempo Real. Transformar o VetOS em um sistema proativo.

## 📅 Schedule
- **Start Date:** [Current Date]
- **Duration:** 2 Weeks

## 📝 Committed Backlog

### 1. The Floating Fred (UI)
*Goal: Estar sempre disponível sem ser intrusivo.*
- [ ] **Global Widget**: Chat flutuante persistente (canto inferior direito).
- [ ] **Context Awareness**: Fred visualmente indica que "sabe" onde você está (ex: "Vendo perfil de Rex").
- [ ] **Expand/Collapse**: UX suave para abrir/fechar o chat.

### 2. Conversational Core (Backend)
*Goal: Cérebro rápido e conectado.*
- [ ] **Gemini 2.5 Flash Integration**: Usar modelo mais rápido e barato para chat.
- [ ] **RAG Lite**: Injetar contexto da página atual (JSON do paciente, dados da consulta).
- [ ] **Tool Calling**: Permitir que o Fred execute "Quick Actions" (ex: Agendar).

### 3. Active Assistance
*Goal: Transformar conversa em ação.*
- [ ] **Quick Actions UI**: Botões interativos na resposta do chat (ex: [Confirmar Agendamento], [Ver Prontuário]).
- [ ] **Reminder System**: "Fred, me lembre de ligar para a Sra. Maria amanhã".

## ✅ Definition of Done (DoD)
- [ ] Chat flutuante funcional em todas as páginas.
- [ ] Fred responde perguntas sobre o contexto da página atual (ex: "Quantos anos ele tem?" estando na página do Rex).
- [ ] Pelo menos 1 "Quick Action" implementada e funcional (ex: Navegação ou Criação simples).
- [ ] UI polida e responsiva.

## 🛠️ Stack Técnica
- **AI**: Gemini 2.5 Flash + Vercel AI SDK (Core).
- **UI**: Shadcn UI (Sheet/Popover customizado) + Framer Motion.
- **State**: Client-side context provider.
