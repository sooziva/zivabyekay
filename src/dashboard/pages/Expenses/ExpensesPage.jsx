import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function ExpensesPage() {
  const expenses = useAuthedJson("/api/dashboard/expenses", []);
  const [form, setForm] = useState({ category: "", amountGhs: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Expenses" subtitle="Log expenses and track monthly totals.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add expense</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/expenses", {
                  ...form,
                  amountGhs: Number(form.amountGhs),
                });
                expenses.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({ category: "", amountGhs: "", notes: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Amount (GHS)"
              value={form.amountGhs}
              onChange={(e) => setForm((p) => ({ ...p, amountGhs: e.target.value }))}
            />
            <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
          {error ? <p className="zb-card__meta">{error}</p> : null}
          <p className="zb-card__meta">{expenses.error ? expenses.error : `${(expenses.data?.items || []).length} entries (last 50).`}</p>

          <div className="zb-list">
            {(expenses.data?.items || []).slice(0, 30).map((x) => (
              <div key={x.id} className="zb-listItem">
                <p className="zb-listItem__title">{x.category}</p>
                <p className="zb-listItem__meta">
                  {typeof x.amountGhs === "number" ? `GHS ${x.amountGhs.toFixed(2)}` : ""} {x.notes ? `• ${x.notes}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}

