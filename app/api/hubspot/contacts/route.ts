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

export async function POST(req: NextRequest) {
  try {
    const { contacts } = await req.json();
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Payload must include a non-empty contacts array.' }, { status: 400 });
    }
    const validContacts: HubSpotContact[] = [];
    const errors: string[] = [];
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
    // Mock sync logic
    const syncedCount = validContacts.length;
    return NextResponse.json({ message: `Synced ${syncedCount} contacts to HubSpot (mock).`, errors });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 