import { prisma } from "./_utils/prisma.js";
import { methodNotAllowed, sendJson } from "./_utils/http.js";
import { fromNodeHeaders } from "better-auth/node";
import { getAuth, getAuthInitError } from "./_utils/auth.js";

async function requireDashboardSession(req, res) {
  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    sendJson(res, 503, { ok: false, error: err?.message || "Auth service unavailable" });
    return null;
  }
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    sendJson(res, 401, { ok: false, error: "Unauthorized" });
    return null;
  }
  return session;
}

function resourceFromUrl(req) {
  const url = String(req.url || "");
  const path = url.split("?")[0] || "";
  // path is like "/api/dashboard/walkins" (or "/api/dashboard")
  const idx = path.indexOf("/api/dashboard");
  const rest = idx >= 0 ? path.slice(idx + "/api/dashboard".length) : path;
  const clean = rest.replace(/^\/+/, "");
  return clean.split("/")[0] || "";
}

function getIdFromUrl(req) {
  const url = new URL(String(req.url || "/"), "http://localhost");
  const id = url.searchParams.get("id");
  return id ? String(id) : "";
}

export default async function handler(req, res) {
  try {
    const session = await requireDashboardSession(req, res);
    if (!session) return;

    const resource = resourceFromUrl(req);

    if (!resource || resource === "session") {
      if (req.method !== "GET") return methodNotAllowed(res);
      return sendJson(res, 200, { ok: true, session });
    }

    if (resource === "walkins") {
      const id = getIdFromUrl(req);
      if (req.method === "GET") {
        const items = await prisma.walkIn.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
        return sendJson(res, 200, { ok: true, items });
      }
      if (req.method === "POST") {
        const body = req.body || {};
        const amountGhs = Number(body.amountGhs);
        if (!Number.isFinite(amountGhs)) return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });
        const date = body.date ? new Date(String(body.date)) : null;
        if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });
        const item = await prisma.walkIn.create({
          data: {
            date,
            client: body.client ? String(body.client) : null,
            service: body.service ? String(body.service) : null,
            staff: body.staff ? String(body.staff) : null,
            amountGhs,
            notes: body.notes ? String(body.notes) : null,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "PATCH") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        const body = req.body || {};
        const date = body.date ? new Date(String(body.date)) : body.date === null ? null : undefined;
        if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });
        const amountGhs = body.amountGhs != null ? Number(body.amountGhs) : undefined;
        if (amountGhs !== undefined && !Number.isFinite(amountGhs))
          return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });
        const item = await prisma.walkIn.update({
          where: { id },
          data: {
            date,
            staff: body.staff != null ? String(body.staff) : undefined,
            client: body.client != null ? String(body.client) : undefined,
            service: body.service != null ? String(body.service) : undefined,
            amountGhs,
            notes: body.notes != null ? String(body.notes) : undefined,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "DELETE") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        await prisma.walkIn.delete({ where: { id } });
        return sendJson(res, 200, { ok: true });
      }
      return methodNotAllowed(res);
    }

    if (resource === "expenses") {
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
    }

    if (resource === "products") {
      const id = getIdFromUrl(req);
      if (req.method === "GET") {
        const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
        return sendJson(res, 200, { ok: true, items });
      }
      if (req.method === "POST") {
        const body = req.body || {};
        const name = String(body.name || "").trim();
        if (!name) return sendJson(res, 400, { ok: false, error: "Missing name" });
        const shades = body.shades != null ? String(body.shades) : body.sku != null ? String(body.sku) : "";
        const item = await prisma.product.create({
          data: {
            name,
            shades: shades.trim() ? shades.trim() : null,
            priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
            stock: body.stock == null || body.stock === "" ? 0 : Number(body.stock),
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "PATCH") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        const body = req.body || {};
        const shades = body.shades != null ? String(body.shades) : undefined;
        const priceGhs = body.priceGhs === "" ? null : body.priceGhs != null ? Number(body.priceGhs) : undefined;
        if (priceGhs !== undefined && priceGhs !== null && !Number.isFinite(priceGhs))
          return sendJson(res, 400, { ok: false, error: "Invalid priceGhs" });
        const stock = body.stock === "" ? 0 : body.stock != null ? Number(body.stock) : undefined;
        if (stock !== undefined && !Number.isFinite(stock)) return sendJson(res, 400, { ok: false, error: "Invalid stock" });

        const item = await prisma.product.update({
          where: { id },
          data: {
            name: body.name != null ? String(body.name) : undefined,
            shades: shades === undefined ? undefined : shades.trim() ? shades.trim() : null,
            priceGhs,
            stock,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "DELETE") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        await prisma.product.delete({ where: { id } });
        return sendJson(res, 200, { ok: true });
      }
      return methodNotAllowed(res);
    }

    if (resource === "classes") {
      const id = getIdFromUrl(req);
      if (req.method === "GET") {
        const items = await prisma.classSession.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
        return sendJson(res, 200, { ok: true, items });
      }
      if (req.method === "POST") {
        const body = req.body || {};
        const studentName = String(body.studentName || "").trim();
        const course = String(body.course || body.title || "").trim();
        if (!studentName) return sendJson(res, 400, { ok: false, error: "Missing studentName" });
        if (!course) return sendJson(res, 400, { ok: false, error: "Missing course" });
        const item = await prisma.classSession.create({
          data: {
            title: course,
            studentName,
            course,
            date: body.date ? new Date(String(body.date)) : null,
            priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
            notes: body.notes ? String(body.notes) : null,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "PATCH") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        const body = req.body || {};
        const course = body.course != null ? String(body.course).trim() : undefined;
        const studentName = body.studentName != null ? String(body.studentName).trim() : undefined;
        const date = body.date ? new Date(String(body.date)) : body.date === null ? null : undefined;
        if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });
        const priceGhs = body.priceGhs === "" ? null : body.priceGhs != null ? Number(body.priceGhs) : undefined;
        if (priceGhs !== undefined && priceGhs !== null && !Number.isFinite(priceGhs))
          return sendJson(res, 400, { ok: false, error: "Invalid priceGhs" });
        const item = await prisma.classSession.update({
          where: { id },
          data: {
            studentName,
            course,
            title: course === undefined ? undefined : course,
            date,
            priceGhs,
            notes: body.notes != null ? String(body.notes) : undefined,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "DELETE") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        await prisma.classSession.delete({ where: { id } });
        return sendJson(res, 200, { ok: true });
      }
      return methodNotAllowed(res);
    }

    if (resource === "home-services") {
      const id = getIdFromUrl(req);
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
        if (amountGhs != null && !Number.isFinite(amountGhs)) return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });

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
      if (req.method === "PATCH") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        const body = req.body || {};
        const date = body.date ? new Date(String(body.date)) : body.date === null ? null : undefined;
        if (date && Number.isNaN(date.getTime())) return sendJson(res, 400, { ok: false, error: "Invalid date" });
        const amountGhs =
          body.amountGhs === "" ? null : body.amountGhs != null ? Number(body.amountGhs) : undefined;
        if (amountGhs !== undefined && amountGhs !== null && !Number.isFinite(amountGhs))
          return sendJson(res, 400, { ok: false, error: "Invalid amountGhs" });

        const item = await prisma.homeServiceBooking.update({
          where: { id },
          data: {
            client: body.client != null ? String(body.client) : undefined,
            date,
            service: body.service != null ? String(body.service) : undefined,
            amountGhs,
            staff: body.staff != null ? String(body.staff) : undefined,
            status: body.status != null ? String(body.status) : undefined,
            notes: body.notes != null ? String(body.notes) : undefined,
          },
        });
        return sendJson(res, 200, { ok: true, item });
      }
      if (req.method === "DELETE") {
        if (!id) return sendJson(res, 400, { ok: false, error: "Missing id" });
        await prisma.homeServiceBooking.delete({ where: { id } });
        return sendJson(res, 200, { ok: true });
      }
      return methodNotAllowed(res);
    }

    if (resource === "salary") {
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

    return sendJson(res, 404, { ok: false, error: "Not Found" });
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Server error" });
  }
}

