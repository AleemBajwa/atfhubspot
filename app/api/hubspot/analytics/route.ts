import { NextRequest, NextResponse } from 'next/server';

async function getHubSpotAnalytics(hubspotApiKey: string) {
  // Get email analytics
  const emailResponse = await fetch('https://api.hubapi.com/marketing/v3/statistics/email', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!emailResponse.ok) {
    throw new Error('Failed to fetch email analytics');
  }

  const emailData = await emailResponse.json();

  // Get contact analytics
  const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/analytics', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!contactResponse.ok) {
    throw new Error('Failed to fetch contact analytics');
  }

  const contactData = await contactResponse.json();

  // Get deal analytics
  const dealResponse = await fetch('https://api.hubapi.com/crm/v3/objects/deals/analytics', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!dealResponse.ok) {
    throw new Error('Failed to fetch deal analytics');
  }

  const dealData = await dealResponse.json();

  // Calculate metrics
  const totalEmails = emailData.total || 0;
  const deliveredEmails = emailData.delivered || 0;
  const openedEmails = emailData.opened || 0;
  const clickedEmails = emailData.clicked || 0;
  const respondedEmails = emailData.responded || 0;
  const totalContacts = contactData.total || 0;
  const qualifiedContacts = contactData.qualified || 0;
  const totalDeals = dealData.total || 0;
  const wonDeals = dealData.won || 0;
  const totalDealValue = dealData.totalValue || 0;
  const marketingSpend = dealData.marketingSpend || 0;

  return {
    emailDeliveryRate: totalEmails ? (deliveredEmails / totalEmails) * 100 : 0,
    openRate: deliveredEmails ? (openedEmails / deliveredEmails) * 100 : 0,
    clickThroughRate: openedEmails ? (clickedEmails / openedEmails) * 100 : 0,
    responseRate: deliveredEmails ? (respondedEmails / deliveredEmails) * 100 : 0,
    qualificationSuccessRate: totalContacts ? (qualifiedContacts / totalContacts) * 100 : 0,
    campaignROI: marketingSpend ? (totalDealValue / marketingSpend) : 0,
    conversionRate: totalContacts ? (wonDeals / totalContacts) * 100 : 0,
    // Additional metrics
    totalEmails,
    deliveredEmails,
    openedEmails,
    clickedEmails,
    respondedEmails,
    totalContacts,
    qualifiedContacts,
    totalDeals,
    wonDeals,
    totalDealValue,
    marketingSpend,
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