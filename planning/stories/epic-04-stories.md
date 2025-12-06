# Epic 04 Stories: Agenda Management

## Story 4.1: Calendar View Component
**As a** Staff Member
**I want to** view the schedule by day, week, or month
**So that** I can see availability.

**Acceptance Criteria:**
- [ ] Implement Calendar UI (using `react-big-calendar` or similar)
- [ ] Switch views (Day/Week/Month)
- [ ] Display different colors for different Veterinarians
- [ ] Show current time indicator

---

## Story 4.2: Create Appointment Flow
**As a** Receptionist
**I want to** book a new appointment
**So that** the veterinarian's time is reserved.

**Acceptance Criteria:**
- [ ] Click on time slot to open "New Appointment" modal
- [ ] Select Pet (Search autocomplete)
- [ ] Select Type (Consultation, Vaccine, Surgery)
- [ ] Default duration based on type (1h standard)
- [ ] Save and refresh calendar instantly

---

## Story 4.3: Conflict Detection & Overbooking
**As a** System
**I want to** warn about double-bookings
**So that** we avoid scheduling errors.

**Acceptance Criteria:**
- [ ] Check if Veterinarian is already booked at selected time
- [ ] If conflict, show warning "Vet Unavailable"
- [ ] Allow override ONLY if "Overbooking" setting is enabled
- [ ] Visually flag conflicting appointments on calendar

---

## Story 4.4: Appointment Actions (Cancel/Reschedule)
**As a** Receptionist
**I want to** cancel or move appointments
**So that** I can manage schedule changes.

**Acceptance Criteria:**
- [ ] Drag and drop appointment to new time (Reschedule)
- [ ] Click appointment -> Cancel option
- [ ] Require "Reason" for cancellation (No-show, Client request)
- [ ] Update status to "Cancelled" (do not delete record)
