import { Resend } from "resend";
import { buildMarketingEmail } from "./email-templates.js";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * @param {Array<string|{email:string,name?:string|null}>} list
 * @returns {Array<{email:string,name:string|null}>}
 */
function normalizeRecipients(list) {
  const map = new Map();
  for (const raw of list || []) {
    if (!raw) continue;
    if (typeof raw === "string") {
      const email = raw.trim().toLowerCase();
      if (email.includes("@") && !map.has(email)) map.set(email, { email, name: null });
      continue;
    }
    const email = String(raw.email || "")
      .trim()
      .toLowerCase();
    if (!email.includes("@")) continue;
    const name = raw.name != null && String(raw.name).trim() ? String(raw.name).trim() : null;
    const existing = map.get(email);
    if (!existing) map.set(email, { email, name });
    else if (!existing.name && name) existing.name = name;
  }
  return Array.from(map.values());
}

/**
 * Send a prepared marketing email to recipients via Resend batch API.
 * Personalizes greeting / {{name}} per recipient when name is available.
 */
export async function sendMarketingCampaign({
  emails,
  recipients,
  subject,
  body,
  previewTitle,
  ctaLabel,
  ctaUrl,
  imageUrl,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  if (!from) throw new Error("Missing RESEND_FROM");

  const people = normalizeRecipients(recipients?.length ? recipients : emails);
  if (!people.length) throw new Error("No recipients selected");
  if (!String(subject || "").trim()) throw new Error("Subject is required");
  if (!String(body || "").trim()) throw new Error("Message body is required");

  const resend = new Resend(apiKey);

  let sent = 0;
  const errors = [];
  const batches = chunk(people, 100);

  for (const batch of batches) {
    const payload = batch.map((person) => {
      const template = buildMarketingEmail({
        subject,
        body,
        previewTitle,
        name: person.name,
        ctaLabel,
        ctaUrl,
        imageUrl,
      });
      return {
        from,
        to: [person.email],
        subject: template.subject,
        text: template.text,
        html: template.html,
      };
    });

    const { data, error } = await resend.batch.send(payload);
    if (error) {
      errors.push(error.message || "Batch send failed");
      continue;
    }
    const count = Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : batch.length;
    sent += count;
  }

  const sample = buildMarketingEmail({
    subject,
    body,
    previewTitle,
    ctaLabel,
    ctaUrl,
    imageUrl,
    name: null,
  });

  return {
    requested: people.length,
    sent,
    failed: Math.max(0, people.length - sent),
    errors,
    subject: sample.subject,
  };
}
