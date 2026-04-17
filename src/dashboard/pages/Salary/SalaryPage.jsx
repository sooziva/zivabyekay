import { useMemo, useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function SalaryPage() {
  const payments = useAuthedJson("/api/dashboard/salary", []);
  const [form, setForm] = useState({
    staff: "",
    period: "",
    date: "",
    amountGhs: "",
    method: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    const items = payments.data?.items || [];
    return items.reduce((sum, x) => sum + (Number(x.amountGhs) || 0), 0);
  }, [payments.data]);

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Salary" subtitle="Staff payroll and payouts.">
        <div className="zb-card">
          <p className="zb-card__title">Payments</p>
          <p className="zb-card__value">{payments.loading ? "…" : (payments.data?.items || []).length}</p>
          <p className="zb-card__meta">Last 50 entries</p>
        </div>

        <div className="zb-card">
          <p className="zb-card__title">Total</p>
          <p className="zb-card__value">{payments.loading ? "…" : `GHS ${total.toFixed(2)}`}</p>
          <p className="zb-card__meta">Sum of payouts (last 50)</p>
        </div>

        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add salary payment</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/salary", {
                  ...form,
                  amountGhs: Number(form.amountGhs),
                });
                payments.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({ staff: "", period: "", date: "", amountGhs: "", method: "", notes: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Staff name" value={form.staff} onChange={(e) => setForm((p) => ({ ...p, staff: e.target.value }))} />
            <input
              placeholder="Period (optional, e.g. 2026-04)"
              value={form.period}
              onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
            />
            <input
              type="datetime-local"
              placeholder="Payment date (optional)"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Amount (GHS)"
              value={form.amountGhs}
              onChange={(e) => setForm((p) => ({ ...p, amountGhs: e.target.value }))}
            />
            <input
              placeholder="Method (cash/momo/bank)"
              value={form.method}
              onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}
            />
            <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>

          {error ? <p className="zb-card__meta">{error}</p> : null}

          <p className="zb-card__meta">{payments.error ? payments.error : "Latest payments"}</p>
          <div className="zb-list">
            {(payments.data?.items || []).slice(0, 25).map((x) => (
              <div key={x.id} className="zb-listItem">
                <p className="zb-listItem__title">{x.staff}</p>
                <p className="zb-listItem__meta">
                  {x.period ? `${x.period} • ` : ""}
                  {x.date ? `${new Date(x.date).toLocaleString()} • ` : ""}
                  {typeof x.amountGhs === "number" ? `GHS ${x.amountGhs.toFixed(2)}` : ""}
                  {x.method ? ` • ${x.method}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}

