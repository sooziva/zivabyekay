import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { Resend } from "resend";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import {
  applyWeddingsPdfDomTweaks,
  getDocHeightPx,
  parseSectionsParam,
  waitForImagesAndScroll,
} from "../lib/weddings-pdf-shared.js";
import { buildAcknowledgementEmail, buildBridalInquiryOwnerEmail } from "../lib/email-templates.js";
import { getAuth, getAuthInitError } from "./auth.js";
import { prisma } from "./prisma.js";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const app = express();

const devFrontendOrigin = "http://localhost:5173";
const configuredFrontendOrigin = process.env.FRONTEND_ORIGIN;

function parseAllowedOrigins(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

const configuredOrigins = parseAllowedOrigins(configuredFrontendOrigin);
const defaultProdOrigins = ["https://sooziva.com", "https://www.sooziva.com", "https://dashboard.sooziva.com"];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultProdOrigins;

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (origin === devFrontendOrigin) return cb(null, true);
      if (/^http:\/\/localhost:517\d$/.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Better Auth handler must be mounted BEFORE express.json().
app.all("/api/auth/{*any}", async (req, res) => {
  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    return res.status(503).json({
      ok: false,
      error: err?.message || "Auth service unavailable",
    });
  }
  return toNodeHandler(auth)(req, res);
});

// Apply JSON parsing only for non-auth routes.
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/dashboard/session", async (req, res) => {
  try {
    const auth = await getAuth();
    if (!auth) {
      const err = getAuthInitError();
      return res.status(503).json({ ok: false, error: err?.message || "Auth service unavailable" });
    }
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return res.json({ ok: true, session });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Failed to get session" });
  }
});

async function requireDashboardSession(req, res) {
  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    res.status(503).json({ ok: false, error: err?.message || "Auth service unavailable" });
    return null;
  }
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return null;
  }
  return session;
}

app.get("/api/dashboard/walkins", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.walkIn.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/walkins", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};
  const amountGhs = Number(body.amountGhs);
  if (!Number.isFinite(amountGhs)) return res.status(400).json({ ok: false, error: "Invalid amountGhs" });
  const item = await prisma.walkIn.create({
    data: {
      client: body.client ? String(body.client) : null,
      service: body.service ? String(body.service) : null,
      amountGhs,
      notes: body.notes ? String(body.notes) : null,
    },
  });
  res.json({ ok: true, item });
});

app.get("/api/dashboard/expenses", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.expense.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/expenses", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};
  const category = String(body.category || "").trim();
  const amountGhs = Number(body.amountGhs);
  if (!category) return res.status(400).json({ ok: false, error: "Missing category" });
  if (!Number.isFinite(amountGhs)) return res.status(400).json({ ok: false, error: "Invalid amountGhs" });
  const item = await prisma.expense.create({
    data: { category, amountGhs, notes: body.notes ? String(body.notes) : null },
  });
  res.json({ ok: true, item });
});

app.get("/api/dashboard/products", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/products", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};
  const name = String(body.name || "").trim();
  if (!name) return res.status(400).json({ ok: false, error: "Missing name" });
  const item = await prisma.product.create({
    data: {
      name,
      sku: body.sku ? String(body.sku) : null,
      priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
      stock: body.stock == null || body.stock === "" ? 0 : Number(body.stock),
    },
  });
  res.json({ ok: true, item });
});

app.get("/api/dashboard/classes", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.classSession.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/classes", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};
  const title = String(body.title || "").trim();
  if (!title) return res.status(400).json({ ok: false, error: "Missing title" });
  const item = await prisma.classSession.create({
    data: {
      title,
      date: body.date ? new Date(String(body.date)) : null,
      priceGhs: body.priceGhs === "" || body.priceGhs == null ? null : Number(body.priceGhs),
      notes: body.notes ? String(body.notes) : null,
    },
  });
  res.json({ ok: true, item });
});

app.get("/api/dashboard/home-services", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.homeServiceBooking.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/home-services", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};

  const client = String(body.client || "").trim();
  if (!client) return res.status(400).json({ ok: false, error: "Missing client" });

  const amountGhsRaw = body.amountGhs;
  const amountGhs = amountGhsRaw === "" || amountGhsRaw == null ? null : Number(amountGhsRaw);
  if (amountGhs != null && !Number.isFinite(amountGhs)) return res.status(400).json({ ok: false, error: "Invalid amountGhs" });

  const date = body.date ? new Date(String(body.date)) : null;
  if (date && Number.isNaN(date.getTime())) return res.status(400).json({ ok: false, error: "Invalid date" });

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

  res.json({ ok: true, item });
});

