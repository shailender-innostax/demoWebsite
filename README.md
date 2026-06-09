# QA Navigation Lab

A React test site for reproducing navigation and hidden-interactive-element findings in QA scanners.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Navigation scenarios

- **Products:** click-triggered dropdown
- **Resources:** hover and keyboard-focus-triggered dropdown
- **Solutions:** click-triggered dropdown with nested submenus
- **Pricing:** simple redirect button
- **Menu:** off-canvas sidebar with collapsible groups

Every destination updates the browser URL and the live route panel without a full page reload.

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

Use **Reveal test target** on an individual card or **Reveal all targets** to compare scanner output before and after the controls become visible.

Closed navbar menus, nested submenus, sidebar sections, and the closed sidebar also intentionally leave their interactive descendants in the DOM under hidden or off-screen parent states.
