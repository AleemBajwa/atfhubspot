"use client";
import React, { useState } from 'react';
import LeadUploadForm from '../../components/LeadUploadForm2';
import LeadQualificationAgent from '../../components/LeadQualificationAgent';
import HubSpotIntegration from '../../components/HubSpotIntegration';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import type { Lead, QualifiedLead } from '../../components/types';

export default function OutboundDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-4xl bg-card rounded-card shadow-card p-8 space-y-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-primary mb-6 text-center">
          AI All-Outbound Automation Dashboard
        </h1>
        <LeadUploadForm onLeadsParsed={setLeads} />
        {leads.length > 0 && (
          <LeadQualificationAgent leads={leads} onQualifiedLeads={setQualifiedLeads} />
        )}
        {qualifiedLeads.length > 0 && (
          <HubSpotIntegration qualifiedLeads={qualifiedLeads} />
        )}
        <AnalyticsDashboard />
      </div>
    </div>
  );
} 