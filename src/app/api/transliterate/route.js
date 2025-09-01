import { NextResponse } from "next/server";

export async function POST(request) {
  // Allow CORS for all origins
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  try {
    const {
      text,
      model = "gpt-oss-120b",
      temperature = 0.7,
      max_tokens = 512,
    } = await request.json();

    const cerebras = await fetch(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: `Transliterate the following text to English letters. Return ONLY the transliterated string, with no additional text, explanations, or formatting: ${text}`,
            },
          ],
          temperature,
          max_tokens,
        }),
      }
    );
    console.log("respomse", cerebras);
    if (!cerebras.ok) {
      const errorData = await cerebras.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch from Mistral API" },
        { status: cerebras.status, headers }
      );
    }

    const data = await cerebras.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() ?? text;

    return NextResponse.json(
      { translitrated: answer || text, data: data },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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
