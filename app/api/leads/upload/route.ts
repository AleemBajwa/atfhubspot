import { NextRequest, NextResponse } from 'next/server';
import type { Lead } from '@/components/types';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLead(lead: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof lead.firstName !== 'string' || !lead.firstName.trim()) errors.push('Missing firstName');
  if (typeof lead.lastName !== 'string' || !lead.lastName.trim()) errors.push('Missing lastName');
  if (typeof lead.email !== 'string' || !isValidEmail(lead.email)) errors.push('Invalid or missing email');
  if (typeof lead.company !== 'string' || !lead.company.trim()) errors.push('Missing company');
  if (typeof lead.title !== 'string' || !lead.title.trim()) errors.push('Missing title');
  return { valid: errors.length === 0, errors };
}

export async function POST(req: NextRequest) {
  try {
    const { leads } = await req.json();
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Payload must include a non-empty leads array.' }, { status: 400 });
    }
    const validLeads: Lead[] = [];
    const errors: string[] = [];
    leads.forEach((lead: any, idx: number) => {
      const { valid, errors: leadErrors } = validateLead(lead);
      if (valid) {
        validLeads.push(lead);
      } else {
        errors.push(`Row ${idx + 1}: ${leadErrors.join(', ')}`);
      }
    });
    if (validLeads.length === 0) {
      return NextResponse.json({ status: 'error', message: 'No valid leads found.', errors }, { status: 400 });
    }
    // Placeholder for storage: in-memory array (not persisted)
    return NextResponse.json({
      status: 'success',
      validCount: validLeads.length,
      invalidCount: errors.length,
      errors,
      message: `Processed ${leads.length} leads: ${validLeads.length} valid, ${errors.length} invalid.`
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message || 'Server error' }, { status: 500 });
  }
} 