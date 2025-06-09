'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SlugPage() {
  const params = useParams();
  const [slug, setSlug] = useState('loading...');
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fullSlug = Array.isArray(params?.slug) ? params.slug.join('/') : 'home';
    setSlug(fullSlug);
  }, [params]);

  const handleSend = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🤖 Chatbot for: {slug}</h1>
      <textarea
        rows={3}
        placeholder="Ask me anything..."
        style={{ width: '100%', marginBottom: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: 20 }}>
        <strong>Bot:</strong>
        <p>{reply}</p>
      </div>
    </div>
  );
}

