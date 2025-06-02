import { NextRequest, NextResponse } from 'next/server';
import type { HubSpotContact } from '@/components/types';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact(contact: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof contact.email !== 'string' || !isValidEmail(contact.email)) errors.push('Invalid or missing email');
  if (typeof contact.firstname !== 'string' || !contact.firstname.trim()) errors.push('Missing firstname');
  if (typeof contact.lastname !== 'string' || !contact.lastname.trim()) errors.push('Missing lastname');
  if (typeof contact.company !== 'string' || !contact.company.trim()) errors.push('Missing company');
  if (typeof contact.jobtitle !== 'string' || !contact.jobtitle.trim()) errors.push('Missing jobtitle');
  return { valid: errors.length === 0, errors };
}

async function createHubSpotContact(contact: HubSpotContact) {
  const hubspotApiKey = process.env.HUBSPOT_API_KEY;
  if (!hubspotApiKey) {
    throw new Error('HUBSPOT_API_KEY environment variable is not set');
  }

  const properties = {
    email: contact.email,
    firstname: contact.firstname,
    lastname: contact.lastname,
    company: contact.company,
    jobtitle: contact.jobtitle,
    phone: contact.phone,
    website: contact.website,
    industry: contact.industry,
    lead_qualification_score: contact.lead_qualification_score?.toString(),
    qualification_reason: contact.qualification_reason,
    lead_source: 'AI All-Outbound Automation',
    created_by_automation: true,
    last_qualification_date: new Date().toISOString(),
    company_intelligence: contact.company_intelligence
  };

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ properties })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`HubSpot API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { contacts } = await req.json();
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Payload must include a non-empty contacts array.' }, { status: 400 });
    }

    const validContacts: HubSpotContact[] = [];
    const errors: string[] = [];
    const syncResults: { success: boolean; email: string; error?: string }[] = [];

    // Validate all contacts first
    contacts.forEach((contact: any, idx: number) => {
      const { valid, errors: contactErrors } = validateContact(contact);
      if (valid) {
        validContacts.push(contact);
      } else {
        errors.push(`Row ${idx + 1}: ${contactErrors.join(', ')}`);
      }
    });

    if (validContacts.length === 0) {
      return NextResponse.json({ error: 'No valid contacts found.', errors }, { status: 400 });
    }

    // Sync each contact to HubSpot
    for (const contact of validContacts) {
      try {
        await createHubSpotContact(contact);
        syncResults.push({ success: true, email: contact.email });
      } catch (error: any) {
        syncResults.push({ 
          success: false, 
          email: contact.email, 
          error: error.message || 'Failed to sync contact'
        });
        errors.push(`Failed to sync ${contact.email}: ${error.message}`);
      }
    }

    const successCount = syncResults.filter(r => r.success).length;
    const failureCount = syncResults.filter(r => !r.success).length;

    return NextResponse.json({ 
      message: `Synced ${successCount} contacts to HubSpot (${failureCount} failed).`,
      syncResults,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
} 