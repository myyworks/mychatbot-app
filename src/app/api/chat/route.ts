mport { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as { message: string };
    const slug: string = request.nextUrl.searchParams.get('slug') || 'home';

    const { data: business, error } = await supabase
      .from('businesses')
      .select('name, faq_md, about_text')
      .eq('slug', slug)
      .single();

    if (error || !business) {
      return NextResponse.json({ reply: 'Sorry, we could not find this business.' });
    }

    const messages = [
      {
        role: 'system',
        content: `
You are a helpful assistant for "${business.name}".

About the business:
${business.about_text || ''}

FAQ:
${business.faq_md || ''}
        `.trim(),
      },
      {
        role: 'user',
        content: body.message,
      },
    ];

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = chat.choices?.[0]?.message?.content || 'No reply received.';
    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error("Server error:", err.message);
    return NextResponse.json({ reply: 'Server error occurred.' });
  }
}

