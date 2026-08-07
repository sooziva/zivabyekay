import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Home,
  Footprints,
  Mail,
  Package,
  Receipt,
  Wallet,
} from "lucide-react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";
import "./Overview.css";

function money(value) {
  const n = Number(value) || 0;
  return `GHS ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function sumAmount(items, key = "amountGhs") {
  return (items || []).reduce((sum, x) => sum + (Number(x?.[key]) || 0), 0);
}

function activityTime(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function formatWhen(value) {
  const t = activityTime(value);
  if (t == null) return "—";
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatSchedule(value) {
  if (!value) return "No date set";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "No date set";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const QUICK_LINKS = [
  { to: "/dashboard/walk-in", label: "Walk-in", hint: "Log a visit", icon: Footprints },
  { to: "/dashboard/home-service", label: "Home service", hint: "Schedule a visit", icon: Home },
  { to: "/dashboard/classes", label: "Classes", hint: "Add enrolment", icon: BookOpen },
  { to: "/dashboard/products", label: "Products", hint: "Check stock", icon: Package },
  { to: "/dashboard/expenses", label: "Expenses", hint: "Log a cost", icon: Wallet },
  { to: "/dashboard/email-marketing", label: "Email", hint: "Reach contacts", icon: Mail },
];

export default function OverviewPage() {
  const walkins = useAuthedJson("/api/dashboard/walkins", []);
  const homeServices = useAuthedJson("/api/dashboard/home-services", []);
  const classes = useAuthedJson("/api/dashboard/classes", []);
  const products = useAuthedJson("/api/dashboard/products", []);
  const expenses = useAuthedJson("/api/dashboard/expenses", []);
  const leads = useAuthedJson("/api/dashboard/email-leads", []);

  const loading =
    walkins.loading ||
    homeServices.loading ||
    classes.loading ||
    products.loading ||
    expenses.loading ||
    leads.loading;

  const walkinItems = walkins.data?.items || [];
  const homeItems = homeServices.data?.items || [];
  const classItems = classes.data?.items || [];
  const productItems = products.data?.items || [];
  const expenseItems = expenses.data?.items || [];
  const leadItems = leads.data?.items || [];

  const walkinRevenue = useMemo(() => sumAmount(walkinItems), [walkinItems]);
  const homeRevenue = useMemo(() => sumAmount(homeItems), [homeItems]);
  const classRevenue = useMemo(() => sumAmount(classItems, "priceGhs"), [classItems]);
  const expenseTotal = useMemo(() => sumAmount(expenseItems), [expenseItems]);

  const income = walkinRevenue + homeRevenue + classRevenue;
  const net = income - expenseTotal;

  const lowStock = useMemo(
    () => productItems.filter((p) => Number(p.stock) <= 3).slice(0, 5),
    [productItems]
  );

  const upcoming = useMemo(() => {
    const now = Date.now();
    return [...homeItems]
      .filter((x) => {
        const t = activityTime(x.date);
        return t != null && t >= now - 60 * 60 * 1000;
      })
      .sort((a, b) => activityTime(a.date) - activityTime(b.date))
      .slice(0, 6);
  }, [homeItems]);

  const recent = useMemo(() => {
    const rows = [
      ...walkinItems.map((x) => ({
        id: `w-${x.id}`,
        type: "Walk-in",
        typeClass: "zb-ovType zb-ovType--walkin",
        title: x.client || "Walk-in client",
        detail: x.service || "Service",
        amount: typeof x.amountGhs === "number" ? money(x.amountGhs) : "—",
        at: x.createdAt || x.date,
        href: "/dashboard/walk-in",
      })),
      ...homeItems.map((x) => ({
        id: `h-${x.id}`,
        type: "Home",
        typeClass: "zb-ovType zb-ovType--home",
        title: x.client || "Home service",
        detail: x.service || x.status || "Home visit",
        amount: typeof x.amountGhs === "number" ? money(x.amountGhs) : "—",
        at: x.createdAt || x.date,
        href: "/dashboard/home-service",
      })),
      ...classItems.map((x) => ({
        id: `c-${x.id}`,
        type: "Class",
        typeClass: "zb-ovType zb-ovType--class",
        title: x.studentName || x.title || "Student",
        detail: x.course || x.title || "Class",
        amount: typeof x.priceGhs === "number" ? money(x.priceGhs) : "—",
        at: x.createdAt || x.date,
        href: "/dashboard/classes",
      })),
      ...expenseItems.map((x) => ({
        id: `e-${x.id}`,
        type: "Expense",
        typeClass: "zb-ovType zb-ovType--expense",
        title: x.category || "Expense",
        detail: x.notes || "Logged expense",
        amount: typeof x.amountGhs === "number" ? `− ${money(x.amountGhs)}` : "—",
        at: x.createdAt,
        href: "/dashboard/expenses",
      })),
    ];
    return rows
      .filter((r) => activityTime(r.at) != null)
      .sort((a, b) => activityTime(b.at) - activityTime(a.at))
      .slice(0, 12);
  }, [walkinItems, homeItems, classItems, expenseItems]);

  const channels = [
    {
      label: "Walk-ins",
      value: walkinItems.length,
      meta: money(walkinRevenue),
      to: "/dashboard/walk-in",
      icon: Footprints,
    },
    {
      label: "Home service",
      value: homeItems.length,
      meta: money(homeRevenue),
      to: "/dashboard/home-service",
      icon: Home,
    },
    {
      label: "Classes",
      value: classItems.length,
      meta: money(classRevenue),
      to: "/dashboard/classes",
      icon: BookOpen,
    },
    {
      label: "Products",
      value: productItems.length,
      meta: lowStock.length ? `${lowStock.length} low stock` : "Stock OK",
      to: "/dashboard/products",
      icon: Package,
    },
  ];

  const anyError =
    walkins.error || homeServices.error || classes.error || products.error || expenses.error || leads.error;

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell
        title="Overview"
        subtitle="Studio pulse — income, bookings, and what needs attention."
      >
        <div className="zb-card zb-card--third zb-ovKpi">
          <div className="zb-ovKpi__top">
            <p className="zb-card__title">Income</p>
            <Receipt size={16} aria-hidden />
          </div>
          <p className="zb-card__value">{loading ? "…" : money(income)}</p>
          <p className="zb-card__meta">Walk-ins · home · classes (last 50 each)</p>
        </div>

        <div className="zb-card zb-card--third zb-ovKpi">
          <div className="zb-ovKpi__top">
            <p className="zb-card__title">Expenses</p>
            <Wallet size={16} aria-hidden />
          </div>
          <p className="zb-card__value">{loading ? "…" : money(expenseTotal)}</p>
          <p className="zb-card__meta">Logged costs (last 50)</p>
        </div>

        <div className="zb-card zb-card--third zb-ovKpi">
          <div className="zb-ovKpi__top">
            <p className="zb-card__title">Net</p>
            <span className={`zb-ovNet ${net >= 0 ? "is-up" : "is-down"}`}>{net >= 0 ? "+" : "−"}</span>
          </div>
          <p className="zb-card__value">{loading ? "…" : money(Math.abs(net))}</p>
          <p className="zb-card__meta">{leadItems.length} email contacts</p>
        </div>

        <div className="zb-card zb-card--full zb-ovChannels">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Channels</p>
              <p className="zb-card__meta">Jump into each part of the studio.</p>
            </div>
          </div>
          <div className="zb-ovChannelGrid">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.to} to={c.to} className="zb-ovChannel">
                  <div className="zb-ovChannel__icon">
                    <Icon size={16} />
                  </div>
                  <div className="zb-ovChannel__body">
                    <p className="zb-ovChannel__label">{c.label}</p>
                    <p className="zb-ovChannel__value">{loading ? "…" : c.value}</p>
                    <p className="zb-ovChannel__meta">{c.meta}</p>
                  </div>
                  <ArrowUpRight className="zb-ovChannel__arrow" size={16} aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="zb-card zb-card--full">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Quick actions</p>
              <p className="zb-card__meta">Common tasks across the dashboard</p>
            </div>
          </div>
          <div className="zb-ovQuick zb-ovQuick--row">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.to} to={q.to} className="zb-ovQuick__item">
                  <span className="zb-ovQuick__icon" aria-hidden>
                    <Icon size={15} />
                  </span>
                  <span>
                    <strong>{q.label}</strong>
                    <em>{q.hint}</em>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {upcoming.length > 0 ? (
          <div className="zb-card zb-card--full">
            <div className="zb-compose__head">
              <div>
                <p className="zb-card__title">Upcoming home visits</p>
                <p className="zb-card__meta">Next scheduled appointments</p>
              </div>
              <Link to="/dashboard/home-service" className="zb-ovInlineLink">
                View all
              </Link>
            </div>
            <ul className="zb-ovUpcoming">
              {upcoming.map((x) => (
                <li key={x.id} className="zb-ovUpcoming__item">
                  <div>
                    <p className="zb-ovUpcoming__name">{x.client}</p>
                    <p className="zb-ovUpcoming__meta">
                      {x.service || "Home service"}
                      {x.status ? ` · ${x.status}` : ""}
                    </p>
                  </div>
                  <div className="zb-ovUpcoming__when">
                    <p>{formatSchedule(x.date)}</p>
                    {typeof x.amountGhs === "number" ? (
                      <p className="zb-ovUpcoming__amt">{money(x.amountGhs)}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {lowStock.length > 0 ? (
          <div className="zb-card zb-card--full">
            <div className="zb-compose__head">
              <div>
                <p className="zb-card__title">Low stock</p>
                <p className="zb-card__meta">Products at 3 or fewer units</p>
              </div>
              <Link to="/dashboard/products" className="zb-ovInlineLink">
                Manage
              </Link>
            </div>
            <div className="zb-ovStock">
              <ul>
                {lowStock.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span>{Number(p.stock) || 0} left</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="zb-card zb-card--full">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Recent activity</p>
              <p className="zb-card__meta">
                {anyError ? anyError : "Latest walk-ins, home visits, classes, and expenses"}
              </p>
            </div>
          </div>

          <div className="zb-tableWrap" role="region" aria-label="Recent activity" tabIndex={0}>
            <table className="zb-table zb-ovTable" aria-label="Recent activity">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Who / what</th>
                  <th>Detail</th>
                  <th>Amount</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {!loading && recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="zb-tableEmpty">
                      Nothing logged yet. Start with a walk-in or home service booking.
                    </td>
                  </tr>
                ) : null}
                {recent.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={row.typeClass}>{row.type}</span>
                    </td>
                    <td>
                      <Link to={row.href} className="zb-ovRowLink">
                        {row.title}
                      </Link>
                    </td>
                    <td>{row.detail}</td>
                    <td>{row.amount}</td>
                    <td className="zb-ovWhen">{formatWhen(row.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}
