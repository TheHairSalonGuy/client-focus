"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2, PhoneCall } from "lucide-react"
import { CALENDLY_URL } from "@/lib/site-config"

const inputClass =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/40"

const STEPS = [
  "Tell us where to reach you",
  "We set up your dedicated receptionist and phone routing",
  "You review and approve before any calls go live",
]

export function GetStartedForm() {
  const [form, setForm] = useState({ fullName: "", practiceName: "", email: "", phone: "" })
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName.trim() || !form.practiceName.trim()) {
      setError("Please enter your name and firm or practice name.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError(null)
    setState("submitting")
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestedAt: new Date().toISOString() }),
      })
      setState(res.ok ? "done" : "error")
    } catch {
      setState("error")
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-normal tracking-tight text-navy-deep">Request Received</h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          Thanks! Our team will reach out shortly to complete the remaining setup steps and confirm your details before
          your 30-day free trial begins. Your trial has not started yet—we&apos;ll walk you through activation together.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright"
          >
            <PhoneCall className="h-5 w-5" />
            Book a Call to Activate
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-navy-deep bg-card px-6 py-3.5 text-base font-semibold text-navy-deep transition-all duration-300 hover:bg-navy-deep hover:text-primary-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm">
          30-Day Free Trial
        </span>
        <h1 className="mt-6 text-balance font-serif text-4xl font-normal leading-[1.08] tracking-tight text-navy-deep sm:text-5xl">
          Let&apos;s Get Your Trial Set Up
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
          Share a few details and our team will help you activate your dedicated virtual receptionist. Your trial
          begins only after these quick setup steps are complete.
        </p>
      </div>

      <ol className="mx-auto mt-8 grid max-w-md gap-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="text-sm font-medium leading-snug text-foreground">{label}</span>
          </li>
        ))}
      </ol>

      <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</span>
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder="Your full name"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Firm/Practice Name</span>
          <input
            className={inputClass}
            value={form.practiceName}
            onChange={(e) => setForm((f) => ({ ...f, practiceName: e.target.value }))}
            placeholder="Your firm or practice name"
            autoComplete="organization"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Email</span>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@business.com"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
            Phone Number <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </span>
          <input
            type="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
        </label>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {state === "error" && (
          <p className="text-sm font-medium text-destructive">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 disabled:opacity-70"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Request Trial Setup
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          No charge today. Your 30-day free trial starts after setup is confirmed.
        </p>
      </form>
    </div>
  )
}
