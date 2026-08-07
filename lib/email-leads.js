/**
 * Upsert a marketing / contact email lead.
 * Same address from multiple forms keeps one row and accumulates sources.
 */
export async function upsertEmailLead(prisma, { email, name, phone, source, meta } = {}) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalized || !normalized.includes("@")) return null;

  const sourceKey = source ? String(source).trim() : "";
  const safeName = name != null && String(name).trim() ? String(name).trim() : null;
  const safePhone = phone != null && String(phone).trim() ? String(phone).trim() : null;
  const safeMeta = meta == null ? null : typeof meta === "string" ? meta : JSON.stringify(meta);

  const existing = await prisma.emailLead.findUnique({ where: { email: normalized } });
  if (existing) {
    const sources = Array.from(new Set([...(existing.sources || []), sourceKey].filter(Boolean)));
    return prisma.emailLead.update({
      where: { email: normalized },
      data: {
        name: safeName || existing.name,
        phone: safePhone || existing.phone,
        sources,
        lastSource: sourceKey || existing.lastSource,
        meta: safeMeta != null ? safeMeta : existing.meta,
      },
    });
  }

  return prisma.emailLead.create({
    data: {
      email: normalized,
      name: safeName,
      phone: safePhone,
      sources: sourceKey ? [sourceKey] : [],
      lastSource: sourceKey || null,
      meta: safeMeta,
    },
  });
}

/** Best-effort capture — never throws to the caller. */
export async function captureEmailLead(prisma, payload) {
  try {
    return await upsertEmailLead(prisma, payload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email-leads] capture failed:", err?.message || err);
    return null;
  }
}
