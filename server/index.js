import "dotenv/config";
import cors from "cors";
import express from "express";
import { Resend } from "resend";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
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

    const subject = `Bridal inquiry — ${data.firstName || "New lead"}${data.weddingDate ? ` (${data.weddingDate})` : ""}`;

    const lines = [
      ["Tier", data.tier],
      ["Name", data.firstName],
      ["WhatsApp", data.whatsapp],
      ["Email", data.email],
      ["City / Country", data.cityCountry],
      ["Referral", data.referral],
      ["Wedding date", data.weddingDate],
      ["Venue", data.venue],
      ["Arrival time", data.weddingTime],
      ["Bridesmaids makeup needs", data.bridesmaidsMakeup],
      ["Style preference", data.stylePreference],
      ["Skin type", data.skinType],
      ["Additional notes", data.notes],
    ]
      .filter(([, v]) => String(v || "").trim().length)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email ? [data.email] : undefined,
      subject,
      text: lines || "New bridal inquiry received.",
    });

    return res.json({ ok: true, id: result?.data?.id ?? null });
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
    const subject = "Wedding agreement acknowledgement confirmation";
    const text = [
      "Agreement acknowledgement received.",
      "",
      `Name: ${name}`,
      `Date: ${date}`,
      `Client email: ${clientEmail}`,
      "",
      "Ziva by Ekay",
    ].join("\n");

    const { data: sent, error } = await resend.emails.send({
      from,
      to: [clientEmail, ownerEmail],
      subject,
      text,
    });

    if (error) return res.status(502).json({ ok: false, error: error.message || "Resend error" });
    return res.json({ ok: true, id: sent?.id ?? null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`);
});

