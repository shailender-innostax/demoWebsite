import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const fullPath = (path) => `${basePath}${path}`;
const external404 = `${basePath}/missing-offer.html`;
const formErrorPath = `${basePath}/server-error.html`;

const routes = {
  "/": "Buggy Marketing Home",
  "/features": "Features",
  "/customers": "Customers",
  "/prices": "Pricing",
  "/resources": "Resources",
  "/admin": "Admin Dashboard",
  "/dashboard": "Customer Dashboard",
  "/sidebar-only": "Sidebar only",
  "/form-error": "Form Error",
};

const productLinks = [
  { label: "AI Landing Pages", path: "/features" },
  { label: "Campaign Reports", path: "/customers" },
  { label: "Broken offer link", href: external404 },
];

const resourceLinks = [
  { label: "Growth guide", path: "/resources" },
  { label: "Case study TBD", path: "/customers" },
  { label: "Privacy center 404", href: `${basePath}/privacy.html` },
];

const hiddenCases = [
  { id: "hidden-attribute", label: "HTML hidden attribute", code: "hidden", kind: "hidden" },
  { id: "aria-hidden", label: "ARIA hidden", code: 'aria-hidden="true"', kind: "aria" },
  { id: "display-none", label: "CSS display none", code: "display: none", kind: "display" },
  { id: "visibility-hidden", label: "CSS visibility hidden", code: "visibility: hidden", kind: "visibility" },
  { id: "opacity-zero", label: "CSS opacity zero", code: "opacity: 0", kind: "opacity" },
  { id: "inert-parent", label: "Inert parent", code: "inert", kind: "inert" },
  { id: "offscreen", label: "Off-screen element", code: "left: -10000px", kind: "offscreen" },
  { id: "collapsed-parent", label: "Collapsed parent", code: "hidden subtree", kind: "collapsed" },
];

const routeFromLocation = () => {
  const route = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length)
    : window.location.pathname;

  return route || "/";
};

