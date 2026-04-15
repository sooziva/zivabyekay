import { Resend } from "resend";

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

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method Not Allowed" });

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const name = (data?.name ?? "").toString().trim();
  const date = (data?.date ?? "").toString().trim();
  const email = (data?.email ?? "").toString().trim();

  if (!name || !date || !email) {
    return json(res, 400, { ok: false, error: "Missing required fields" });
  }

  const ownerEmail = (process.env.RESEND_TO || process.env.OWNER_EMAIL || "sooziva@gmail.com").toString().trim();

  try {
    const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
    const from = (process.env.RESEND_FROM || "").toString().trim();
    if (!from) throw new Error("Missing env var: RESEND_FROM");
    const subject = "Wedding agreement acknowledgement confirmation";
    const text = [
      "Agreement acknowledgement received.",
      "",
      `Name: ${name}`,
      `Date: ${date}`,
      `Client email: ${email}`,
      "",
      "Ziva by Ekay",
    ].join("\n");

    const { data: sent, error } = await resend.emails.send({
      from,
      to: [email, ownerEmail],
      subject,
      text,
    });

    if (error) return json(res, 502, { ok: false, error: error.message || "Resend error" });
    return json(res, 200, { ok: true, id: sent?.id ?? null });
  } catch (err) {
    return json(res, 500, { ok: false, error: err?.message || "Email failed to send" });
  }
}

