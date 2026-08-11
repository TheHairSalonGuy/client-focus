import { readFileSync } from "node:fs"
import { put } from "@vercel/blob"

const files = [
  { path: "public/print/business-card-print.pdf", type: "application/pdf" },
  { path: "public/print/business-card-front.pdf", type: "application/pdf" },
  { path: "public/print/business-card-back.pdf", type: "application/pdf" },
  { path: "public/print/business-card-front.png", type: "image/png" },
  { path: "public/print/business-card-back.png", type: "image/png" },
]

const results = {}
for (const file of files) {
  const name = file.path.split("/").pop()
  const data = readFileSync(file.path)
  const blob = await put(`business-card-print/${name}`, data, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  results[name] = blob.url
  console.log(`${name} -> ${blob.url}`)
}

console.log("\nJSON:")
console.log(JSON.stringify(results, null, 2))
