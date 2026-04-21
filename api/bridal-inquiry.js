import { Resend } from "resend";
import { buildBridalInquiryOwnerEmail } from "../lib/email-templates.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getRequiredEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

function parseRecipients(value) {
  return String(value || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method Not Allowed" });

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON" });
  }

  try {
    const apiKey = getRequiredEnv("RESEND_API_KEY");
    const from = getRequiredEnv("RESEND_FROM");
    const to = getRequiredEnv("RESEND_TO");

    const email = buildBridalInquiryOwnerEmail(data);

    const resend = new Resend(apiKey);
    const recipients = parseRecipients(to);
    const { data: sent, error } = await resend.emails.send({
      from,
      to: recipients.length ? recipients : [to],
      replyTo: data?.email ? [String(data.email).trim()] : undefined,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (error) return json(res, 502, { ok: false, error: error.message || "Resend error" });
    return json(res, 200, { ok: true, id: sent?.id ?? null });
  } catch (err) {
    return json(res, 500, { ok: false, error: err?.message || "Unknown error" });
  }
}

