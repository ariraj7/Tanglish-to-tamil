// Run with: node test.js
const { transliterate } = require("./translit.js");

const cases = {
  "vaNakkam": "வணக்கம்",
  "tamizh": "தமிழ்",
  "nandri": "நன்றி",
  "neeyum": "நீயும்",
  "enna": "என்ன",
  "pongal": "பொங்கல்",
  "poo": "பூ",
  "ammaa": "அம்மா",
  "vandhaan": "வந்தான்",
  "ingu": "இங்கு",
  "thamizh naadu": "தமிழ் நாடு",
};

let passed = 0;
for (const [input, expected] of Object.entries(cases)) {
  const got = transliterate(input);
  const ok = got === expected;
  if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${input.padEnd(14)} -> ${got}  ${ok ? "" : "(expected " + expected + ")"}`);
}
console.log(`\n${passed}/${Object.keys(cases).length} passed`);
