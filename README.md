# Buggy Marketing Test Site

A React marketing website with intentional defects for validating a QA scanner defects lane.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Intentional defect scenarios

- Typo and grammar issues: `markting`, `vistors`, `fasterr`, `Contat us`
- Placeholder text: `Lorem ipsum`, `TBD`, `[object Object]`, `undefined`, `null`
- Broken image: missing hero dashboard asset
- Broken primary navigation and CTA links: `/missing-offer.html`, `/privacy.html`
- Public protected-looking routes: `/admin/`, `/dashboard/`
- Dead CTA buttons that do not change route or UI state
- Empty checkout success: total is `$0`, but checkout still confirms order
- Lead form action points to a missing server error page
- Horizontal overflow: a `145vw` banner on mobile
- Hidden interactive target variants for hidden-attribute testing

The site is intentionally imperfect. Do not treat the defects as regressions to fix unless you are changing the test fixture itself.

## Hidden attributes scenarios

The hidden attributes lab renders a real button in each of these states:

| Test case | Hidden mechanism |
| --- | --- |
| `hidden-attribute` | Native `hidden` attribute |
| `aria-hidden` | `aria-hidden="true"` parent |
| `display-none` | `display: none` |
| `visibility-hidden` | `visibility: hidden` |
| `opacity-zero` | `opacity: 0` |
| `inert-parent` | `inert` parent |
| `offscreen` | Absolutely positioned off-screen |
| `collapsed-parent` | Hidden collapsed parent subtree |

Use **Reveal test target** on an individual card to compare scanner output before and after a control becomes visible.

Closed navbar menus, sidebar sections, and the closed sidebar also intentionally leave their interactive descendants in the DOM under hidden or off-screen parent states.
