"use client"

import { useState } from "react"
import Link from "next/link"
import { ASSESSMENT_URL } from "@/lib/site-config"
import { BrandLockup } from "@/components/brand-lockup"

const links = [
  { label: "Ashley", href: "/#ashley" },
  { label: "Industry Data", href: "/#industry-data" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Testimonials", href: "/#testimonials" },
]

function RevealLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden text-base font-medium tracking-wide"
    >
      <span className="block text-muted-foreground transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-full block text-foreground transition-transform duration-300 ease-out group-hover:-translate-y-full"
      >
        {label}
      </span>
    </Link>
  )
}

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background">
      {/* Padding mirrors the hero's outer grid padding exactly (lg:pl-6/pr-16, xl:pl-6/pr-2)
          so the logo's left edge lines up with the "Never" headline and the CTA's right
          edge lines up with the hero image's right edge. */}
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-8 py-4 sm:px-10 lg:pl-6 lg:pr-16 xl:pl-6 xl:pr-2">
        {/* Left: logo + company name */}
        <BrandLockup />

        {/* Right: menu + primary CTA */}
        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <RevealLink key={link.href} {...link} />
          ))}
          <Link
            href={ASSESSMENT_URL}
            className="group relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-teal px-6 py-2.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60"
          >
            <span aria-hidden="true" className="cta-runner" />
            <span className="relative z-[1]">Start Free Assessment</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ASSESSMENT_URL}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-teal px-5 py-3.5 text-center text-lg font-semibold text-primary-foreground"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
