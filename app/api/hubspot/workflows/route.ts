import { NextRequest, NextResponse } from 'next/server';

async function getHubSpotWorkflows(hubspotApiKey: string) {
  const response = await fetch('https://api.hubapi.com/automation/v3/workflows', {
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workflows');
  }

  const data = await response.json();
  return data.workflows.map((workflow: any) => ({
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
    type: workflow.type,
    lastUpdated: workflow.updatedAt,
    metrics: {
      contactsEnrolled: workflow.metrics?.contactsEnrolled || 0,
      contactsCompleted: workflow.metrics?.contactsCompleted || 0,
      contactsActive: workflow.metrics?.contactsActive || 0,
      emailsSent: workflow.metrics?.emailsSent || 0,
      emailsOpened: workflow.metrics?.emailsOpened || 0,
      emailsClicked: workflow.metrics?.emailsClicked || 0,
      conversions: workflow.metrics?.conversions || 0
    },
    settings: {
      triggerType: workflow.settings?.triggerType,
      enrollmentTrigger: workflow.settings?.enrollmentTrigger,
      targetList: workflow.settings?.targetList,
      frequency: workflow.settings?.frequency,
      timezone: workflow.settings?.timezone
    }
  }));
}

async function createHubSpotWorkflow(hubspotApiKey: string, workflow: any) {
  const response = await fetch('https://api.hubapi.com/automation/v3/workflows', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workflow)
  });

  if (!response.ok) {
    throw new Error('Failed to create workflow');
  }

  return response.json();
}

async function updateHubSpotWorkflow(hubspotApiKey: string, workflowId: string, updates: any) {
  const response = await fetch(`https://api.hubapi.com/automation/v3/workflows/${workflowId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update workflow');
  }

  return response.json();
}

async function toggleHubSpotWorkflow(hubspotApiKey: string, workflowId: string, action: 'activate' | 'deactivate') {
  const response = await fetch(`https://api.hubapi.com/automation/v3/workflows/${workflowId}/${action}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} workflow`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const workflows = await getHubSpotWorkflows(hubspotApiKey);
    return NextResponse.json({ workflows });
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

    const workflow = await req.json();
    const result = await createHubSpotWorkflow(hubspotApiKey, workflow);
    return NextResponse.json({ workflow: result });
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

    const { workflowId, updates } = await req.json();
    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 });
    }

    const result = await updateHubSpotWorkflow(hubspotApiKey, workflowId, updates);
    return NextResponse.json({ workflow: result });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    const { workflowId, action } = await req.json();
    if (!workflowId || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json({ 
        error: 'Workflow ID and valid action (activate/deactivate) are required' 
      }, { status: 400 });
    }

    const result = await toggleHubSpotWorkflow(hubspotApiKey, workflowId, action as 'activate' | 'deactivate');
    return NextResponse.json({ workflow: result });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
} 