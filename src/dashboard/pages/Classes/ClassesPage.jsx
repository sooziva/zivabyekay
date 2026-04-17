import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function ClassesPage() {
  const classes = useAuthedJson("/api/dashboard/classes", []);
  const [form, setForm] = useState({ title: "", date: "", priceGhs: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Classes" subtitle="Manage class schedules, payments, and attendance.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add class</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/classes", {
                  ...form,
                  priceGhs: form.priceGhs === "" ? null : Number(form.priceGhs),
                });
                classes.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({ title: "", date: "", priceGhs: "", notes: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            <input
              type="datetime-local"
              placeholder="Date (optional)"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Price (GHS)"
              value={form.priceGhs}
              onChange={(e) => setForm((p) => ({ ...p, priceGhs: e.target.value }))}
            />
            <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add"}
            </button>
          </form>
          {error ? <p className="zb-card__meta">{error}</p> : null}
          <p className="zb-card__meta">{classes.error ? classes.error : `${(classes.data?.items || []).length} sessions (last 50).`}</p>
          <div className="zb-list">
            {(classes.data?.items || []).slice(0, 20).map((x) => (
              <div key={x.id} className="zb-listItem">
                <p className="zb-listItem__title">{x.title}</p>
                <p className="zb-listItem__meta">
                  {x.date ? new Date(x.date).toLocaleString() : "No date"} {x.priceGhs != null ? `• GHS ${Number(x.priceGhs).toFixed(2)}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}

