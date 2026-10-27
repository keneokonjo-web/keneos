import { NextResponse } from 'next/server';

// Reports which server-side features are configured. Never returns secret values.
export async function GET() {
  return NextResponse.json({ assistant: Boolean(process.env.ANTHROPIC_API_KEY), account: Boolean(process.env.OWNER_PASSWORD_HASH) });
}
