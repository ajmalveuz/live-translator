// transliteration_rules/arabic.js

// This is a *highly simplified* example.
// Real Arabic transliteration requires handling:
// - Short vowels (often not written)
// - Sun/Moon letters for 'Al-' (ال)
// - Shadda (doubling consonants)
// - Hamza, Madda, Ta Marbuta (ة) variations
// - Context-dependent letter forms (initial, medial, final)
// - Different transliteration standards (ISO 233, DIN 31635, Library of Congress)

const arabicToLatinMap = {
  'ا': 'a',
  'ب': 'b',
  'ت': 't',
  'ث': 'th',
  'ج': 'j',
  'ح': 'h',
  'خ': 'kh',
  'د': 'd',
  'ذ': 'dh',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sh',
  'ص': 's', // Often 'ṣ' in academic, but 's' for general
  'ض': 'd', // Often 'ḍ'
  'ط': 't', // Often 'ṭ'
  'ظ': 'z', // Often 'ẓ'
  'ع': '‘', // Or 'a' or omitted depending on context
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'و': 'w', // Or 'ū' for long vowel
  'ي': 'y', // Or 'ī' for long vowel
  'ة': 'a', // simplified, often 'ah' at end of word if pronounced
  'ء': '\'', // Hamza
  'آ': 'aa', // Madda
  'ﻻ': 'la', // Ligature
  'ال': 'al-', // For the definite article
};

// You can also add regex replacements for more complex rules
const arabicRegexReplacements = [
  // Example: remove common diacritics if desired (though some standards keep them)
  [/[\u064B-\u065F]/g, ''], // Arabic diacritics (fathatan, dammatan, kasratan, shadda, sukun, etc.)
  [/يٰ/g, 'ya'], // Ya with small alef
  [/ى/g, 'a'], // Alef maksura (often 'ā' or 'a')
];

export function transliterateText(text) {
  let result = text;

  // Apply regex replacements first for patterns
  for (const [regex, replacement] of arabicRegexReplacements) {
    result = result.replace(regex, replacement);
  }

  // Then apply character-by-character mapping
  let finalResult = '';
  for (const char of result) {
    finalResult += arabicToLatinMap[char] || char; // Fallback to original char if no map
  }

  // Post-processing for common names/phrases
  finalResult = finalResult.replace(/Mu hammad/g, 'Muhammad'); // Example: fix spacing if it occurs
  finalResult = finalResult.replace(/’/g, ''); // Remove soft apostrophe if not needed
  finalResult = finalResult.replace(/ʿ/g, ''); // Remove another common representation of ayn

  return finalResult;
}