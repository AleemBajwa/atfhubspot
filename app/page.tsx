"use client";
import React, { useState } from "react";
import LeadUploadForm from "../components/LeadUploadForm2";
import LeadQualificationAgent from "../components/LeadQualificationAgent";
import HubSpotIntegration from "../components/HubSpotIntegration";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import type { Lead, QualifiedLead } from "../components/types";

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>([]);

  return (
    <main className="min-h-screen bg-[#f5f7fa] py-10 px-2 font-sans">
      <div className="flex flex-col gap-10 items-center">
        {/* Upload Leads Card */}
        <section className="relative bg-white rounded-3xl shadow-card border border-gray-100 p-8 max-w-xl w-full mx-auto flex flex-col gap-6 transition-all duration-300 hover:shadow-card-hover">
          <div className="absolute left-0 top-6 h-12 w-1.5 rounded-full bg-[#00b8ff]" />
          <div className="flex items-center gap-3 mb-2 pl-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2b49] tracking-tight">Upload Leads</h1>
          </div>
          <p className="text-gray-500 text-base mb-2 pl-6">Upload your CSV file to begin the AI-powered lead qualification process.</p>
          <div className="pl-6">
            <LeadUploadForm onLeadsParsed={setLeads} />
          </div>
          {leads.length > 0 && (
            <div className="mt-6 pl-6">
              <LeadQualificationAgent leads={leads} onQualifiedLeads={setQualifiedLeads} />
            </div>
          )}
          {qualifiedLeads.length > 0 && (
            <div className="mt-6 pl-6">
              <HubSpotIntegration qualifiedLeads={qualifiedLeads} />
            </div>
          )}
        </section>
        {/* Analytics Dashboard Card */}
        <section className="relative bg-white rounded-3xl shadow-card border border-gray-100 p-8 max-w-6xl w-full mx-auto flex flex-col gap-6 transition-all duration-300 hover:shadow-card-hover">
          <div className="absolute left-0 top-6 h-12 w-1.5 rounded-full bg-[#1a2b49]" />
          <div className="flex items-center gap-3 mb-2 pl-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2b49] tracking-tight">Analytics Dashboard</h2>
          </div>
          <p className="text-gray-500 text-base mb-2 pl-6">Real-time metrics and performance indicators.</p>
          <div className="pl-6">
            <AnalyticsDashboard />
          </div>
        </section>
      </div>
    </main>
  );
}
