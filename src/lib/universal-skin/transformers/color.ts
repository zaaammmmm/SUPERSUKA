const BLUE_AS_BRAND = process.env.SUPERAPP_BLUE_AS_BRAND === "1";

/* ==========================================================================
   Konversi warna dan pemetaan palet ke Design System Superapp Kampus.
   Pendekatan: warna asal -> OKLCH. Keluarga hue menentukan "rampa" tujuan,
   lightness (L) menentukan tingkat terang/gelapnya. Jadi tidak bergantung
   pada nama class atau nama variabel di CSS SISKA.
   ========================================================================== */

export type Rgba = { r: number; g: number; b: number; a: number };
type Lab = { L: number; a: number; b: number };

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (c: number) => {
  const v = clamp(c);
  return Math.round(clamp(v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055) * 255);
};

export function rgbToOklab(r: number, g: number, b: number): Lab {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

export function oklabToRgb({ L, a, b }: Lab): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/* ------------------------------ Parsing ---------------------------------- */

const NUM = String.raw`[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?`;
const hexToRgba = (hex: string): Rgba | null => {
  let h = hex.slice(1);
  if (![3, 4, 6, 8].includes(h.length)) return null;
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
};

const alphaOf = (v?: string) => {
  if (v == null) return 1;
  return clamp(v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v));
};
const channel = (v: string) => (v.endsWith("%") ? (parseFloat(v) / 100) * 255 : parseFloat(v));

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  h = (h * 60 + 360) % 360;
  return [h, s, l];
}

const RE_RGB = new RegExp(String.raw`^rgba?\(\s*(${NUM}%?)[\s,]+(${NUM}%?)[\s,]+(${NUM}%?)(?:\s*[,/]\s*(${NUM}%?))?\s*\)$`, "i");
const RE_HSL = new RegExp(String.raw`^hsla?\(\s*(${NUM})(?:deg)?[\s,]+(${NUM})%[\s,]+(${NUM})%(?:\s*[,/]\s*(${NUM}%?))?\s*\)$`, "i");
const RE_OKLCH = new RegExp(String.raw`^oklch\(\s*(${NUM}%?)\s+(${NUM}%?)\s+(${NUM})(?:deg)?(?:\s*/\s*(${NUM}%?))?\s*\)$`, "i");

export function parseColor(token: string): Rgba | null {
  if (token.startsWith("#")) return hexToRgba(token);
  let m = RE_RGB.exec(token);
  if (m) return { r: channel(m[1]), g: channel(m[2]), b: channel(m[3]), a: alphaOf(m[4]) };
  m = RE_HSL.exec(token);
  if (m) {
    const [r, g, b] = hslToRgb(((parseFloat(m[1]) % 360) + 360) % 360, clamp(parseFloat(m[2]) / 100), clamp(parseFloat(m[3]) / 100));
    return { r, g, b, a: alphaOf(m[4]) };
  }
  m = RE_OKLCH.exec(token);
  if (m) {
    const L = m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    const C = m[2].endsWith("%") ? (parseFloat(m[2]) / 100) * 0.4 : parseFloat(m[2]);
    const h = (parseFloat(m[3]) * Math.PI) / 180;
    const [r, g, b] = oklabToRgb({ L, a: C * Math.cos(h), b: C * Math.sin(h) });
    return { r, g, b, a: alphaOf(m[4]) };
  }
  return null;
}

/* ------------------------------ Rampa tujuan ----------------------------- */

type Stop = { L: number; lab: Lab };
// Setiap anggota: "#hex" (L dihitung dari warnanya) atau ["#hex", L] untuk menetapkan L secara
// eksplisit. Dua stop berwarna sama membentuk "dataran": rentang shade 600-700 pada CSS asal
// (umumnya warna tombol/tautan) jatuh tepat pada warna palet, bukan warna perantara.
const ramp = (entries: Array<string | [string, number]>): Stop[] =>
  entries
    .map((e) => {
      const [hex, L] = typeof e === "string" ? [e, undefined] : e;
      const c = hexToRgba(hex)!;
      const lab = rgbToOklab(c.r, c.g, c.b);
      return { L: L ?? lab.L, lab };
    })
    .sort((x, y) => x.L - y.L);

