// Losslessly inject a 300 DPI pHYs chunk into the print PNGs so print software
// reads the correct physical size (3.75" x 2.25"). Pixel data is untouched — no
// re-encoding or recompression, preserving QR sharpness and image quality.

import { readFile, writeFile } from "node:fs/promises"
import zlib from "node:zlib"
import path from "node:path"

const DPI = 300
const PPM = Math.round(DPI / 0.0254) // pixels per meter (11811 for 300 DPI)

function buildPhys() {
  const data = Buffer.alloc(9)
  data.writeUInt32BE(PPM, 0)
  data.writeUInt32BE(PPM, 4)
  data.writeUInt8(1, 8) // unit = meter
  const typeAndData = Buffer.concat([Buffer.from("pHYs", "ascii"), data])
  const crc = zlib.crc32(typeAndData) >>> 0
  const chunk = Buffer.alloc(4 + typeAndData.length + 4)
  chunk.writeUInt32BE(data.length, 0)
  typeAndData.copy(chunk, 4)
  chunk.writeUInt32BE(crc, 4 + typeAndData.length)
  return chunk
}

async function inject(file) {
  const png = await readFile(file)
  if (png.readUInt32BE(0) !== 0x89504e47) throw new Error(`Not a PNG: ${file}`)
  // Signature (8) + IHDR (length 4 + type 4 + data 13 + crc 4 = 25) => IHDR ends at 33.
  const ihdrEnd = 8 + 4 + 4 + 13 + 4
  // Drop any existing pHYs to avoid duplicates, then insert fresh one after IHDR.
  const before = png.subarray(0, ihdrEnd)
  const after = png.subarray(ihdrEnd)
  const out = Buffer.concat([before, buildPhys(), after])
  await writeFile(file, out)
  console.log(`Injected ${DPI} DPI (${PPM} ppm) into ${path.basename(file)} — ${out.length} bytes`)
}

const files = [
  path.resolve("public/print/business-card-front.png"),
  path.resolve("public/print/business-card-back.png"),
]
for (const f of files) await inject(f)
