import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = request.headers.get('x-chatbot-slug') || 'default';

    // Fetch business data from Supabase
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
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return NextResponse.json({ reply: `OpenAI error: ${data.error?.message}` });
    }

    const reply = data?.choices?.[0]?.message?.content || 'No reply received.';
    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error('Server error:', err.message || err);
    return NextResponse.json({ reply: 'Server error occurred.' });
  }
}

