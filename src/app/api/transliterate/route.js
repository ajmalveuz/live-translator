// app/api/transliterate/route.js
import translate from 'google-translate-api-x';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests (CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Handle GET (health check or simple test)
export async function GET() {
  return Response.json(
    {
      message: 'Transliteration API is running. Use POST to transliterate text.',
      supported: 'All languages via Google Translate',
    },
    { headers: corsHeaders }
  );
}

// Handle POST (main transliteration)
export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Valid "text" string is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Use google-translate-api-x to auto-detect and transliterate
    const result = await translate(text, {
      to: 'en',
      from: 'auto',
      // Enable transliteration/romanization
      client: 'gtx', // or 'dict', 'tc' — 'gtx' is best for general use
    });

    /**
     * Google returns:
     * - `text`: translated text in English
     * - `pronunciation`: often the **romanized/transliterated** form (e.g., "नमस्ते" → "Namaste")
     * - `from.language.iso`: detected language code
     */
    const detectedLang = result.from?.language?.iso || 'unknown';
    const translation = result.text?.trim() || '';
    const transliteration = result.pronunciation?.trim() || translation;

    // Sometimes pronunciation is null or same as text — fallback to cleaned version
    const finalTransliteration =
      transliteration && transliteration !== text && transliteration.length <= 200
        ? transliteration
        : translation;

    return Response.json(
      {
        original: text,
        detectedLanguage: detectedLang,
        transliterated: finalTransliteration,
        translated: translation,
        success: true,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Transliteration failed:', error);

    // Handle common errors
    if (error.message.includes('detected')) {
      return Response.json(
        { error: 'Language detection failed', details: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      {
        error: 'Transliteration failed (Google Translate error)',
        details: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}