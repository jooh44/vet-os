# Epic 06 Stories: FRED Assistant

## Story 6.1: Floating Chat Widget
**As a** User
**I want to** access FRED from any screen
**So that** I can ask questions without leaving my work.

**Acceptance Criteria:**
- [ ] Fixed position widget (bottom-right)
- [ ] Expand/Collapse animations
- [ ] Chat interface (Messages scroll, Input area)
- [ ] "Typing" indicator state

---

## Story 6.2: FRED Backend Service (Gemini)
**As a** System
**I want to** process user messages via Gemini Flash
**So that** we get intelligent responses.

**Acceptance Criteria:**
- [ ] API Route `/api/fred/chat`
- [ ] Integrate Google Gemini SDK
- [ ] Maintain session history (Last 10 messages)
- [ ] System Prompt Inject: "You are FRED, a vet assistant..."

---

## Story 6.3: Grounding/RAG Service
**As a** System
**I want to** search the database before answering
**So that** FRED answers about specific patients are accurate.

**Acceptance Criteria:**
- [ ] Detect intent (e.g., "Search Patient")
- [ ] Execute DB Query (PostgreSQL search)
- [ ] Inject findings into LLM Context
- [ ] If no data found, explicitly state it (Anti-hallucination)

---

## Story 6.4: Quick Action Buttons
**As a** User
**I want to** see clickable actions in the chat
**So that** I can navigate directly to the suggested task.

**Acceptance Criteria:**
- [ ] Support "Action Suggestions" in API response
- [ ] Render buttons (e.g., "Open Rex's Profile", "Book Appt")
- [ ] Handle click events to route/open modals
