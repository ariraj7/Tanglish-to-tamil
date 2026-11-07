/*
 * kolam.js — draws a sikku kolam: one unbroken line weaving around a grid of dots.
 *
 * The line travels diagonally between the dots and bounces off the edges of the
 * grid like a billiard ball. When the grid's width and height share no common
 * factor (5 and 4, 7 and 5…), the line visits every gap and closes into a
 * single loop, which is the rule traditional sikku kolams follow.
 */
(function (root) {
  "use strict";

  // Returns the points of the loop in "half-dot" units: dots sit at odd (x, y).
  function kolamPoints(cols, rows) {
    const W = 2 * cols;
    const H = 2 * rows;
    const start = { x: 2, y: 1, dx: 1, dy: 1 };
    const pts = [];
    let { x, y, dx, dy } = start;
    do {
      pts.push({ x, y, edge: x === 0 || x === W || y === 0 || y === H });
      x += dx;
      y += dy;
      if (x === 0 || x === W) dx = -dx;
      if (y === 0 || y === H) dy = -dy;
    } while (!(x === start.x && y === start.y && dx === start.dx && dy === start.dy) && pts.length < 10000);
    return { pts, W, H };
  }

  // Builds an SVG path. Straight diagonals cross between the dots; at the edge
  // of the grid the line wraps around the outer dot in a round loop.
  function kolamPath(cols, rows, gap, pad) {
    const { pts } = kolamPoints(cols, rows);
    const s = gap / 2;
    const X = (v) => (pad + v * s).toFixed(1);
    const n = pts.length;
    const r = (s * Math.SQRT1_2).toFixed(1); // loop radius: just touches both diagonals
    // start at a crossing point (pts[0] is never on the edge)
    let d = `M${X(pts[0].x)} ${X(pts[0].y)}`;
    for (let k = 1; k <= n; k++) {
      const prev = pts[k - 1];
      const cur = pts[k % n];
      const next = pts[(k + 1) % n];
      if (!cur.edge) { d += ` L${X(cur.x)} ${X(cur.y)}`; continue; }
      // the dot this loop goes around sits between prev and next
      const dot = { x: (prev.x + next.x) / 2, y: (prev.y + next.y) / 2 };
      const f1 = { x: (cur.x + dot.x) / 2 + (prev.x - next.x) / 4, y: (cur.y + dot.y) / 2 + (prev.y - next.y) / 4 };
      const f2 = { x: (cur.x + dot.x) / 2 - (prev.x - next.x) / 4, y: (cur.y + dot.y) / 2 - (prev.y - next.y) / 4 };
      const din = { x: cur.x - prev.x, y: cur.y - prev.y };
      const dout = { x: next.x - cur.x, y: next.y - cur.y };
      const sweep = din.x * dout.y - din.y * dout.x > 0 ? 1 : 0;
      d += ` L${X(f1.x)} ${X(f1.y)} A${r} ${r} 0 0 ${sweep} ${X(f2.x)} ${X(f2.y)}`;
    }
    const W = 2 * cols, H = 2 * rows;
    const dots = [];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) dots.push([pad + (2 * i + 1) * s, pad + (2 * j + 1) * s]);
    return { d: d + " Z", dots, width: pad * 2 + W * s, height: pad * 2 + H * s };
  }

  function kolamSVG(cols, rows, { gap = 40, pad = 14, stroke = 3, dot = 3.2, className = "" } = {}) {
    const k = kolamPath(cols, rows, gap, pad);
    const dots = k.dots.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dot}"/>`).join("");
    return `<svg class="${className}" viewBox="0 0 ${k.width.toFixed(0)} ${k.height.toFixed(0)}" aria-hidden="true" focusable="false">` +
      `<g class="kolam-dots">${dots}</g>` +
      `<path class="kolam-line" d="${k.d}" fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const api = { kolamPoints, kolamPath, kolamSVG };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Kolam = api;
})(typeof window !== "undefined" ? window : globalThis);
