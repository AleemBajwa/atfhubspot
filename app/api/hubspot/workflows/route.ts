import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock workflow status data
    const workflows = [
      { id: 'wf1', name: 'Welcome Sequence', status: 'active' },
      { id: 'wf2', name: 'Re-engagement', status: 'paused' },
    ];
    return NextResponse.json({ workflows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 