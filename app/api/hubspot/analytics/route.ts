import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock analytics data
    const analytics = {
      emailDeliveryRate: 98.5,
      openRate: 45.2,
      clickThroughRate: 12.1,
      responseRate: 8.7,
      qualificationSuccessRate: 67.3,
      campaignROI: 3.5,
      conversionRate: 22.4,
    };
    return NextResponse.json({ analytics });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 