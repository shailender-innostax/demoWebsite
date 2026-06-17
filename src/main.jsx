import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const navGroups = {
  products: [
    {
      label: "Analytics",
      path: "/products/analytics",
      detail: "Simple dropdown destination",
    },
    {
      label: "Automation",
      path: "/products/automation",
      detail: "Simple dropdown destination",
    },
    {
      label: "Scanner API",
      path: "/products/scanner-api",
      detail: "Simple dropdown destination",
    },
  ],
  resources: [
    {
      label: "Documentation",
      path: "/resources/docs",
      detail: "Hover dropdown destination",
    },
    {
      label: "Release notes",
      path: "/resources/releases",
      detail: "Hover dropdown destination",
    },
    {
      label: "Support",
      path: "/resources/support",
      detail: "Hover dropdown destination",
    },
  ],
  solutions: [
    {
      label: "By team",
      children: [
        {
          label: "Engineering",
          path: "/solutions/engineering",
          detail: "Nested submenu destination",
        },
        {
          label: "Quality assurance",
          path: "/solutions/qa",
          detail: "Nested submenu destination",
        },
      ],
    },
    {
      label: "By company size",
      children: [
        {
          label: "Startups",
          path: "/solutions/startups",
          detail: "Nested submenu destination",
        },
        {
          label: "Enterprise",
          path: "/solutions/enterprise",
          detail: "Nested submenu destination",
        },
      ],
    },
    {
      label: "All solutions",
      path: "/solutions",
      detail: "Direct nested-menu destination",
    },
  ],
};

const hiddenCases = [
  {
    id: "hidden-attribute",
    label: "HTML hidden attribute",
    code: "hidden",
    kind: "hidden",
  },
  {
    id: "aria-hidden",
    label: "ARIA hidden",
    code: 'aria-hidden="true"',
    kind: "aria",
  },
  {
    id: "display-none",
    label: "CSS display none",
    code: "display: none",
    kind: "display",
  },
  {
    id: "visibility-hidden",
    label: "CSS visibility hidden",
    code: "visibility: hidden",
    kind: "visibility",
  },
  {
    id: "opacity-zero",
    label: "CSS opacity zero",
    code: "opacity: 0",
    kind: "opacity",
  },
  { id: "inert-parent", label: "Inert parent", code: "inert", kind: "inert" },
  {
    id: "offscreen",
    label: "Off-screen element",
    code: "left: -10000px",
    kind: "offscreen",
  },
  {
    id: "collapsed-parent",
    label: "Collapsed menu parent",
    code: "hidden parent subtree",
    kind: "collapsed",
  },
];

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const routeFromLocation = () => {
  const route = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length)
    : window.location.pathname;

  return route || "/";
};

