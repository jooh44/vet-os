# Sprint 5: MVP Consolidation - Teleconsulta & Access Control

**Sprint Goal:** Ensure the MVP is deployment-ready by verifying user data isolation and refining the Teleconsulta experience.

**Focus**: Security (Access Control) and User Experience (Teleconsulta Flow).

## 📅 Schedule

- **Start Date:** 18/12/2025
- **Duration:** 1 Week

## 📝 Backlog

### 1. User Data Isolation (Story 8.1)

*Goal: Ensure Vets only access their own patients/data.*

- [ ] **Prisma Middleware/Query Review**: Verify `where: { veterinarianId: user.id }` is applied correctly.
- [ ] **Guest User Access**: Confirm "Convidado" roles behave as expected.

### 2. Teleconsulta Refinement (Story 9.1)

*Goal: Smooth video-consultation experience.*

- [ ] **Video Integration**: Verify WebRTC/Link generation.
- [ ] **Split-Screen UX**: Ensure Prontuário is editable while video is active.
- [ ] **Patient Link**: Verify the link sent to Tutors works on mobile.

### 3. Documentation (Completed)

- [x] Update PRD (Pivot to Teleconsulta).
- [x] Create BMad Artifacts (`task.md`, `implementation_plan.md`).

## ✅ Definition of Done (DoD)

- [ ] Admin can see all users/patients.
- [ ] Vet "Fernando" can ONLY see his patients.
- [ ] Teleconsulta link opens a video room successfully.
- [ ] No "Farejador" traces in visible UI.
