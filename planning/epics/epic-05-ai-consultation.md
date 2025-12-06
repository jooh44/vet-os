# Epic 05: AI Consultation & Records

**Status:** Draft
**Priority:** Critical (Differentiation)
**Owner:** AI Lead

## Goal
Revolutionize the veterinary workflow by automating medical record creation using Audio-to-Text and Generative AI.

## Description
This is the core "Wow" feature of FRED. It handles the flow from Consultation start, Audio recording/upload, Transcription (Whisper), Structural Analysis (GPT-4o), to final Medical Record confirmation and PDF generation.

## Scope
### In Scope
- Audio Upload & Management (MinIO)
- Transcription Service Integration (OpenAI Whisper)
- Medical Record Generation (OpenAI GPT-4o)
- Consultation Interface (Active consultation view)
- Medical Record Editor (Human confirmation)
- Prescription Generation (Templates)
- PDF Generation (Records & Prescriptions)

### Out of Scope
- Real-time streaming transcription (Phase 2)
- Complex diagnosis suggestions (Phase 2)

## Key Stories
- [ ] Implement Active Consultation Interface
- [ ] Create Audio Upload & Processing Service
- [ ] Integrate Whisper API for Transcription
- [ ] Integrate GPT-4o for Record Structuring
- [ ] Build Medical Record Editor & Review UI
- [ ] Implement Prescription Generator & PDF Export

## Dependencies
- Epic 01 (MinIO, OpenAI Keys)
- Epic 03 (Patient context)
- Epic 04 (Appointment context)
