# Epic 06: FRED Assistant

**Status:** Draft
**Priority:** High
**Owner:** AI Lead

## Goal
Provide an always-available AI assistant that helps users navigate the system, retrieve patient info, and manage tasks via natural language.

## Description
FRED is the floating chat assistant. This epic covers the Chat UI, the integration with Gemini Flash, the context management window, and the "Grounding" mechanism to ensure answers are based on database facts (RAG - Retrieval Augmented Generation).

## Scope
### In Scope
- Floating Chat UI (Global component)
- Gemini 2.5 Flash Integration
- Context Awareness (Current page, User role)
- RAG Setup (Search DB for Patient/Appt info)
- Quick Actions (Buttons in chat)
- Usage Limits & Auditing

### Out of Scope
- Voice interaction with FRED (Text only for MVP)
- Autonomous complex agentic actions (Drafting emails, etc. - Phase 2)

## Key Stories
- [ ] Implement Floating Chat Widget & UI
- [ ] Build FRED Backend Service (Gemini Integration)
- [ ] Implement RAG/Grounding for Patient Data
- [ ] Create Context Injection Mechanism
- [ ] Implement Quick Action Buttons in Chat

## Dependencies
- Epic 01 (Gemini Keys)
- Epics 03/04 (Data to search)
