import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { deleteJson, patchJson, postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";
import { Check, Pencil, Trash2, X } from "lucide-react";

function toLocalDateTimeInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function ClassesPage() {
  const classes = useAuthedJson("/api/dashboard/classes", []);
  const [form, setForm] = useState({ studentName: "", course: "", date: "", priceGhs: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({ studentName: "", course: "", date: "", priceGhs: "", notes: "" });
  const [rowSaving, setRowSaving] = useState(false);

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(classes.data?.items || []).slice(0, 50).map((x) => (
                  <tr key={x.id}>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.studentName}
                          onChange={(e) => setDraft((p) => ({ ...p, studentName: e.target.value }))}
                        />
                      ) : (
                        x.studentName || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.course}
                          onChange={(e) => setDraft((p) => ({ ...p, course: e.target.value }))}
                        />
                      ) : (
                        x.course || x.title || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          type="datetime-local"
                          value={draft.date}
                          onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))}
                        />
                      ) : x.date ? (
                        new Date(x.date).toLocaleString()
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          value={draft.priceGhs}
                          onChange={(e) => setDraft((p) => ({ ...p, priceGhs: e.target.value }))}
                        />
                      ) : x.priceGhs != null ? (
                        `GHS ${Number(x.priceGhs).toFixed(2)}`
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.notes}
                          onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
                        />
                      ) : (
                        x.notes || "—"
                      )}
                    </td>
                    <td>
                      <div className="zb-rowActions">
                        {editingId === x.id ? (
                          <>
                            <button
                              type="button"
                              className="zb-iconBtn"
                              aria-label="Save"
                              disabled={rowSaving}
                              onClick={async () => {
                                setRowSaving(true);
                                try {
                                  const json = await patchJson(`/api/dashboard/classes?id=${encodeURIComponent(x.id)}`, {
                                    ...draft,
                                    priceGhs: draft.priceGhs === "" ? null : Number(draft.priceGhs),
                                  });
                                  classes.setData((prev) => ({
                                    ...prev,
                                    items: (prev?.items || []).map((it) => (it.id === x.id ? json.item : it)),
                                  }));
                                  setEditingId("");
                                } finally {
                                  setRowSaving(false);
                                }
                              }}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              type="button"
                              className="zb-iconBtn"
                              aria-label="Cancel"
                              disabled={rowSaving}
                              onClick={() => setEditingId("")}
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="zb-iconBtn"
                              aria-label="Edit"
                              onClick={() => {
                                setEditingId(x.id);
                                setDraft({
                                  studentName: x.studentName || "",
                                  course: x.course || x.title || "",
                                  date: toLocalDateTimeInputValue(x.date),
                                  priceGhs: x.priceGhs == null ? "" : String(x.priceGhs),
                                  notes: x.notes || "",
                                });
                              }}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              className="zb-iconBtn zb-iconBtn--danger"
                              aria-label="Delete"
                              onClick={async () => {
                                const ok = window.confirm("Delete this class entry?");
                                if (!ok) return;
                                setRowSaving(true);
                                try {
                                  await deleteJson(`/api/dashboard/classes?id=${encodeURIComponent(x.id)}`);
                                  classes.setData((prev) => ({
                                    ...prev,
                                    items: (prev?.items || []).filter((it) => it.id !== x.id),
                                  }));
                                } finally {
                                  setRowSaving(false);
                                }
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
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

