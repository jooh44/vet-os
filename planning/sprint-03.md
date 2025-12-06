# Sprint 3: AI & Market Intelligence

**Sprint Goal:** "The 'Wow' Factor" - Implement the AI Consultation features (transcription, automated records) and the 'Farejador' Market Intelligence tool.

**Focus**: Deliver the core value propositions of the platform to demonstrate to investors/veterinarians.

## 📅 Schedule
- **Start Date:** [Current Date]
- **Duration:** 2 Weeks

## 📝 Committed Backlog

### 1. AI Consultation (Story 5.1, 5.2)
*Goal: Turn audio into structure medical data.*
- [ ] **Audio Upload Component**: UI to record/upload consultation audio files.
- [ ] **Transcription Service**: Mock integration (or real Gemini API) to convert audio to text.
- [ ] **AI Processing**: Generate JSON structure (Anamnesis, Diagnosis, Prescription) from text.
- [ ] **Record Creation**: Auto-fill a new Medical Record from the AI output.

### 2. Farejador (Story 7.1)
*Goal: Monitor market prices.*
- [ ] **Dashboard Widget**: Display "Competitor Prices" on main dashboard.
- [ ] **Bot Setup**: Basic structure for the scraping bot (mocked for demo).
- [ ] **Price Alerts**: UI for setting price thresholds.

## ✅ Definition of Done (DoD)
- [ ] Audio upload works (drag & drop or mic).
- [ ] "Generate Record" button produces a visible result in the Timeline.
- [ ] Farejador page shows mocked competitor data.
- [ ] All new components use "Warm Sage" design system.

## Risks
- **External API Latency**: Gemini/Transcription might be slow (use mocks for reliable demo).
- **Browser Compatibility**: Microphone access issues in some browsers.
