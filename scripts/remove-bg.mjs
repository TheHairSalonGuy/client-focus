import { removeBackground } from "@imgly/background-removal-node"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const input = process.argv[2]
const output = process.argv[3]

const data = await readFile(input)
const blob = new Blob([data], { type: "image/png" })

const result = await removeBackground(blob, {
  output: { format: "image/png", quality: 0.9 },
})

const arrayBuffer = await result.arrayBuffer()
await writeFile(output, Buffer.from(arrayBuffer))
console.log("Wrote transparent cutout to", path.resolve(output))
