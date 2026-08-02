// Generates abstract, film-toned SVG placeholders so the design reads
// end-to-end before real scans are dropped in. Each uses layered gradients
// + feTurbulence grain so they feel like out-of-focus film frames, not
// gray boxes. Swap public/photos/* with real JPEGs later — same filenames.
import { writeFileSync } from "node:fs";

const palettes = {
  portra: [["#d9a08a", "#e8c9a8", "#9db2a8"], ["#c98d74", "#e5d2b8", "#7e9b94"]],
  gold: [["#e0a45c", "#c97a3e", "#6e5a3f"], ["#e8b878", "#a05c30", "#4a3c2a"]],
  trix: [["#d8d4cc", "#8a867e", "#2a2824"], ["#b8b4ac", "#5a5650", "#1a1816"]],
  cinestill: [["#3a4a6a", "#c96a4a", "#1a2030"], ["#4a5a80", "#e08050", "#141824"]],
  superia: [["#8aa87e", "#d8c890", "#4a6050"], ["#a0b890", "#e0d0a0", "#3a5044"]],
};

function svg(id, w, h, stops, seed) {
  const [a, b, c] = stops;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<radialGradient id="g1" cx="${30 + (seed % 40)}%" cy="${20 + (seed % 50)}%" r="90%">
<stop offset="0%" stop-color="${b}"/><stop offset="55%" stop-color="${a}"/><stop offset="100%" stop-color="${c}"/>
</radialGradient>
<linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${c}" stop-opacity="0"/><stop offset="100%" stop-color="${c}" stop-opacity=".55"/>
</linearGradient>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.55 0"/>
<feComposite operator="over" in2="SourceGraphic"/></filter>
<filter id="soft"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.008" numOctaves="2" seed="${seed + 7}"/>
<feDisplacementMap in="SourceGraphic" scale="${60 + (seed % 60)}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#g1)"/>
<g filter="url(#soft)" opacity=".7">
<ellipse cx="${w * 0.62}" cy="${h * 0.4}" rx="${w * 0.5}" ry="${h * 0.32}" fill="${b}" opacity=".6"/>
<ellipse cx="${w * 0.25}" cy="${h * 0.75}" rx="${w * 0.4}" ry="${h * 0.3}" fill="${c}" opacity=".5"/>
</g>
<rect width="${w}" height="${h}" fill="url(#g2)"/>
<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".16"/>
</svg>`;
}

const shots = [
  ["p01", "landscape", "portra", 0], ["p02", "portrait", "gold", 1],
  ["p03", "landscape", "trix", 2], ["p04", "portrait", "portra", 3],
  ["p05", "landscape", "cinestill", 4], ["p06", "square", "gold", 5],
  ["p07", "portrait", "trix", 6], ["p08", "landscape", "superia", 7],
  ["p09", "landscape", "portra", 8], ["p10", "portrait", "cinestill", 9],
  ["p11", "landscape", "gold", 10], ["p12", "square", "trix", 11],
  ["p13", "portrait", "superia", 12], ["p14", "landscape", "portra", 13],
];
const dims = { landscape: [1600, 1067], portrait: [1067, 1600], square: [1400, 1400] };

for (const [id, aspect, pal, seed] of shots) {
  const [w, h] = dims[aspect];
  const stops = palettes[pal][seed % 2];
  writeFileSync(`public/photos/${id}.svg`, svg(id, w, h, stops, seed * 13 + 5));
}
console.log(`generated ${shots.length} placeholders`);
