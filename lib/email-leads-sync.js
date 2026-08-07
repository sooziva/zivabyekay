import { MongoClient } from "mongodb";
import { upsertEmailLead } from "./email-leads.js";

function ownerEmails() {
  return new Set(
    String(process.env.RESEND_TO || process.env.OWNER_EMAIL || "")
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function resendGet(apiKey, path) {
  const res = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.message || json?.error || `Resend ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return json;
}

async function listResendContacts(apiKey) {
  const all = [];
  let after = "";
  for (let i = 0; i < 50; i += 1) {
    const qs = new URLSearchParams({ limit: "100" });
    if (after) qs.set("after", after);
    const json = await resendGet(apiKey, `/contacts?${qs.toString()}`);
    const page = Array.isArray(json?.data) ? json.data : [];
    all.push(...page);
    if (!json?.has_more || !page.length) break;
    after = page[page.length - 1]?.id || "";
    if (!after) break;
  }
  return all;
}

async function listResendAudiences(apiKey) {
  try {
    const json = await resendGet(apiKey, "/audiences");
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

async function listResendAudienceContacts(apiKey, audienceId) {
  const all = [];
  let after = "";
  for (let i = 0; i < 50; i += 1) {
    const qs = new URLSearchParams({ limit: "100" });
    if (after) qs.set("after", after);
    let json;
    try {
      json = await resendGet(apiKey, `/audiences/${audienceId}/contacts?${qs.toString()}`);
    } catch {
      break;
    }
    const page = Array.isArray(json?.data) ? json.data : [];
    all.push(...page);
    if (!json?.has_more || !page.length) break;
    after = page[page.length - 1]?.id || "";
    if (!after) break;
  }
  return all;
}

async function listResendSentRecipients(apiKey) {
  const emails = new Map(); // email -> { name, createdAt }
  let after = "";
  for (let i = 0; i < 30; i += 1) {
    const qs = new URLSearchParams({ limit: "100" });
    if (after) qs.set("after", after);
    let json;
    try {
      json = await resendGet(apiKey, `/emails?${qs.toString()}`);
    } catch {
      break;
    }
    const page = Array.isArray(json?.data) ? json.data : [];
    for (const item of page) {
      const toList = Array.isArray(item?.to) ? item.to : item?.to ? [item.to] : [];
      for (const raw of toList) {
        const email = String(raw || "")
          .trim()
          .toLowerCase();
        if (!email.includes("@")) continue;
        if (!emails.has(email)) {
          emails.set(email, {
            email,
            createdAt: item.created_at || item.createdAt || null,
          });
        }
      }
    }
    if (!json?.has_more || !page.length) break;
    after = page[page.length - 1]?.id || "";
    if (!after) break;
  }
  return Array.from(emails.values());
}

async function listAuthUsers() {
  const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUrl) return [];
  const client = new MongoClient(mongoUrl, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "zivabyekay");
    return await db
      .collection("user")
      .find({}, { projection: { email: 1, name: 1, createdAt: 1 } })
      .limit(2000)
      .toArray();
  } finally {
    await client.close().catch(() => {});
  }
}

function parseImportText(text) {
  const rows = [];
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines) {
    // support "email", "name,email", "email,name", or comma-separated emails
    const parts = line.split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ""));
    if (parts.length === 1 && parts[0].includes("@")) {
      rows.push({ email: parts[0], name: null });
      continue;
    }
    if (parts.length >= 2) {
      const a = parts[0];
      const b = parts[1];
      if (a.includes("@")) rows.push({ email: a, name: b.includes("@") ? null : b || null });
      else if (b.includes("@")) rows.push({ email: b, name: a || null });
    }
  }
  return rows;
}

/**
 * Sync historical contacts into EmailLead from:
 * - Resend contacts / audiences (waitlist-style lists)
 * - Resend sent-email recipients
 * - Better Auth dashboard users
 */
export async function syncHistoricalEmailLeads(prisma) {
  const summary = {
    resendContacts: 0,
    resendAudiences: 0,
    resendSent: 0,
    authUsers: 0,
    imported: 0,
    skippedOwner: 0,
    errors: [],
  };

  const owners = ownerEmails();
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const contacts = await listResendContacts(apiKey);
      for (const c of contacts) {
        const email = String(c.email || "").trim();
        if (!email) continue;
        if (owners.has(email.toLowerCase())) {
          summary.skippedOwner += 1;
          continue;
        }
        const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || null;
        await upsertEmailLead(prisma, {
          email,
          name,
          source: "waitlist",
          meta: { importedFrom: "resend-contacts", resendId: c.id || null },
        });
        summary.resendContacts += 1;
        summary.imported += 1;
      }
    } catch (err) {
      summary.errors.push(`Resend contacts: ${err?.message || err}`);
    }

    try {
      const audiences = await listResendAudiences(apiKey);
      for (const audience of audiences) {
        const contacts = await listResendAudienceContacts(apiKey, audience.id);
        for (const c of contacts) {
          const email = String(c.email || "").trim();
          if (!email) continue;
          if (owners.has(email.toLowerCase())) {
            summary.skippedOwner += 1;
            continue;
          }
          const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || null;
          await upsertEmailLead(prisma, {
            email,
            name,
            source: "waitlist",
            meta: {
              importedFrom: "resend-audience",
              audienceId: audience.id,
              audienceName: audience.name || null,
            },
          });
          summary.resendAudiences += 1;
          summary.imported += 1;
        }
      }
    } catch (err) {
      summary.errors.push(`Resend audiences: ${err?.message || err}`);
    }

    try {
      const sent = await listResendSentRecipients(apiKey);
      for (const c of sent) {
        const email = String(c.email || "").trim();
        if (!email) continue;
        if (owners.has(email.toLowerCase())) {
          summary.skippedOwner += 1;
          continue;
        }
        await upsertEmailLead(prisma, {
          email,
          name: null,
          source: "resend-sent",
          meta: { importedFrom: "resend-emails" },
        });
        summary.resendSent += 1;
        summary.imported += 1;
      }
    } catch (err) {
      summary.errors.push(`Resend emails: ${err?.message || err}`);
    }
  } else {
    summary.errors.push("Missing RESEND_API_KEY — skipped Resend sync");
  }

  try {
    const users = await listAuthUsers();
    for (const u of users) {
      const email = String(u.email || "").trim();
      if (!email) continue;
      await upsertEmailLead(prisma, {
        email,
        name: u.name || null,
        source: "dashboard-user",
        meta: { importedFrom: "better-auth-user" },
      });
      summary.authUsers += 1;
      summary.imported += 1;
    }
  } catch (err) {
    summary.errors.push(`Auth users: ${err?.message || err}`);
  }

  return summary;
}

export async function importEmailLeadsFromText(prisma, text, source = "import") {
  const rows = parseImportText(text);
  let imported = 0;
  for (const row of rows) {
    const item = await upsertEmailLead(prisma, {
      email: row.email,
      name: row.name,
      source,
      meta: { importedFrom: "manual-import" },
    });
    if (item) imported += 1;
  }
  return { imported, parsed: rows.length };
}
