// Content for the site: word of the day, example chips and the letter guide.
(function (root) {
  "use strict";

  const WORDS_OF_THE_DAY = [
    { tamil: "அன்பு", tanglish: "anbu", meaning: "Love, affection", note: "The love between family and friends, not only romantic love. The Thirukkural gives it a whole chapter." },
    { tamil: "நன்றி", tanglish: "nandri", meaning: "Thank you, gratitude", note: "Notice the ன்ற cluster: typing ndr gives it in one go." },
    { tamil: "வணக்கம்", tanglish: "vaNakkam", meaning: "Hello; a respectful greeting", note: "Said with palms pressed together. The capital N gives ண." },
    { tamil: "மழை", tanglish: "mazhai", meaning: "Rain", note: "zh makes ழ, the sound many say is special to Tamil." },
    { tamil: "நிலா", tanglish: "nilaa", meaning: "Moon", note: "A favourite word in film songs and lullabies." },
    { tamil: "கடல்", tanglish: "kadal", meaning: "Sea", note: "Tamil Nadu has more than a thousand kilometres of coastline." },
    { tamil: "தமிழ்", tanglish: "thamizh", meaning: "Tamil", note: "Ends in ழ், so type zh, not l." },
    { tamil: "அம்மா", tanglish: "ammaa", meaning: "Mother", note: "The doubled aa makes the long ா at the end." },
    { tamil: "நண்பன்", tanglish: "naNban", meaning: "Friend", note: "n at the start of a word becomes ந on its own." },
    { tamil: "பசி", tanglish: "pasi", meaning: "Hunger", note: "Usually the first word you hear at the door of a Tamil home: pasikkudhaa? (are you hungry?)" },
    { tamil: "கனவு", tanglish: "kanavu", meaning: "Dream", note: "In the middle of a word, n becomes ன." },
    { tamil: "பூ", tanglish: "poo", meaning: "Flower", note: "One letter, one word. oo gives the long ூ." },
    { tamil: "வீடு", tanglish: "veedu", meaning: "House, home", note: "Inside a word, d gives ட." },
    { tamil: "தண்ணீர்", tanglish: "thaNNeer", meaning: "Water", note: "Often shortened to thaNNi in everyday speech." },
    { tamil: "பாட்டு", tanglish: "paattu", meaning: "Song", note: "Double tt gives ட்ட." },
    { tamil: "கோலம்", tanglish: "kOlam", meaning: "Kolam, the rice-flour drawing at the doorstep", note: "Drawn fresh each morning around a grid of dots, like the one at the top of this page." },
    { tamil: "இசை", tanglish: "isai", meaning: "Music", note: "ai is a single vowel in Tamil: ை." },
    { tamil: "நேரம்", tanglish: "nEram", meaning: "Time", note: "Capital E gives the long ே." },
    { tamil: "உலகம்", tanglish: "ulagam", meaning: "World", note: "g and k both give க. Tamil uses one letter for both sounds." },
    { tamil: "புத்தகம்", tanglish: "puththagam", meaning: "Book", note: "Double th gives த்த." },
    { tamil: "அறிவு", tanglish: "aRivu", meaning: "Knowledge, wisdom", note: "Capital R gives the rolled ற." },
    { tamil: "பொறுமை", tanglish: "poRumai", meaning: "Patience", note: "Short o gives ொ; capital O would give ோ." },
    { tamil: "வானம்", tanglish: "vaanam", meaning: "Sky", note: "Long aa then a plain a." },
    { tamil: "மரம்", tanglish: "maram", meaning: "Tree", note: "Every consonant carries an a sound unless a dot (்) removes it." },
    { tamil: "சிரிப்பு", tanglish: "sirippu", meaning: "Laughter", note: "At the start of a word, s gives ச." },
    { tamil: "நட்பு", tanglish: "natpu", meaning: "Friendship", note: "The Thirukkural has a chapter on it too." },
    { tamil: "கல்வி", tanglish: "kalvi", meaning: "Education", note: "Kalvi is the root of many school and college names in Tamil Nadu." },
    { tamil: "உணவு", tanglish: "uNavu", meaning: "Food", note: "Capital N gives ண." },
    { tamil: "கதை", tanglish: "kadhai", meaning: "Story", note: "dh and th both give த." },
    { tamil: "இனிமை", tanglish: "inimai", meaning: "Sweetness, pleasantness", note: "Used for voices, words and memories, not only for taste." },
    { tamil: "ஊர்", tanglish: "oor", meaning: "Hometown, village", note: "\"Sondha oor\" is the place your family comes from." },
  ];

  const EXAMPLES = ["vaNakkam", "nandri", "thamizh", "pongal", "eppadi irukkeenga?", "naan oru maaNavan"];

  // Letter guide. "type" is what to type; the converter turns it into "tamil".
  const VOWEL_GUIDE = [
    ["அ", "a"], ["ஆ", "aa"], ["இ", "i"], ["ஈ", "ee"], ["உ", "u"], ["ஊ", "oo"],
    ["எ", "e"], ["ஏ", "E"], ["ஐ", "ai"], ["ஒ", "o"], ["ஓ", "O"], ["ஔ", "au"], ["ஃ", "H"],
  ];
  const CONSONANT_GUIDE = [
    ["க", "k or g"], ["ங", "ng"], ["ச", "s or ch"], ["ஞ", "nY"], ["ட", "t or d"], ["ண", "N"],
    ["த", "th or dh"], ["ந", "n (word start)"], ["ப", "p or b"], ["ம", "m"], ["ய", "y"], ["ர", "r"],
    ["ல", "l"], ["வ", "v or w"], ["ழ", "zh"], ["ள", "L"], ["ற", "R"], ["ன", "n (mid-word)"],
  ];
  const GRANTHA_GUIDE = [["ஜ", "j"], ["ஷ", "sh"], ["ஸ", "S"], ["ஹ", "h"], ["க்ஷ", "ksh"], ["ஸ்ரீ", "sri"]];
  const CLUSTER_GUIDE = [
    ["ண்ட", "nd", "vEndaam → வேண்டாம்"],
    ["ந்த", "ndh", "vandhaan → வந்தான்"],
    ["ங்க", "ng", "pongal → பொங்கல்"],
    ["ஞ்ச", "nj", "konjam → கொஞ்சம்"],
    ["ன்ற", "ndr", "nandri → நன்றி"],
    ["ற்ற", "tr", "kaatru → காற்று"],
  ];

  // Uyirmei grid: rows are consonants, columns are vowel signs
  const GRID_CONSONANTS = ["க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம", "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன"];
  const GRID_SIGNS = [["", "a"], ["ா", "aa"], ["ி", "i"], ["ீ", "ee"], ["ு", "u"], ["ூ", "oo"], ["ெ", "e"], ["ே", "E"], ["ை", "ai"], ["ொ", "o"], ["ோ", "O"], ["ௌ", "au"]];

  const api = { WORDS_OF_THE_DAY, EXAMPLES, VOWEL_GUIDE, CONSONANT_GUIDE, GRANTHA_GUIDE, CLUSTER_GUIDE, GRID_CONSONANTS, GRID_SIGNS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SiteData = api;
})(typeof window !== "undefined" ? window : globalThis);
