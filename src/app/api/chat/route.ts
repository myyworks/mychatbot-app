import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
    A    messages: [{ role: 'user', content: message }],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔴 OpenAI API error:", data);
      return NextResponse.json({ reply: `OpenAI error: ${data.error?.message}` });
    }

    const reply = data?.choices?.[0]?.message?.content || 'No reply received.';
    return NextResponse.json({ reply });

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: message }],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔴 OpenAI API error:", data);
      return NextResponse.json({ reply: `OpenAI error: ${data.error?.message}` });
    }

    const reply = data?.choices?.[0]?.message?.content || 'No reply received.';
    return NextResponse.json({ reply });

  } catch (err) {
    console.error("🔴 Server error:", (err as Error).message || err);
    return NextResponse.json({ reply: "Server error occurred." });
  }
}

