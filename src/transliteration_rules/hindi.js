// transliteration_rules/hindi.js

// This is a *highly simplified* example for Devanagari (Hindi).
// Real Devanagari transliteration (e.g., IAST, Hunterian, ISO 15919) requires handling:
// - Vowel signs (matras)
// - Conjunct consonants
// - Virama (हलन्त)
// - Nasalization (अनुस्वार, चंद्रबिंदु)
// - Stress and aspiration
// - Context-dependent pronunciation

const devanagariToLatinMap = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', // Often 'ṭ'
  'ठ': 'th', // Often 'ṭh'
  'ड': 'd', // Often 'ḍ'
  'ढ': 'dh', // Often 'ḍh'
  'ण': 'n', // Often 'ṇ'
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', // or 'w'
  'श': 'sh', // Often 'ś'
  'ष': 'sh', // Often 'ṣ'
  'स': 's', 'ह': 'h',
  // Vowel signs (matras) - these are tricky as they combine with consonants
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  // Other signs
  'ं': 'n', // Anusvara (often 'ṃ')
  'ः': 'h', // Visarga
  'ॅ': 'a', // Chandrabindu (often nasalization marker)
  '़': '', // Nukta (used for borrowed sounds like क़, ख़, ग़, ज़, फ़) - needs context
  '्': '', // Virama (halant) - signifies absence of inherent vowel, important for conjuncts
  'ॐ': 'Om', // Common word
};

const devanagariRegexReplacements = [
  // Example for handling nukta:
  [/क़/g, 'q'], [/ख़/g, 'kh'], [/ग़/g, 'gh'], [/ज़/g, 'z'], [/फ़/g, 'f'],
  // Example: a simple way to combine a consonant and a matra (still very basic)
  // This needs much more sophisticated handling for actual accuracy.
  // For instance, 'कि' (ki), 'की' (kee)
  // A proper system would process character by character, maintaining state.
];


export function transliterateText(text) {
  let result = text;

  // Apply regex replacements first
  for (const [regex, replacement] of devanagariRegexReplacements) {
    result = result.replace(regex, replacement);
  }

  // Then apply character-by-character mapping
  let finalResult = '';
  // This loop won't correctly handle matras and conjuncts alone.
  // A proper Devanagari transliterator needs to look ahead/behind for context.
  for (let i = 0; i < result.length; i++) {
    let char = result[i];
    let mapped = devanagariToLatinMap[char];

    if (mapped !== undefined) {
      finalResult += mapped;
    } else {
      finalResult += char;
    }
  }

  // Simple post-processing (e.g., remove consecutive hyphens if they occur from Virama handling)
  finalResult = finalResult.replace(/--/g, '-');

  return finalResult;
}