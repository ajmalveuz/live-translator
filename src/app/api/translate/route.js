import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

export async function POST(req) {
  try {
    const { text, target = "en" } = await req.json();

    const result = await translate(text, { to: target });

    const res = NextResponse.json({
      original: text,
      translated: result.text,
      detectedLang: result.from.language.iso,
    });

    // Allow all origins
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "*");

    return res;
  } catch (err) {
    console.error(err);
    const res = NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  const res = NextResponse.json({});
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "*");
  return res;
}
