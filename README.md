# AI All-Outbound Automation Dashboard

A Next.js 15.3 + React 19 dashboard for uploading, qualifying, syncing, and analyzing outbound leads using AI and HubSpot CRM.

## Features
- CSV upload and validation for outbound leads
- AI-powered lead qualification (mocked, ready for OpenAI integration)
- Sync qualified leads to HubSpot (mocked, ready for API integration)
- Real-time analytics dashboard (auto-refresh)
- Modern UI with Tailwind CSS v4, shadcn/ui, and Recharts
- Robust error handling and validation

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Environment Variables
Create a `.env.local` file for API keys (when integrating real APIs):
```
HUBSPOT_API_KEY=your-hubspot-key
OPENAI_API_KEY=your-openai-key
SERPER_API_KEY=your-serper-key
```

### 4. Usage
- Upload a CSV of leads (see `docs/leads_sample.csv` for format)
- Qualify leads with AI
- Sync qualified leads to HubSpot
- View analytics

## Deployment
- Push your code to GitHub
- Deploy on [Vercel](https://vercel.com/) (recommended, see `docs/manual.md` for step-by-step)
- Set environment variables in Vercel dashboard

## Documentation & Handover
- See `docs/manual.md` for full project manual, setup, and handover instructions

## Support
- For issues, check the manual or contact the developer
