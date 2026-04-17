import { useMemo } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function OverviewPage() {
  const walkins = useAuthedJson("/api/dashboard/walkins", []);

  const revenue = useMemo(() => {
    const items = walkins.data?.items || [];
    return items.reduce((sum, x) => sum + (Number(x.amountGhs) || 0), 0);
  }, [walkins.data]);

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Overview" subtitle="Quick snapshot of bookings, sales, and operations.">
        <div className="zb-card">
          <p className="zb-card__title">Walk-ins</p>
          <p className="zb-card__value">{walkins.loading ? "…" : (walkins.data?.items || []).length}</p>
          <p className="zb-card__meta">{walkins.error ? walkins.error : "Last 50 entries"}</p>
        </div>

        <div className="zb-card">
          <p className="zb-card__title">Revenue</p>
          <p className="zb-card__value">{walkins.loading ? "…" : `GHS ${revenue.toFixed(2)}`}</p>
          <p className="zb-card__meta">Walk-in total (last 50)</p>
        </div>

        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Recent activity</p>
          <div className="zb-tableWrap" role="region" aria-label="Recent activity table" tabIndex={0}>
            <table className="zb-table" aria-label="Recent activity">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(walkins.data?.items || []).slice(0, 10).map((x) => (
                  <tr key={x.id}>
                    <td>Walk-in</td>
                    <td>{x.client || "—"}</td>
                    <td>{x.service || "—"}</td>
                    <td>{typeof x.amountGhs === "number" ? `GHS ${x.amountGhs.toFixed(2)}` : "—"}</td>
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

