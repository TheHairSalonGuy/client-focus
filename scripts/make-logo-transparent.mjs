// Converts the white-background headset JPG into a transparent-background PNG.
// 1. Decode to raw RGBA.
// 2. Turn near-white pixels transparent (soft feather to keep edges clean).
// 3. Trim surrounding transparency, then pad back to a centered square canvas
//    so the artwork sits perfectly centered inside the circular frame.
import sharp from "sharp"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const SRC = join(root, "public", "my-virtual-receptionist-icon.jpg")
const OUT = join(root, "public", "my-virtual-receptionist-icon.png")

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// Soft white-key: fully transparent above HI, opaque below LO, linear feather between.
const HI = 244
const LO = 228
for (let i = 0; i < data.length; i += channels) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const m = Math.min(r, g, b) // high only when the pixel is near-white
  let alpha
  if (m >= HI) alpha = 0
  else if (m <= LO) alpha = 255
  else alpha = Math.round(((HI - m) / (HI - LO)) * 255)
  data[i + 3] = alpha
}

const keyed = sharp(data, { raw: { width, height, channels } }).png()

// Trim leftover transparent margin, then extend to a centered square.
const trimmed = await keyed.trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
const tw = trimmed.info.width
const th = trimmed.info.height
const side = Math.max(tw, th)
const left = Math.round((side - tw) / 2)
const top = Math.round((side - th) / 2)

await sharp(trimmed.data)
  .extend({
    top,
    bottom: side - th - top,
    left,
    right: side - tw - left,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(OUT)

console.log(`[v0] wrote ${OUT} — ${side}x${side} transparent square (from ${width}x${height})`)
