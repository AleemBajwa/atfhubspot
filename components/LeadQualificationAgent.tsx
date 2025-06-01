import React, { useState } from 'react';
import type { Lead, QualifiedLead } from './types';

interface LeadQualificationAgentProps {
  leads: Lead[];
  onQualifiedLeads?: (qualifiedLeads: QualifiedLead[]) => void;
}

const LeadQualificationAgent: React.FC<LeadQualificationAgentProps> = ({ leads, onQualifiedLeads = () => {} }) => {
  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQualify = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leads/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads }),
      });
      const data = await res.json();
      setQualifiedLeads(data.qualifiedLeads || []);
      onQualifiedLeads(data.qualifiedLeads || []);
      if (data.error) setError(data.error);
    } catch (e: any) {
      setError('Qualification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        onClick={handleQualify}
        disabled={loading || leads.length === 0}
      >
        {loading ? 'Qualifying...' : 'Qualify Leads'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {qualifiedLeads.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Qualified Leads</h3>
          <ul className="list-disc pl-5">
            {qualifiedLeads.map((ql, i) => (
              <li key={i}>
                <span className="font-bold">{ql.firstName} {ql.lastName}</span> - Score: {ql.qualificationScore} - {ql.qualificationReason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeadQualificationAgent; 