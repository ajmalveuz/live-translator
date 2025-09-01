import { NextResponse } from 'next/server';

export async function POST(request) {
  // Allow CORS for all origins
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const { text, model = 'mistral-small' } = await request.json();

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: `Transliterate the following text to English letters. Return ONLY the transliterated string, with no additional text, explanations, or formatting: ${text}` }],
      }),
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch from Mistral API' },
        { status: mistralResponse.status, headers }
      );
    }

    const data = await mistralResponse.json();
    return NextResponse.json({translitrated:data?.choices[0]?.message?.content||text,data:data}, { headers });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  const res = NextResponse.json({});
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "*");
  return res;
}