// Netral: #14261B (teks utama), #44574B (teks pendukung), #5E6E63, #C3D5C9/#DCE7E0 (garis), #F8FAFC (latar)
const NEUTRAL = ramp([
  ["#0B1610", 0.12], ["#14261B", 0.22], ["#14261B", 0.3], "#44574B", "#5E6E63",
  "#8D9F93", "#C3D5C9", "#DCE7E0", "#EEF3F0", "#F8FAFC", "#FFFFFF",
]);
// Hijau identitas kampus: #155E38 (utama), #0F4A2C (tua), #1B7A43, #E4F1E8 (tint)
const BRAND = ramp([
  ["#062014", 0.2], ["#0A3320", 0.3], ["#0F4A2C", 0.47], ["#155E38", 0.5], ["#155E38", 0.63],
  ["#6FB088", 0.72], ["#A3CDB3", 0.78], ["#CBE4D5", 0.9], ["#E4F1E8", 0.95], ["#F6FAF7", 0.985],
]);
// Status: merah #B3261E, oranye #A8540A, biru #1C5DA8
const ERROR = ramp([
  ["#3F0C09", 0.25], ["#5E120F", 0.4], ["#8F1D17", 0.48], ["#B3261E", 0.53], ["#B3261E", 0.6],
  ["#DE766E", 0.7], ["#F0B3AE", 0.82], ["#F9DEDC", 0.92], ["#FDF3F2", 0.97],
]);
const WARN = ramp([
  ["#4F2805", 0.3], ["#7F3F08", 0.45], ["#A8540A", 0.56], ["#A8540A", 0.68],
  ["#E0A468", 0.78], ["#ECD3B6", 0.88], ["#FBF0E4", 0.95], ["#FEF8F1", 0.98],
]);
const INFO = ramp([
  ["#0B2547", 0.3], ["#0F3260", 0.42], ["#164A86", 0.47], ["#1C5DA8", 0.52], ["#1C5DA8", 0.58],
  ["#6A9AD4", 0.7], ["#A9C5E8", 0.82], ["#D6E4F5", 0.92], ["#EEF4FB", 0.97],
]);

function sample(stops: Stop[], L: number): Lab {
  if (L <= stops[0].L) return stops[0].lab;
  const last = stops[stops.length - 1];
  if (L >= last.L) return last.lab;
  for (let i = 1; i < stops.length; i++) {
    if (L <= stops[i].L) {
      const lo = stops[i - 1], hi = stops[i];
      const t = (L - lo.L) / (hi.L - lo.L);
      return {
        L: lo.lab.L + (hi.lab.L - lo.lab.L) * t,
        a: lo.lab.a + (hi.lab.a - lo.lab.a) * t,
        b: lo.lab.b + (hi.lab.b - lo.lab.b) * t,
      };
    }
  }
  return last.lab;
}

/** Keluarga hue (derajat OKLCH): merah, oranye/kuning, hijau/teal, biru, ungu/pink. */
function familyOf(h: number): Stop[] {
  if (h >= 345 || h < 38) return ERROR;
  if (h < 110) return WARN;
  if (h < 215) return BRAND;
  if (h < 265) return BLUE_AS_BRAND ? BRAND : INFO;
  return BRAND; // indigo, violet, ungu, fuchsia, pink
}

export function mapColor(c: Rgba): Rgba {
  const lab = rgbToOklab(c.r, c.g, c.b);
  const chroma = Math.hypot(lab.a, lab.b);
  // Latar pucat (L tinggi) punya kroma kecil tetapi tetap membawa makna warna (merah/biru/oranye);
  // ambang diturunkan agar tidak jatuh ke netral dan kehilangan warnanya.
  const chromatic = lab.L >= 0.9 ? chroma >= 0.012 : chroma >= 0.05;

  if (!chromatic) {
    if (lab.L >= 0.995) return { r: 255, g: 255, b: 255, a: c.a };
    const [r, g, b] = oklabToRgb(sample(NEUTRAL, lab.L));
    return { r, g, b, a: c.a };
  }
  const h = ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360;
  const [r, g, b] = oklabToRgb(sample(familyOf(h), lab.L));
  return { r, g, b, a: c.a };
}

/* ------------------------------ Serialisasi ------------------------------ */

const hex2 = (n: number) => n.toString(16).padStart(2, "0");
export function formatColor({ r, g, b, a }: Rgba): string {
  if (a >= 0.999) return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  return `rgb(${r} ${g} ${b} / ${Math.round(a * 1000) / 1000})`;
}
