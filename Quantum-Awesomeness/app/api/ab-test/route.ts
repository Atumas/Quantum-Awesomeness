import { NextResponse } from 'next/server';
import { generateABVariants } from '@/lib/ab-testing';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json();
  const { code, count } = body || {};

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Missing base code' }, { status: 400 });
  }

  const variants = await generateABVariants(code, Number(count) || 3);
  return NextResponse.json(variants);
}
