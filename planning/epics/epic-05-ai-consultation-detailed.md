# Epic 05: AI Veterinary Consultation

**Goal**: Transform the consultation experience by using Audio-to-Text and AI to automatically generate medical records.

## User Stories

### Story 5.1: The Listening Doctor (Audio Upload)
**As a** Vet,
**I want to** click a "Record" button during consultation (or upload a file),
**So that** I don't have to type everything manually.

**Acceptance Criteria**:
- [ ] UI Component: Record Button (with mic icon).
- [ ] Fallback: File Upload zone (MP3/WAV/OGG).
- [ ] Visualizer: Waveform or simple "Recording..." pulse.
- [ ] Action: Save audio file to MinIO (bucket `consultations`).

### Story 5.2: The Digital Scribe (Transcription & Structuring)
**As a** Vet,
**I want to** see the AI processing my audio,
**So that** I can review the generated structure (Anamnesis, Physical Exam, Diagnosis).

**Acceptance Criteria**:
- [ ] Process: Send audio URL to backend.
- [ ] AI Mock: 5 second delay -> Return JSON with:
    - Anamnesis: "Patient vomiting for 2 days..."
    - Exam: "Temp 39.5, Dehydrated."
    - Diagnosis: "Gastroenteritis."
    - Prescription: "Dipirone 500mg..."
- [ ] UI: Display "Generating..." skeleton state.
- [ ] Review: Editable forms pre-filled with AI data.

### Story 5.3: Magic Record (Commit to DB)
**As a** Vet,
**I want to** save the AI-generated insight as an official Medical Record,
**So that** it appears on the Pet's timeline.

**Acceptance Criteria**:
- [ ] Button: "Save Record".
- [ ] Result: New entry in `MedicalRecord` table.
- [ ] Timeline: Entry shows up immediately on Pet Profile.

## Technical Notes
- Use `shadcn/ui` for recording interface.
- Use `react-media-recorder` or native MediaRecorder API.
- Mock the AI response initially to speed up demo.
