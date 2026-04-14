import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import "./Dashboard.css";

function Section({ id, title, subtitle, children }) {
  return (
    <div className="zb-dsection" id={id}>
      <DashboardPageShell title={title} subtitle={subtitle}>
        {children}
      </DashboardPageShell>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="zb-dashboardPage">
      <Section
        id="overview"
        title="Overview"
        subtitle="Quick snapshot of bookings, sales, and operations."
      >
        <div className="zb-card">
          <p className="zb-card__title">Today</p>
          <p className="zb-card__value">0 bookings</p>
          <p className="zb-card__meta">Add real data later (backend/integrations).</p>
        </div>
        <div className="zb-card">
          <p className="zb-card__title">Revenue</p>
          <p className="zb-card__value">GHS 0</p>
          <p className="zb-card__meta">Walk‑in + Home service + Product.</p>
        </div>
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Recent activity</p>
          <table className="zb-table" aria-label="Recent activity">
            <thead>
              <tr>
                <th>Type</th>
                <th>Client</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Walk‑in</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="classes" title="Classes" subtitle="Manage class schedules, payments, and attendance.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Class list</p>
          <p className="zb-card__meta">Create, edit, and track enrollments here.</p>
        </div>
      </Section>

      <Section id="walk-in" title="Walk‑in" subtitle="Track walk‑in services and quick receipts.">
        <div className="zb-card">
          <p className="zb-card__title">Walk‑in count</p>
          <p className="zb-card__value">0</p>
          <p className="zb-card__meta">Today</p>
        </div>
        <div className="zb-card">
          <p className="zb-card__title">Walk‑in total</p>
          <p className="zb-card__value">GHS 0</p>
          <p className="zb-card__meta">Today</p>
        </div>
      </Section>

      <Section
        id="home-service"
        title="Home Service"
        subtitle="Manage home service bookings, addresses, and staffing."
      >
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Upcoming home service</p>
          <p className="zb-card__meta">Add booking cards + map/address details here.</p>
        </div>
      </Section>

      <Section id="products" title="Product" subtitle="Inventory, sales, and restock alerts.">
        <div className="zb-card">
          <p className="zb-card__title">SKUs</p>
          <p className="zb-card__value">0</p>
          <p className="zb-card__meta">Tracked products</p>
        </div>
        <div className="zb-card">
          <p className="zb-card__title">Low stock</p>
          <p className="zb-card__value">0</p>
          <p className="zb-card__meta">Needs restock</p>
        </div>
      </Section>

      <Section id="expenses" title="Expenses" subtitle="Log expenses and track monthly totals.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Expense log</p>
          <p className="zb-card__meta">Add categories (rent, supplies, marketing, etc.).</p>
        </div>
      </Section>

      <Section id="salary" title="Salary" subtitle="Staff payroll and payouts.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Payroll</p>
          <p className="zb-card__meta">Add staff list + payout status here.</p>
        </div>
      </Section>

      <Section id="reports" title="Reports" subtitle="Download and review performance reports.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Reports</p>
          <p className="zb-card__meta">Daily/weekly/monthly summaries will live here.</p>
        </div>
      </Section>
    </div>
  );
}

