import { prisma } from "../_utils/prisma.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";
import { requireDashboardSession } from "./_utils/session.js";

export default async function handler(req, res) {
  try {
    const session = await requireDashboardSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const items = await prisma.homeServiceBooking.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
      return sendJson(res, 200, { ok: true, items });
    }

    if (req.method === "POST") {
      const body = req.body || {};

      const client = String(body.client || "").trim();
      if (!client) return sendJson(res, 400, { ok: false, error: "Missing client" });

      const amountGhsRaw = body.amountGhs;
      const amountGhs = amountGhsRaw === "" || amountGhsRaw == null ? null : Number(amountGhsRaw);
      if (amountGhs != null && !Number.isFinite(amountGhs))
        return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });

      const date = body.date ? new Date(String(body.date)) : null;
      if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });

      const item = await prisma.homeServiceBooking.create({
        data: {
          client,
          date,
          service: body.service ? String(body.service) : null,
          amountGhs,
          address: body.address ? String(body.address) : null,
          city: body.city ? String(body.city) : null,
          staff: body.staff ? String(body.staff) : null,
          status: body.status ? String(body.status) : null,
          notes: body.notes ? String(body.notes) : null,
        },
      });

      return sendJson(res, 200, { ok: true, item });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Server error" });
  }
}

