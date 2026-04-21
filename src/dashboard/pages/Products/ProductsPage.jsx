import { useState } from "react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import { deleteJson, patchJson, postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";
import { Check, Pencil, Trash2, X } from "lucide-react";

export default function ProductsPage() {
  const products = useAuthedJson("/api/dashboard/products", []);
  const [form, setForm] = useState({ name: "", shades: "", priceGhs: "", stock: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({ name: "", shades: "", priceGhs: "", stock: "" });
  const [rowSaving, setRowSaving] = useState(false);

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products.data?.items || []).slice(0, 100).map((x) => (
                  <tr key={x.id}>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.name}
                          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                        />
                      ) : (
                        x.name
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          value={draft.shades}
                          onChange={(e) => setDraft((p) => ({ ...p, shades: e.target.value }))}
                        />
                      ) : (
                        x.shades || "—"
                      )}
                    </td>
                    <td>
                      {editingId === x.id ? (
                        <input
                          className="zb-tableInput"
                          type="number"
                          step="1"
                          inputMode="numeric"
                          value={draft.stock}
                          onChange={(e) => setDraft((p) => ({ ...p, stock: e.target.value }))}
                        />
                      ) : typeof x.stock === "number" ? (
                        x.stock
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
                                  const json = await patchJson(`/api/dashboard/products?id=${encodeURIComponent(x.id)}`, {
                                    ...draft,
                                    priceGhs: draft.priceGhs === "" ? null : Number(draft.priceGhs),
                                    stock: draft.stock === "" ? 0 : Number(draft.stock),
                                  });
                                  products.setData((prev) => ({
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
                                  name: x.name || "",
                                  shades: x.shades || "",
                                  priceGhs: x.priceGhs == null ? "" : String(x.priceGhs),
                                  stock: x.stock == null ? "" : String(x.stock),
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
                                const ok = window.confirm("Delete this product?");
                                if (!ok) return;
                                setRowSaving(true);
                                try {
                                  await deleteJson(`/api/dashboard/products?id=${encodeURIComponent(x.id)}`);
                                  products.setData((prev) => ({
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

