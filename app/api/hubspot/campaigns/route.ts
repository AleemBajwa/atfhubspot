import { NextRequest, NextResponse } from 'next/server';

async function getHubSpotCampaigns(hubspotApiKey: string) {
  const response = await fetch('https://api.hubapi.com/marketing/v3/campaigns', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  const data = await response.json();
  return data.campaigns.map((campaign: any) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    type: campaign.type,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    budget: campaign.budget,
    spent: campaign.spent,
    metrics: {
      emailsSent: campaign.metrics?.emailsSent || 0,
      opens: campaign.metrics?.opens || 0,
      clicks: campaign.metrics?.clicks || 0,
      responses: campaign.metrics?.responses || 0,
      conversions: campaign.metrics?.conversions || 0,
      revenue: campaign.metrics?.revenue || 0
    }
  }));
}

async function createHubSpotCampaign(hubspotApiKey: string, campaign: any) {
  const response = await fetch('https://api.hubapi.com/marketing/v3/campaigns', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(campaign)
  });

  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }

  return response.json();
}

async function updateHubSpotCampaign(hubspotApiKey: string, campaignId: string, updates: any) {
  const response = await fetch(`https://api.hubapi.com/marketing/v3/campaigns/${campaignId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update campaign');
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const campaigns = await getHubSpotCampaigns(hubspotApiKey);
    return NextResponse.json({ campaigns });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const campaign = await req.json();
    const result = await createHubSpotCampaign(hubspotApiKey, campaign);
    return NextResponse.json({ campaign: result });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const { campaignId, updates } = await req.json();
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    const result = await updateHubSpotCampaign(hubspotApiKey, campaignId, updates);
    return NextResponse.json({ campaign: result });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
} 