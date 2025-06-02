import { NextRequest, NextResponse } from 'next/server';
import type { Lead, QualifiedLead } from '@/components/types';

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

async function getCompanyIntelligence(company: string, serperApiKey: string) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': serperApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: `${company} company news funding technology stack`,
      num: 5
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch company intelligence');
  }

  const data = await response.json();
  return {
    recentNews: data.news?.slice(0, 3).map((n: any) => n.title).join('; ') || 'No recent news found',
    techStack: data.knowledge_graph?.technologies?.join(', ') || 'Tech stack unknown',
    fundingStatus: data.knowledge_graph?.funding || 'Funding status unknown',
    growthIndicators: data.knowledge_graph?.growth_indicators || 'Growth indicators unknown',
    competitorAnalysis: data.knowledge_graph?.competitors?.join(', ') || 'Competitors unknown'
  };
}

async function qualifyLeadWithAI(lead: Lead, openaiApiKey: string, serperApiKey: string): Promise<QualifiedLead> {
  const startTime = Date.now();
  
  // Get company intelligence first
  const intelligence = await getCompanyIntelligence(lead.company, serperApiKey);
  
  // Prepare the prompt for OpenAI
  const prompt = `Analyze this lead and provide a qualification score (1-10) and detailed reasoning:
Lead Information:
- Name: ${lead.firstName} ${lead.lastName}
- Title: ${lead.title}
- Company: ${lead.company}
- Industry: ${lead.industry || 'Unknown'}
- Company Size: ${lead.companySize || 'Unknown'}
- Location: ${lead.location || 'Unknown'}

Company Intelligence:
- Recent News: ${intelligence.recentNews}
- Tech Stack: ${intelligence.techStack}
- Funding Status: ${intelligence.fundingStatus}
- Growth Indicators: ${intelligence.growthIndicators}
- Competitors: ${intelligence.competitorAnalysis}

Please analyze this information and provide:
1. A qualification score from 1-10 (where 10 is most qualified)
2. A detailed qualification reason
3. A confidence level from 0-1
4. Any additional insights about the lead's potential

Format your response as JSON:
{
  "score": number,
  "reason": string,
  "confidence": number,
  "insights": string
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to qualify lead with AI');
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);

  return {
    ...lead,
    qualificationScore: result.score,
    qualificationReason: result.reason,
    confidenceLevel: result.confidence,
    companyIntelligence: result.insights,
    recentNews: intelligence.recentNews,
    techStack: intelligence.techStack,
    fundingStatus: intelligence.fundingStatus,
    growthIndicators: intelligence.growthIndicators,
    competitorAnalysis: intelligence.competitorAnalysis,
    qualifiedAt: new Date(),
    processingTime: Date.now() - startTime
  };
}

export async function POST(req: NextRequest) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const serperApiKey = process.env.SERPER_API_KEY;

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    if (!serperApiKey) {
      throw new Error('SERPER_API_KEY environment variable is not set');
    }

    const { leads } = await req.json();
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'Payload must include a non-empty leads array.' }, { status: 400 });
    }

    const validLeads: Lead[] = [];
    const errors: string[] = [];
    const qualificationResults: { success: boolean; email: string; error?: string }[] = [];

    // Validate all leads first
    leads.forEach((lead: any, idx: number) => {
      const { valid, errors: leadErrors } = validateLead(lead);
      if (valid) {
        validLeads.push(lead);
      } else {
        errors.push(`Row ${idx + 1}: ${leadErrors.join(', ')}`);
      }
    });

    if (validLeads.length === 0) {
      return NextResponse.json({ error: 'No valid leads found.', errors }, { status: 400 });
    }

    // Qualify each lead
    const qualifiedLeads: QualifiedLead[] = [];
    for (const lead of validLeads) {
      try {
        const qualifiedLead = await qualifyLeadWithAI(lead, openaiApiKey, serperApiKey);
        qualifiedLeads.push(qualifiedLead);
        qualificationResults.push({ success: true, email: lead.email });
      } catch (error: any) {
        qualificationResults.push({ 
          success: false, 
          email: lead.email, 
          error: error.message || 'Failed to qualify lead'
        });
        errors.push(`Failed to qualify ${lead.email}: ${error.message}`);
      }
    }

    const successCount = qualificationResults.filter(r => r.success).length;
    const failureCount = qualificationResults.filter(r => !r.success).length;

    return NextResponse.json({ 
      qualifiedLeads,
      message: `Qualified ${successCount} leads (${failureCount} failed).`,
      qualificationResults,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || 'Server error',
      details: e.stack
    }, { status: 500 });
  }
} 