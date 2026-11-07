# Ezhuthu (எழுத்து): Tanglish to Tamil

**Type Tamil the way you speak it.** Ezhuthu converts Tanglish (Tamil written in English letters) into Tamil script as you type, and suggests the real word you meant when a spelling is ambiguous.

**Live site:** https://ariraj7.github.io/Tanglish-to-tamil/

| You type | You get |
| --- | --- |
| `vaNakkam` | வணக்கம் |
| `thamizh naadu` | தமிழ் நாடு |
| `eppadi irukkeenga?` | எப்படி இருக்கீங்க? |
| `thamil` | தமில், with the suggestion **தமிழ்** |

## Features

- **Live conversion** in side-by-side panels, plus a **reverse mode** (Tamil → Tanglish)
- **Spelling suggestions:** words that aren't in a 17,600-word Tamil dictionary get underlined, with one-click fixes (`thamil` → தமிழ், `vanakam` → வணக்கம்)
- **Letter guide:** every vowel, consonant and letter pair, plus a clickable 18 × 12 grid of all combinations
- **Step-by-step view** that shows exactly how your text was read, and which spelling rules applied
- **Word of the day** with its meaning and what to type
- Copy, share on WhatsApp, download as .txt, recent history, word and letter counts
- Dark mode, works on phones, keyboard accessible
- Runs entirely in the browser: no server, nothing you type leaves your device

## How it works

1. **Greedy longest match.** The converter reads left to right and always takes the longest piece it recognises, so `zh` becomes ழ rather than z + h, and `aa` becomes the long ா.
2. **Consonant + vowel sign.** Most Tamil letters are a consonant with a vowel sign attached (க + ி = கி). A consonant with no vowel gets a pulli (க்).
3. **Context rules.** Spelling depends on position: `n` at the start of a word is ந, in the middle it's ன, before `d` it's ண; a word-initial `t` is த because Tamil words don't begin with ட. Common letter pairs (ங்க, ஞ்ச, ன்ற, ற்ற, ண்ட) have shortcuts.
4. **Dictionary suggestions.** English letters can't show every Tamil sound (`l` could be ல, ள or ழ). For each word, the engine generates every spelling within two small edits (swapping similar letters, short and long vowels, doubled consonants) and keeps the ones found in the dictionary, ranked by fewest edits, then by how common the word is.
5. **Reverse mode.** Tamil text is split into consonant + vowel units and mapped back to Tanglish. Round trips (Tamil → Tanglish → Tamil) give back the same word for 97.7% of the dictionary.

## Project structure

```
index.html              page structure
css/style.css           design (light and dark themes)
js/translit.js          converter engine: forward, reverse, trace, suggestions
js/app.js               connects the engine to the page
js/data.js              word of the day, examples, letter guide data
js/kolam.js             draws the kolam in the header
js/dictionary.js        generated Tamil word list
tools/                  script that builds the dictionary, plus hand-added words
tests/test.js           tests
```

## Run it locally

Open `index.html` in a browser (or use the VS Code Live Server extension).

Run the tests with Node.js:

```
node tests/test.js
```

## Credits

- Tamil word frequencies: [FrequencyWords](https://github.com/hermitdave/FrequencyWords) by Hermit Dave, built from OpenSubtitles 2018, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Fonts: [Catamaran](https://fonts.google.com/specimen/Catamaran) and [Noto Serif Tamil](https://fonts.google.com/noto/specimen/Noto+Serif+Tamil) from Google Fonts.

Built by Ari Rajkumar.
