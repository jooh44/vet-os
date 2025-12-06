# Sprint 01: Foundation & Infrastructure

**Sprint Goal:** Initialize the project with a robust technical foundation (Auth, DB, Storage) and deploy the first "Hello User" dashboard to production.

**Duration:** 2 Weeks
**Start Date:** 06/12/2025
**End Date:** 20/12/2025

## Committed Backlog

### Priority 1: Project Setup (Epic 1)
- [ ] **Story 1.1:** Setup Next.js Project Structure
    - *Why:* We need a codebase to start working.
    - *DoD:* `npm run dev` works, folders matching architecture linked.
- [ ] **Story 1.5:** Setup Deployment Pipeline (Coolify)
    - *Why:* "Deploy Early, Deploy Often". We need a live link immediately.
    - *DoD:* Push to main triggers deploy to `fred.digitaldog.pet`.

### Priority 2: Backend Core (Epic 1)
- [ ] **Story 1.2:** Configure PostgreSQL & Prisma
    - *Why:* Data needs a home.
    - *DoD:* Docker DB running, Schema migration applied.
- [ ] **Story 1.4:** Implement NextAuth.js Authentication
    - *Why:* Access control is critical for multi-role system.
    - *DoD:* Users can sign in/out, protected routes redirect.
- [ ] **Story 1.3:** Setup MinIO Object Storage
    - *Why:* Audio upload is our main feature, storage must be ready.
    - *DoD:* Can upload/download a dummy file via API.

### Priority 3: UI Shell (Epic 2)
- [ ] **Story 2.1:** Implement Main Dashboard Layout (Sidebar/Header)
    - *Why:* Users need navigation.
    - *DoD:* Responsive sidebar with "Depth" design, navigation links working.

## Definition of Done (DoD)
1. Code compiles without errors (TypeScript strict mode).
2. Linting passes (`npm run lint`).
3. Feature works locally.
4. Feature deployed to Staging/Production URL.
5. Basic manual verification passed.

## Rituals
- **Daily:** Async check-in via task updates.
- **Review:** Live demo of the deployed dashboard at end of sprint.
- **Retrospective:** Document what technical assumptions were wrong.

## Risks & Mitigations
- *Risk:* VPS Configuration issues with Coolify.
    - *Mitigation:* allocated 2 days buffer in Story 1.5.
- *Risk:* MinIO connection locally vs docker network.
    - *Mitigation:* Use verified docker-compose networking setup.
