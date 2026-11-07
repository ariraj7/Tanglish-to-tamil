// Run from the project folder with:  node tests/test.js
global.window = {};
require("../js/dictionary.js");
const T = require("../js/translit.js");
const { WORDS_OF_THE_DAY } = require("../js/data.js");
T.loadDictionary(window.TAMIL_WORDS);

let passed = 0;
let failed = 0;
function check(name, got, expected) {
  if (got === expected) { passed++; return; }
  failed++;
  console.log(`FAIL  ${name}\n      got:      ${got}\n      expected: ${expected}`);
}

// 1. Tanglish -> Tamil
const forward = {
  "vaNakkam": "வணக்கம்",
  "Vanakkam": "வனக்கம்",          // capital V is just v
  "tamizh": "தமிழ்",
  "thamizh naadu": "தமிழ் நாடு",
  "nandri": "நன்றி",
  "neeyum": "நீயும்",
  "enna": "என்ன",
  "pongal": "பொங்கல்",
  "poo": "பூ",
  "ammaa": "அம்மா",
  "vandhaan": "வந்தான்",
  "ingu": "இங்கு",
  "konjam": "கொஞ்சம்",            // nj -> ஞ்ச
  "vEndaam": "வேண்டாம்",          // nd -> ண்ட
  "rendu": "ரெண்டு",
  "kaatru": "காற்று",              // tr inside a word -> ற்ற
  "uLnaadu": "உள்நாடு",            // n after a consonant -> ந
  "sonnaen": "சொன்னேன்",          // ae -> ே
  "sri": "ஸ்ரீ",
  "nYaabagam": "ஞாபகம்",
  "kai": "கை",
  "2024 pongal!": "2024 பொங்கல்!",
};
for (const [input, expected] of Object.entries(forward)) check(`forward "${input}"`, T.transliterate(input), expected);

// 2. Tamil -> Tanglish -> Tamil should give back the same word
for (const word of ["வணக்கம்", "தமிழ்", "பாட்டு", "வீடு", "காதல்", "பத்து", "கொஞ்சம்", "நன்றி", "தோசை", "காற்று", "அண்ணன்", "பச்சை"]) {
  check(`round trip ${word}`, T.transliterate(T.toTanglish(word)), word);
}
check("reverse readable", T.toTanglish("வீடு"), "veedu");
check("reverse readable", T.toTanglish("பாட்டு"), "paattu");

// 3. Suggestions
function firstSuggestion(word) {
  const r = T.suggest(word);
  return r.options[0] && r.options[0].tamil;
}
check('suggest "thamil"', firstSuggestion("thamil"), "தமிழ்");
check('suggest "vanakam"', firstSuggestion("vanakam"), "வணக்கம்");
check('suggest "kaadhalikkiren"', firstSuggestion("kaadhalikkiren"), "காதலிக்கிறேன்");
check('suggest "thosai"', firstSuggestion("thosai"), "தோசை");
check('"nandri" is a known word', T.suggest("nandri").known, true);

// 4. Every word-of-the-day spelling must convert to its Tamil word
for (const w of WORDS_OF_THE_DAY) check(`word of the day "${w.tanglish}"`, T.transliterate(w.tanglish), w.tamil);

// 5. How much of the dictionary survives a round trip (information only)
let ok = 0;
for (const w of window.TAMIL_WORDS) if (T.transliterate(T.toTanglish(w)) === w) ok++;
console.log(`Round trip works for ${ok} of ${window.TAMIL_WORDS.length} dictionary words (${((100 * ok) / window.TAMIL_WORDS.length).toFixed(1)}%)`);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
