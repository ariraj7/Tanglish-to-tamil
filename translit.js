// translit.js — converts Tanglish (Tamil typed in English letters) to Tamil script.
//
// Core idea: Tamil letters = consonant + vowel sign.
//   க (k) + ி (i sign) = கி (ki)
//   க (k) + ் (pulli / no vowel) = க் (k)
// So we read the input left to right, grab the longest matching consonant,
// then check whether a vowel follows it.

// STEP 1: Vowels. Each has two forms:
//   [standalone form (used at the start of a word), sign form (attached to a consonant)]
const VOWELS = {
  "aa": ["ஆ", "ா"], "A": ["ஆ", "ா"],
  "ii": ["ஈ", "ீ"], "ee": ["ஈ", "ீ"], "I": ["ஈ", "ீ"],
  "uu": ["ஊ", "ூ"], "oo": ["ஊ", "ூ"], "U": ["ஊ", "ூ"],
  "ai": ["ஐ", "ை"],
  "au": ["ஔ", "ௌ"],
  "E":  ["ஏ", "ே"],
  "O":  ["ஓ", "ோ"],
  "a":  ["அ", ""],   // 'a' is built into every consonant, so no sign
  "i":  ["இ", "ி"],
  "u":  ["உ", "ு"],
  "e":  ["எ", "ெ"],
  "o":  ["ஒ", "ொ"],
};

// STEP 2: Consonants. Some keys are clusters that Tamil writes specially.
// The vowel attaches to the LAST letter of the value.
const CONSONANTS = {
  "ndr": "ன்ற",   // nandri -> நன்றி
  "ng": "ங்க",    // pongal -> பொங்கல், ingu -> இங்கு
  "nj": "ஞ",
  "ch": "ச",
  "th": "த", "dh": "த",
  "zh": "ழ",
  "sh": "ஷ",
  "k": "க", "g": "க",
  "s": "ச",
  "t": "ட", "d": "ட",
  "N": "ண",
  "n": "ன",       // special-cased below
  "p": "ப", "b": "ப",
  "m": "ம",
  "y": "ய",
  "r": "ர",
  "R": "ற",
  "l": "ல",
  "L": "ள",
  "v": "வ", "w": "வ",
  "j": "ஜ",
  "S": "ஸ",
  "h": "ஹ",
};

const PULLI = "்"; // the dot that means "no vowel"

// Sort keys longest-first so "zh" is tried before "z", "aa" before "a", etc.
const vowelKeys = Object.keys(VOWELS).sort((a, b) => b.length - a.length);
const consonantKeys = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);

// Find the longest key from `keys` that appears in `text` at position `i`.
function matchAt(text, i, keys) {
  for (const key of keys) {
    if (text.startsWith(key, i)) return key;
  }
  return null;
}

function isLetter(ch) {
  return ch !== undefined && /[a-zA-Z]/.test(ch);
}

// STEP 3: The converter.
function transliterate(input) {
  let out = "";
  let i = 0;

  while (i < input.length) {
    const wordStart = !isLetter(input[i - 1]);

    // Try a consonant first
    const c = matchAt(input, i, consonantKeys);
    if (c) {
      let base = CONSONANTS[c];

      // STEP 4: Context rules (Tamil spelling depends on position)
      // Words start with ந, not ன: "neeyum" -> நீயும்
      // and n before th/dh is also ந: "vandhaan" -> வந்தான்
      if (c === "n" && (wordStart || /^(th|dh)/.test(input.slice(i + 1)))) {
        base = "ந";
      }
      // Tamil words don't start with ட, so t/d at the start means த: "tamizh" -> தமிழ்
      if ((c === "t" || c === "d") && wordStart) {
        base = "த";
      }

      i += c.length;

      // Is there a vowel after the consonant?
      const v = matchAt(input, i, vowelKeys);
      if (v) {
        out += base + VOWELS[v][1]; // consonant + vowel sign
        i += v.length;
      } else {
        out += base + PULLI;        // consonant with no vowel
      }
      continue;
    }

    // Otherwise try a standalone vowel
    const v = matchAt(input, i, vowelKeys);
    if (v) {
      out += VOWELS[v][0];
      i += v.length;
      continue;
    }

    // Anything else (spaces, numbers, punctuation) passes through unchanged
    out += input[i];
    i += 1;
  }

  return out;
}

// Lets Node.js load this file for testing; ignored in the browser.
if (typeof module !== "undefined") module.exports = { transliterate };
