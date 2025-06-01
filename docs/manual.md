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
| Project initialization                 | Complete    |                              |
| Dependency installation                | Complete    | Tailwind, shadcn/ui, recharts, papaparse, react-dropzone@13, @types installed |
| LeadUploadForm                         | Complete    | CSV parsing, preview, upload, error handling implemented |
| /api/leads/upload                      | Complete    | Endpoint created, validation logic implemented |
| LeadQualificationAgent                 | Complete    | UI, API integration, qualification logic, parent integration |
| /api/leads/qualify                     | Complete    | Endpoint created, mock logic implemented |
| HubSpotIntegration                     | Complete    | UI, API integration, parent integration |
| /api/hubspot/contacts                  | Complete    | Endpoint created, mock logic implemented |
| /api/hubspot/campaigns                 | Complete    | Endpoint created, mock data implemented |
| /api/hubspot/analytics                 | Complete    | Endpoint created, mock data implemented |
| /api/hubspot/workflows                 | Complete    | Endpoint created, mock data implemented |
| AnalyticsDashboard                     | Complete    | Component created, integrated in main page |
| ErrorBoundary (UI error handling)      | Complete    | Component created, integrated in main page |
| Real-time updates                      | Complete    | Analytics auto-refresh every 10s           |
| Error handling/validation              | Complete    | Frontend and backend validation, error boundaries |
| Deployment                             | In progress | Vercel via GitHub, see instructions below  |
| Documentation                          | In progress | Manual updated                             |

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
- Push your code to GitHub:
  1. `git init`
  2. `git add .`
  3. `git commit -m "Initial commit"`
  4. Create a new repo on GitHub (via the website)
  5. `git remote add origin https://github.com/your-username/your-repo.git`
  6. `git push -u origin main`
- Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
- Click "New Project" and import your GitHub repository.
- Accept the defaults and click "Deploy".
- Add environment variables in Vercel dashboard when you integrate real APIs.
- Every push to GitHub will auto-deploy to Vercel.

---

## 9. Change Log / What's Done & What's Left
- Tailwind CSS configured manually (CLI issues on Windows)
- Project structure created: components/, app/api/, utils/
- LeadUploadForm component: drag-and-drop, CSV parsing (papaparse), preview, error handling, upload to API
- react-dropzone downgraded to v13.0.0 for useDropzone hook compatibility
- API endpoint /api/leads/upload scaffolded and implemented
- TypeScript interfaces for Lead and QualifiedLead defined
- LeadQualificationAgent component and /api/leads/qualify endpoint implemented
- HubSpotContact interface, HubSpotIntegration component, and /api/hubspot/contacts endpoint implemented
- Main flow integrated: Upload -> Qualify -> Sync
- All HubSpot endpoints scaffolded with mock data
- AnalyticsDashboard component created and integrated
- ErrorBoundary component created and integrated for UI error handling
- Real-time updates (auto-refresh for analytics) implemented
- Deployment instructions for Vercel via GitHub added

---

**Keep this document updated as the project progresses. Feed it back to the AI for context at any time.** 