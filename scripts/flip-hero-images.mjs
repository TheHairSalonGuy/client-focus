import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

// Horizontally mirror the four generated restaurant hero images so the host
// sits on the RIGHT of the frame looking LEFT, matching the Thai host photo.
const publicDir = join(process.cwd(), "public")
const files = ["hero-fine-dining.png", "hero-casual-dining.png", "hero-quick-service.png", "hero-bar-grill.png"]

for (const file of files) {
  const path = join(publicDir, file)
  const input = await readFile(path)
  const flipped = await sharp(input).flop().png().toBuffer()
  await writeFile(path, flipped)
  console.log(`[v0] flipped ${file}`)
}

console.log("[v0] done")
