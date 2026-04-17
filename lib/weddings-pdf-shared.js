/**
 * Shared Puppeteer steps for Weddings PDF (Express + Vercel serverless).
 * Default sections exclude FAQ, legal triggers, and agreement form.
 */
export const DEFAULT_WEDDINGS_PDF_SECTIONS =
  "hero,note,tiers,addons,experience,book,testimonials,gallery";

export const SECTION_SELECTORS = [
  ["hero", ".weddings-hero"],
  ["note", "#note"],
  ["tiers", "#tiers"],
  ["addons", "#addons"],
  ["experience", "#experience"],
  ["book", "#book"],
  ["legal", "#legal-documents"],
  ["signature", "#signature"],
  ["testimonials", "#testimonials"],
  ["faq", "#faq"],
  ["gallery", "#gallery"],
];

export function parseSectionsParam(sectionsParam) {
  const raw = (sectionsParam ?? DEFAULT_WEDDINGS_PDF_SECTIONS).toString().trim();
  return raw === "all"
    ? new Set(["all"])
    : new Set(
        raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
}

/** Inject CSS to hide header/banner and unselected sections. */
export async function applyWeddingsPdfDomTweaks(page, selected) {
  await page.addStyleTag({
    content: `
      .ekay-page-header,
      .kellsie-top-banner,
      .weddings-skip-link {
        display: none !important;
      }
      body { padding-top: 0 !important; }
    `,
  });

  if (!selected.has("all")) {
    const hideCss = SECTION_SELECTORS.filter(([key]) => !selected.has(key))
      .map(([, sel]) => `${sel}{display:none !important;}`)
      .join("\n");
    if (hideCss) await page.addStyleTag({ content: hideCss });
  }
}

export async function waitForImagesAndScroll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const imgs = Array.from(document.images || []);
    for (const img of imgs) {
      try {
        img.loading = "eager";
        img.decoding = "sync";
      } catch {
        // ignore
      }
    }

    const total = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await sleep(75);
    }
    window.scrollTo(0, 0);

    const awaitImg = (img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
    await Promise.race([Promise.all(imgs.map(awaitImg)), sleep(8000)]);
  });
}

export async function getDocHeightPx(page) {
  return page.evaluate(() =>
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    )
  );
}