function useNavigation() {
  const [path, setPath] = useState(routeFromLocation);

  useEffect(() => {
    const onPopState = () => setPath(routeFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", fullPath(nextPath));
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { path, navigate };
}

function Chevron() {
  return <span className="chevron" aria-hidden="true">v</span>;
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
      <button className="nav-trigger" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        Product <Chevron />
      </button>
      <div className="dropdown-panel" hidden={!open}>
        <p className="menu-caption">Click dropdown</p>
        {productLinks.map((item) => item.href ? (
          <a key={item.label} href={item.href}>{item.label}<span>404</span></a>
        ) : (
          <button key={item.path} type="button" onClick={() => { navigate(item.path); setOpen(false); }}>
            {item.label}<span>go</span>
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
      <button className="nav-trigger" type="button" aria-expanded={open}>
        Resources <Chevron />
      </button>
      <div className="dropdown-panel" hidden={!open}>
        <p className="menu-caption">Hover dropdown</p>
        {resourceLinks.map((item) => item.href ? (
          <a key={item.label} href={item.href}>{item.label}<span>404</span></a>
        ) : (
          <button key={item.path} type="button" onClick={() => navigate(item.path)}>
            {item.label}<span>go</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ open, setOpen, navigate, path }) {
  const [expanded, setExpanded] = useState("");
  const sections = [
    { key: "product", title: "Product", items: productLinks },
    { key: "resources", title: "Resources", items: resourceLinks },
    {
      key: "protected",
      title: "Protected links",
      items: [
        { label: "Admin exposed", path: "/admin" },
        { label: "Dashboard exposed", path: "/dashboard" },
      ],
    },
  ];

  return (
    <>
      <button className={`sidebar-scrim ${open ? "visible" : ""}`} aria-label="Close sidebar" onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidebar-heading">
          <div>
            <span className="eyebrow">Mobile menu</span>
            <h2>Navigation</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close sidebar" onClick={() => setOpen(false)}>x</button>
        </div>
        <button className="sidebar-direct" type="button" onClick={() => { navigate("/"); setOpen(false); }}>
          Home <span>go</span>
        </button>
        <button className="sidebar-direct" type="button" onClick={() => { navigate("/sidebar-only"); setOpen(false); }}>
          Sidebar only <span>go</span>
        </button>
        {sections.map((section) => (
          <div className="sidebar-section" key={section.key}>
            <button
              className="sidebar-section-trigger"
              type="button"
              aria-expanded={expanded === section.key}
              onClick={() => setExpanded(expanded === section.key ? "" : section.key)}
            >
              {section.title}<Chevron />
            </button>
            <div className="sidebar-links" hidden={expanded !== section.key}>
              {section.items.map((item) => item.href ? (
                <a key={item.label} href={item.href}>{item.label}<span>404</span></a>
              ) : (
                <button
                  className={path === item.path ? "active" : ""}
                  key={item.path}
                  type="button"
                  onClick={() => { navigate(item.path); setOpen(false); }}
                >
                  {item.label}<span>go</span>
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
  const button = <button className="scanner-target" data-qa-case={item.id}>Hidden scanner target: {item.label}</button>;

  if (revealed) return <div className="revealed-target">{button}</div>;
  if (item.kind === "hidden") return <div hidden>{button}</div>;
  if (item.kind === "aria") return <div aria-hidden="true">{button}</div>;
  if (item.kind === "display") return <div className="display-none">{button}</div>;
  if (item.kind === "visibility") return <div className="visibility-hidden">{button}</div>;
  if (item.kind === "opacity") return <div className="opacity-zero">{button}</div>;
  if (item.kind === "inert") return <div inert="">{button}</div>;
  if (item.kind === "offscreen") return <div className="offscreen">{button}</div>;
  return <div hidden><div className="collapsed-parent">{button}</div></div>;
}

function HiddenAttributesLab() {
  const [revealed, setRevealed] = useState([]);
  const toggle = (id) => {
    setRevealed((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  return (
    <section className="lab-section" id="hidden-attributes">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Hidden attributes regression cases</span>
          <h2>Hidden interactive targets</h2>
          <p>These intentionally hidden controls should be handled carefully by the scanner.</p>
        </div>
      </div>
      <div className="case-grid">
        {hiddenCases.map((item, index) => {
          const isRevealed = revealed.includes(item.id);
          return (
            <article className="case-card" key={item.id} data-test-case={item.id}>
              <div className="case-topline">
                <span>CASE {String(index + 1).padStart(2, "0")}</span>
                <span className={isRevealed ? "status revealed" : "status"}>{isRevealed ? "Revealed" : "Hidden"}</span>
              </div>
              <h3>{item.label}</h3>
              <code>{item.code}</code>
              <HiddenExample item={item} revealed={isRevealed} />
              <button className="case-toggle" type="button" onClick={() => toggle(item.id)}>
                {isRevealed ? "Restore hidden state" : "Reveal test target"} <span>go</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BuggyMarketingHome({ navigate, setSidebarOpen }) {
  const [orderMessage, setOrderMessage] = useState("");

  return (
    <>
      <section className="hero marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> premium markting automation platform</span>
          <h1>
            Convert visitors into
            <br />
            <em>revenue fasterr.</em>
          </h1>
          <p>
            AcmeGrowth helps teams lauch campaigns, manage leads, and prove ROI with a succesfull
            dashboard that is trusted by undefined companies.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href={external404}>Start free audit</a>
            <button className="secondary-button dead-cta" type="button">Get demo</button>
            <button className="secondary-button" type="button" onClick={() => setSidebarOpen(true)}>Open sidebar</button>
          </div>
          <p className="tiny-note">Lorem ipsum dolor sit amet. Launch copy TBD. Customer score: [object Object].</p>
        </div>

        <div className="bug-card">
          <div className="console-top"><span><i /> LIVE DEFECTS</span><span>MARKETING</span></div>
          <img
            className="hero-image"
            src={fullPath("/assets/missing-hero-dashboard.png")}
            alt="Growth analytics dashboard"
          />
          <h2>Broken hero visual</h2>
          <p>This image path intentionally does not exist, so rendered browsers report naturalWidth as zero.</p>
        </div>
      </section>

      <section className="bug-strip" aria-label="Intentional defect examples">
        <article><span>01</span><strong>Typo</strong><p>Contat us for a freee onboarding call.</p></article>
        <article><span>02</span><strong>Placeholder</strong><p>Pricing block says null until CMS is ready.</p></article>
        <article><span>03</span><strong>Broken CTA</strong><p>Start free audit opens a missing page.</p></article>
        <article><span>04</span><strong>Overflow</strong><p>Mobile has an intentionally wide banner.</p></article>
      </section>

      <section className="content-grid">
        <article className="marketing-card">
          <span className="eyebrow">Copy review target</span>
          <h2>Built for busy markting teams</h2>
          <p>
            Our platform gives every campain owner a single source of truth, but this section has
            several spelling mistakes for the defect lane to identify.
          </p>
          <button className="primary-button dead-cta" type="button">Download report</button>
        </article>

        <article className="marketing-card">
          <span className="eyebrow">Soft functionality target</span>
          <h2>Checkout without a plan</h2>
          <p>Total selected plan value: $0</p>
          <button className="primary-button" type="button" onClick={() => setOrderMessage("Order placed! Confirmation #0000")}>
            Checkout
          </button>
          {orderMessage && <p className="bad-success">{orderMessage}</p>}
        </article>

        <article className="marketing-card">
          <span className="eyebrow">Form error target</span>
          <h2>Book a demo</h2>
          <form className="lead-form" action={formErrorPath}>
            <label>
              Work email
              <input name="email" defaultValue="" placeholder="name@company.com" />
            </label>
            <button className="primary-button" type="submit">Submit lead form</button>
          </form>
        </article>
      </section>

      <section className="overflow-section" aria-label="Horizontal overflow defect">
        <div className="overflow-banner">
          Mobile layout breaker: this banner is 145vw wide and should create horizontal overflow on small screens.
        </div>
      </section>

      <HiddenAttributesLab />
    </>
  );
}

function DestinationPage({ path, title }) {
  if (path === "/admin" || path === "/dashboard") {
    return (
      <section className="destination-page exposed-admin">
        <span className="eyebrow">No login required</span>
        <h1>{title}</h1>
        <p>Confidential revenue, customer, and API settings are visible publicly. This protected-looking route intentionally returns app content without authentication.</p>
      </section>
    );
  }

  if (path === "/form-error") {
    return (
      <section className="destination-page error-page">
        <span className="eyebrow">Form submission defect</span>
        <h1>500 Internal Server Error</h1>
        <p>The lead form sent visitors to a failure page instead of a success confirmation.</p>
      </section>
    );
  }

  return (
    <section className="destination-page">
      <span className="eyebrow">Marketing route</span>
      <h1>{title}</h1>
      <p>Visible page content for route validation. Placeholder value: null.</p>
    </section>
  );
}

function App() {
  const { path, navigate } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = routes[path] || "Unknown Marketing Page";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate("/")} aria-label="Buggy marketing home">
          <span className="brand-mark">B</span>
          <span>
            <strong>BUGGY GROWTH</strong>
            <small>marketing site</small>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ClickDropdown navigate={navigate} />
          <HoverDropdown navigate={navigate} />
          <button className="nav-trigger" type="button" onClick={() => navigate("/prices")}>Pricing</button>
          <a className="nav-trigger nav-link" href={external404}>Shop now</a>
          <a className="nav-trigger nav-link" href={fullPath("/admin/")}>Admin</a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setSidebarOpen(true)}>
          <span className="menu-lines" aria-hidden="true"><i /><i /></span> Menu
        </button>
      </header>

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} navigate={navigate} path={path} />

      <main>
        {path === "/" ? (
          <BuggyMarketingHome navigate={navigate} setSidebarOpen={setSidebarOpen} />
        ) : (
          <DestinationPage path={path} title={title} />
        )}
      </main>

      <footer>
        <div><span className="brand-mark small">B</span><strong>Buggy Growth</strong></div>
        <a href={fullPath("/dashboard/")}>Dashboard</a>
        <a href={`${basePath}/privacy.html`}>Privacy policy</a>
        <code>data-defect-suite="marketing-bugs"</code>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
