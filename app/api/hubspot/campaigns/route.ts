import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock campaign data
    const campaigns = [
      { id: '1', name: 'Spring Launch', status: 'active' },
      { id: '2', name: 'Summer Sale', status: 'completed' },
    ];
    return NextResponse.json({ campaigns });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 