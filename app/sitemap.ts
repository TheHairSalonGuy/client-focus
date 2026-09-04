import type { MetadataRoute } from "next"

const BASE_URL = "https://www.nevermisscustomer.com"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date("2026-09-03"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date("2026-09-03"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/terms`, lastModified: new Date("2026-09-03"), changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/assessment`, lastModified: new Date("2026-09-03"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/get-started`, lastModified: new Date("2026-09-03"), changeFrequency: "monthly", priority: 0.5 },
  ]
}
