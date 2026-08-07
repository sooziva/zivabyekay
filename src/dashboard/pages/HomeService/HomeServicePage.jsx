import { useMemo, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import DateTimePicker from "../../components/DateTimePicker/DateTimePicker";
import { deleteJson, patchJson, postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

const STATUS_OPTIONS = [
  { value: "", label: "No status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const EMPTY_FORM = {
  client: "",
  date: "",
  service: "",
  amountGhs: "",
  staff: "",
  status: "pending",
  notes: "",
};

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

function formatBookingDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "confirmed") return "zb-statusChip zb-statusChip--ok";
  if (s === "completed") return "zb-statusChip zb-statusChip--done";
  if (s === "cancelled") return "zb-statusChip zb-statusChip--muted";
  if (s === "pending") return "zb-statusChip zb-statusChip--pending";
  return "zb-statusChip";
}

export default function HomeServicePage() {
  const bookings = useAuthedJson("/api/dashboard/home-services", []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [rowSaving, setRowSaving] = useState(false);

  const items = bookings.data?.items || [];

  const total = useMemo(() => items.reduce((sum, x) => sum + (Number(x.amountGhs) || 0), 0), [items]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return items.filter((x) => x.date && new Date(x.date).getTime() >= now).length;
  }, [items]);

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Home Service" subtitle="Schedule at-home bookings, staff, and payment status.">
        <div className="zb-card zb-card--third">
          <p className="zb-card__title">Bookings</p>
          <p className="zb-card__value">{bookings.loading ? "…" : items.length}</p>
          <p className="zb-card__meta">Last 50 entries</p>
        </div>

        <div className="zb-card zb-card--third">
          <p className="zb-card__title">Upcoming</p>
          <p className="zb-card__value">{bookings.loading ? "…" : upcoming}</p>
          <p className="zb-card__meta">With a future date</p>
        </div>

        <div className="zb-card zb-card--third">
          <p className="zb-card__title">Total</p>
          <p className="zb-card__value">{bookings.loading ? "…" : `GHS ${total.toFixed(2)}`}</p>
          <p className="zb-card__meta">Sum of amounts</p>
        </div>

        <div className="zb-card zb-card--full zb-compose">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">New booking</p>
              <p className="zb-card__meta">Add a home visit with date, time, and staff.</p>
            </div>
          </div>

          <form
            className="zb-compose__grid zb-hsForm"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (!form.client.trim()) {
                setError("Client name is required.");
                return;
              }
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/home-services", {
                  ...form,
                  amountGhs: form.amountGhs === "" ? null : Number(form.amountGhs),
                });
                bookings.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm(EMPTY_FORM);
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <label className="zb-compose__field">
              <span>Client</span>
              <input placeholder="Client name" value={form.client} onChange={setField("client")} required />
            </label>

            <label className="zb-compose__field">
              <span>Date & time</span>
              <DateTimePicker
                value={form.date}
                onChange={(next) => setForm((p) => ({ ...p, date: next }))}
                placeholder="Pick date & time"
                aria-label="Booking date and time"
              />
            </label>

            <label className="zb-compose__field">
              <span>Service</span>
              <input placeholder="e.g. Bridal trial, Soft glam" value={form.service} onChange={setField("service")} />
            </label>

            <label className="zb-compose__field">
              <span>Amount (GHS)</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                value={form.amountGhs}
                onChange={setField("amountGhs")}
              />
            </label>

            <label className="zb-compose__field">
              <span>Staff</span>
              <input placeholder="Artist / team member" value={form.staff} onChange={setField("staff")} />
            </label>

            <label className="zb-compose__field">
              <span>Status</span>
              <select value={form.status} onChange={setField("status")} aria-label="Booking status">
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || "none"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="zb-compose__field zb-compose__field--full">
              <span>Notes</span>
              <input placeholder="Address, access notes, special requests…" value={form.notes} onChange={setField("notes")} />
            </label>

            <div className="zb-compose__actions zb-compose__field--full">
              <button type="submit" className="zb-btn zb-btn--primary" disabled={saving}>
                {saving ? "Saving…" : "Save booking"}
              </button>
            </div>
          </form>

          {error ? <p className="zb-statusErr">{error}</p> : null}
        </div>

        <div className="zb-card zb-card--full">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Bookings</p>
              <p className="zb-card__meta">{bookings.error ? bookings.error : "Latest home service appointments"}</p>
            </div>
          </div>

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
                {items.length === 0 && !bookings.loading ? (
                  <tr>
                    <td colSpan={8} className="zb-tableEmpty">
                      No home service bookings yet. Add one above.
                    </td>
                  </tr>
                ) : null}
                {items.slice(0, 50).map((x) => (
                  <tr key={x.id}>
                    <td>
                      {editingId === x.id ? (
                        <DateTimePicker
                          compact
                          value={draft.date}
                          onChange={(next) => setDraft((p) => ({ ...p, date: next }))}
                          placeholder="Date & time"
                          aria-label="Edit booking date and time"
                        />
                      ) : (
                        formatBookingDate(x.date)
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
                        <select
                          className="zb-tableInput"
                          value={draft.status}
                          onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value }))}
                          aria-label="Edit status"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value || "none"} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : x.status ? (
                        <span className={statusClass(x.status)}>{x.status}</span>
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
