# Epic 02 Stories: User Management & Dashboard

## Story 2.1: Implement Main Dashboard Layout
**As a** User
**I want to** see a responsive dashboard sidebar and layout
**So that** I can navigate to different sections of the application.

**Acceptance Criteria:**
- [ ] Create `Sidebar` component with Depth design (from Design System)
- [ ] Create `Header` component with user greeting
- [ ] Implement responsive behavior (collapse on mobile)
- [ ] Ensure active state highlighting for current route

---

## Story 2.2: Implement RBAC Logic
**As a** System Admin
**I want to** enforce role-based access control
**So that** Attendants cannot access Admin settings or Veterinarian-only features.

**Acceptance Criteria:**
- [ ] Define Roles: ADMIN, VET, ATTENDANT in schema
- [ ] Create convenience hooks `useRole` or `gate()`
- [ ] Protect specific routes based on Role
- [ ] Hide Sidebar items user doesn't have permission for

---

## Story 2.3: Admin User Management Interface
**As a** Clinic Owner (Admin)
**I want to** view and manage my team members
**So that** I can control who accesses the system.

**Acceptance Criteria:**
- [ ] Create Team List page (Name, Role, Status)
- [ ] Implement Edit User modal (change role)
- [ ] Implement Deactivate User action (soft delete/status toggle)
- [ ] Ensure Admin cannot deactivate themselves

---

## Story 2.4: User Invitation System
**As a** Clinic Owner
**I want to** invite new staff members via email
**So that** they can set up their own passwords and access the system.

**Acceptance Criteria:**
- [ ] Create "Invite User" modal
- [ ] Generate unique invite link (token)
- [ ] Implement "Accept Invite" page (Password creation)
- [ ] Send email via transactional provider (mock or real)
