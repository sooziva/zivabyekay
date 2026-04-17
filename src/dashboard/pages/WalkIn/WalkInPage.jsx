import { useMemo, useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function WalkInPage() {
  const walkins = useAuthedJson("/api/dashboard/walkins", []);
  const [form, setForm] = useState({ client: "", service: "", amountGhs: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    const items = walkins.data?.items || [];
    return items.reduce((sum, x) => sum + (Number(x.amountGhs) || 0), 0);
  }, [walkins.data]);

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Walk-in" subtitle="Track walk-in services and quick receipts.">
        <div className="zb-card">
          <p className="zb-card__title">Count</p>
          <p className="zb-card__value">{walkins.loading ? "…" : (walkins.data?.items || []).length}</p>
          <p className="zb-card__meta">Last 50 entries</p>
        </div>

        <div className="zb-card">
          <p className="zb-card__title">Total</p>
          <p className="zb-card__value">{walkins.loading ? "…" : `GHS ${total.toFixed(2)}`}</p>
          <p className="zb-card__meta">Last 50 entries</p>
        </div>

        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add walk-in</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/walkins", { ...form, amountGhs: Number(form.amountGhs) });
                walkins.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({ client: "", service: "", amountGhs: "", notes: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Client" value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} />
            <input placeholder="Service" value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} />
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

          <p className="zb-card__meta">{walkins.error ? walkins.error : "Latest entries"}</p>
          <div className="zb-list">
            {(walkins.data?.items || []).slice(0, 20).map((x) => (
              <div key={x.id} className="zb-listItem">
                <p className="zb-listItem__title">{x.client || "Walk-in"}</p>
                <p className="zb-listItem__meta">
                  {x.service ? `${x.service} • ` : ""}
                  {typeof x.amountGhs === "number" ? `GHS ${x.amountGhs.toFixed(2)}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}

