import { Resend } from "resend";
import { captureEmailLead } from "../lib/email-leads.js";
import { prisma } from "./_utils/prisma.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function parseRecipients(value) {
  return String(value || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Public form lead capture for Contact + Booking (and future forms).
 * POST body: { source: "contact"|"booking", email, name, message?, ...meta }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method Not Allowed" });

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const source = String(data.source || "").trim() || "form";
  const email = String(data.email || "").trim();
  const name = String(data.name || "").trim();
  const message = String(data.message || "").trim();

  if (!email) return json(res, 400, { ok: false, error: "Missing email" });

  try {
    await captureEmailLead(prisma, {
      email,
      name: name || null,
      phone: data.phone || data.whatsapp || null,
      source,
      meta: {
        message: message || null,
        service: data.service || null,
        date: data.date || null,
        time: data.time || null,
        phone: data.phone || null,
      },
    });

    // Notify owner for contact messages (optional Resend).
    if (source === "contact" && message) {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM;
      const to = process.env.RESEND_TO;
      if (apiKey && from && to) {
        const resend = new Resend(apiKey);
        const recipients = parseRecipients(to);
        await resend.emails.send({
          from,
          to: recipients.length ? recipients : [to],
          replyTo: [email],
          subject: `New contact message from ${name || email}`,
          text: [`Name: ${name || "—"}`, `Email: ${email}`, "", message].join("\n"),
        });
      }
    }

    return json(res, 200, { ok: true });
  } catch (err) {
    return json(res, 500, { ok: false, error: err?.message || "Failed to save" });
  }
}
