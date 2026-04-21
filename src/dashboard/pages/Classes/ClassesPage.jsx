import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function ClassesPage() {
  const classes = useAuthedJson("/api/dashboard/classes", []);
  const [form, setForm] = useState({ studentName: "", course: "", date: "", priceGhs: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Classes" subtitle="Manage class schedules, payments, and attendance.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add class enrolment</p>
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
                setForm({ studentName: "", course: "", date: "", priceGhs: "", notes: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input
              placeholder="Student name"
              value={form.studentName}
              onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
              required
            />
            <input
              placeholder="Course"
              value={form.course}
              onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
              required
            />
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
          <div className="zb-tableWrap" role="region" aria-label="Classes table" tabIndex={0}>
            <table className="zb-table" aria-label="Classes">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {(classes.data?.items || []).slice(0, 50).map((x) => (
                  <tr key={x.id}>
                    <td>{x.studentName || "—"}</td>
                    <td>{x.course || x.title || "—"}</td>
                    <td>{x.date ? new Date(x.date).toLocaleString() : "—"}</td>
                    <td>{x.priceGhs != null ? `GHS ${Number(x.priceGhs).toFixed(2)}` : "—"}</td>
                    <td>{x.notes || "—"}</td>
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

