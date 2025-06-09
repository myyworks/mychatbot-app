import { supabase } from '@/lib/supabase';

...

const slug = request.nextUrl.searchParams.get('slug') || 'home';

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

