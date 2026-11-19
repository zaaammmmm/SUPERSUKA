import { formatColor, mapColor, parseColor, rgbToHsl } from "./color";
import { TOKEN_COLORS } from "./semantic-color-aliases";

/* ==========================================================================
   Transformasi CSS upstream -> Universal Design System SUPERSUKA (dijalankan di proxy)
   0. Komentar     : dibuang (apostrof/tanda kutip di komentar tidak boleh mengacaukan pemindaian)
   1. Warna        : token SISKA dipetakan persis (tokens.ts); warna literal lain dipetakan
                     ke palet hijau/emas + warna status secara generik (color.ts)
   2. Tipografi    : font-family -> Plus Jakarta Sans (mono & icon font dibiarkan)
   3. Ukuran teks  : minimum 12px
   4. Radius       : dibulatkan ke 6 / 10 / 16 px
   5. Mode gelap   : @media (prefers-color-scheme: dark) dibuang (design system hanya light)
   ========================================================================== */

const FONT_STACK = `"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif`;
// Dicek hanya pada keluarga font PERTAMA: stack sistem standar memuat "Segoe UI Symbol" dan
// "Apple Color Emoji" di ekornya, dan itu tidak boleh membuat seluruh stack dianggap font ikon.
const KEEP_FONT = /mono|icon|awesome|material|symbol|emoji|^\s*(?:inherit|initial|unset|revert)/i;
const firstFamily = (val: string) => val.replace(/!important\s*$/i, "").split(",")[0] ?? "";

/** Buang komentar CSS. Build produksi sudah tanpa komentar, tetapi `next dev` tidak. */
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Hapus blok @media (prefers-color-scheme: dark) { ... } dengan pencocokan kurung. */
function stripDarkMedia(css: string): string {
  const re = /@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{/gi;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < css.length && depth > 0) {
      const ch = css[i++];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
    }
    out += css.slice(last, m.index);
    last = i;
    re.lastIndex = i;
  }
  return out + css.slice(last);
}

/* ------------------------------ 1. Warna --------------------------------- */

const COLOR_FN = String.raw`(?:rgba?|hsla?|oklch)\([^()]*\)`;
const COLOR_SCAN = new RegExp(
  [
    String.raw`@font-face\s*\{[^}]*\}`, // dibiarkan
    String.raw`url\([^)]*\)`, // dibiarkan
    String.raw`"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'`, // string, dibiarkan
    String.raw`\\[\s\S]`, // karakter escape (mis. selector bg-\[\#fff\]), dibiarkan
    `(?<fn>${COLOR_FN})`,
    String.raw`(?<hex>#[0-9a-fA-F]{3,8})(?![0-9a-zA-Z_-])`,
  ].join("|"),
  "gi",
);

function mapColors(css: string): string {
  return css.replace(COLOR_SCAN, (...args) => {
    const groups = args[args.length - 1] as { fn?: string; hex?: string };
    const token = groups.fn ?? groups.hex;
    if (!token) return args[0];
    const parsed = parseColor(token);
    return parsed ? formatColor(mapColor(parsed)) : token;
  });
}

/* ------------------------- 2-4. Deklarasi tertentu ----------------------- */

const DECL_SCAN = new RegExp(
  [
    String.raw`(?<keep>@font-face\s*\{[^}]*\})`,
    String.raw`(?<prop>--[\w-]+|[a-z-]+)(?<sep>\s*:\s*)(?<val>[^;{}]+)(?=[;}])`,
  ].join("|"),
  "gi",
);

const RADIUS_PROP = /^(?:border-(?:top|bottom)-(?:left|right)-radius|border-(?:start|end)-(?:start|end)-radius|border-radius|--(?:radius|rounded|r)(?:-[\w-]+)?)$/i;
const FONT_VAR_PROP = /^--(?:font(?:-[\w-]+)?|default-font-family)$/i;
const FONT_VAR_SKIP = /weight|size|style|feature|variation|stretch|leading|tracking|mono|optical/i;
const TEXT_VAR_PROP = /^--text-\w+$/i;
// Variabel warna gaya shadcn: "--primary: 262 83% 58%" (hsl tanpa fungsi) atau "12 34 56" (rgb tanpa fungsi)
const COLOR_VAR_NAME = /color|primary|secondary|accent|border|ring|foreground|background|muted|card|popover|destructive|input|brand|surface|sidebar|chart/i;
const HSL_TRIPLET = /^(\s*)(\d+(?:\.\d+)?)(?:deg)?(\s+)(\d+(?:\.\d+)?)%(\s+)(\d+(?:\.\d+)?)%(\s*)$/;
const RGB_TRIPLET = /^(\s*)(\d{1,3})(\s+)(\d{1,3})(\s+)(\d{1,3})(\s*)$/;

const toPx = (n: number, unit: string) => (unit === "rem" || unit === "em" ? n * 16 : n);
const SIZE_VALUE = /^\s*(\d*\.?\d+)(px|rem)\s*(!important)?\s*$/i;

function mapRadiusPx(px: number): number {
  if (px < 0.5 || px >= 40) return px; // 0 dan pill (rounded-full) tidak diubah
  if (px <= 7) return 6;
  if (px <= 12) return 10;
  return 16;
}

