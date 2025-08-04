import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Get Supabase session/user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Store user message in Supabase
  const { data: userMessage, error: userMessageError } = await supabase
    .from('messages')
    .insert([{ user_id: user.id, text: message, is_bot: false }])
    .select();

  if (userMessageError) {
    console.error('Error saving user message:', userMessageError);
  } else {
    console.log('User message saved:', userMessage);
  }

  // Call Gemini 2.0 Flash API
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    }
  );

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error('Gemini API Error:', errText);
    return NextResponse.json(
      { error: 'Gemini API failed', details: errText },
      { status: 500 }
    );
  }

  const geminiData = await geminiRes.json();
  console.log('Gemini API response:', geminiData);

  const botReply =
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Sorry, no reply.';

  // Store bot reply in Supabase
  const { data: botMessage, error: botMessageError } = await supabase
    .from('messages')
    .insert([{ user_id: user.id, text: botReply, is_bot: true }])
    .select();

  if (botMessageError) {
    console.error('Error saving bot message:', botMessageError);
  } else {
    console.log('Bot message saved:', botMessage);
  }

  return NextResponse.json({ reply: botReply });
}
