import { DESIGN_TOKENS } from "@/lib/design-system";

const c = DESIGN_TOKENS.colors;
const t = DESIGN_TOKENS.typography;
const r = DESIGN_TOKENS.radius;

export const UNIVERSAL_SKIN_CSS = `
:root {
  color-scheme: light;
  --ss-primary: ${c.primary}; --ss-primary-dark: ${c.primaryDark};
  --ss-primary-soft: ${c.primarySoft}; --ss-secondary: ${c.secondary};
  --ss-bg: ${c.background}; --ss-surface: ${c.surface};
  --ss-text: ${c.text}; --ss-muted: ${c.textMuted};
  --ss-new: ${c.statusNew}; --ss-warning: ${c.warning}; --ss-info: ${c.info};
  --ss-success: ${c.success}; --ss-danger: ${c.danger};
  --ss-radius-sm: ${r.sm}; --ss-radius-md: ${r.md}; --ss-radius-lg: ${r.lg};
  --ss-font: ${t.family};
  --ss-shadow-sm: 0 1px 3px rgb(20 38 27 / .08);
  --ss-shadow-md: 0 8px 24px rgb(20 38 27 / .12);
}
html { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; }
body { background-color: var(--ss-bg); color: var(--ss-text); font-family: var(--ss-font); }
button, input, select, textarea { font: inherit; }
:focus-visible { outline: 3px solid var(--ss-info) !important; outline-offset: 3px !important; }
::selection { background: var(--ss-primary-soft); color: var(--ss-text); }
[data-super-component] { min-width: 0; }
[data-super-component="button-primary"], button[data-super-variant="primary"], [role="button"][data-super-variant="primary"] {
  background: var(--ss-primary) !important; border-color: var(--ss-primary) !important;
  color: #fff !important; border-radius: var(--ss-radius-md) !important;
}
[data-super-component="button-danger"] { background: var(--ss-danger) !important; border-color: var(--ss-danger) !important; color: #fff !important; border-radius: var(--ss-radius-md) !important; }
[data-super-component="button-secondary"], button[data-super-variant="secondary"] {
  background: var(--ss-primary-soft) !important; border-color: var(--ss-primary-soft) !important;
  color: var(--ss-primary-dark) !important; border-radius: var(--ss-radius-md) !important;
}
[data-super-component="card"] {
  background: var(--ss-surface); border: 1px solid rgb(20 38 27 / .08);
  border-radius: var(--ss-radius-lg); box-shadow: var(--ss-shadow-sm);
}
[data-super-component="input"] {
  min-height: 2.65rem; border-radius: var(--ss-radius-sm) !important;
  font-family: var(--ss-font) !important; max-width: 100%;
}
[data-super-component="form"] { min-width: 0; }
[data-super-layout="responsive-grid"] { grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); }
[data-super-layout="wrapping-row"] { flex-wrap: wrap; }
[data-super-component="badge-success"] { background: #E2F2E8 !important; color: var(--ss-success) !important; }
[data-super-component="badge-warning"] { background: #FBF0E4 !important; color: var(--ss-warning) !important; }
[data-super-component="badge-danger"] { background: #FDF0EF !important; color: var(--ss-danger) !important; }
[data-super-component="badge-info"] { background: #E8F0FA !important; color: var(--ss-info) !important; }
[data-super-component="navigation"] { min-width: 0; }
[data-super-component="navigation"] a[aria-current="page"],
[data-super-component="navigation"] a[aria-current="true"],
[data-super-component="navigation"] [aria-current="page"] {
  color: var(--ss-primary) !important; background: var(--ss-primary-soft) !important;
}
[data-super-component="sidebar"] { min-width: 0; }
[data-super-component="modal"], [role="dialog"], dialog[open] {
  border-radius: var(--ss-radius-lg); box-shadow: var(--ss-shadow-md);
  max-width: min(94vw, 48rem); max-height: min(90dvh, 52rem); overflow: auto;
}
[data-super-component="dropdown"], [data-super-component="dropdown-trigger"] {
  border-radius: var(--ss-radius-md);
}
[data-super-component="dropdown"] { box-shadow: var(--ss-shadow-md); }
[data-super-component="table"] { width: 100%; border-collapse: collapse; }
[data-super-component="table"] th {
  background: var(--ss-primary-soft); color: var(--ss-text); text-align: start;
}
[data-super-component="table"] :is(th,td) { padding: .7rem .85rem; }
img, video, canvas, svg { max-width: 100%; }
pre, code { overflow-wrap: anywhere; }
button, [role="button"], input, select, textarea { touch-action: manipulation; }
@media (max-width: 768px) {
  [data-super-component="card"]:not([data-super-confidence="0.68"]) { border-radius: var(--ss-radius-md); }
  [data-super-component="table"] { display: block; overflow-x: auto; }
  [data-super-component="modal"], [role="dialog"], dialog[open] {
    width: min(94vw, 42rem); max-height: 88dvh;
  }
  [data-super-component="navigation"] { max-width: 100%; }
}
@media (max-width: 480px) {
  body { overflow-wrap: break-word; }
  [data-super-component="input"] { width: 100%; }
  [data-super-component="button-primary"],
  [data-super-component="button-secondary"],
  [data-super-component="button-danger"] { min-height: 2.65rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important; animation-duration: .01ms !important;
    animation-iteration-count: 1 !important; transition-duration: .01ms !important;
  }
}
`;
