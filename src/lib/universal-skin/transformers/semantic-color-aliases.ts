/* ==========================================================================
   Pemetaan alias variabel CSS umum -> Universal Design System SUPERSUKA.
   Alias dipilih dari nama variabel CSS yang lazim digunakan aplikasi web.

   Kenapa eksplisit? Pemetaan generik berbasis OKLCH (color.ts) hanya menebak
   dari hue + lightness, sehingga hasilnya mendekati palet tetapi tidak persis
   (mis. primary menjadi #135734, bukan #155E38) dan latar status yang sangat
   pucat (merah/biru/plum) bisa dianggap netral dan kehilangan warnanya.
   Alias yang cocok dipetakan langsung ke nilai palet.
   Warna literal di luar token tetap ditangani pemetaan generik.

   Semua pasangan teks/latar di bawah sudah dicek kontrasnya >= 4.5:1 (WCAG AA).
   ========================================================================== */

// Palet inti (Design System, bagian 3)
const GREEN = "#155E38";
const GREEN_DARK = "#0F4A2C";
const GREEN_TINT = "#E4F1E8";
const INK = "#14261B";
const INK_2 = "#44574B";

// Status (bagian 3.3). Latar pucat = turunan lebih terang dari warna status.
const WARN = "#A8540A";
const WARN_BG = "#FBF0E4";
const INFO = "#1C5DA8";
const INFO_BG = "#E8F0FA";
const OK = "#1B7A43";
const OK_BG = "#E2F2E8";
const ERR = "#B3261E";
const ERR_BG = "#FDF0EF";

/** Nama variabel (huruf kecil) -> nilai hex. Diterapkan pada setiap deklarasi variabel tsb. */
export const TOKEN_COLORS: Record<string, string> = {
  // Permukaan & teks
  "--bg": "#F8FAFC",
  "--surface": "#FFFFFF",
  "--ink": INK,
  "--text": INK,
  "--muted": INK_2,

  // Identitas
  "--primary": GREEN,
  "--primary-700": GREEN_DARK,
  "--primary-50": GREEN_TINT,
  "--primary-100": "#CBE4D5",
  "--dark": GREEN_DARK,

  // Garis & kontrol
  "--line": "#DCE7E0",
  "--line-strong": "#C3D5C9",
  "--field": "#5E6E63",
  "--focus": INFO, // garis fokus keyboard memakai biru status (bagian 3.3)

  // Galat
  "--err": ERR,
  "--err-bg": ERR_BG,

  // Status aplikasi: submitted=amber, under_review=blue, in_progress=teal,
  // resolved=green, rejected=plum. Design System: menunggu=oranye, diproses/ditinjau=biru,
  // selesai=hijau, ditolak=merah.
  "--st-amber": WARN,
  "--st-amber-bg": WARN_BG,
  "--st-blue": INFO,
  "--st-blue-bg": INFO_BG,
  "--st-teal": INFO,
  "--st-teal-bg": INFO_BG,
  "--st-green": OK,
  "--st-green-bg": OK_BG,
  "--st-plum": ERR,
  "--st-plum-bg": ERR_BG,
};
