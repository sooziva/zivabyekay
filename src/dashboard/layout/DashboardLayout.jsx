import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "./DashboardLayout.css";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", to: "/dashboard/overview" },
  { id: "classes", label: "Classes", to: "/dashboard/classes" },
  { id: "walk-in", label: "Walk-in", to: "/dashboard/walk-in" },
  { id: "home-service", label: "Home Service", to: "/dashboard/home-service" },
  { id: "products", label: "Product", to: "/dashboard/products" },
  { id: "expenses", label: "Expenses", to: "/dashboard/expenses" },
  { id: "salary", label: "Salary", to: "/dashboard/salary" },
  { id: "reports", label: "Reports", to: "/dashboard/reports" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const sectionIds = useMemo(() => NAV_ITEMS.map((x) => x.id), []);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const match = NAV_ITEMS.find((x) => location.pathname.startsWith(x.to));
    setActiveId(match?.id || "overview");
  }, [location.pathname, sectionIds]);

  useEffect(() => {
    // Reset scroll to top on page change.
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="zb-dashboard">
      <div
        className={`zb-dashboard__overlay${sidebarOpen ? " zb-dashboard__overlay--open" : ""}`}
        role="button"
        tabIndex={sidebarOpen ? 0 : -1}
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSidebarOpen(false);
        }}
      />

      <aside
        className={`zb-dashboard__sidebar${sidebarOpen ? " zb-dashboard__sidebar--open" : ""}`}
        aria-label="Dashboard navigation"
      >
        <div className="zb-dashboard__brand">
          <p className="zb-dashboard__brandTitle">Ziva by Ekay</p>
          <p className="zb-dashboard__brandSub">Dashboard</p>
        </div>

        <nav className="zb-dashboard__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={(e) => {
                // allow ctrl/cmd click to open new tab
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                navigate(item.to);
              }}
              className={`zb-dashboard__navItem zb-dashboard__navButton${
                activeId === item.id ? " zb-dashboard__navItem--active" : ""
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="zb-dashboard__sidebarFooter">
          <p className="zb-dashboard__hint">Admin/Staff</p>
        </div>
      </aside>

      <div className="zb-dashboard__main">
        <header className="zb-dashboard__topbar">
          <div className="zb-dashboard__topbarLeft">
            <button
              className="zb-dashboard__menuBtn"
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              Menu
            </button>
            <p className="zb-dashboard__pageKicker"></p>
          </div>
          <div className="zb-dashboard__topbarRight">
            <button className="zb-dashboard__chip" type="button">
              This week
            </button>
            <button className="zb-dashboard__chip zb-dashboard__chip--primary" type="button">
              New entry
            </button>
          </div>
        </header>

        <main className="zb-dashboard__content" ref={contentRef}>
          <div className="zb-dashboard__contentInner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

