// letters.js — the letter guide page (letters.html).
(function () {
  "use strict";

  const T = window.Translit;
  const D = window.SiteData;
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...children) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  };

  // ---------------------------------------------------------------------------
  // Practice box
  // ---------------------------------------------------------------------------
  const practice = $("practiceInput");
  const practiceOut = $("practiceOut");

  function renderPractice() {
    const text = practice.value;
    practiceOut.textContent = text ? T.transliterate(text) : "";
    $("practiceOpen").href = text ? "index.html?text=" + encodeURIComponent(text) : "index.html";
  }

  function insert(text) {
    const start = practice.selectionStart ?? practice.value.length;
    const end = practice.selectionEnd ?? practice.value.length;
    practice.setRangeText(text, start, end, "end");
    practice.focus({ preventScroll: true });
    renderPractice();
  }

  practice.addEventListener("input", renderPractice);
  $("practiceClear").addEventListener("click", () => { practice.value = ""; renderPractice(); practice.focus(); });

  // What to insert for a letter: its Tanglish spelling if that converts back to
  // the same letter, otherwise the Tamil letter itself (Tamil passes through unchanged).
  function insertionFor(tamil, typed, isConsonant) {
    const candidate = typed + (isConsonant ? "a" : "");
    return T.transliterate(candidate) === tamil ? candidate : tamil;
  }

  // ---------------------------------------------------------------------------
  // Letter keys
  // ---------------------------------------------------------------------------
  function keyButton(tamil, typedLabel, isConsonant) {
    const firstSpelling = typedLabel.split(" ")[0];
    const btn = el("button", { type: "button", className: "key" },
      el("span", { className: "key-ta", lang: "ta", textContent: tamil }),
      el("span", { className: "key-en", textContent: typedLabel }));
    btn.setAttribute("aria-label", `${tamil}: type ${typedLabel}`);
    btn.addEventListener("click", () => insert(insertionFor(tamil, firstSpelling, isConsonant)));
    return btn;
  }

  D.VOWEL_GUIDE.forEach(([ta, en]) => $("vowelKeys").append(keyButton(ta, en, false)));
  D.CONSONANT_GUIDE.forEach(([ta, en]) => $("consonantKeys").append(keyButton(ta, en, true)));
  D.GRANTHA_GUIDE.forEach(([ta, en]) => $("granthaKeys").append(keyButton(ta, en, ta !== "ஸ்ரீ")));

  const pairsBody = $("pairsTable").querySelector("tbody");
  D.CLUSTER_GUIDE.forEach(([ta, en, example]) => {
    pairsBody.append(el("tr", {},
      el("td", { lang: "ta", textContent: ta }),
      el("td", {}, el("kbd", { textContent: en })),
      el("td", { textContent: example })));
  });

  // ---------------------------------------------------------------------------
  // All combinations (uyirmei)
  // ---------------------------------------------------------------------------
  const table = $("uyirmei");
  const head = el("tr", {}, el("th", { scope: "col" }));
  D.GRID_SIGNS.forEach(([, en], idx) => {
    head.append(el("th", { scope: "col" }, el("span", { lang: "ta", textContent: D.VOWEL_GUIDE[idx][0] }), el("br"), en));
  });
  table.append(el("thead", {}, head));
  const body = el("tbody");
  D.GRID_CONSONANTS.forEach((c) => {
    const row = el("tr", {}, el("th", { scope: "row", lang: "ta", textContent: c + "்" }));
    D.GRID_SIGNS.forEach(([sign]) => {
      const letter = c + sign;
      const typed = T.toTanglish(letter);
      const works = T.transliterate(typed) === letter;
      const btn = el("button", { type: "button", lang: "ta" }, letter, el("small", { textContent: works ? typed : "–" }));
      btn.setAttribute("aria-label", works ? `${letter}: type ${typed}` : letter);
      btn.addEventListener("click", () => insert(works ? typed : letter));
      row.append(el("td", {}, btn));
    });
    body.append(row);
  });
  table.append(body);

  renderPractice();
})();
