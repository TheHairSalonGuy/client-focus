import type { ReactNode } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const linkClassName =
  "rounded-sm text-teal-bright underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-bright focus-visible:ring-offset-2 focus-visible:ring-offset-background"

type LegalDocumentProps = {
  eyebrow: string
  title: string
  effectiveDate: string
  children: ReactNode
}

export function LegalDocument({
  eyebrow,
  title,
  effectiveDate,
  children,
}: LegalDocumentProps) {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background px-6 pb-20 pt-28 sm:px-8 sm:pt-32">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-bright">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light leading-tight tracking-tight text-foreground text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: {effectiveDate}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Gig AI Inc dba Swish Voice
          </p>
          <div className="mt-12 space-y-10 text-base leading-relaxed text-foreground/85">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined}>
      <h2
        id={id ? `${id}-heading` : undefined}
        className="font-serif text-2xl font-semibold text-navy-deep"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

export function LegalLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a href={href} className={linkClassName}>
      {children}
    </a>
  )
}
