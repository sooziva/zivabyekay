import { Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./DashboardLayout.css";

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "classes", label: "Classes" },
  { id: "walk-in", label: "Walk-in" },
  { id: "home-service", label: "Home Service" },
  { id: "products", label: "Product" },
  { id: "expenses", label: "Expenses" },
  { id: "salary", label: "Salary" },
  { id: "reports", label: "Reports" },
];

export default function DashboardLayout() {
  const sectionIds = useMemo(() => NAV_ITEMS.map((x) => x.id), []);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "overview");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="zb-dashboard">
      <aside className="zb-dashboard__sidebar" aria-label="Dashboard navigation">
        <div className="zb-dashboard__brand">
          <p className="zb-dashboard__brandTitle">Ziva by Ekay</p>
          <p className="zb-dashboard__brandSub">Dashboard</p>
        </div>

        <nav className="zb-dashboard__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => jumpTo(item.id)}
              className={`zb-dashboard__navItem zb-dashboard__navButton${
                activeId === item.id ? " zb-dashboard__navItem--active" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="zb-dashboard__sidebarFooter">
          <p className="zb-dashboard__hint">Admin/Staff</p>
        </div>
      </aside>

      <div className="zb-dashboard__main">
        <header className="zb-dashboard__topbar">
          <div className="zb-dashboard__topbarLeft">
            <p className="zb-dashboard__pageKicker">dashboard.sooziva</p>
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

        <main className="zb-dashboard__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

