# Epic 04: Agenda Management

**Status:** Draft
**Priority:** High
**Owner:** Product Owner

## Goal
Provide a robust calendar interface for scheduling consultations, managing availability, and handling basic appointment flows.

## Description
The Agenda is the command center for the clinic. This epic implements the calendar views, appointment creation/editing flows, and conflict management logic as defined in the PRD.

## Scope
### In Scope
- Calendar Views (Day, Week, Month)
- Appointment CRUD (Create, Edit, Cancel, Reschedule)
- Conflict detection (Overbooking logic)
- Veterinarian availability filtering
- Status workflow (Scheduled -> Confirmed -> In Progress -> Completed)

### Out of Scope
- Google Calendar Sync (Phase 2)
- Online scheduling by Tutors (Phase 2)

## Key Stories
- [ ] Implement Calendar UI Component (Day/Week/Month)
- [ ] Create Appointment Booking Modal
- [ ] Implement Appointment Drag & Drop Rescheduling
- [ ] Handle Cancellations & Reasons Logic
- [ ] Implement Veterinarian Filter & Color Coding

## Dependencies
- Epic 03 (Tutors & Pets must exist to book)
