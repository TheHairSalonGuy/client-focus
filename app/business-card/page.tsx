import type { Metadata } from "next"
import { FrontCard, BackCard } from "@/components/business-card-faces"

export const metadata: Metadata = {
  title: "Business Card — Never Miss Client",
  description:
    "Double-sided premium business card for Never Miss Client, helping businesses capture every client opportunity with AI virtual receptionists.",
}

export default function BusinessCardPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Never Miss Client — Business Card
          </h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-relaxed text-muted-foreground">
            Double-sided premium design. Standard 3.5&Prime; &times; 2&Prime; proportions.
          </p>
        </header>

        <section
          aria-labelledby="downloads-heading"
          className="mx-auto mb-12 max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 id="downloads-heading" className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            Print-ready downloads
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
            Files are 3.75&Prime; &times; 2.25&Prime; with a 0.125&Prime; bleed, text as vector outlines, and the QR embedded at
            full resolution. Upload the combined PDF to LeCard Print Shop.
          </p>

          <a
            href="https://gi7bdwfce2o5ctvl.public.blob.vercel-storage.com/business-card-print/business-card-print.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-primary px-5 py-4 font-sans text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>
              <span className="block text-sm font-bold">Combined PDF — front &amp; back</span>
              <span className="block text-xs opacity-80">business-card-print.pdf · 2 pages · recommended for printing</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">Download</span>
          </a>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              {
                href: "https://gi7bdwfce2o5ctvl.public.blob.vercel-storage.com/business-card-print/business-card-front.pdf",
                label: "Front — PDF",
                sub: "single page",
              },
              {
                href: "https://gi7bdwfce2o5ctvl.public.blob.vercel-storage.com/business-card-print/business-card-back.pdf",
                label: "Back — PDF",
                sub: "single page",
              },
              {
                href: "https://gi7bdwfce2o5ctvl.public.blob.vercel-storage.com/business-card-print/business-card-front.png",
                label: "Front — PNG",
                sub: "300 DPI",
              },
              {
                href: "https://gi7bdwfce2o5ctvl.public.blob.vercel-storage.com/business-card-print/business-card-back.png",
                label: "Back — PNG",
                sub: "300 DPI",
              },
            ].map((file) => (
              <li key={file.href}>
                <a
                  href={file.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 font-sans text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span>
                    <span className="block font-medium">{file.label}</span>
                    <span className="block text-xs text-muted-foreground">{file.sub}</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Get</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col items-center gap-12">
          <figure className="flex w-full max-w-2xl flex-col gap-3">
            <FrontCard />
            <figcaption className="text-center font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Front
            </figcaption>
          </figure>

          <figure className="flex w-full max-w-2xl flex-col gap-3">
            <BackCard />
            <figcaption className="text-center font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Back
            </figcaption>
          </figure>
        </div>
      </div>
    </main>
  )
}
