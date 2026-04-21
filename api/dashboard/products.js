import { prisma } from "../_utils/prisma.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";
import { requireDashboardSession } from "./_utils/session.js";

export default async function handler(req, res) {
  try {
    const session = await requireDashboardSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
      return sendJson(res, 200, { ok: true, items });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const name = String(body.name || "").trim();
      if (!name) return sendJson(res, 400, { ok: false, error: "Missing name" });
      const item = await prisma.product.create({
        data: {
          name,
          sku: body.sku ? String(body.sku) : null,
          priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
          stock: body.stock == null || body.stock === "" ? 0 : Number(body.stock),
        },
      });
      return sendJson(res, 200, { ok: true, item });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Server error" });
  }
}

