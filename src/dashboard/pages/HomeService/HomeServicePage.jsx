import { useMemo, useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function HomeServicePage() {
  const bookings = useAuthedJson("/api/dashboard/home-services", []);
  const [form, setForm] = useState({
    client: "",
    date: "",
    service: "",
    amountGhs: "",
    address: "",
    city: "",
    staff: "",
    status: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
                  address: "",
                  city: "",
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
            <input placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            <input placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
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
          <div className="zb-list">
            {(bookings.data?.items || []).slice(0, 25).map((x) => (
              <div key={x.id} className="zb-listItem">
                <p className="zb-listItem__title">{x.client}</p>
                <p className="zb-listItem__meta">
                  {x.date ? `${new Date(x.date).toLocaleString()} • ` : ""}
                  {x.service ? `${x.service} • ` : ""}
                  {typeof x.amountGhs === "number" ? `GHS ${x.amountGhs.toFixed(2)}` : ""}
                  {x.city ? ` • ${x.city}` : ""}
                  {x.status ? ` • ${x.status}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}

