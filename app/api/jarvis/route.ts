import { NextResponse } from 'next/server';

export const maxDuration = 60;

const SYSTEM = `You are the assistant inside Kene Okonjo's private operating system ("Kene OS"), acting as his chief of staff. He is the final decision-maker.
Rules:
- Use only the CONTEXT provided. If something is not in it, say you do not have it. Never invent figures, dates, people or business facts.
- Separate facts from your inferences and say which is which. Be concise and practical.
- You cannot send emails, edit records, make payments or publish anything from here. If asked, say so and offer a draft he can review.
- WAYKON Holdings is an unregistered brand and intent. Do not describe any venture as incorporated.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: 'The assistant is not connected yet. Add ANTHROPIC_API_KEY in the Vercel project settings.' }, { status: 503 });
  let body: { messages?: { role: 'user' | 'assistant'; content: string }[]; context?: string; name?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
  const messages = (body.messages ?? []).slice(-16).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') return NextResponse.json({ error: 'No message' }, { status: 400 });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: 900,
      system: `${SYSTEM}\nYour display name is ${body.name || 'Jarvis'}.\n\nCONTEXT\n${String(body.context ?? '').slice(0, 24000)}`,
      messages,
    }),
  });
  if (!r.ok) return NextResponse.json({ error: `The assistant request failed (${r.status}).` }, { status: 502 });
  const data = (await r.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  return NextResponse.json({ reply: text || 'No response.' });
}
