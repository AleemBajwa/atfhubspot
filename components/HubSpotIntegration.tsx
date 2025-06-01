import React, { useState } from 'react';
import type { QualifiedLead } from './types';

interface HubSpotIntegrationProps {
  qualifiedLeads: QualifiedLead[];
}

const HubSpotIntegration: React.FC<HubSpotIntegrationProps> = ({ qualifiedLeads }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setError(null);
    try {
      const res = await fetch('/api/hubspot/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: qualifiedLeads }),
      });
      const data = await res.json();
      setSyncResult(data.message || 'Sync complete');
      if (data.error) setError(data.error);
    } catch (e: any) {
      setError('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
        onClick={handleSync}
        disabled={syncing || qualifiedLeads.length === 0}
      >
        {syncing ? 'Syncing...' : 'Sync Qualified Leads to HubSpot'}
      </button>
      {syncResult && <div className="text-green-600">{syncResult}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default HubSpotIntegration; 