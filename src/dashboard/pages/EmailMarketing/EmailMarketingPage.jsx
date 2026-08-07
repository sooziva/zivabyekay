import { useMemo, useRef, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import DashboardPageShell from "../../components/DashboardPageShell/DashboardPageShell";
import EmojiPicker from "../../components/EmojiPicker/EmojiPicker";
import { deleteJson, patchJson, postJson, useAuthedJson } from "../_shared/dashboardData";
import "../_shared/DashboardPages.css";

const SOURCE_LABELS = {
  "bridal-inquiry": "Bridal inquiry",
  acknowledgement: "Wedding acknowledgement",
  contact: "Contact",
  booking: "Booking",
  form: "Form",
  waitlist: "Waitlist / Resend",
  "resend-sent": "Past emails sent",
  "dashboard-user": "Dashboard user",
  import: "Imported",
};

function labelSource(source) {
  if (!source) return "—";
  return SOURCE_LABELS[source] || source;
}

export default function EmailMarketingPage() {
  const leads = useAuthedJson("/api/dashboard/email-leads", []);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [audience, setAudience] = useState("selected");
  const [subject, setSubject] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);
  const [rowBusy, setRowBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({ name: "", phone: "", email: "" });
  const subjectRef = useRef(null);

  const items = leads.data?.items || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((x) => {
      if (sourceFilter !== "all") {
        const sources = x.sources || [];
        if (!sources.includes(sourceFilter) && x.lastSource !== sourceFilter) return false;
      }
      if (!q) return true;
      return (
        String(x.email || "")
          .toLowerCase()
          .includes(q) ||
        String(x.name || "")
          .toLowerCase()
          .includes(q) ||
        String(x.phone || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, sourceFilter, query]);

  const sourceOptions = useMemo(() => {
    const set = new Set();
    items.forEach((x) => (x.sources || []).forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [items]);

  const recipientCount = useMemo(() => {
    if (audience === "all") return items.length;
    if (audience === "filtered") return filtered.length;
    return selected.size;
  }, [audience, items.length, filtered.length, selected.size]);

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleVisible = () => {
    const ids = filtered.map((x) => x.id);
    const allOn = ids.length > 0 && ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOn) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const resolveRecipients = () => {
    const rows =
      audience === "all" ? items : audience === "filtered" ? filtered : filtered.filter((x) => selected.has(x.id));
    return rows.map((x) => ({ email: x.email, name: x.name || null }));
  };

  const previewName =
    (audience === "selected"
      ? filtered.find((x) => selected.has(x.id) && x.name)?.name
      : filtered.find((x) => x.name)?.name) || "there";

  const previewBodyHtml = useMemo(() => {
    const escape = (s) =>
      String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    const personalized = String(body || "").trim();
    const paragraphs = personalized
      ? personalized
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
      : ["Your message will appear here."];
    return paragraphs.map((p) => escape(p).replaceAll("\n", "<br />"));
  }, [body]);

  const startEdit = (x) => {
    setEditingId(x.id);
    setDraft({
      email: x.email || "",
      name: x.name || "",
      phone: x.phone || "",
    });
  };

  const saveEdit = async (id) => {
    setRowBusy(true);
    setErrorMsg("");
    try {
      const json = await patchJson(`/api/dashboard/email-leads?id=${encodeURIComponent(id)}`, {
        email: draft.email.trim(),
        name: draft.name.trim(),
        phone: draft.phone.trim(),
      });
      leads.setData((prev) => ({
        ...prev,
        items: (prev?.items || []).map((it) => (it.id === id ? json.item : it)),
      }));
      setEditingId("");
    } catch (err) {
      setErrorMsg(err?.message || "Could not save contact");
    } finally {
      setRowBusy(false);
    }
  };

  const copyAll = async () => {
    const list = resolveRecipients()
      .map((x) => x.email)
      .filter(Boolean);
    if (!list.length) return;
    try {
      await navigator.clipboard.writeText(list.join(", "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const onSync = async () => {
    setErrorMsg("");
    setStatusMsg("");
    setSyncing(true);
    try {
      const json = await postJson("/api/dashboard/email-leads", { action: "sync" });
      leads.setData((prev) => ({ ...prev, items: json.items || [] }));
      const s = json.summary || {};
      setStatusMsg(
        `Synced contacts. Resend: ${s.resendContacts || 0}, audiences: ${s.resendAudiences || 0}, sent: ${s.resendSent || 0}, users: ${s.authUsers || 0}.`
      );
      if (s.errors?.length) setErrorMsg(s.errors.join(" · "));
    } catch (err) {
      setErrorMsg(err?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const onImport = async () => {
    setErrorMsg("");
    setStatusMsg("");
    setImporting(true);
    try {
      const json = await postJson("/api/dashboard/email-leads", {
        action: "import",
        source: "waitlist",
        text: importText,
      });
      leads.setData((prev) => ({ ...prev, items: json.items || [] }));
      setStatusMsg(`Imported ${json.imported || 0} of ${json.parsed || 0} rows.`);
      setImportText("");
      setShowImport(false);
    } catch (err) {
      setErrorMsg(err?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const onSend = async () => {
    setErrorMsg("");
    setStatusMsg("");
    const recipients = resolveRecipients();
    if (!recipients.length) {
      setErrorMsg("Choose at least one recipient.");
      return;
    }
    if (!subject.trim() || !body.trim()) {
      setErrorMsg("Add a subject and message before sending.");
      return;
    }
    const ok = window.confirm(`Send this email to ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}?`);
    if (!ok) return;

    setSending(true);
    try {
      const json = await postJson("/api/dashboard/email-leads", {
        action: "send",
        recipients,
        subject: subject.trim(),
        body: body.trim(),
        previewTitle: previewTitle.trim() || subject.trim(),
        ctaLabel: ctaLabel.trim(),
        ctaUrl: ctaUrl.trim(),
        imageUrl: imageUrl.trim(),
      });
      const r = json.result || {};
      setStatusMsg(`Sent ${r.sent || 0} of ${r.requested || recipients.length}.`);
      if (r.errors?.length) setErrorMsg(r.errors.join(" · "));
    } catch (err) {
      setErrorMsg(err?.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="zb-dashboardPage">
      <DashboardPageShell
        title="Email marketing"
        subtitle="Prepare a message, pick your audience, and send from one place."
      >
        <div className="zb-card">
          <p className="zb-card__title">Contacts</p>
          <p className="zb-card__value">{leads.loading ? "…" : items.length}</p>
          <p className="zb-card__meta">Unique emails</p>
        </div>

        <div className="zb-card">
          <p className="zb-card__title">Recipients</p>
          <p className="zb-card__value">{recipientCount}</p>
          <p className="zb-card__meta">
            {audience === "all" ? "Entire list" : audience === "filtered" ? "Current filter" : "Selected rows"}
          </p>
        </div>

        <div className="zb-card zb-card--full zb-compose">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Compose</p>
              <p className="zb-card__meta">Write the campaign, then choose who receives it.</p>
            </div>
            <div className="zb-compose__audience">
              <label>
                <span>Send to</span>
                <select value={audience} onChange={(e) => setAudience(e.target.value)} aria-label="Audience">
                  <option value="selected">Selected ({selected.size})</option>
                  <option value="filtered">Filtered ({filtered.length})</option>
                  <option value="all">Everyone ({items.length})</option>
                </select>
              </label>
            </div>
          </div>

          <div className="zb-compose__grid">
            <label className="zb-compose__field">
              <span>Subject</span>
              <div className="zb-compose__emojiField">
                <input
                  ref={subjectRef}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. ✨ 10% off walk-ins this Thursday"
                />
                <EmojiPicker
                  label="Add emoji to subject"
                  onPick={(emoji) => {
                    const el = subjectRef.current;
                    if (!el) {
                      setSubject((prev) => `${prev}${emoji}`);
                      return;
                    }
                    const start = el.selectionStart ?? subject.length;
                    const end = el.selectionEnd ?? subject.length;
                    const next = `${subject.slice(0, start)}${emoji}${subject.slice(end)}`;
                    setSubject(next);
                    requestAnimationFrame(() => {
                      el.focus();
                      const caret = start + emoji.length;
                      el.setSelectionRange(caret, caret);
                    });
                  }}
                />
              </div>
            </label>
            <label className="zb-compose__field">
              <span>Headline</span>
              <input
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                placeholder="Shown large in the email"
              />
            </label>
            <label className="zb-compose__field zb-compose__field--full">
              <span>Message</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"Walk into the studio this Thursday for a cool discount.\n\nUse a blank line between paragraphs."}
                rows={7}
              />
              <p className="zb-card__meta">
                Each email greets the recipient with their Name from the list (or “Hi there,” if name is empty).
              </p>
            </label>
            {/* Image URL hidden for now — keep state/send wiring for later
            <label className="zb-compose__field zb-compose__field--full">
              <span>Image URL (optional)</span>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://… (public image link)"
              />
              <p className="zb-card__meta">Paste a publicly hosted image URL. It appears at the top of the email.</p>
            </label>
            */}
            <label className="zb-compose__field">
              <span>Button label (optional)</span>
              <input
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="e.g. Book a walk-in"
              />
            </label>
            <label className="zb-compose__field">
              <span>Button link (optional)</span>
              <input
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://sooziva.com/booking"
              />
            </label>
          </div>

          <div className="zb-emailPreview" aria-label="Email preview">
            <div className="zb-emailPreview__brand">
              <p className="zb-emailPreview__brandName">Ziva by Ekay</p>
            </div>
            <div className="zb-emailPreview__card">
              {imageUrl.trim() && /^https?:\/\//i.test(imageUrl.trim()) ? (
                <img className="zb-emailPreview__image" src={imageUrl.trim()} alt="" />
              ) : null}
              <div className="zb-emailPreview__inner">
                <p className="zb-emailPreview__eyebrow">Studio note</p>
                <h2 className="zb-emailPreview__title">{previewTitle.trim() || "Your headline"}</h2>
                <p className="zb-emailPreview__hello">Hi {previewName},</p>
                {previewBodyHtml.map((p, i) => (
                  <p key={i} className="zb-emailPreview__p" dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                {ctaLabel.trim() && ctaUrl.trim() ? (
                  <a className="zb-emailPreview__cta" href={ctaUrl.trim()} target="_blank" rel="noreferrer">
                    {ctaLabel.trim()}
                  </a>
                ) : null}
                <div className="zb-emailPreview__signoff">
                  <p>With love,</p>
                  <p>
                    <strong>Ziva by Ekay</strong>
                  </p>
                </div>
              </div>
            </div>
            <p className="zb-emailPreview__footer">Unsubscribe · sooziva.com</p>
          </div>

          <div className="zb-compose__actions">
            <button type="button" className="zb-btn zb-btn--primary" onClick={onSend} disabled={sending || !recipientCount}>
              {sending ? "Sending…" : `Send to ${recipientCount}`}
            </button>
            <button type="button" className="zb-btn zb-btn--ghost" onClick={copyAll} disabled={!recipientCount}>
              {copied ? "Copied" : "Copy recipient emails"}
            </button>
          </div>

          {(statusMsg || errorMsg) && (
            <div className="zb-compose__status">
              {statusMsg ? <p className="zb-statusOk">{statusMsg}</p> : null}
              {errorMsg ? <p className="zb-statusErr">{errorMsg}</p> : null}
            </div>
          )}
        </div>

        <div className="zb-card zb-card--full">
          <div className="zb-compose__head">
            <div>
              <p className="zb-card__title">Audience</p>
              <p className="zb-card__meta">Edit name and phone on each contact after syncing.</p>
            </div>
            <div className="zb-compose__actions zb-compose__actions--compact">
              <button type="button" className="zb-btn zb-btn--ghost" onClick={onSync} disabled={syncing}>
                {syncing ? "Syncing…" : "Sync past contacts"}
              </button>
              <button type="button" className="zb-btn zb-btn--ghost" onClick={() => setShowImport((v) => !v)}>
                {showImport ? "Hide import" : "Import list"}
              </button>
            </div>
          </div>

          {showImport ? (
            <div className="zb-importBox">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={"one@email.com\nname,another@email.com"}
                rows={4}
              />
              <button type="button" className="zb-btn zb-btn--primary" onClick={onImport} disabled={importing || !importText.trim()}>
                {importing ? "Importing…" : "Import"}
              </button>
            </div>
          ) : null}

          <form className="zb-form zb-form--toolbar" onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="Search name, email, or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search leads"
            />
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} aria-label="Filter by source">
              <option value="all">All sources</option>
              {sourceOptions.map((s) => (
                <option key={s} value={s}>
                  {labelSource(s)}
                </option>
              ))}
            </select>
            <button type="button" className="zb-btn zb-btn--ghost" onClick={toggleVisible} disabled={!filtered.length}>
              {filtered.length && filtered.every((x) => selected.has(x.id)) ? "Clear visible" : "Select visible"}
            </button>
          </form>

          <p className="zb-card__meta">{leads.error ? leads.error : `${selected.size} selected · ${filtered.length} visible`}</p>

          <div className="zb-tableWrap" role="region" aria-label="Email leads table" tabIndex={0}>
            <table className="zb-table" aria-label="Email leads">
              <thead>
                <tr>
                  <th className="zb-table__check">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every((x) => selected.has(x.id))}
                      onChange={toggleVisible}
                      aria-label="Select all visible"
                    />
                  </th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Sources</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => {
                  const isEditing = editingId === x.id;
                  return (
                    <tr key={x.id} className={selected.has(x.id) ? "zb-table__row--selected" : undefined}>
                      <td className="zb-table__check">
                        <input
                          type="checkbox"
                          checked={selected.has(x.id)}
                          onChange={() => toggleOne(x.id)}
                          aria-label={`Select ${x.email}`}
                        />
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="zb-tableInput"
                            value={draft.email}
                            onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                            aria-label="Email"
                          />
                        ) : (
                          x.email
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="zb-tableInput"
                            value={draft.name}
                            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Name"
                            aria-label="Name"
                          />
                        ) : (
                          x.name || "—"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="zb-tableInput"
                            value={draft.phone}
                            onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="Phone"
                            aria-label="Phone"
                          />
                        ) : (
                          x.phone || "—"
                        )}
                      </td>
                      <td>{(x.sources || []).map(labelSource).join(", ") || "—"}</td>
                      <td>
                        <div className="zb-rowActions">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="zb-iconBtn"
                                aria-label="Save contact"
                                disabled={rowBusy}
                                onClick={() => saveEdit(x.id)}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                type="button"
                                className="zb-iconBtn"
                                aria-label="Cancel edit"
                                disabled={rowBusy}
                                onClick={() => setEditingId("")}
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="zb-iconBtn"
                                aria-label="Edit contact"
                                disabled={rowBusy}
                                onClick={() => startEdit(x)}
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                type="button"
                                className="zb-iconBtn zb-iconBtn--danger"
                                aria-label="Delete lead"
                                disabled={rowBusy}
                                onClick={async () => {
                                  const ok = window.confirm(`Remove ${x.email} from the list?`);
                                  if (!ok) return;
                                  setRowBusy(true);
                                  try {
                                    await deleteJson(`/api/dashboard/email-leads?id=${encodeURIComponent(x.id)}`);
                                    setSelected((prev) => {
                                      const next = new Set(prev);
                                      next.delete(x.id);
                                      return next;
                                    });
                                    leads.setData((prev) => ({
                                      ...prev,
                                      items: (prev?.items || []).filter((it) => it.id !== x.id),
                                    }));
                                  } finally {
                                    setRowBusy(false);
                                  }
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!leads.loading && !filtered.length ? (
                  <tr>
                    <td colSpan={6}>No emails yet. Sync past contacts or import a list.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardPageShell>
    </div>
  );
}
