# AI All-Outbound Automation Dashboard – Project Manual

---

## 1. Project Overview
A Next.js 15.3 + React 19 dashboard for uploading, qualifying, syncing, and analyzing outbound leads using AI and HubSpot CRM.

---

## 2. Requirements

### A. From Client (You)
- OpenAI GPT-4.1 mini API key
- Serper API key
- HubSpot CRM API key (v3/v4) or OAuth credentials
- HubSpot account with required permissions
- Sample CSV file with lead data
- Branding assets (logo, color scheme, UI preferences)
- Hosting/deployment preferences (Vercel, AWS, etc.)
- Feedback availability for reviews and clarifications
- (Optional) Analytics/tracking codes

### B. From Developer
- Set up Next.js 15.3 + React 19 project with TypeScript
- Integrate Tailwind CSS v4, shadcn/ui, Recharts
- Implement CSV upload (react-dropzone, papaparse)
- Build API routes for upload, qualification, HubSpot sync, analytics
- Integrate OpenAI, Serper, and HubSpot APIs
- Implement real-time analytics dashboard (WebSocket, Recharts)
- Robust error handling, validation, and feedback
- Write and maintain documentation

---

## 3. Implementation Plan

### A. Initial Setup
- [ ] Initialize Next.js 15.3 + React 19 project with TypeScript
- [ ] Install dependencies (Tailwind, shadcn/ui, Recharts, react-dropzone, papaparse, etc.)
- [ ] Set up project structure (components, API routes, utils, etc.)

### B. Lead Upload Module
- [ ] Build `LeadUploadForm` component (drag-and-drop, CSV validation, preview)
- [ ] Implement `/api/leads/upload` endpoint (batch processing, error handling)
- [ ] TypeScript interfaces for leads

### C. Lead Qualification Agent
- [ ] Build `LeadQualificationAgent` component
- [ ] Integrate Langchain/Langgraph SDK, OpenAI GPT-4.1 mini, Serper API
- [ ] Implement `/api/leads/qualify` endpoint (scoring, reasoning, metadata)
- [ ] TypeScript interfaces for qualified leads

### D. HubSpot CRM Integration
- [ ] Build `HubSpotIntegration` component
- [ ] Integrate HubSpot API v3/v4 (contacts, campaigns, analytics, workflows)
- [ ] Implement endpoints: `/api/hubspot/contacts`, `/api/hubspot/campaigns`, `/api/hubspot/analytics`, `/api/hubspot/workflows`
- [ ] TypeScript interfaces for HubSpot contacts

### E. Analytics Dashboard
- [ ] Build `AnalyticsDashboard` component (overview, metrics, charts)
- [ ] Integrate real-time updates (WebSocket, auto-refresh)
- [ ] Implement metrics tracking and visualization

### F. Error Handling & Validation
- [ ] Implement robust error boundaries (React 19)
- [ ] Add form and API validation

### G. Deployment
- [ ] Prepare for deployment (Vercel, AWS, etc.)
- [ ] Set up environment variables for API keys
- [ ] Finalize domain and hosting

### H. Documentation & Handover
- [ ] Write setup, usage, and troubleshooting documentation
- [ ] Prepare handover checklist

---

## 4. Progress Tracker

| Task                                  | Status      | Notes                        |
|----------------------------------------|-------------|------------------------------|
| Project initialization                 | Not started |                              |
| Dependency installation                | Not started |                              |
| LeadUploadForm                         | Not started |                              |
| /api/leads/upload                      | Not started |                              |
| LeadQualificationAgent                 | Not started |                              |
| /api/leads/qualify                     | Not started |                              |
| HubSpotIntegration                     | Not started |                              |
| /api/hubspot/* endpoints               | Not started |                              |
| AnalyticsDashboard                     | Not started |                              |
| Real-time updates                      | Not started |                              |
| Error handling/validation              | Not started |                              |
| Deployment                             | Not started |                              |
| Documentation                          | Not started |                              |

---

## 5. Setup & Usage Instructions
(To be filled as development progresses)

---

## 6. API Keys & Credentials Checklist
| Service      | Key/Token/Secret | Provided (Y/N) |
|--------------|------------------|----------------|
| OpenAI       |                  |                |
| Serper       |                  |                |
| HubSpot      |                  |                |

---

## 7. Sample Data
**Lead CSV Example:**
```csv
firstName,lastName,email,company,title,phone,website,industry,companySize,location
John,Doe,john@company.com,Company Inc.,CTO,1234567890,www.company.com,Tech,100,NY
```

---

## 8. Deployment & Handover
- Steps for deploying to chosen platform
- How to set environment variables
- How to update API keys
- How to run locally and in production

---

## 9. Change Log / What's Done & What's Left
(To be updated as work progresses)

---

**Keep this document updated as the project progresses. Feed it back to the AI for context at any time.** 