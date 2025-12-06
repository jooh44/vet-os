# Sprint 02: The Digital Patient File

**Sprint Goal:** Enable the clinic to go paperless by fully managing Tutors (Clients) and Pets (Patients) digitally, creating the foundation for medical records and agenda.

**Duration:** 2 Weeks
**Start Date:** 20/12/2025
**End Date:** 03/01/2026

## Committed Backlog

### Priority 1: Tutor Management (Epic 3)
- [ ] **Story 3.1:** Tutor List & Search
    - *Why:* Receptionists need to find viewing clients quickly.
    - *DoD:* List page with Search bar and Pagination implemented.
- [ ] **Story 3.2:** Tutor Registration
    - *Why:* We need to add new clients to the system.
    - *DoD:* Form with validation (CPF, Email) saving to DB.

### Priority 2: Pet Management (Epic 3)
- [ ] **Story 3.3:** Pet Registration & Profile
    - *Why:* The patient is the center of the veterinary business.
    - *DoD:* Complete Pet profile with photo upload (MinIO) and linkage to Tutor.
- [ ] **Story 3.4:** Patient Timeline/History View
    - *Why:* Vets need to see the history fast.
    - *DoD:* Visual timeline showing previous (mocked) events.

### Priority 3: User Management (Epic 2 Carryover)
- [ ] **Story 2.3:** Admin User Management (Team)
    - *Why:* Admins need to invite other vets and attendants.
    - *DoD:* List of system users and "Invite" modal.

## Definition of Done (DoD)
1. Features implemented with Shadcn/ui components.
2. Database Schema updated (prisma migrate).
3. Server Actions used for all mutations.
4. Zod validation for all forms.
5. Search/Filter works with URL parameters (Bookmarkable).

## Risks
- **Data Relations:** Complexity in Tutor <-> Pet one-to-many forms (Nested forms vs Separate steps).
    - *Mitigation:* Use separate steps (Register Tutor -> Redirect to Pet Add).
- **MinIO:** Ensuring photo upload works seamlessly in production container.

## Verification Plan
1. **Automated:**
   - Unit tests for Zod schemas.
   - End-to-end flow: Create Tutor -> Create Pet -> Verify on List.
2. **Manual:**
   - Upload a pet photo and verify persistence.
   - Search for a tutor by partial name.
