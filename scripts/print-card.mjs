// Generates print-ready business card files from the fixed-size print routes.
//
// Geometry:
//   Trim size  : 3.5" x 2"      (standard US business card)
//   Bleed      : 0.125" per side
//   Artwork    : 3.75" x 2.25"  (with bleed)
//
// On-screen artboard is 720 x 432 CSS px (192px per inch).
//   PNG : deviceScaleFactor 1.5625 -> 1125 x 675 px = 300 DPI at 3.75 x 2.25"
//   PDF : page 3.75" x 2.25", scale 0.5 (720px = 7.5" * 0.5 = 3.75") -> vector text, full-res images
//
// Deliverables (written to public/print/):
//   business-card-front.png   (300 DPI)
//   business-card-back.png    (300 DPI)
//   business-card-front.pdf   (single page)
//   business-card-back.pdf    (single page)
//   business-card-print.pdf   (front + back, 2 pages)

import { chromium } from "playwright"
import { PDFDocument } from "pdf-lib"
import { mkdir, writeFile, readFile } from "node:fs/promises"
import path from "node:path"

const BASE = process.env.PRINT_BASE_URL || "http://localhost:3000"
const OUT = path.resolve("public/print")

// 300 DPI / (192 px-per-inch on the artboard) = 1.5625
const DEVICE_SCALE = 300 / 192
// 720 CSS px = 7.5in; page is 3.75in -> scale 0.5
const PDF_SCALE = 0.5

const sides = [
  { name: "front", url: `${BASE}/business-card/print/front` },
  { name: "back", url: `${BASE}/business-card/print/back` },
]

async function waitForReady(page) {
  await page.waitForSelector("#print-artboard")
  // Ensure webfonts and all images are fully decoded before capture.
  await page.evaluate(async () => {
    await document.fonts.ready
    const imgs = Array.from(document.images)
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true })
              img.addEventListener("error", res, { once: true })
            }),
      ),
    )
  })
  // Small settle for layout/paint.
  await page.waitForTimeout(300)
}

async function run() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()

  for (const side of sides) {
    // ---- High-res PNG (300 DPI) ----
    const pngCtx = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      deviceScaleFactor: DEVICE_SCALE,
    })
    const pngPage = await pngCtx.newPage()
    await pngPage.goto(side.url, { waitUntil: "networkidle" })
    await waitForReady(pngPage)
    const artboard = pngPage.locator("#print-artboard")
    await artboard.screenshot({
      path: path.join(OUT, `business-card-${side.name}.png`),
      type: "png",
    })
    const box = await artboard.boundingBox()
    console.log(`[${side.name}] PNG artboard CSS box: ${Math.round(box.width)}x${Math.round(box.height)} -> raster ${Math.round(box.width * DEVICE_SCALE)}x${Math.round(box.height * DEVICE_SCALE)}`)
    await pngCtx.close()

    // ---- Vector PDF (single page, exact 3.75 x 2.25in with bleed) ----
    const pdfCtx = await browser.newContext({ viewport: { width: 1400, height: 900 } })
    const pdfPage = await pdfCtx.newPage()
    await pdfPage.goto(side.url, { waitUntil: "networkidle" })
    await waitForReady(pdfPage)
    // Render using screen media so the PDF matches the approved preview exactly.
    await pdfPage.emulateMedia({ media: "screen" })
    await pdfPage.addStyleTag({ content: "html,body{margin:0!important;padding:0!important;background:#0c1a2b}" })
    await pdfPage.pdf({
      path: path.join(OUT, `business-card-${side.name}.pdf`),
      width: "3.75in",
      height: "2.25in",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      scale: PDF_SCALE,
      pageRanges: "1",
    })
    await pdfCtx.close()
  }

  await browser.close()

  // ---- Merge front + back into a single 2-page print-ready PDF ----
  const merged = await PDFDocument.create()
  for (const side of sides) {
    const bytes = await readFile(path.join(OUT, `business-card-${side.name}.pdf`))
    const doc = await PDFDocument.load(bytes)
    const [pg] = await merged.copyPages(doc, [0])
    merged.addPage(pg)
  }
  const mergedBytes = await merged.save()
  await writeFile(path.join(OUT, "business-card-print.pdf"), mergedBytes)

  // Report final page dimensions (in points; 1in = 72pt, so 3.75in = 270pt, 2.25in = 162pt).
  const check = await PDFDocument.load(mergedBytes)
  check.getPages().forEach((p, i) => {
    const { width, height } = p.getSize()
    console.log(`[merged] page ${i + 1}: ${width.toFixed(1)}pt x ${height.toFixed(1)}pt (${(width / 72).toFixed(3)}in x ${(height / 72).toFixed(3)}in)`)
  })

  console.log("Done. Files written to public/print/")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