function mapRadiusValue(val: string): string {
  if (/calc|var\(|\/|env\(|clamp|min\(|max\(/i.test(val)) return val;
  return val.replace(/(\d*\.?\d+)(px|rem|em)\b/gi, (all, n: string, unit: string) => {
    const px = toPx(parseFloat(n), unit.toLowerCase());
    const mapped = mapRadiusPx(px);
    return mapped === px ? all : `${mapped}px`;
  });
}

function mapDeclarations(css: string): string {
  return css.replace(DECL_SCAN, (...args) => {
    const g = args[args.length - 1] as { keep?: string; prop?: string; sep?: string; val?: string };
    if (g.keep) return g.keep;
    const prop = g.prop!;
    const val = g.val!;
    const rebuild = (v: string) => `${prop}${g.sep}${v}`;

    // 1. Token semantik yang sudah dikenal: pakai nilai palet persis
    const token = prop.startsWith("--") ? TOKEN_COLORS[prop.toLowerCase()] : undefined;
    if (token) return rebuild(token + (/!important\s*$/i.test(val) ? "!important" : ""));

    // 2. Tipografi
    if (/^font-family$/i.test(prop) || (FONT_VAR_PROP.test(prop) && !FONT_VAR_SKIP.test(prop))) {
      if (KEEP_FONT.test(firstFamily(val))) return args[0];
      const important = /!important\s*$/i.test(val) ? "!important" : "";
      return rebuild(FONT_STACK + important);
    }

    // 3. Ukuran teks minimum 12px
    if (/^font-size$/i.test(prop) || TEXT_VAR_PROP.test(prop)) {
      const m = SIZE_VALUE.exec(val);
      if (m) {
        const px = toPx(parseFloat(m[1]), m[2].toLowerCase());
        if (px > 0 && px < 12) return rebuild(`${m[2].toLowerCase() === "rem" ? "0.75rem" : "12px"}${m[3] ? "!important" : ""}`);
      }
      return args[0];
    }

    // 4. Radius 6 / 10 / 16
    if (RADIUS_PROP.test(prop)) return rebuild(mapRadiusValue(val));

    // Variabel warna tanpa fungsi (gaya shadcn)
    if (prop.startsWith("--") && COLOR_VAR_NAME.test(prop)) {
      const h = HSL_TRIPLET.exec(val);
      if (h) {
        const c = parseColor(`hsl(${h[2]} ${h[4]}% ${h[6]}%)`);
        if (c) {
          const o = mapColor(c);
          const [hh, ss, ll] = rgbToHsl(o.r, o.g, o.b);
          return rebuild(`${h[1]}${Math.round(hh * 10) / 10} ${Math.round(ss * 1000) / 10}% ${Math.round(ll * 1000) / 10}%${h[7]}`);
        }
      }
      const r = RGB_TRIPLET.exec(val);
      if (r && +r[2] <= 255 && +r[4] <= 255 && +r[6] <= 255) {
        const o = mapColor({ r: +r[2], g: +r[4], b: +r[6], a: 1 });
        return rebuild(`${r[1]}${o.r} ${o.g} ${o.b}${r[7]}`);
      }
    }
    return args[0];
  });
}

/* ------------------------------- Publik ---------------------------------- */

export function transformCss(css: string): string {
  return mapDeclarations(mapColors(stripDarkMedia(stripComments(css))));
}

const BRAND_GREEN = "#155E38";

/**
 * Metadata ikon SISKA memakai "/siska.png" (tanpa basePath), padahal berkasnya ada di
 * "/siska/siska.png". Di domain SISKA sendiri ini 404; di bawah portal path tsb jatuh ke portal.
 */
const fixIconPaths = (html: string) =>
  html.replace(/(<link\b[^>]*\bhref=["'])\/siska\.png(["'])/gi, "$1/siska/siska.png$2");

/** Transformasi HTML: <style> inline, theme-color, dan suntik skin + font. */
export function transformHtml(html: string, transformStyles = true, assetPrefix = "/__superapp/", serviceId = ""): string {
  const base = serviceId === "siska" ? fixIconPaths(html) : html;
  if (!transformStyles) return injectSkin(base, assetPrefix);
  let out = base.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_m, open: string, body: string, close: string) => `${open}${transformCss(body)}${close}`);
  out = out.replace(/(<meta\s+name=["']theme-color["'][^>]*content=["'])[^"']*(["'])/gi, `$1${BRAND_GREEN}$2`);
  return injectSkin(out, assetPrefix);
}

function injectSkin(html: string, assetPrefix: string): string {
  const inject = `<link rel="stylesheet" href="${assetPrefix}font.css"><link rel="stylesheet" href="${assetPrefix}skin.css"><script defer src="${assetPrefix}runtime.js"></script>`;
  return /<\/head>/i.test(html) ? html.replace(/<\/head>/i, () => `${inject}</head>`) : inject + html;
}

/** Ubah CSS Google Fonts agar file font diambil lewat proxy portal (tanpa kontak langsung ke Google). */
export function rewriteGoogleFontCss(css: string, filePrefix: string): string {
  return css.replace(/url\(\s*https:\/\/fonts\.gstatic\.com\/([^)\s]+)\s*\)/g, (_m, path: string) => `url(${filePrefix}${path})`);
}
