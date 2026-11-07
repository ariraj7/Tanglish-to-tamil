// common.js — shared by every page: the logo, light/dark mode and the site color.
// Loaded in <head> so the saved color is applied before the page appears (no flash).
(function () {
  "use strict";

  const LOGO = `<svg class="logo" viewBox="0 0 244 190" aria-hidden="true" focusable="false"><path class="logo-ink" fill-rule="evenodd" d="M212.94 153.00 L212.61 152.12 L212.00 151.51 L208.25 150.54 L207.38 149.88 L205.62 148.04 L204.62 147.65 L203.62 147.50 L202.12 147.56 L201.12 147.88 L200.38 148.40 L198.75 150.15 L196.88 150.94 L180.75 151.00 L177.88 151.32 L175.50 151.89 L173.88 152.53 L172.38 153.39 L170.50 155.00 L169.14 156.62 L167.90 158.62 L166.62 161.62 L166.54 162.88 L167.01 163.72 L168.00 164.19 L170.75 164.25 L172.12 163.96 L173.31 163.10 L175.18 160.50 L176.75 158.93 L178.38 157.85 L180.00 157.33 L196.50 157.25 L199.00 156.86 L202.38 155.56 L203.25 155.38 L204.50 155.60 L208.00 156.99 L209.75 157.25 L210.88 157.19 L211.88 156.86 L212.69 156.00 L213.00 154.75ZM218.08 106.38 L216.62 104.62 L215.38 103.44 L213.88 102.26 L212.25 101.28 L209.38 100.14 L204.75 99.06 L203.62 99.06 L198.25 100.33 L195.12 101.82 L193.38 103.07 L191.50 104.88 L190.26 106.38 L188.60 109.12 L187.83 110.88 L186.75 114.12 L186.50 115.50 L186.38 120.50 L186.57 122.38 L187.56 125.75 L188.43 127.50 L189.51 129.12 L191.75 131.62 L196.88 135.75 L197.26 136.25 L197.36 136.75 L197.10 137.17 L196.62 137.44 L194.75 137.75 L181.62 137.75 L179.62 137.56 L177.38 136.85 L175.75 135.75 L174.72 134.38 L174.38 133.50 L174.12 131.88 L174.12 113.62 L173.74 111.12 L172.65 108.75 L171.71 107.38 L170.75 106.38 L168.75 104.76 L167.38 103.90 L166.50 103.58 L165.78 103.67 L165.43 104.12 L165.42 105.00 L166.83 109.50 L167.50 114.00 L167.50 134.00 L167.71 136.00 L168.12 137.75 L169.38 140.25 L170.88 141.94 L173.25 143.51 L176.50 144.74 L179.12 145.12 L201.12 145.12 L202.25 145.25 L213.50 145.12 L215.75 144.75 L217.75 143.78 L219.00 142.75 L219.74 141.88 L220.94 139.62 L221.81 136.38 L222.12 133.25 L222.04 116.12 L220.69 111.12 L219.60 108.75ZM200.50 107.81 L202.50 107.35 L204.75 107.25 L206.62 107.54 L208.25 108.11 L209.75 109.01 L211.62 110.62 L213.17 112.62 L214.04 114.38 L214.43 115.75 L214.62 117.38 L214.53 132.88 L214.18 134.38 L213.53 135.62 L212.75 136.46 L211.38 137.31 L209.00 137.75 L203.38 137.75 L201.75 137.49 L200.75 137.07 L199.75 136.00 L197.15 130.50 L195.96 127.50 L194.89 124.12 L194.35 121.62 L194.12 116.75 L194.40 114.88 L195.03 113.12 L196.31 111.00 L198.50 108.89ZM200.94 93.25 L200.79 94.75 L201.26 96.00 L202.50 97.32 L203.75 98.04 L204.75 98.03 L206.00 97.33 L207.04 96.25 L207.61 95.00 L207.69 94.12 L207.19 93.01 L206.75 92.71 L206.25 92.76 L205.25 93.62 L204.38 93.92 L203.50 93.65 L202.54 92.54 L202.12 92.31 L201.50 92.54ZM154.82 53.38 L153.75 52.31 L152.38 51.40 L151.00 50.89 L149.50 50.62 L147.62 50.72 L145.62 51.14 L143.00 52.07 L140.62 53.21 L136.12 56.03 L130.50 60.44 L112.75 75.08 L109.62 77.88 L107.86 79.88 L107.96 80.24 L108.62 80.26 L113.25 78.10 L136.12 65.19 L137.88 64.69 L139.62 64.68 L141.00 65.21 L142.06 66.38 L142.44 67.62 L142.62 69.25 L142.62 132.50 L142.50 134.62 L141.83 138.38 L140.90 141.00 L139.07 143.88 L137.25 145.68 L134.50 147.60 L131.38 148.88 L127.12 149.79 L123.50 150.12 L83.25 150.12 L82.12 150.00 L43.50 150.12 L42.12 150.00 L35.62 150.32 L31.12 151.40 L26.50 153.28 L22.50 155.76 L18.54 159.25 L15.64 162.75 L13.07 166.62 L9.57 173.62 L7.14 181.00 L6.88 182.75 L7.21 183.72 L8.12 184.28 L9.88 184.50 L22.38 184.38 L23.62 184.03 L24.71 182.88 L26.65 178.75 L29.39 174.38 L32.88 170.62 L35.38 168.62 L38.25 166.90 L40.12 166.14 L42.88 165.44 L44.50 165.25 L140.12 165.25 L142.88 164.83 L146.12 163.81 L148.62 162.57 L150.62 161.17 L152.50 159.38 L153.74 157.88 L155.35 155.00 L156.99 150.50 L157.50 147.25 L157.50 112.25 L157.62 111.12 L157.50 61.50 L157.29 59.50 L156.88 57.75 L155.97 55.25ZM112.88 8.08 L109.50 6.92 L104.25 5.96 L102.50 5.75 L95.12 5.75 L92.62 5.96 L88.00 6.89 L83.62 8.21 L79.00 10.03 L75.12 12.19 L72.50 13.90 L68.38 17.07 L65.38 19.62 L62.21 23.12 L58.39 27.88 L55.58 32.12 L53.83 35.62 L53.44 37.12 L53.25 39.00 L53.25 43.50 L53.50 45.62 L54.07 46.88 L55.38 48.11 L65.75 55.50 L67.12 56.32 L68.25 56.44 L68.82 56.10 L69.17 55.50 L69.38 52.00 L69.25 49.38 L68.50 43.38 L68.50 41.00 L69.10 38.38 L70.21 36.00 L71.81 33.75 L73.38 32.00 L76.12 29.67 L78.88 27.81 L83.12 25.65 L87.00 24.12 L88.50 24.06 L88.83 24.22 L89.08 24.62 L88.94 25.62 L86.78 29.75 L85.39 33.25 L84.33 38.00 L84.12 39.88 L84.12 76.88 L83.88 79.62 L84.12 82.38 L84.12 104.50 L83.92 107.12 L83.10 109.62 L81.93 111.88 L80.81 113.50 L77.88 116.24 L74.88 118.10 L70.62 119.92 L66.88 120.93 L59.25 122.00 L54.12 122.12 L51.25 121.90 L47.12 121.29 L43.38 120.49 L40.50 119.53 L38.38 118.60 L34.88 116.65 L31.75 114.43 L29.21 112.00 L26.21 107.88 L24.44 104.50 L22.64 99.25 L21.47 93.38 L21.25 90.50 L21.38 84.75 L21.76 82.50 L23.46 76.50 L24.90 73.00 L27.01 69.25 L28.25 67.75 L30.38 65.62 L31.88 64.47 L34.38 63.21 L37.25 62.44 L38.75 62.25 L40.38 62.33 L44.75 63.46 L72.25 75.68 L76.00 77.12 L77.72 77.40 L77.89 77.21 L77.83 76.88 L77.12 76.06 L70.75 71.38 L42.38 52.22 L40.75 51.50 L36.00 50.88 L34.25 50.88 L29.25 51.44 L27.88 51.78 L23.75 53.40 L21.62 54.58 L18.88 56.75 L16.19 59.50 L13.97 62.62 L11.83 66.62 L9.38 73.25 L8.29 77.50 L7.25 83.62 L7.25 86.88 L6.62 91.62 L6.50 95.00 L6.62 98.00 L7.12 101.38 L7.33 104.62 L8.62 109.88 L10.40 114.50 L12.46 118.25 L14.94 121.75 L16.12 123.12 L20.00 126.81 L25.12 130.40 L29.50 132.72 L34.12 134.67 L41.12 136.83 L46.12 137.92 L53.62 139.00 L68.62 139.12 L72.00 138.90 L78.38 137.71 L82.38 136.54 L86.50 134.85 L90.12 132.93 L94.00 130.33 L98.69 125.75 L100.15 123.75 L101.07 122.00 L101.43 120.75 L101.62 118.38 L101.50 86.12 L101.75 82.88 L101.50 79.62 L101.60 33.12 L102.76 27.88 L104.53 23.12 L107.54 17.50 L109.64 14.38 L112.42 11.25 L113.28 10.00 L113.47 9.00Z"/><path class="logo-accent" fill-rule="evenodd" d="M230.81 30.25 L227.75 27.07 L224.88 24.94 L221.25 21.71 L219.62 20.65 L217.50 19.92 L214.50 19.38 L212.38 19.46 L209.25 20.31 L207.75 21.10 L206.62 22.12 L202.94 26.25 L201.40 28.50 L200.38 31.25 L200.00 33.00 L200.11 34.38 L201.32 37.00 L201.07 37.85 L200.00 38.60 L196.88 39.90 L194.12 41.28 L192.75 42.17 L189.31 45.75 L187.81 48.38 L186.32 53.12 L185.88 57.38 L186.07 60.12 L187.58 66.50 L188.76 68.62 L191.75 71.93 L193.75 73.19 L196.88 74.15 L197.44 73.96 L197.75 73.38 L197.85 72.50 L197.69 71.38 L196.50 67.00 L194.76 62.12 L194.50 60.50 L194.57 55.00 L195.08 53.25 L196.21 51.12 L197.25 49.88 L198.62 48.82 L200.88 47.71 L203.12 47.12 L205.12 47.18 L207.50 47.94 L210.12 49.39 L211.57 50.75 L213.22 53.38 L214.04 56.00 L214.25 58.12 L214.25 70.88 L213.97 73.00 L213.44 74.38 L212.12 75.88 L210.38 76.72 L208.12 77.00 L202.62 76.78 L201.12 76.47 L197.75 75.28 L195.62 76.33 L193.88 76.79 L191.50 77.00 L185.38 77.12 L179.75 76.82 L178.50 76.44 L177.25 75.76 L176.38 75.00 L175.32 73.62 L174.83 72.62 L174.47 71.25 L174.49 56.12 L174.28 53.12 L173.78 51.12 L172.22 47.38 L171.49 46.25 L170.62 45.40 L169.75 44.85 L168.50 44.43 L167.25 44.43 L166.39 44.82 L165.72 45.88 L165.62 47.88 L166.62 54.38 L166.50 58.38 L166.62 73.75 L167.36 77.62 L168.03 79.25 L168.68 80.25 L170.38 81.75 L175.00 84.47 L177.25 85.18 L179.25 85.38 L211.88 85.25 L215.12 84.92 L216.50 84.57 L218.00 83.71 L219.58 82.12 L220.56 80.75 L221.69 78.50 L222.24 76.88 L222.62 74.50 L222.50 57.38 L221.99 53.38 L221.06 50.75 L219.47 47.12 L217.72 44.50 L213.62 41.06 L208.00 38.29 L207.44 37.75 L207.21 37.12 L208.31 34.50 L209.18 31.62 L209.93 30.38 L211.00 29.39 L213.00 28.35 L214.38 28.17 L216.25 28.60 L218.12 29.61 L222.62 33.71 L223.99 35.25 L226.17 38.50 L227.24 40.62 L227.62 43.12 L228.00 47.62 L227.75 52.12 L227.75 71.38 L228.00 74.62 L227.75 77.38 L228.31 80.12 L228.89 81.12 L229.62 81.92 L230.50 82.49 L231.75 82.99 L234.50 83.25 L235.88 83.01 L237.25 82.40 L237.82 81.75 L238.00 80.88 L237.68 79.62 L236.83 77.88 L236.50 76.38 L236.62 74.00 L236.50 70.38 L236.62 43.50 L236.42 40.38 L235.92 38.50 L234.85 36.25 L232.38 32.38Z"/></svg>`;

  const PRESETS = [
    { name: "Red", hex: "#d0262b" },
    { name: "Saffron", hex: "#e2711d" },
    { name: "Turmeric", hex: "#e0a100" },
    { name: "Leaf", hex: "#2f855a" },
    { name: "Peacock", hex: "#0e7c86" },
    { name: "Blue", hex: "#2563eb" },
    { name: "Indigo", hex: "#4f46e5" },
    { name: "Plum", hex: "#8b3a8f" },
    { name: "Rose", hex: "#db2777" },
    { name: "Charcoal", hex: "#3f3f46" },
  ];
  const DEFAULT_COLOR = PRESETS[0].hex;

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: still works, just not saved */ } },
  };

  // ---------- color math ----------
  const hexToRgb = (hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function luminance(rgb) {
    const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  // Nudge a color toward black or white until it is readable on the background (WCAG 4.5:1)
  function readableOn(color, background) {
    const target = luminance(background) > 0.5 ? [0, 0, 0] : [255, 255, 255];
    let c = color;
    for (let t = 0; t <= 1.0001 && contrast(c, background) < 4.5; t += 0.05) c = mix(color, target, t);
    return c;
  }

  const root = document.documentElement;
  const SURFACE = { light: [255, 255, 255], dark: [31, 30, 41] };
  const prefersDark = () => window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = () => {
    const t = store.get("ari-theme", "system");
    return t === "system" ? (prefersDark() ? "dark" : "light") : t;
  };

  // Turn one chosen color into the handful of variables the CSS uses
  function applyColor(hex) {
    const rgb = hexToRgb(hex);
    const theme = currentTheme();
    const surface = SURFACE[theme];
    const s = root.style;
    s.setProperty("--accent", hex);
    s.setProperty("--accent-deep", rgbToHex(mix(rgb, [0, 0, 0], 0.18)));
    // text that sits on top of the accent: white or near-black, whichever reads better
    s.setProperty("--on-accent", contrast(rgb, [255, 255, 255]) >= 3 ? "#ffffff" : "#1f1d2b");
    // the accent used as text or thin lines on the page background
    s.setProperty("--accent-text", rgbToHex(readableOn(rgb, surface)));
    s.setProperty("--accent-wash", rgbToHex(mix(surface, rgb, theme === "dark" ? 0.22 : 0.12)));
    s.setProperty("--accent-tint", rgbToHex(mix(surface, rgb, theme === "dark" ? 0.08 : 0.04)));
  }

  function applyTheme(choice) {
    if (choice === "system") delete root.dataset.theme;
    else root.dataset.theme = choice;
    applyColor(store.get("ari-color", DEFAULT_COLOR));
  }

  // Apply immediately, before the body is drawn
  applyTheme(store.get("ari-theme", "system"));
  if (window.matchMedia) {
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (store.get("ari-theme", "system") === "system") applyColor(store.get("ari-color", DEFAULT_COLOR));
    });
  }

  // ---------- page setup once the HTML is ready ----------
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-logo]").forEach((elm) => { elm.innerHTML = LOGO; });

    const btn = document.getElementById("appearanceBtn");
    const panel = document.getElementById("appearancePanel");
    if (!btn || !panel) return;

    const swatches = panel.querySelector(".swatches");
    const custom = panel.querySelector("#customColor");
    const themeButtons = panel.querySelectorAll("[data-theme-choice]");

    PRESETS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.style.background = p.hex;
      b.dataset.hex = p.hex;
      b.title = p.name;
      b.setAttribute("aria-label", p.name);
      b.addEventListener("click", () => choose(p.hex));
      swatches.append(b);
    });

    function syncPanel() {
      const color = store.get("ari-color", DEFAULT_COLOR).toLowerCase();
      panel.querySelectorAll(".swatch").forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.hex === color)));
      custom.value = color;
      const t = store.get("ari-theme", "system");
      themeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeChoice === t)));
    }

    function choose(hex) {
      store.set("ari-color", hex);
      applyColor(hex);
      syncPanel();
    }

    custom.addEventListener("input", () => { store.set("ari-color", custom.value); applyColor(custom.value); });
    custom.addEventListener("change", syncPanel);
    themeButtons.forEach((b) => b.addEventListener("click", () => {
      store.set("ari-theme", b.dataset.themeChoice);
      applyTheme(b.dataset.themeChoice);
      syncPanel();
    }));
    panel.querySelector("#resetColor").addEventListener("click", () => {
      store.set("ari-theme", "system");
      applyTheme("system");
      choose(DEFAULT_COLOR);
    });

    function open(show) {
      panel.hidden = !show;
      btn.setAttribute("aria-expanded", String(show));
      if (show) { syncPanel(); panel.querySelector("button").focus(); }
    }
    btn.addEventListener("click", () => open(panel.hidden));
    document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) open(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
  });
})();