app.get("/api/dashboard/salary", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const items = await prisma.salaryPayment.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ ok: true, items });
});

app.post("/api/dashboard/salary", async (req, res) => {
  const session = await requireDashboardSession(req, res);
  if (!session) return;
  const body = req.body || {};

  const staff = String(body.staff || "").trim();
  if (!staff) return res.status(400).json({ ok: false, error: "Missing staff" });

  const amountGhs = Number(body.amountGhs);
  if (!Number.isFinite(amountGhs)) return res.status(400).json({ ok: false, error: "Invalid amountGhs" });

  const date = body.date ? new Date(String(body.date)) : null;
  if (date && Number.isNaN(date.getTime())) return res.status(400).json({ ok: false, error: "Invalid date" });

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

  res.json({ ok: true, item });
});

app.post("/api/bridal-inquiry", async (req, res) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO;

    if (!apiKey) return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY" });
    if (!from) return res.status(500).json({ ok: false, error: "Missing RESEND_FROM" });
    if (!to) return res.status(500).json({ ok: false, error: "Missing RESEND_TO" });

    const data = req.body || {};

    const email = buildBridalInquiryOwnerEmail(data);

    const resend = new Resend(apiKey);
    const recipients = String(to)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const { data: sent, error } = await resend.emails.send({
      from,
      to: recipients.length ? recipients : [to],
      replyTo: data.email ? [data.email] : undefined,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (error) return res.status(502).json({ ok: false, error: error.message || "Resend error" });
    return res.json({ ok: true, id: sent?.id ?? null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
});

app.post("/api/send-acknowledgement", async (req, res) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const ownerEmail = process.env.RESEND_TO || process.env.OWNER_EMAIL || "sooziva@gmail.com";

    if (!apiKey) return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY" });
    if (!from) return res.status(500).json({ ok: false, error: "Missing RESEND_FROM" });
    if (!ownerEmail) return res.status(500).json({ ok: false, error: "Missing RESEND_TO" });

    const data = req.body || {};
    const name = String(data.name || "").trim();
    const date = String(data.date || "").trim();
    const clientEmail = String(data.email || "").trim();

    if (!name || !date || !clientEmail) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const resend = new Resend(apiKey);
    const email = buildAcknowledgementEmail({ name, date, clientEmail });

    const { data: sent, error } = await resend.emails.send({
      from,
      to: [clientEmail, ownerEmail],
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (error) return res.status(502).json({ ok: false, error: error.message || "Resend error" });
    return res.json({ ok: true, id: sent?.id ?? null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
});

app.get("/api/weddings-pdf", async (req, res) => {
  const host = req.get("host") || "";
  const origin =
    process.env.FRONTEND_ORIGIN ||
    (host.includes("8787") ? "http://localhost:5173" : `${req.protocol}://${host}`);
  const path = String(req.query?.path || "/ekay/weddings");
  const safePath = path.startsWith("/") ? path : `/${path}`;
  const url = `${origin}${safePath}`;
  const mode = String(req.query?.mode || "a4"); // "single" | "a4"
  const selected = parseSectionsParam(req.query?.sections);

  let browser;
  try {
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      (process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : await chromium.executablePath());

    browser = await puppeteer.launch({
      executablePath,
      args:
        process.platform === "darwin"
          ? ["--no-sandbox", "--disable-setuid-sandbox"]
          : chromium.args,
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(90_000);
    await page.goto(url, { waitUntil: "networkidle0" });

    await applyWeddingsPdfDomTweaks(page, selected);
    await waitForImagesAndScroll(page);
    await page.emulateMediaType("screen");

    const docHeightPx = await getDocHeightPx(page);

    const pdf =
      mode === "single"
        ? await page.pdf({
            width: "210mm",
            height: `${Math.ceil(docHeightPx)}px`,
            printBackground: true,
            displayHeaderFooter: false,
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
            preferCSSPageSize: false,
            scale: 1,
          })
        : await page.pdf({
            format: "A4",
            printBackground: true,
            displayHeaderFooter: false,
            preferCSSPageSize: true,
            margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
            scale: 1,
          });

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", `attachment; filename="weddings${mode === "single" ? "-single" : ""}.pdf"`);
    return res.end(pdf);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Failed to generate PDF" });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`);
});

