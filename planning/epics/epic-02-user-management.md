# Epic 02: User Management & Dashboard

**Status:** Draft
**Priority:** High
**Owner:** Product Manager

## Goal
Create the core user interface and management systems to allow different personas (Admin, Vet, Attendant) to access and use the system appropriately.

## Description
This epic focuses on the "shell" of the application: the dashboard, navigation, and user management. It ensures that when a user logs in, they see the correct options and hold the correct permissions.

## Scope
### In Scope
- Dashboard UI implementation (based on Design System)
- Role-Based Access Control (RBAC) logic
- User management interface (Invite, Edit, Deactivate users)
- Team settings for Admin
- Profile settings for logged-in users

### Out of Scope
- Public registration (Self-service signup is Phase 2)
- Complex analytics on dashboard (Placeholders only)

## Key Stories
- [ ] Implement Main Dashboard Layout & Sidebar
- [ ] Create Admin User Management Interface
- [ ] Implement Invitation System for New Users
- [ ] Create User Profile Settings Page
- [ ] Implement RBAC Middleware & UI Protection

## Dependencies
- Epic 01 (Auth & DB)
