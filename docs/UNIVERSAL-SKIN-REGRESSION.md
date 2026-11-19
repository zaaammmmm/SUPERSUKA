# Universal Skin Engine — regression checklist

The automated `npm run test:skin` checks the runtime contract and gateway boundaries. It is
not a substitute for browser-level visual and accessibility testing.

## Confidence policy
- Native HTML / ARIA semantics: confidence 0.98–1.00.
- Recognized component classes and state attributes: 0.84–0.88.
- Structural fallback: 0.68 and excluded from card styling.
- `data-super-component`, `data-super-confidence`, and `data-super-reason` are diagnostic
  attributes. Existing `data-super-component` annotations are never overwritten.

## Staging matrix (repeat for every enabled service)
- [ ] Initial page, direct deep link, refresh, and client-side navigation.
- [ ] Desktop (1440px), tablet (768px), mobile (390px and 320px).
- [ ] Primary, secondary, destructive, disabled, loading, and icon-only controls.
- [ ] Inputs, validation errors, selects, tables, badges, tabs, pagination.
- [ ] Dialog open/close, nested popover/dropdown, escape key, outside click.
- [ ] Sidebar, top navigation, active route, collapsed/mobile navigation.
- [ ] Dynamic content inserted after load (MutationObserver).
- [ ] Keyboard-only traversal, visible focus, screen-reader names, contrast,
      zoom at 200%, and prefers-reduced-motion.
- [ ] Login/logout, cookies, redirect, upload/download, API calls, and error states.
- [ ] Console errors, layout overflow, LCP/INP/CLS before and after skin.

Record screenshots and results per service and viewport. Do not promote a service to
production solely because the automated source-contract tests pass.
