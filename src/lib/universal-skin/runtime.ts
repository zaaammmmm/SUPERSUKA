/** Conservative semantic DOM classifier. Never replaces nodes, handlers, or ARIA semantics. */
export const UNIVERSAL_SKIN_RUNTIME = String.raw`(() => {
  if (window.__SUPER_SKIN_RUNTIME__) return;
  window.__SUPER_SKIN_RUNTIME__ = true;

  const LIMIT = 1200;
  const SELECTOR = [
    'button', 'a', 'input', 'select', 'textarea', 'table', 'nav', 'header', 'aside',
    'main', 'form', 'dialog', '[role]', '[aria-modal="true"]',
    '[data-state="open"]', '[aria-expanded="true"]',
    '[class*="card" i]', '[class*="modal" i]', '[class*="dialog" i]',
    '[class*="dropdown" i]', '[class*="popover" i]', '[class*="sidebar" i]',
    '[class*="navbar" i]', '[class*="tabs" i]', '[class*="badge" i]',
    '[class*="status" i]', '[class*="chip" i]'
  ].join(',');

  const words = (el) => [
    el.getAttribute('aria-label') || '',
    el.getAttribute('title') || '',
    typeof el.className === 'string' ? el.className : '',
    el.getAttribute('data-testid') || ''
  ].join(' ').toLowerCase();
  const set = (el, component, confidence, reason) => {
    if (el.dataset.superComponent) return;
    el.dataset.superComponent = component;
    el.dataset.superConfidence = String(confidence);
    el.dataset.superReason = reason;
  };
  const classify = (el) => {
    if (!(el instanceof HTMLElement) || el.dataset.superComponent) return;
    const tag = el.tagName.toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    const cls = words(el);
    const text = (el.innerText || '').trim().toLowerCase();
    const state = (el.getAttribute('data-state') || '').toLowerCase();
    const expanded = el.getAttribute('aria-expanded') === 'true';

    // Native semantics receive the strongest confidence.
    if (['input', 'select', 'textarea'].includes(tag)) return set(el, 'input', 1, 'native-form-control');
    if (tag === 'table' || ['grid', 'table'].includes(role)) return set(el, 'table', 1, 'native-table');
    if (tag === 'nav' || role === 'navigation') return set(el, 'navigation', 1, 'native-navigation');
    if (tag === 'dialog' || role === 'dialog' || el.getAttribute('aria-modal') === 'true')
      return set(el, 'modal', 1, 'dialog-semantics');
    if (role === 'menu' || role === 'listbox' || /dropdown|popover|menu-panel/.test(cls))
      return set(el, 'dropdown', role ? 0.98 : 0.86, 'menu-or-dropdown-pattern');
    if (tag === 'form' || role === 'form') return set(el, 'form', 0.98, 'form-semantics');
    if (tag === 'main' || role === 'main') return set(el, 'main', 1, 'main-landmark');
    if (tag === 'aside' || role === 'complementary') return set(el, 'sidebar', 0.98, 'complementary-landmark');
    if (tag === 'header' || role === 'banner') return set(el, 'header', 0.98, 'banner-landmark');

    if (tag === 'button' || role === 'button' || (tag === 'a' && /\b(button|btn)\b/.test(cls))) {
      const intent = text + ' ' + cls;
      const danger = /\b(delete|remove|reject|cancel|hapus|tolak|batalkan)\b/.test(intent);
      const primary = /\b(submit|save|continue|login|register|create|add|simpan|kirim|lanjut|masuk|daftar|buat|tambah)\b/.test(intent);
      const variant = danger ? 'danger' : primary ? 'primary' : 'secondary';
      el.dataset.superVariant = variant;
      return set(el, 'button-' + variant, tag === 'button' || role === 'button' ? 0.98 : 0.88, 'interactive-control');
    }

    if (/\b(badge|status|chip|tag)\b/.test(cls)) {
      const value = (text + ' ' + cls);
      const variant = /\b(success|approved|active|berhasil|selesai|diterima)\b/.test(value) ? 'success'
        : /\b(warning|pending|menunggu|perhatian)\b/.test(value) ? 'warning'
        : /\b(error|danger|rejected|gagal|ditolak)\b/.test(value) ? 'danger'
        : /\b(info|processing|proses|ditinjau)\b/.test(value) ? 'info' : '';
      if (variant) return set(el, 'badge-' + variant, 0.86, 'status-token');
    }

    if (/\bgrid\b/.test(cls) && el.children.length >= 2)
      el.dataset.superLayout = 'responsive-grid';
    else if (/\bflex\b/.test(cls) && el.children.length >= 3 && /flex-row|row/.test(cls))
      el.dataset.superLayout = 'wrapping-row';
    if (/\b(card|panel|tile|surface)\b/.test(cls))
      return set(el, 'card', 0.88, 'component-class');
    if (expanded || state === 'open' || state === 'opening')
      return set(el, 'dropdown-trigger', 0.84, 'expanded-state');

    // Structural fallback is deliberately lower-confidence and only marks clear containers.
    if (el.children.length >= 2 && el.querySelector(':scope > h1,:scope > h2,:scope > h3') &&
        el.getBoundingClientRect().width >= 240)
      return set(el, 'card', 0.68, 'structural-container');
  };

  const scan = (root) => {
    if (!(root instanceof Element)) return;
    classify(root);
    const nodes = root.querySelectorAll(SELECTOR);
    const count = Math.min(nodes.length, LIMIT);
    for (let i = 0; i < count; i++) classify(nodes[i]);
  };

  let pending = [];
  let scheduled = false;
  const flush = () => {
    scheduled = false;
    const batch = pending;
    pending = [];
    for (const node of batch) scan(node);
  };
  const enqueue = (node) => {
    if (!(node instanceof Element)) return;
    pending.push(node);
    if (!scheduled) {
      scheduled = true;
      if ('requestIdleCallback' in window) window.requestIdleCallback(flush, { timeout: 120 });
      else window.requestAnimationFrame(flush);
    }
  };
  const start = () => {
    scan(document.documentElement);
    const observer = new MutationObserver((records) => {
      for (const record of records) for (const node of record.addedNodes) enqueue(node);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();`;
