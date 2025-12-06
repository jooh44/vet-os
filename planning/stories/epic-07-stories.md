# Epic 07 Stories: Market Intelligence (Farejador)

## Story 7.1: Farejador Onboarding
**As a** Clinic Owner
**I want to** set my location and identify my clinic
**So that** the system knows who to compare me against.

**Acceptance Criteria:**
- [ ] Search Google Places API for "My Clinic"
- [ ] Confirm location map
- [ ] Save Clinic Place ID and Coordinates
- [ ] Trigger initial competitor scan

---

## Story 7.2: Competitor Discovery Service
**As a** System
**I want to** find veterinary clinics near the user
**So that** we can build the competitor list.

**Acceptance Criteria:**
- [ ] Search "Veterinary" in 5km radius via Google Places
- [ ] Filter out the user's own clinic
- [ ] Store top 5-10 competitors in DB
- [ ] Fetch details (Rating, Review Count, Address)

---

## Story 7.3: Daily Monitoring Job
**As a** System
**I want to** check for changes in competitors daily
**So that** I can report trends.

**Acceptance Criteria:**
- [ ] CRON Job at 06:00 AM
- [ ] Fetch fresh data for stored competitors
- [ ] Compare with previous day's snapshot
- [ ] Detect changes (Rating up/down, New reviews)
- [ ] Save "Daily Insight" record

---

## Story 7.4: "Jornal do Fred" Email
**As a** Clinic Owner
**I want to** receive a daily summary email
**So that** I start my day informed about the market.

**Acceptance Criteria:**
- [ ] Generate HTML Email template "Jornal do Fred"
- [ ] Populate with Daily Insight data
- [ ] Send via email provider
- [ ] Link to dashboard for full view
