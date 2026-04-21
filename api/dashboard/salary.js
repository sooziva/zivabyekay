import { prisma } from "../_utils/prisma.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";
import { requireDashboardSession } from "./_utils/session.js";

export default async function handler(req, res) {
  const session = await requireDashboardSession(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const items = await prisma.salaryPayment.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    return sendJson(res, 200, { ok: true, items });
  }

  if (req.method === "POST") {
    const body = req.body || {};

    const staff = String(body.staff || "").trim();
    if (!staff) return sendJson(res, 400, { ok: false, error: "Missing staff" });

    const amountGhs = Number(body.amountGhs);
    if (!Number.isFinite(amountGhs)) return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });

    const date = body.date ? new Date(String(body.date)) : null;
    if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });

    const item = await prisma.salaryPayment.create({
      data: {
        staff,
        period: body.period ? String(body.period) : null,
        date,
        amountGhs,
        method: body.method ? String(body.method) : null,
        notes: body.notes ? String(body.notes) : null,
      },
    });

    return sendJson(res, 200, { ok: true, item });
  }

  return methodNotAllowed(res);
}

