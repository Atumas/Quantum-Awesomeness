import { NextResponse } from 'next/server';
import { TEMPLATE_MARKETPLACE } from '@/lib/templates/marketplace';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(TEMPLATE_MARKETPLACE);
}
