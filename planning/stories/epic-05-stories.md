# Epic 05 Stories: AI Consultation & Records

## Story 5.1: Audio Upload Service
**As a** Veterinarian
**I want to** upload the consultation audio file
**So that** it can be processed by the AI.

**Acceptance Criteria:**
- [ ] UI for File Upload (Drag & Drop)
- [ ] Client-side validation (File type mp3/m4a, Size < 50MB)
- [ ] Progress bar for upload
- [ ] Backend handler to save stream to MinIO
- [ ] Return `audioId` for tracking

---

## Story 5.2: Transcription Service (Whisper)
**As a** System
**I want to** transcribe the uploaded audio
**So that** we have the raw text for analysis.

**Acceptance Criteria:**
- [ ] Async job triggered after upload
- [ ] Call OpenAI Whisper API
- [ ] Handle timeouts/retries
- [ ] Save raw transcription text to database
- [ ] Notify frontend when ready

---

## Story 5.3: Medical Record Generation (GPT-4o)
**As a** Veterinarian
**I want to** receive a structured medial record from the transcription
**So that** I don't have to type it manually.

**Acceptance Criteria:**
- [ ] Construct Prompt with Transcription + Pet Context (Age, Name)
- [ ] Call GPT-4o with structured output (JSON mode)
- [ ] Extract fields: Complaint, Exam, Diagnosis, Rx
- [ ] Handle "Hallucination" risks (Grounding prompt)
- [ ] Return JSON to frontend

---

## Story 5.4: Medical Record Editor & Review
**As a** Veterinarian
**I want to** review and edit the AI-generated record
**So that** I can ensure accuracy before signing.

**Acceptance Criteria:**
- [ ] Pre-fill form with AI JSON data
- [ ] "Review Mode": Checkbox for each field to confirm
- [ ] Allow editing any field
- [ ] "Sign & Save" button (locks record)
- [ ] Generate standard PDF Layout

---

## Story 5.5: Prescription Generator
**As a** Veterinarian
**I want to** generate a prescription from the accepted record
**So that** I can print it for the owner.

**Acceptance Criteria:**
- [ ] Pull medications from Medical Record
- [ ] Select Template (Simple, Controlled)
- [ ] Generate PDF with Vet signature
- [ ] Email option to Tutor
