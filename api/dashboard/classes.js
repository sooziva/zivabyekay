import { prisma } from "../_utils/prisma.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";
import { requireDashboardSession } from "./_utils/session.js";

export default async function handler(req, res) {
  try {
    const session = await requireDashboardSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const items = await prisma.classSession.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
      return sendJson(res, 200, { ok: true, items });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const title = String(body.title || "").trim();
      if (!title) return sendJson(res, 400, { ok: false, error: "Missing title" });
      const item = await prisma.classSession.create({
        data: {
          title,
          date: body.date ? new Date(String(body.date)) : null,
          priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
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

