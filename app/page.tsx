"use client";
import React, { useState } from "react";
import LeadUploadForm from "../components/LeadUploadForm2";
import LeadQualificationAgent from "../components/LeadQualificationAgent";
import HubSpotIntegration from "../components/HubSpotIntegration";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import TestComponent from "./TestComponent";
import type { Lead, QualifiedLead } from "../components/types";

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>([]);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-4">AI All-Outbound Automation Dashboard</h1>
      <LeadUploadForm onLeadsParsed={setLeads} />
      {leads.length > 0 && (
        <LeadQualificationAgent leads={leads} onQualifiedLeads={setQualifiedLeads} />
      )}
      {qualifiedLeads.length > 0 && (
        <HubSpotIntegration qualifiedLeads={qualifiedLeads} />
      )}
      <AnalyticsDashboard />
      <TestComponent />
    </div>
  );
}
