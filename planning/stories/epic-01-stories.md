# Epic 01 Stories: Foundation & Infrastructure

## Story 1.1: Setup Next.js Project Structure
**As a** Developer
**I want to** initialize the Next.js project with TypeScript, Tailwind, and Shadcn/ui
**So that** we have a modern, type-safe foundation for development.

**Acceptance Criteria:**
- [ ] Initialize Next.js 14 (App Router) project
- [ ] Configure Tailwind CSS with Design System colors (tokens)
- [ ] Install and configure Shadcn/ui
- [ ] Setup project folder structure (app, components, lib, types) as per Architecture doc
- [ ] Verify `npm run dev` works without errors

---

## Story 1.2: Configure PostgreSQL & Prisma
**As a** Developer
**I want to** setup the database connection and ORM
**So that** we can persist application data reliably.

**Acceptance Criteria:**
- [ ] Install Prisma and setup `schema.prisma`
- [ ] Configure `DATABASE_URL` in .env
- [ ] Create initial docker-compose for local PostgreSQL
- [ ] Define initial User model in schema
- [ ] Verify `npx prisma migrate dev` runs successfully

---

## Story 1.3: Setup MinIO Object Storage
**As a** Developer
**I want to** configure MinIO for file storage
**So that** we can save audio files and PDFs locally compatible with S3 APIs.

**Acceptance Criteria:**
- [ ] Add MinIO service to docker-compose
- [ ] Configure `MINIO_ENDPOINT` and keys in .env
- [ ] Create utility service `lib/storage.ts` for upload/download
- [ ] Verify file upload works to local MinIO bucket

---

## Story 1.4: Implement NextAuth.js Authentication
**As a** Developer
**I want to** setup the authentication layer
**So that** we can secure the application and manage user sessions.

**Acceptance Criteria:**
- [ ] Install and configure NextAuth.js v5
- [ ] Implement Credentials provider (Email/Password)
- [ ] Setup Login page UI
- [ ] Configure JWT session strategy
- [ ] Protect routes using middleware

---

## Story 1.5: Setup Deployment Pipeline (Coolify)
**As a** DevOps Engineer
**I want to** configure the deployment workflow on Coolify
**So that** we can deploy changes to production automatically.

**Acceptance Criteria:**
- [ ] Configure Dockerfile for Next.js production build
- [ ] Setup Coolify project linked to Git repository
- [ ] Configure Environment Variables in Coolify
- [ ] Verify successful build and deploy on push
