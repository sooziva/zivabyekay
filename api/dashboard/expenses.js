import { prisma } from "../_utils/prisma.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";
import { requireDashboardSession } from "./_utils/session.js";

export default async function handler(req, res) {
  try {
    const session = await requireDashboardSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const items = await prisma.expense.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
      return sendJson(res, 200, { ok: true, items });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const category = String(body.category || "").trim();
      const amountGhs = Number(body.amountGhs);
      if (!category) return sendJson(res, 400, { ok: false, error: "Missing category" });
      if (!Number.isFinite(amountGhs)) return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });
      const item = await prisma.expense.create({
        data: { category, amountGhs, notes: body.notes ? String(body.notes) : null },
      });
      return sendJson(res, 200, { ok: true, item });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Server error" });
  }
}

