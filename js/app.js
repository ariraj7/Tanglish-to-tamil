// app.js — connects the converter engine (translit.js) to the page.
(function () {
  "use strict";

  const T = window.Translit;
  const D = window.SiteData;
  T.loadDictionary(window.TAMIL_WORDS || []);

  const $ = (id) => document.getElementById(id);
  const input = $("input");
  const output = $("output");
  const suggestBox = $("suggest");
  const counts = $("counts");
  const el = (tag, props = {}, ...children) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  };

  // localStorage can be blocked (private windows, strict settings), so never let it throw
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let mode = "to-ta";        // "to-ta": Tanglish -> Tamil, "to-en": Tamil -> Tanglish
  let words = [];            // Latin words in the input: { start, end, text }
  let activeWord = -1;       // which word the suggestions are about
  const keptAsTyped = new Set(); // words the user chose to keep without a suggestion

  const outputText = () => (mode === "to-ta" ? T.transliterate(input.value) : T.toTanglish(input.value));

  function findWords(text) {
    const found = [];
    const re = /[A-Za-z]+/g;
    let m;
    while ((m = re.exec(text))) found.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
    return found;
  }

  function caretWord() {
    const c = input.selectionStart;
    return words.findIndex((w) => c >= w.start && c <= w.end);
  }

  // ---------------------------------------------------------------------------
  // Rendering the output
  // ---------------------------------------------------------------------------
  function render() {
    const text = input.value;
    output.replaceChildren();

    if (!text.trim()) {
      words = [];
      activeWord = -1;
      output.append(el("span", { className: "output-empty", textContent: mode === "to-ta" ? "Your Tamil text appears here." : "Tanglish appears here." }));
    } else if (mode === "to-en") {
      words = [];
      output.textContent = T.toTanglish(text);
    } else {
      words = findWords(text);
      let pos = 0;
      words.forEach((w, i) => {
        if (w.start > pos) output.append(text.slice(pos, w.start)); // spaces, punctuation, Tamil pass through
        const r = T.suggest(w.text);
        const span = el("span", { className: "w", textContent: r.tamil });
        span.dataset.i = i;
        if (!r.known && r.options.length && !keptAsTyped.has(w.text)) span.classList.add("check");
        output.append(span);
        pos = w.end;
      });
      if (pos < text.length) output.append(text.slice(pos));
    }

    if (document.activeElement === input) activeWord = caretWord();
    if (activeWord >= words.length) activeWord = -1;
    highlightActive();
    renderSuggestions();
    renderCounts();
    renderTrace();
    updateButtons();
  }

  function highlightActive() {
    output.querySelectorAll(".w.active").forEach((s) => s.classList.remove("active"));
    const span = output.querySelector(`.w[data-i="${activeWord}"]`);
    if (span) span.classList.add("active");
  }

  function renderCounts() {
    const out = input.value.trim() ? outputText() : "";
    if (!out) { counts.textContent = ""; return; }
    const wordCount = out.split(/\s+/).filter(Boolean).length;
    let letters = 0;
    if (window.Intl && Intl.Segmenter) {
      for (const g of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(out)) if (/\S/.test(g.segment)) letters++;
    } else {
      letters = out.replace(/\s/g, "").length;
    }
    counts.textContent = `${wordCount} ${wordCount === 1 ? "word" : "words"}, ${letters} ${letters === 1 ? "letter" : "letters"}`;
  }

  // ---------------------------------------------------------------------------
  // Suggestions
  // ---------------------------------------------------------------------------
  function renderSuggestions() {
    suggestBox.replaceChildren();
    const w = words[activeWord];
    if (mode !== "to-ta" || !w || keptAsTyped.has(w.text)) { suggestBox.hidden = true; return; }
    const r = T.suggest(w.text);
    if (!r.options.length) { suggestBox.hidden = true; return; }

    const label = el("span", { className: "suggest-label" });
    if (r.known) {
      label.append(el("b", { lang: "ta", textContent: r.tamil }), " is a word. It could also be:");
    } else {
      label.append(`“${w.text}” isn't in the word list. Did you mean:`);
    }
    suggestBox.append(label);

    r.options.forEach((opt) => {
      const btn = el("button", { type: "button", className: "option" },
        el("span", { className: "option-ta", lang: "ta", textContent: opt.tamil }),
        el("span", { className: "option-en", textContent: opt.tanglish }));
      btn.setAttribute("aria-label", `Use ${opt.tamil}, typed ${opt.tanglish}`);
      btn.addEventListener("click", () => replaceWord(activeWord, opt));
      suggestBox.append(btn);
    });

    if (!r.known) {
      const keep = el("button", { type: "button", className: "option keep" },
        el("span", { className: "option-en", textContent: "Keep" }),
        el("span", { className: "option-ta", lang: "ta", textContent: r.tamil }));
      keep.addEventListener("click", () => { keptAsTyped.add(w.text); render(); input.focus(); });
      suggestBox.append(keep);
    }
    suggestBox.hidden = false;
  }

  // Swap a word in the input for the chosen suggestion. We write the Tanglish
  // spelling back so the input stays editable; if that spelling wouldn't come
  // back as the same Tamil word, we insert the Tamil word itself.
  function replaceWord(index, opt) {
    const w = words[index];
    if (!w) return;
    const replacement = T.transliterate(opt.tanglish) === opt.tamil ? opt.tanglish : opt.tamil;
    input.focus();
    input.setRangeText(replacement, w.start, w.end, "end");
    activeWord = -1;
    render();
    activeWord = -1;
    highlightActive();
    renderSuggestions();
    scheduleHistory();
  }

  output.addEventListener("click", (e) => {
    const span = e.target.closest(".w");
    if (!span) return;
    activeWord = Number(span.dataset.i);
    highlightActive();
    renderSuggestions();
  });

  function onCaretMove() {
    const i = caretWord();
    if (i !== activeWord) { activeWord = i; highlightActive(); renderSuggestions(); }
  }

  input.addEventListener("input", () => { render(); scheduleHistory(); });
  input.addEventListener("click", onCaretMove);
  input.addEventListener("keyup", (e) => { if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") onCaretMove(); });

  // ---------------------------------------------------------------------------
  // Direction swap
  // ---------------------------------------------------------------------------
  function setMode(next, carryText) {
    if (next === mode) return;
    mode = next;
    if (carryText !== undefined) input.value = carryText;
    const toTa = mode === "to-ta";
    $("inputLabel").textContent = toTa ? "Tanglish" : "தமிழ்";
    $("inputLabel").lang = toTa ? "en" : "ta";
    $("inputHint").textContent = toTa ? "English letters" : "Tamil script";
    $("outputLabel").textContent = toTa ? "தமிழ்" : "Tanglish";
    $("outputLabel").style.fontFamily = toTa ? "" : "var(--font-ui)";
    input.placeholder = toTa ? "Type here, for example: vaNakkam, eppadi irukkeenga?" : "Paste Tamil text here, for example: வணக்கம்";
    input.classList.toggle("is-tamil", !toTa);
    output.classList.toggle("is-latin", !toTa);
    $("examples").hidden = !toTa;
    const swap = $("swap");
    swap.classList.toggle("flipped", !toTa);
    swap.setAttribute("aria-label", toTa ? "Swap direction: Tamil to Tanglish" : "Swap direction: Tanglish to Tamil");
    activeWord = -1;
    render();
  }

  $("swap").addEventListener("click", () => {
    const carry = input.value.trim() ? outputText() : "";
    setMode(mode === "to-ta" ? "to-en" : "to-ta", carry);
    input.focus();
  });

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  function updateButtons() {
    const empty = !input.value.trim();
    ["copyBtn", "shareBtn", "downloadBtn", "clearBtn"].forEach((id) => { $(id).disabled = empty; });
  }

  function flash(button, text) {
    const original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = text;
    clearTimeout(button._t);
    button._t = setTimeout(() => { button.textContent = original; }, 1600);
  }

  $("copyBtn").addEventListener("click", async () => {
    const text = outputText();
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback for browsers that block the clipboard API
      const tmp = el("textarea", { value: text });
      document.body.append(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
    }
    flash($("copyBtn"), "Copied");
    saveHistory();
  });

  $("shareBtn").addEventListener("click", () => {
    window.open("https://wa.me/?text=" + encodeURIComponent(outputText()), "_blank", "noopener");
    saveHistory();
  });

  $("downloadBtn").addEventListener("click", () => {
    const blob = new Blob([outputText()], { type: "text/plain;charset=utf-8" });
    const a = el("a", { href: URL.createObjectURL(blob), download: mode === "to-ta" ? "ezhuthu-tamil.txt" : "ezhuthu-tanglish.txt" });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash($("downloadBtn"), "Downloaded");
    saveHistory();
  });

  $("clearBtn").addEventListener("click", () => {
    input.value = "";
    render();
    input.focus();
  });

  // Example chips
  D.EXAMPLES.forEach((ex) => {
    const chip = el("button", { type: "button", className: "chip", textContent: ex });
    chip.addEventListener("click", () => {
      setMode("to-ta");
      input.value = ex;
      input.focus();
      input.setSelectionRange(ex.length, ex.length);
      render();
    });
    $("examples").append(chip);
  });

  // ---------------------------------------------------------------------------
  // Recent conversions (kept in this browser only)
  // ---------------------------------------------------------------------------
  const HISTORY_KEY = "ezhuthu-history";
  let historyTimer = null;

  function scheduleHistory() {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(saveHistory, 1500);
  }

  function saveHistory() {
    const text = input.value.trim();
    if (!text) return;
    const entry = { i: text, o: outputText().trim(), m: mode };
    let list = store.get(HISTORY_KEY, []);
    const top = list[0];
    // While someone is still typing the same text, update one entry instead of adding many
    if (top && top.m === entry.m && (entry.i.startsWith(top.i) || top.i.startsWith(entry.i))) list.shift();
    list = [entry, ...list.filter((x) => x.i !== entry.i)].slice(0, 12);
    store.set(HISTORY_KEY, list);
    renderHistory();
  }

  function renderHistory() {
    const list = store.get(HISTORY_KEY, []);
    const ol = $("historyList");
    ol.replaceChildren();
    list.forEach((item) => {
      const btn = el("button", { type: "button" },
        el("span", { textContent: item.i, className: item.m === "to-en" ? "h-out" : "" }),
        el("span", { textContent: item.o, className: item.m === "to-ta" ? "h-out" : "" }));
      btn.addEventListener("click", () => {
        setMode(item.m);
        input.value = item.i;
        render();
        input.focus();
        $("converter").scrollIntoView({ block: "start" });
      });
      ol.append(el("li", {}, btn));
    });
    $("historyCount").textContent = list.length ? `(${list.length})` : "";
    $("historyEmpty").hidden = list.length > 0;
    $("clearHistory").hidden = list.length === 0;
  }

  $("clearHistory").addEventListener("click", () => { store.set(HISTORY_KEY, []); renderHistory(); });

  // ---------------------------------------------------------------------------
  // Letter guide
  // ---------------------------------------------------------------------------
  // Insert text at the cursor as if it had been typed
  function insertAtCursor(text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.setRangeText(text, start, end, "end");
    input.focus();
    render();
    scheduleHistory();
  }

  // What to insert for a letter: its Tanglish spelling if that converts back to
  // the same letter, otherwise the Tamil letter itself.
  function insertionFor(tamil, typed, isConsonant) {
    if (mode === "to-en") return tamil;
    const candidate = typed + (isConsonant ? "a" : "");
    return T.transliterate(candidate) === tamil ? candidate : tamil;
  }

  function keyButton(tamil, typedLabel, isConsonant) {
    const firstSpelling = typedLabel.split(" ")[0];
    const btn = el("button", { type: "button", className: "key" },
      el("span", { className: "key-ta", lang: "ta", textContent: tamil }),
      el("span", { className: "key-en", textContent: typedLabel }));
    btn.setAttribute("aria-label", `${tamil}: type ${typedLabel}`);
    btn.addEventListener("click", () => insertAtCursor(insertionFor(tamil, firstSpelling, isConsonant)));
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

  // Uyirmei grid
  (function buildGrid() {
    const table = $("uyirmei");
    const head = el("tr", {}, el("th", { scope: "col" }));
    D.GRID_SIGNS.forEach(([, en], idx) => {
      const vowel = D.VOWEL_GUIDE[idx][0];
      head.append(el("th", { scope: "col" }, el("span", { lang: "ta", textContent: vowel }), el("br"), en));
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
        btn.addEventListener("click", () => insertAtCursor(mode === "to-ta" && works ? typed : letter));
        row.append(el("td", {}, btn));
      });
      body.append(row);
    });
    table.append(body);
  })();

  // ---------------------------------------------------------------------------
  // Word of the day
  // ---------------------------------------------------------------------------
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  let wordIndex = dayOfYear % D.WORDS_OF_THE_DAY.length;

  function showWord() {
    const w = D.WORDS_OF_THE_DAY[wordIndex];
    $("wotdTamil").textContent = w.tamil;
    $("wotdTanglish").textContent = w.tanglish;
    $("wotdMeaning").textContent = w.meaning;
    $("wotdNote").textContent = w.note;
  }
  $("wotdNext").addEventListener("click", () => { wordIndex = (wordIndex + 1) % D.WORDS_OF_THE_DAY.length; showWord(); });
  $("wotdTry").addEventListener("click", () => {
    setMode("to-ta");
    input.value = D.WORDS_OF_THE_DAY[wordIndex].tanglish;
    render();
    $("converter").scrollIntoView({ block: "start" });
    input.focus({ preventScroll: true });
  });
  showWord();

  // ---------------------------------------------------------------------------
  // How it works: live step-by-step breakdown
  // ---------------------------------------------------------------------------
  function renderTrace() {
    let source = mode === "to-ta" ? input.value : T.toTanglish(input.value);
    source = source.trim() || "vaNakkam";
    if (source.length > 48) source = source.slice(0, 48).replace(/\s+\S*$/, "") || source.slice(0, 48);
    $("traceWord").textContent = source;

    const list = $("trace");
    list.replaceChildren();
    const rules = new Map();
    T.trace(source).forEach((step) => {
      if (step.kind === "other" && /\s/.test(step.src)) { list.append(el("li", { className: "gap", ariaHidden: "true" })); return; }
      const li = el("li", {},
        el("span", { className: "t-src", textContent: step.src }),
        el("span", { className: "t-out", lang: "ta", textContent: step.out }));
      if (step.rule) { li.classList.add("has-rule"); rules.set(step.rule, step.src); }
      list.append(li);
    });
    const old = list.parentElement.querySelector(".trace-rules");
    if (old) old.remove();
    if (rules.size) {
      const ul = el("ul", { className: "trace-rules" });
      rules.forEach((src, rule) => ul.append(el("li", {}, el("b", { textContent: src }), ": " + rule)));
      list.after(ul);
    }
  }

  // ---------------------------------------------------------------------------
  // Hero kolam: dots first, then one unbroken line, the way a kolam is drawn
  // ---------------------------------------------------------------------------
  (function drawKolam() {
    const box = $("heroKolam");
    box.innerHTML = window.Kolam.kolamSVG(6, 5, { gap: 60, pad: 18, stroke: 3.4, dot: 3.8 });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const path = box.querySelector(".kolam-line");
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.animationDelay = "1.1s";
    box.querySelectorAll(".kolam-dots circle").forEach((c, i) => { c.style.animationDelay = `${i * 32}ms`; });
    box.classList.add("kolam-draw");
  })();

  // ---------------------------------------------------------------------------
  // Theme toggle
  // ---------------------------------------------------------------------------
  const root = document.documentElement;
  const isDark = () => root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  function syncThemeLabel() { $("themeToggle").setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"); }
  $("themeToggle").addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("ezhuthu-theme", root.dataset.theme); } catch (e) { /* ignore */ }
    syncThemeLabel();
  });
  syncThemeLabel();

  renderHistory();
  render();
})();
