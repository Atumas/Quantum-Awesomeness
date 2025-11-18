import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.error('Client error report:', body);
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
