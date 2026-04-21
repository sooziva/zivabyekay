import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

export default function ProductsPage() {
  const products = useAuthedJson("/api/dashboard/products", []);
  const [form, setForm] = useState({ name: "", shades: "", priceGhs: "", stock: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell title="Product" subtitle="Inventory, sales, and restock alerts.">
        <div className="zb-card zb-card--full">
          <p className="zb-card__title">Add product</p>
          <form
            className="zb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSaving(true);
              try {
                const json = await postJson("/api/dashboard/products", form);
                products.setData((prev) => ({ ...prev, items: [json.item, ...(prev?.items || [])] }));
                setForm({ name: "", shades: "", priceGhs: "", stock: "" });
              } catch (err) {
                setError(err?.message || "Failed to save");
              } finally {
                setSaving(false);
              }
            }}
          >
            <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input
              placeholder="Shades (optional)"
              value={form.shades}
              onChange={(e) => setForm((p) => ({ ...p, shades: e.target.value }))}
            />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Price (GHS)"
              value={form.priceGhs}
              onChange={(e) => setForm((p) => ({ ...p, priceGhs: e.target.value }))}
            />
            <input
              type="number"
              inputMode="numeric"
              step="1"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
            />
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add"}
            </button>
          </form>
          {error ? <p className="zb-card__meta">{error}</p> : null}
          <p className="zb-card__meta">{products.error ? products.error : `${(products.data?.items || []).length} products`}</p>

          <div className="zb-tableWrap" role="region" aria-label="Products table" tabIndex={0}>
            <table className="zb-table" aria-label="Products">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Shades</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {(products.data?.items || []).slice(0, 100).map((x) => (
                  <tr key={x.id}>
                    <td>{x.name}</td>
                    <td>{x.shades || "—"}</td>
                    <td>{typeof x.stock === "number" ? x.stock : "—"}</td>
                    <td>{x.priceGhs != null ? `GHS ${Number(x.priceGhs).toFixed(2)}` : "—"}</td>
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

