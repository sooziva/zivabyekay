function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeLine(value) {
  return String(value ?? "").trim();
}

function formatLines(pairs) {
  return pairs
    .map(([label, value]) => [normalizeLine(label), normalizeLine(value)])
    .filter(([, value]) => value.length)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function renderPairsTable(pairs) {
  const rows = pairs
    .map(([label, value]) => [normalizeLine(label), normalizeLine(value)])
    .filter(([, value]) => value.length)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px; border-top:1px solid rgba(20,20,20,0.08); color:#58524d; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; width:38%;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 12px; border-top:1px solid rgba(20,20,20,0.08); color:#1a1816; font-size:14px; line-height:1.5;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; border:1px solid rgba(20,20,20,0.08); border-radius:14px; overflow:hidden; background:#ffffff;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderShell({ title, subtitle, bodyHtml, footerNote }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background:#f7f3ee; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; color:#1a1816;">
    <div style="padding:32px 14px;">
      <div style="max-width:640px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:14px;">
          <div style="font-family: Georgia, 'Times New Roman', serif; font-size:22px; letter-spacing:0.06em;">
            ZIVA BY EKAY
          </div>
          <div style="font-size:12px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(26,24,22,0.7); margin-top:6px;">
            Bridal Studio
          </div>
        </div>

        <div style="background:#ffffff; border:1px solid rgba(20,20,20,0.08); border-radius:18px; overflow:hidden; box-shadow:0 18px 60px rgba(20,20,20,0.08);">
          <div style="padding:22px 20px 18px; border-bottom:1px solid rgba(20,20,20,0.06); background:linear-gradient(180deg, rgba(61,82,70,0.10), rgba(61,82,70,0.03));">
            <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(26,24,22,0.7);">
              ${escapeHtml(subtitle)}
            </div>
            <div style="font-family: Georgia, 'Times New Roman', serif; font-size:22px; margin-top:8px; line-height:1.25;">
              ${escapeHtml(title)}
            </div>
          </div>

          <div style="padding:18px 20px 22px;">
            ${bodyHtml}
          </div>
        </div>

        <div style="max-width:640px; margin:14px auto 0; text-align:center; font-size:12px; line-height:1.6; color:rgba(26,24,22,0.65);">
          ${escapeHtml(footerNote)}
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export function buildBridalInquiryOwnerEmail(data) {
  const firstName = normalizeLine(data?.firstName) || "New lead";
  const weddingDate = normalizeLine(data?.weddingDate);

  const subject = `Bridal inquiry — ${firstName}${weddingDate ? ` (${weddingDate})` : ""}`;

  const pairs = [
    ["Tier", data?.tier],
    ["Name", data?.firstName],
    ["WhatsApp", data?.whatsapp],
    ["Email", data?.email],
    ["City / Country", data?.cityCountry],
    ["Referral", data?.referral],
    ["Wedding date", data?.weddingDate],
    ["Venue", data?.venue],
    ["Arrival time", data?.weddingTime],
    ["Bridesmaids makeup needs", data?.bridesmaidsMakeup],
    ["Style preference", data?.stylePreference],
    ["Skin type", data?.skinType],
    ["Additional notes", data?.notes],
  ];

  const text = [
    "New bridal inquiry received.",
    "",
    formatLines(pairs) || "No details provided.",
    "",
    "Ziva by Ekay",
  ].join("\n");

  const bodyHtml = `
    <p style="margin:0 0 14px; color:#3d3935; font-size:14px; line-height:1.7;">
      A new bridal inquiry was submitted. Details are below.
    </p>
    ${renderPairsTable(pairs)}
  `;

  const html = renderShell({
    subtitle: "New form submission",
    title: "Bridal inquiry",
    bodyHtml,
    footerNote: "You can reply directly to the client’s email from your inbox.",
  });

  return { subject, text, html };
}

export function buildAcknowledgementEmail({ name, date, clientEmail }) {
  const subject = "Wedding agreement acknowledgement confirmation";
  const pairs = [
    ["Name", name],
    ["Date", date],
    ["Client email", clientEmail],
  ];

  const text = [
    "Agreement acknowledgement received.",
    "",
    formatLines(pairs),
    "",
    "Ziva by Ekay",
  ].join("\n");

  const bodyHtml = `
    <p style="margin:0 0 14px; color:#3d3935; font-size:14px; line-height:1.7;">
      We’ve received the acknowledgement for the client service agreement summary.
    </p>
    ${renderPairsTable(pairs)}
    <p style="margin:14px 0 0; color:#5c554d; font-size:12px; line-height:1.7;">
      For active bookings, the binding agreement is the signed contract sent separately.
    </p>
  `;

  const html = renderShell({
    subtitle: "Confirmation",
    title: "Acknowledgement received",
    bodyHtml,
    footerNote: "If you didn’t request this, you can ignore this email.",
  });

  return { subject, text, html };
}

export function buildPasswordResetEmail({ resetUrl }) {
  const subject = "Reset your password";

  const text = [
    "Reset your password",
    "",
    "Use the link below to reset your password:",
    resetUrl,
    "",
    "If you didn’t request this, you can ignore this email.",
    "",
    "Ziva by Ekay",
  ].join("\n");

  const bodyHtml = `
    <p style="margin:0 0 14px; color:#3d3935; font-size:14px; line-height:1.7;">
      We received a request to reset your password.
    </p>
    <p style="margin:0 0 16px; color:#3d3935; font-size:14px; line-height:1.7;">
      Tap the button below to choose a new password:
    </p>
    <div style="text-align:center; margin:18px 0 10px;">
      <a
        href="${escapeHtml(resetUrl)}"
        style="display:inline-block; padding:12px 18px; background:#2a2622; color:#faf9f7; text-decoration:none; border-radius:10px; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; font-weight:600;"
      >
        Reset password
      </a>
    </div>
    <p style="margin:12px 0 0; color:#5c554d; font-size:12px; line-height:1.7;">
      If the button doesn’t work, copy and paste this link into your browser:
      <br />
      <span style="word-break:break-all;">${escapeHtml(resetUrl)}</span>
    </p>
  `;

  const html = renderShell({
    subtitle: "Security",
    title: "Reset your password",
    bodyHtml,
    footerNote: "If you didn’t request this, you can ignore this email.",
  });

  return { subject, text, html };
}

