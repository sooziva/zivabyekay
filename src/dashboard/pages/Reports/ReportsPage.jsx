import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import "../_shared/DashboardPages.css";

export default function ReportsPage() {
  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Reports" subtitle="Download and review performance reports.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Coming next</p>
          <p className="zb-card__meta">Daily/weekly/monthly summaries will live here.</p>
        </div>
      </DashboardPageShell>
    </div>
  );
}

