# Epic 07: Market Intelligence (Farejador)

**Status:** Draft
**Priority:** Critical (Differentiation)
**Owner:** Data Analyst

## Goal
Empower veterinarians with insights about their local market and competitors using automated public data monitoring.

## Description
The "Farejador" monitors competitors' public digital footprint (Google Maps, Social Media) and generates daily insights. It includes the onboarding flow to locate the user's clinic and the recurring monitoring jobs.

## Scope
### In Scope
- Farejador Onboarding (Locate Clinic, Verify)
- Competitor Discovery (Google Place Search - Gemini Grounding)
- Daily Monitoring Job (CRON)
- "Jornal do Fred" Daily Report Generation and Email
- Market Intelligence Dashboard (Competitor list, metrics)

### Out of Scope
- Deep firecrawl scraping (Phase 2)
- Paid social media metrics (Phase 2)

## Key Stories
- [ ] Implement Farejador Onboarding Flow
- [ ] Create Competitor Discovery Service
- [ ] Build Competitor Monitoring Dashboard
- [ ] Implement Daily "Jornal do Fred" Email Job
- [ ] Integrate Gemini Grounding for Market Data

## Dependencies
- Epic 01 (CRON jobs, Gemini Keys)
