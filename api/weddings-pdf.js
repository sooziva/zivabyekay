import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import {
  applyWeddingsPdfDomTweaks,
  getDocHeightPx,
  parseSectionsParam,
  waitForImagesAndScroll,
} from "../lib/weddings-pdf-shared.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getOrigin(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").toString().split(",")[0].trim();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString().split(",")[0].trim();
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method Not Allowed" });

  const path = (req.query?.path || "/ekay/weddings").toString();
  const safePath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getOrigin(req)}${safePath}`;
  const selected = parseSectionsParam(req.query?.sections);
  const mode = (req.query?.mode || "a4").toString().trim(); // "single" | "a4"

  let browser;
  try {
    const executablePath = await chromium.executablePath();
    browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(90_000);

    await page.goto(url, { waitUntil: "networkidle0" });

    await applyWeddingsPdfDomTweaks(page, selected);
    await waitForImagesAndScroll(page);

    await page.emulateMediaType("screen");

    const docHeightPx = await getDocHeightPx(page);

    const pdf =
      mode === "single"
        ? await page.pdf({
            width: "210mm",
            height: `${Math.ceil(docHeightPx)}px`,
            printBackground: true,
            displayHeaderFooter: false,
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
            preferCSSPageSize: false,
            scale: 1,
          })
        : await page.pdf({
            format: "A4",
            printBackground: true,
            displayHeaderFooter: false,
            preferCSSPageSize: true,
            margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
            scale: 1,
          });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", `attachment; filename="weddings${mode === "single" ? "-single" : ""}.pdf"`);
    res.end(pdf);
  } catch (err) {
    json(res, 500, { ok: false, error: err?.message || "Failed to generate PDF" });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
