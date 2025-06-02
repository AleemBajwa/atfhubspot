import { NextRequest, NextResponse } from 'next/server';

async function getHubSpotAnalytics(hubspotApiKey: string) {
  // Get contact analytics
  const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!contactResponse.ok) {
    throw new Error('Failed to fetch contact analytics');
  }

  const contactData = await contactResponse.json();
  const totalContacts = contactData.total || 0;
  // No direct qualifiedContacts field, so set to 0 or estimate if you have a property
  const qualifiedContacts = 0;

  // Get deal analytics
  const dealResponse = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!dealResponse.ok) {
    throw new Error('Failed to fetch deal analytics');
  }

  const dealData = await dealResponse.json();
  const totalDeals = dealData.total || 0;
  // No direct wonDeals, totalDealValue, marketingSpend fields, so set to 0 or estimate if you have properties
  const wonDeals = 0;
  const totalDealValue = 0;
  const marketingSpend = 0;

  // Workflows analytics (optional, if you want to fetch workflows count)
  let totalWorkflows = null;
  try {
    const workflowResponse = await fetch('https://api.hubapi.com/automation/v3/workflows', {
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (workflowResponse.ok) {
      const workflowData = await workflowResponse.json();
      totalWorkflows = Array.isArray(workflowData.workflows) ? workflowData.workflows.length : null;
    }
  } catch (e) {
    totalWorkflows = null;
  }

  return {
    // Email analytics not available on this plan
    emailAnalyticsAvailable: false,
    emailAnalyticsMessage: 'Email analytics are not available on your current HubSpot plan.',
    emailDeliveryRate: null,
    openRate: null,
    clickThroughRate: null,
    responseRate: null,
    // Contacts & deals
    qualificationSuccessRate: totalContacts ? (qualifiedContacts / totalContacts) * 100 : 0,
    campaignROI: marketingSpend ? (totalDealValue / marketingSpend) : 0,
    conversionRate: totalContacts ? (wonDeals / totalContacts) * 100 : 0,
    totalContacts,
    qualifiedContacts,
    totalDeals,
    wonDeals,
    totalDealValue,
    marketingSpend,
    totalWorkflows,
    lastUpdated: new Date().toISOString()
  };
}

export async function GET(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const analytics = await getHubSpotAnalytics(hubspotApiKey);
    return NextResponse.json({ analytics });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
} 