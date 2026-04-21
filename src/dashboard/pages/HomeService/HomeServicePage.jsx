import { useMemo, useState } from "react";
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

export default function HomeServicePage() {
  const bookings = useAuthedJson("/api/dashboard/home-services", []);
  const [form, setForm] = useState({
    client: "",
    date: "",
    service: "",
    amountGhs: "",
    staff: "",
    status: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({ client: "", date: "", service: "", amountGhs: "", staff: "", status: "", notes: "" });
  const [rowSaving, setRowSaving] = useState(false);

  const total = useMemo(() => {
    const items = bookings.data?.items || [];
    return items.reduce((sum, x) => sum + (Number(x.amountGhs) || 0), 0);
  }, [bookings.data]);

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Home Service" subtitle="Manage home service bookings, addresses, and staffing.">
        <div className="zb-card">
          <p className="zb-card__title">Bookings</p>
          <p className="zb-card__value">{bookings.loading ? "…" : (bookings.data?.items || []).length}</p>
          <p className="zb-card__meta">Last 50 entries</p>
        </div>

        <div className="zb-card">
          <p className="zb-card__title">Total</p>
          <p className="zb-card__value">{bookings.loading ? "…" : `GHS ${total.toFixed(2)}`}</p>
          <p className="zb-card__meta">Sum of amounts (last 50)</p>
        </div>

        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add home service booking</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/home-services", {
                  ...form,
                  amountGhs: form.amountGhs === "" ? null : Number(form.amountGhs),
                });
                bookings.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({
                  client: "",
                  date: "",
                  service: "",
                  amountGhs: "",
                  staff: "",
                  status: "",
                  notes: "",
                });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Client" value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} />
            <input
              type="datetime-local"
              placeholder="Date (optional)"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
            <input placeholder="Service" value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Amount (GHS)"
              value={form.amountGhs}
              onChange={(e) => setForm((p) => ({ ...p, amountGhs: e.target.value }))}
            />
            <input placeholder="Staff (optional)" value={form.staff} onChange={(e) => setForm((p) => ({ ...p, staff: e.target.value }))} />
            <input
              placeholder="Status (pending/confirmed/completed)"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            />
            <input placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>

          {error ? <p className="zb-card__meta">{error}</p> : null}

          <p className="zb-card__meta">{bookings.error ? bookings.error : "Latest bookings"}</p>
          <div className="zb-tableWrap" role="region" aria-label="Home service bookings table" tabIndex={0}>
            <table className="zb-table" aria-label="Home service bookings">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Staff</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(bookings.data?.items || []).slice(0, 50).map((x) => (
                  <tr key={x.id}>
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
                          value={draft.client}
                          onChange={(e) => setDraft((p) => ({ ...p, client: e.target.value }))}
                        />
                      ) : (
                        x.client || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.service}
                          onChange={(e) => setDraft((p) => ({ ...p, service: e.target.value }))}
                        />
                      ) : (
                        x.service || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.staff}
                          onChange={(e) => setDraft((p) => ({ ...p, staff: e.target.value }))}
                        />
                      ) : (
                        x.staff || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.status}
                          onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value }))}
                        />
                      ) : (
                        x.status || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          value={draft.amountGhs}
                          onChange={(e) => setDraft((p) => ({ ...p, amountGhs: e.target.value }))}
                        />
                      ) : typeof x.amountGhs === "number" ? (
                        `GHS ${x.amountGhs.toFixed(2)}`
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
                                  const json = await patchJson(`/api/dashboard/home-services?id=${encodeURIComponent(x.id)}`, {
                                    ...draft,
                                    amountGhs: draft.amountGhs === "" ? null : Number(draft.amountGhs),
                                  });
                                  bookings.setData((prev) => ({
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
                                  client: x.client || "",
                                  date: toLocalDateTimeInputValue(x.date),
                                  service: x.service || "",
                                  amountGhs: x.amountGhs == null ? "" : String(x.amountGhs),
                                  staff: x.staff || "",
                                  status: x.status || "",
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
                                const ok = window.confirm("Delete this home service booking?");
                                if (!ok) return;
                                setRowSaving(true);
                                try {
                                  await deleteJson(`/api/dashboard/home-services?id=${encodeURIComponent(x.id)}`);
                                  bookings.setData((prev) => ({
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