function useNavigation() {
  const [path, setPath] = useState(routeFromLocation);
  const [source, setSource] = useState("Direct page load");

  useEffect(() => {
    const onPopState = () => {
      setPath(routeFromLocation());
      setSource("Browser history");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath, nextSource = "Navigation item") => {
    window.history.pushState({}, "", `${basePath}${nextPath}`);
    setPath(nextPath);
    setSource(nextSource);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { path, source, navigate };
}

function Chevron({ right = false }) {
  return (
    <span
      className={right ? "chevron chevron-right" : "chevron"}
      aria-hidden="true"
    >
      ⌄
    </span>
  );
}

function ClickDropdown({ navigate }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <div className="nav-dropdown" ref={rootRef}>
      <button
        className="nav-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="products-menu"
        onClick={() => setOpen((value) => !value)}
      >
        Products <Chevron />
      </button>
      <div id="products-menu" className="dropdown-panel" hidden={!open}>
        <p className="menu-caption">Opens on click</p>
        {navGroups.products.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              navigate(item.path, "Click dropdown");
              setOpen(false);
            }}
          >
            <span>{item.label}</span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HoverDropdown({ navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="nav-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="nav-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="resources-menu"
      >
        Resources <Chevron />
      </button>
      <div id="resources-menu" className="dropdown-panel" hidden={!open}>
        <p className="menu-caption">Opens on hover or focus</p>
        {navGroups.resources.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path, "Hover dropdown")}
          >
            <span>{item.label}</span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NestedDropdown({ navigate }) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState("");
  return (
    <div className="nav-dropdown">
      <button
        className="nav-trigger"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Solutions <Chevron />
      </button>
      <div className="dropdown-panel nested-panel" hidden={!open}>
        <p className="menu-caption">Contains submenus</p>
        {navGroups.solutions.map((item) =>
          item.children ? (
            <div
              className="submenu-root"
              key={item.label}
              onMouseEnter={() => setActiveSubmenu(item.label)}
            >
              <button
                type="button"
                aria-expanded={activeSubmenu === item.label}
                onClick={() =>
                  setActiveSubmenu(
                    activeSubmenu === item.label ? "" : item.label,
                  )
                }
              >
                <span>{item.label}</span>
                <Chevron right />
              </button>
              <div
                className="submenu-panel"
                hidden={activeSubmenu !== item.label}
              >
                {item.children.map((child) => (
                  <button
                    key={child.path}
                    type="button"
                    onClick={() => {
                      navigate(child.path, "Nested submenu");
                      setOpen(false);
                    }}
                  >
                    <span>{child.label}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                navigate(item.path, "Nested dropdown");
                setOpen(false);
              }}
            >
              <span>{item.label}</span>
              <span aria-hidden="true">→</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function Sidebar({ open, setOpen, navigate, path }) {
  const [expanded, setExpanded] = useState("products");
  const sections = [
    { key: "products", title: "Products", items: navGroups.products },
    { key: "resources", title: "Resources", items: navGroups.resources },
    {
      key: "solutions",
      title: "Solutions",
      items: navGroups.solutions.flatMap((item) => item.children || [item]),
    },
  ];

  return (
    <>
      <button
        className={`sidebar-scrim ${open ? "visible" : ""}`}
        aria-label="Close sidebar"
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidebar-heading">
          <div>
            <span className="eyebrow">Alternate navigation</span>
            <h2>Sidebar menu</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        <button
          className="sidebar-direct"
          type="button"
          onClick={() => {
            navigate("/", "Sidebar simple button");
            setOpen(false);
          }}
        >
          Overview <span>→</span>
        </button>
        <button
          className="sidebar-direct"
          type="button"
          onClick={() => {
            navigate("/sidebar-only", "Sidebar-only button");
            setOpen(false);
          }}
        >
          Sidebar only <span>→</span>
        </button>
        {sections.map((section) => (
          <div className="sidebar-section" key={section.key}>
            <button
              className="sidebar-section-trigger"
              type="button"
              aria-expanded={expanded === section.key}
              onClick={() =>
                setExpanded(expanded === section.key ? "" : section.key)
              }
            >
              {section.title}
              <Chevron />
            </button>
            <div className="sidebar-links" hidden={expanded !== section.key}>
              {section.items.map((item) => (
                <button
                  className={path === item.path ? "active" : ""}
                  key={item.path}
                  type="button"
                  onClick={() => {
                    navigate(item.path, "Sidebar dropdown");
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}

function HiddenExample({ item, revealed }) {
  const button = (
    <button
      className="scanner-target"
      data-qa-case={item.id}
      onClick={() => alert(`Activated ${item.label}`)}
    >
      Scanner target: {item.label}
    </button>
  );

  if (revealed) return <div className="revealed-target">{button}</div>;
  if (item.kind === "hidden") return <div hidden>{button}</div>;
  if (item.kind === "aria") return <div aria-hidden="true">{button}</div>;
  if (item.kind === "display")
    return <div className="display-none">{button}</div>;
  if (item.kind === "visibility")
    return <div className="visibility-hidden">{button}</div>;
  if (item.kind === "opacity")
    return <div className="opacity-zero">{button}</div>;
  if (item.kind === "inert") return <div inert="">{button}</div>;
  if (item.kind === "offscreen")
    return <div className="offscreen">{button}</div>;
  return (
    <div hidden>
      <div className="collapsed-parent">{button}</div>
    </div>
  );
}

function HiddenAttributesLab() {
  const [revealed, setRevealed] = useState([]);
  const toggle = (id) =>
    setRevealed((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  return (
    <section className="lab-section" id="hidden-attributes">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Scanner reproduction suite</span>
          <h2>Hidden attributes lab</h2>
          <p>
            Each card contains a real interactive target under a different
            hidden-state condition.
          </p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            setRevealed(
              revealed.length === hiddenCases.length
                ? []
                : hiddenCases.map((item) => item.id),
            )
          }
        >
          {revealed.length === hiddenCases.length
            ? "Reset all cases"
            : "Reveal all targets"}
        </button>
      </div>
      <div className="case-grid">
        {hiddenCases.map((item, index) => {
          const isRevealed = revealed.includes(item.id);
          return (
            <article
              className="case-card"
              key={item.id}
              data-test-case={item.id}
            >
              <div className="case-topline">
                <span>CASE {String(index + 1).padStart(2, "0")}</span>
                <span className={isRevealed ? "status revealed" : "status"}>
                  {isRevealed ? "Revealed" : "Hidden"}
                </span>
              </div>
              <h3>{item.label}</h3>
              <code>{item.code}</code>
              <HiddenExample item={item} revealed={isRevealed} />
              <button
                className="case-toggle"
                type="button"
                onClick={() => toggle(item.id)}
              >
                {isRevealed ? "Restore hidden state" : "Reveal test target"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function App() {
  const { path, source, navigate } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const destinationItems = [
    ...navGroups.products,
    ...navGroups.resources,
    ...navGroups.solutions.flatMap((item) => item.children || [item]),
    { label: "Pricing", path: "/prices" },
    { label: "Sidebar only", path: "/sidebar-only" },
  ];
  const title =
    destinationItems.find((item) => item.path === path)?.label ||
    "Navigation overview";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          type="button"
          onClick={() => navigate("/", "Brand button")}
          aria-label="QA Navigation Lab home"
        >
          <span className="brand-mark">Q</span>
          <span>
            <strong>QA NAV</strong>
            <small>reproduction lab</small>
          </span>
        </button>
        {/* <nav className="desktop-nav" aria-label="Primary navigation">
          <ClickDropdown navigate={navigate} />
          <HoverDropdown navigate={navigate} />
          <NestedDropdown navigate={navigate} />
          <button className="nav-trigger" type="button" onClick={() => navigate("/prices", "Simple navbar button")}>Pricing</button>
        </nav> */}
        <button
          className="menu-button"
          type="button"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>{" "}
          Menu
        </button>
      </header>

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        navigate={navigate}
        path={path}
      />

      <main>
        {path === "/" ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <i /> deterministic interaction playground
                </span>
                <h1>
                  Navigation that is
                  <br />
                  <em>made to be tested.</em>
                </h1>
                <p>
                  A purpose-built React site for reproducing scanner findings
                  across click, hover, nested, redirected, and hidden
                  interactive elements.
                </p>
                <div className="hero-actions">
                  {/* <button
                    className="primary-button"
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("hidden-attributes")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Explore hidden cases <span>↓</span>
                  </button> */}
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                  >
                    Open sidebar
                  </button>
                </div>
              </div>
              <div className="route-console">
                <div className="console-top">
                  <span>
                    <i /> LIVE ROUTE
                  </span>
                  <span>REACT SPA</span>
                </div>
                <div className="route-path">{path}</div>
                <h2>{title}</h2>
                <p>
                  This page was reached through: <strong>{source}</strong>
                </p>
                <div className="console-stats">
                  <span>
                    <b>4</b> navigation patterns
                  </span>
                  <span>
                    <b>8</b> hidden cases
                  </span>
                  <span>
                    <b>18</b> route targets
                  </span>
                </div>
              </div>
            </section>

            <section
              className="pattern-strip"
              aria-label="Available interaction patterns"
            >
              <article>
                <span>01</span>
                <strong>Click dropdown</strong>
                <p>Button toggles an explicit menu.</p>
              </article>
              <article>
                <span>02</span>
                <strong>Hover dropdown</strong>
                <p>Pointer hover and keyboard focus.</p>
              </article>
              <article>
                <span>03</span>
                <strong>Nested submenu</strong>
                <p>Second-level destination links.</p>
              </article>
              <article>
                <span>04</span>
                <strong>Simple redirect</strong>
                <p>One action, one route change.</p>
              </article>
            </section>

            {/* <HiddenAttributesLab /> */}
          </>
        ) : (
          <section className="destination-page">
            <h1>{title}</h1>
          </section>
        )}
      </main>

      {path === "/" && (
        <footer>
          <div>
            <span className="brand-mark small">Q</span>
            <strong>QA Navigation Lab</strong>
          </div>
          <p>Built for repeatable scanner reproduction.</p>
          <code>data-qa-suite="hidden-attributes"</code>
        </footer>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
