# Epic 03 Stories: Client & Patient Management

## Story 3.1: Tutor List & Search
**As a** Receptionist
**I want to** search for tutors by name or CPF
**So that** I can quickly find their records.

**Acceptance Criteria:**
- [ ] Create Tutor List view with pagination
- [ ] Implement search bar (debounce)
- [ ] Display key info columns (Name, Pets, Contact)
- [ ] Click row to navigate to Tutor Details

---

## Story 3.2: Tutor Registration
**As a** Receptionist
**I want to** register a new tutor
**So that** I can associate pets and appointments to them.

**Acceptance Criteria:**
- [ ] Create Tutor Form (Name, CPF, Phone, Email, Address)
- [ ] Implement Zod validation (CPF format, Email)
- [ ] Handle "Tutor already exists" error gracefully
- [ ] Save to `User/Tutor` tables

---

## Story 3.3: Pet Registration & Profile
**As a** Veterinarian
**I want to** register a pet with detailed medical info
**So that** I have a complete record.

**Acceptance Criteria:**
- [ ] Create Pet Form (Name, Species, Breed, Weight, Birthdate)
- [ ] Implement Upload field for Pet Photo
- [ ] Create Pet Profile Header (Photo + Key Stats)
- [ ] Link Pet to Owner (Tutor)

---

## Story 3.4: Patient Timeline View
**As a** Veterinarian
**I want to** see a chronological timeline of the pet's history
**So that** I can understand their medical background at a glance.

**Acceptance Criteria:**
- [ ] Fetch history events (Consults, Vaccines, Exams)
- [ ] Render vertical timeline component
- [ ] Color-code events by type
- [ ] Allow expanding an event to see details
