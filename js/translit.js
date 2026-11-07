/*
 * translit.js — the converter engine.
 *
 *   transliterate("vaNakkam")        -> "வணக்கம்"     Tanglish -> Tamil
 *   trace("vaNakkam")                -> how each piece of the input was read
 *   toTanglish("வணக்கம்")            -> "vaNakkam"    Tamil -> Tanglish
 *   suggest("thamil")                -> real Tamil words the typist probably meant
 *
 * Works in the browser (adds window.Translit) and in Node (module.exports).
 */
(function (root) {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. Lookup tables
  // ---------------------------------------------------------------------------

  // Each vowel has two forms: [on its own, as a sign attached to a consonant].
  const VOWELS = {
    aa: ["ஆ", "ா"], A: ["ஆ", "ா"],
    ii: ["ஈ", "ீ"], ee: ["ஈ", "ீ"], I: ["ஈ", "ீ"],
    uu: ["ஊ", "ூ"], oo: ["ஊ", "ூ"], U: ["ஊ", "ூ"],
    ai: ["ஐ", "ை"],
    au: ["ஔ", "ௌ"],
    E: ["ஏ", "ே"], ae: ["ஏ", "ே"],
    O: ["ஓ", "ோ"],
    a: ["அ", ""], // every consonant already carries an "a" sound
    i: ["இ", "ி"],
    u: ["உ", "ு"],
    e: ["எ", "ெ"],
    o: ["ஒ", "ொ"],
  };

  // Consonants. Some keys are clusters Tamil always writes a particular way.
  // A following vowel attaches to the LAST letter of the value.
  const CONSONANTS = {
    ndr: "ன்ற", // nandri   -> நன்றி
    nch: "ஞ்ச", // panchu   -> பஞ்சு
    ksh: "க்ஷ",
    nj: "ஞ்ச",  // konjam   -> கொஞ்சம்
    nY: "ஞ",    // ஞ on its own (rare)
    ng: "ங்க",  // pongal   -> பொங்கல்
    tr: "ற்ற",  // kaatru   -> காற்று   (only inside a word)
    ch: "ச",
    th: "த", dh: "த",
    zh: "ழ",
    sh: "ஷ",
    k: "க", g: "க", c: "க", q: "க",
    s: "ச",
    t: "ட", d: "ட", T: "ட", D: "ட",
    N: "ண",
    n: "ன", // ந or ண depending on position, see rules below
    p: "ப", b: "ப",
    f: "ஃப",
    m: "ம",
    y: "ய",
    r: "ர",
    R: "ற",
    l: "ல",
    L: "ள",
    v: "வ", w: "வ",
    j: "ஜ", z: "ஜ",
    S: "ஸ",
    h: "ஹ",
    x: "க்ஸ",
  };

  // Whole pieces that don't follow the normal consonant + vowel pattern.
  const SPECIAL = { sri: "ஸ்ரீ", shri: "ஸ்ரீ" }; // only at the start of a word
  const SYMBOLS = { H: "ஃ" };                  // aaytham

  const PULLI = "்"; // the dot meaning "no vowel"

  // Capitals only mean something for these letters (ண, ள, ற, long vowels…).
  // Any other capital is treated as lowercase, so "Vanakkam" still works.
  const MEANINGFUL_CAPS = new Set("AIUEONLRTDSH");

  const byLengthDesc = (a, b) => b.length - a.length;
  const VOWEL_KEYS = Object.keys(VOWELS).sort(byLengthDesc);
  const CONSONANT_KEYS = Object.keys(CONSONANTS).sort(byLengthDesc);
  const SPECIAL_KEYS = Object.keys(SPECIAL).sort(byLengthDesc);

  function matchAt(text, i, keys) {
    for (const key of keys) if (text.startsWith(key, i)) return key;
    return null;
  }

  const isLatin = (ch) => ch !== undefined && /[a-zA-Z]/.test(ch);

  function normalizeCase(input) {
    let out = "";
    let prev = "";
    for (const ch of input) {
      const keep = MEANINGFUL_CAPS.has(ch) || (ch === "Y" && prev === "n"); // "nY" = ஞ
      out += /[A-Z]/.test(ch) && !keep ? ch.toLowerCase() : ch;
      prev = ch;
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // 2. Tanglish -> Tamil
  // ---------------------------------------------------------------------------

  // Reads the input left to right and returns every piece it read, so the
  // website can show the steps. transliterate() just joins the outputs.
  function trace(rawInput) {
    const input = normalizeCase(rawInput);
    const steps = [];
    let i = 0;

    while (i < input.length) {
      const wordStart = !isLatin(input[i - 1]);

      // Special whole pieces like "sri"
      if (wordStart) {
        const sp = matchAt(input, i, SPECIAL_KEYS);
        if (sp) {
          steps.push({ src: sp, out: SPECIAL[sp], kind: "special" });
          i += sp.length;
          continue;
        }
      }

      if (SYMBOLS[input[i]]) {
        steps.push({ src: input[i], out: SYMBOLS[input[i]], kind: "symbol" });
        i += 1;
        continue;
      }

      let c = matchAt(input, i, CONSONANT_KEYS);
      if (c === "tr" && wordStart) c = "t"; // "tr" -> ற்ற only inside a word

      if (c) {
        let base = CONSONANTS[c];
        let rule = null;
        const rest = input.slice(i + c.length);

        // Context rules: Tamil spelling depends on where the letter is.
        const last = steps[steps.length - 1];
        const afterBareConsonant = last && last.kind === "consonant" && !/[னணந]்$/.test(last.out);
        if (c === "n") {
          if (wordStart) {
            base = "ந"; rule = "n at the start of a word is ந";
          } else if (afterBareConsonant) {
            base = "ந"; rule = "n right after another consonant starts a new word part, so it's ந";
          } else if (/^(th|dh)/.test(rest)) {
            base = "ந"; rule = "n before th/dh is ந";
          } else if (/^[tdTD](?!h)/.test(rest)) {
            base = "ண"; rule = "n before t/d is ண";
          }
        }
        if ((c === "t" || c === "d") && wordStart) {
          base = "த"; rule = "Tamil words don't start with ட, so this is த";
        }

        const v = matchAt(input, i + c.length, VOWEL_KEYS);
        const src = c + (v || "");
        const out = base + (v ? VOWELS[v][1] : PULLI);
        steps.push({ src, out, kind: v ? "consonant+vowel" : "consonant", rule });
        i += src.length;
        continue;
      }

      const v = matchAt(input, i, VOWEL_KEYS);
      if (v) {
        steps.push({ src: v, out: VOWELS[v][0], kind: "vowel" });
        i += v.length;
        continue;
      }

      // Spaces, digits, punctuation, Tamil text: copied as is
      steps.push({ src: input[i], out: input[i], kind: "other" });
      i += 1;
    }
    return steps;
  }

  function transliterate(input) {
    return trace(input).map((s) => s.out).join("");
  }

  // ---------------------------------------------------------------------------
  // 3. Splitting Tamil text into letters
  // ---------------------------------------------------------------------------

  const CONSONANT_CHARS = new Set("கஙசஞடணதநபமயரலவழளறனஜஷஸஹ");
  const SIGN_CHARS = new Set(["ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ", PULLI]);
  const VOWEL_CHARS = new Set("அஆஇஈஉஊஎஏஐஒஓஔ");

  // "வணக்கம்" -> [{c:"வ",s:""}, {c:"ண",s:""}, {c:"க",s:"்"}, {c:"க",s:""}, {c:"ம",s:"்"}]
  // c = consonant, s = vowel sign ("" = inherent a); v = standalone vowel; x = anything else
  function toUnits(tamil) {
    const units = [];
    // NFC joins ொ/ோ/ௌ when they arrive as two separate characters
    const chars = Array.from(tamil.normalize("NFC"));
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (CONSONANT_CHARS.has(ch)) {
        const next = chars[i + 1];
        if (SIGN_CHARS.has(next)) { units.push({ c: ch, s: next }); i++; }
        else units.push({ c: ch, s: "" });
      } else if (VOWEL_CHARS.has(ch)) {
        units.push({ v: ch });
      } else {
        units.push({ x: ch });
      }
    }
    return units;
  }

  const unitsToString = (units) =>
    units.map((u) => (u.c ? u.c + u.s : u.v || u.x)).join("");

  // ---------------------------------------------------------------------------
  // 4. Tamil -> Tanglish (reverse mode)
  // ---------------------------------------------------------------------------

  const REV_VOWEL = { "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ee", "உ": "u", "ஊ": "oo",
    "எ": "e", "ஏ": "E", "ஐ": "ai", "ஒ": "o", "ஓ": "O", "ஔ": "au" };
  const REV_SIGN = { "": "a", "ா": "aa", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo",
    "ெ": "e", "ே": "E", "ை": "ai", "ொ": "o", "ோ": "O", "ௌ": "au", [PULLI]: "" };
  const REV_CONS = { "க": "k", "ங": "ng", "ச": "s", "ஞ": "nY", "ட": "t", "ண": "N",
    "த": "th", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r", "ல": "l", "வ": "v",
    "ழ": "zh", "ள": "L", "ற": "R", "ன": "n", "ஜ": "j", "ஷ": "sh", "ஸ": "S", "ஹ": "h" };

  // Two-letter clusters written as one Tanglish chunk: "ங்க" -> "ng"
  const REV_CLUSTERS = { "ஙக": "ng", "ஞச": "nj", "னற": "ndr", "றற": "tr", "ணட": "nd", "நத": "ndh" };
  const REV_SPECIAL = { "ஸ்ரீ": "sri" };

  function toTanglish(tamil) {
    let out = "";
    // Handle special pieces first
    for (const [ta, en] of Object.entries(REV_SPECIAL)) tamil = tamil.split(ta).join("\u0000" + en + "\u0001");
    const parts = tamil.split(/(\u0000[^\u0001]*\u0001)/);
    for (const part of parts) {
      if (part.startsWith("\u0000")) { out += part.slice(1, -1); continue; }
      out += unitsToTanglish(toUnits(part));
    }
    return out;
  }

  function unitsToTanglish(units) {
    let out = "";
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (u.v) { out += REV_VOWEL[u.v]; continue; }
      if (u.x) { out += u.x === "ஃ" ? "H" : u.x; continue; }

      const prev = units[i - 1];
      const next = units[i + 1];
      const wordStart = !prev || !!prev.x;

      // Clusters: consonant-with-pulli followed by a specific consonant
      if (u.s === PULLI && next && next.c && REV_CLUSTERS[u.c + next.c]) {
        out += REV_CLUSTERS[u.c + next.c] + REV_SIGN[next.s];
        i++;
        continue;
      }

      let rom = REV_CONS[u.c];
      if (u.c === "ட") {
        if (wordStart || (next && (next.c === "ர" || next.c === "ஹ"))) rom = "T";
        else rom = (prev.c === "ட" && prev.s === PULLI) || u.s === PULLI ? "t" : "d"; // பாட்டு "paattu", வீடு "veedu"
      }
      if (u.c === "த" && !wordStart) rom = prev.c === "த" && prev.s === PULLI ? "th" : "dh";
      if (u.c === "ச" && !wordStart && prev.c === "ச" && prev.s === PULLI) rom = "ch";
      if (u.c === "ச" && u.s === PULLI && next && next.c === "ச") rom = "ch";
      out += rom + REV_SIGN[u.s];
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // 5. Suggestions from a dictionary
  // ---------------------------------------------------------------------------
  //
  // Typing is ambiguous: "l" could be ல, ள or ழ, "e" could be short or long, and
  // people often type one k where Tamil has two. So for a word we try small
  // edits to the Tamil result and keep the ones that are real words.

  const SWAP_GROUPS = [
    ["ல", "ள", "ழ"], ["ன", "ண", "ந"], ["ர", "ற"], ["ட", "த"],
    ["அ", "ஆ"], ["இ", "ஈ"], ["உ", "ஊ"], ["எ", "ஏ"], ["ஒ", "ஓ"],
  ];
  const SIGN_GROUPS = [["", "ா"], ["ி", "ீ"], ["ு", "ூ"], ["ெ", "ே"], ["ொ", "ோ"]];

  const swapsFor = (ch, groups) => {
    const g = groups.find((grp) => grp.includes(ch));
    return g ? g.filter((x) => x !== ch) : [];
  };

  // Every word reachable with exactly one edit
  function oneEdit(units) {
    const results = [];
    const copy = () => units.map((u) => ({ ...u }));
    units.forEach((u, i) => {
      if (u.c) {
        for (const c of swapsFor(u.c, SWAP_GROUPS)) { const n = copy(); n[i].c = c; results.push(n); }
        // doubled letters change together: அன்ன -> அண்ண counts as one edit
        const nxt = units[i + 1];
        if (u.s === PULLI && nxt && nxt.c === u.c) {
          for (const c of swapsFor(u.c, SWAP_GROUPS)) { const n = copy(); n[i].c = c; n[i + 1].c = c; results.push(n); }
        }
        if (u.s !== PULLI) {
          for (const s of swapsFor(u.s, SIGN_GROUPS)) { const n = copy(); n[i].s = s; results.push(n); }
        }
        // doubling: "vaNakam" -> வணக்கம் (க -> க்க)
        const prev = units[i - 1];
        if (i > 0 && prev.c && !(prev.c === u.c && prev.s === PULLI)) {
          const n = copy(); n.splice(i, 0, { c: u.c, s: PULLI }); results.push(n);
        }
        // un-doubling: க்க -> க
        if (u.s === PULLI && units[i + 1] && units[i + 1].c === u.c) {
          const n = copy(); n.splice(i, 1); results.push(n);
        }
      } else if (u.v) {
        for (const v of swapsFor(u.v, SWAP_GROUPS)) { const n = copy(); n[i].v = v; results.push(n); }
      }
    });
    return results;
  }

  let dictionary = null; // Map: word -> rank (0 = most common)

  function loadDictionary(words) {
    dictionary = new Map();
    words.forEach((w, rank) => {
      const word = w.normalize("NFC");
      if (!dictionary.has(word)) dictionary.set(word, rank);
    });
    return dictionary.size;
  }

  const isKnown = (tamilWord) => !!dictionary && dictionary.has(tamilWord);

  const cache = new Map();

  // Returns { tamil, known, options: [{ tamil, tanglish, edits }] }
  function suggest(tanglishWord, maxOptions = 4) {
    if (cache.has(tanglishWord)) return cache.get(tanglishWord);
    const tamil = transliterate(tanglishWord);
    const known = isKnown(tamil);
    const found = new Map(); // tamil -> edits
    if (dictionary) {
      let frontier = [toUnits(tamil)];
      const seen = new Set([tamil]);
      for (let edits = 1; edits <= 2; edits++) {
        const nextFrontier = [];
        for (const units of frontier) {
          for (const cand of oneEdit(units)) {
            const s = unitsToString(cand);
            if (seen.has(s)) continue;
            seen.add(s);
            nextFrontier.push(cand);
            if (dictionary.has(s)) found.set(s, edits);
          }
        }
        frontier = nextFrontier;
        if (found.size >= maxOptions) break;
      }
    }
    const options = [...found.entries()]
      .sort((a, b) => a[1] - b[1] || dictionary.get(a[0]) - dictionary.get(b[0]))
      .slice(0, maxOptions)
      .map(([w, edits]) => ({ tamil: w, tanglish: toTanglish(w), edits }));
    const result = { tamil, known, options };
    cache.set(tanglishWord, result);
    return result;
  }

  const api = { transliterate, trace, toTanglish, toUnits, suggest, loadDictionary, isKnown };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Translit = api;
})(typeof window !== "undefined" ? window : globalThis);
