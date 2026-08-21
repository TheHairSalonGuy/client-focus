"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Phone } from "lucide-react"
import { buildResult, type Answers } from "@/lib/assessment"
import { CALENDLY_URL } from "@/lib/site-config"

/** Delivery status of the background email notification (mirrors AssessmentFlow). */
export type SubmitState = "idle" | "submitting" | "done" | "error"

/**
 * Assessment results page.
 *
 * A deliberately simple, image-led layout:
 *   1. Wide comparison image (~80% of the section) with only two dollar amounts
 *      overlaid — a navy-bordered hourly box above her left hand (with a compact
 *      Essential/Professional toggle) and a green-bordered monthly revenue box
 *      above the money in her right hand. No labels or paragraphs over the woman.
 *   2. A plain-text explanation + transparent calculation + disclaimer (no cards).
 *   3. Two CTAs: "Call to Test" (scrolls home to the Grace/Pearl section) and
 *      "Book a Demo" (Calendly).
 *
 * Every figure is derived from the assessment answers (buildResult -> metrics);
 * only the two fixed hourly plan rates are hardcoded (they are pricing, not data).
 */

// Fixed hourly investment rates. These are plan prices, NOT assessment-derived values.
// The toggle only swaps between these two numbers — it never touches the revenue math.
const PLAN_RATES = {
  Professional: 6.24,
  Essential: 3.11,
} as const

type PlanKey = keyof typeof PLAN_RATES

/* --------------------------------- Count-up hook -------------------------------- */

/**
 * Smoothly animates a number up to `target` using an ease-out curve. On mount it
 * counts up from 0; when `target` changes (plan toggle) it animates from the last
 * settled value. Honors prefers-reduced-motion by snapping instantly.
 */
function useCountUp(target: number, { duration = 1200, decimals = 0 }: { duration?: number; decimals?: number } = {}) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const from = fromRef.current

    if (prefersReduced) {
      fromRef.current = target
      setValue(target)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(from + (target - from) * eased)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
        setValue(target)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value)
}

/* --------------------------------- Formatter --------------------------------- */

function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`
}

/* --------------------------------- Component ---------------------------------- */

export function ResultsView({
  answers,
}: {
  answers: Answers
  // Still accepted from the caller (submission runs in the background), but the
  // on-page delivery banner has been removed, so it is no longer rendered here.
  submitState?: SubmitState
}) {
  const { metrics } = buildResult(answers)
  const [plan, setPlan] = useState<PlanKey>("Professional")

  // Animated figures.
  const revenue = useCountUp(metrics.midpointRevenue, { duration: 1300 })
  const missedCalls = useCountUp(metrics.missedCallsPerMonth, { duration: 1300 })
  const hourly = useCountUp(PLAN_RATES[plan], { duration: 900, decimals: 2 })

  function scrollToCall() {
    // "Call to Test" returns to the main site and scrolls to the Ashley demo section.
    window.location.href = "/#ashley"
  }

  return (
    <div className="pt-6 pb-2">
      {/* ----------------------- Image with two amounts overlaid ------------------- */}
      {/* Wide 3:2 image is the primary visual (~80% of the section). The two amounts
          are pinned by percentage just above each hand and never cover her face. */}
      <figure className="relative mx-auto aspect-[3/2] w-full max-w-5xl overflow-hidden rounded-3xl">
        <Image
          src="/results-woman-money.png"
          alt="A professional virtual receptionist weighing the low hourly investment against the potential monthly revenue held in her other hand"
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />

        {/* Left hand — missed-call volume metric, resting on the woman's open palm. */}
        <div className="absolute left-[8%] top-[56%] w-[22%] max-w-[200px]">
          <div className="rounded-2xl border-2 border-navy-deep bg-sky-100 px-1.5 py-2 text-center shadow-lg sm:px-2.5 sm:py-3">
            <p className="font-serif text-xl font-normal leading-none text-navy-deep sm:text-3xl md:text-4xl">
              {missedCalls.toLocaleString("en-US")}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground sm:text-[11px]">
              Total Missed Calls / Month
            </p>
          </div>
        </div>

        {/* Right hand — main financial impact, centered over the stack of money. */}
        <div className="absolute right-[9%] top-[42%] w-[24%] max-w-[222px]">
          <div className="rounded-2xl border-2 border-success bg-sky-100 px-2 py-1.5 text-center shadow-lg sm:px-2.5 sm:py-2.5">
            <p className="font-serif text-xl font-normal leading-none text-success sm:text-3xl md:text-4xl">
              {money(revenue)}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground sm:text-[11px]">
              Estimated Monthly Sales Lost
            </p>
          </div>
        </div>
      </figure>

      {/* ------------------ Explanation + CTAs + calculation ------------------ */}
      {/* max-w-5xl matches the hero image width, so the left/right text edges line
          up vertically with the image borders above. */}
      <div className="mx-auto mt-8 max-w-5xl">
        {/* Main paragraph — copy changes based on the selected plan; the revenue
            figure stays dynamic (derived from the assessment answers). */}
        {/* Plan toggle — swaps the hourly figure quoted in the paragraph below. */}
        <div
          role="group"
          aria-label="Choose plan"
          className="mb-5 inline-flex rounded-full border border-border bg-muted p-1"
        >
          {(Object.keys(PLAN_RATES) as PlanKey[]).map((key) => {
            const active = plan === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPlan(key)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-navy-deep text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key} Plan
              </button>
            )
          })}
        </div>

        <div className="space-y-4 text-pretty text-lg leading-relaxed text-foreground">
          <p>
            Based on your assessment answers, your restaurant is losing an estimated{" "}
            <strong className="font-bold text-navy-deep">{money(metrics.midpointRevenue)}</strong> in sales each month
            from unanswered calls—about{" "}
            <strong className="font-bold text-navy-deep">
              {metrics.missedCallsPerMonth.toLocaleString("en-US")}
            </strong>{" "}
            missed calls. At {money(metrics.clientValue)} per transaction and {metrics.visitsPerYear} visits a year,
            each regular you capture is worth{" "}
            <strong className="font-bold text-navy-deep">{money(metrics.lifetimeValue)}</strong> a year.
          </p>

          {plan === "Essential" ? (
            <p>
              With the <strong className="font-bold text-navy-deep">Essential Plan</strong>, your Virtual Receptionist
              costs only <strong className="font-bold text-navy-deep">$3.11 per hour</strong> to answer calls 24/7,
              gather the caller&apos;s reason for calling, and send an organized summary directly to your email inbox.
            </p>
          ) : (
            <p>
              With the <strong className="font-bold text-navy-deep">Professional Plan</strong>, your Virtual
              Receptionist costs only <strong className="font-bold text-navy-deep">$6.24 per hour</strong> to handle
              multiple calls at once 24/7, collect full intake details, prepare organized summaries, book appointments,
              and send automatic reminders.
            </p>
          )}
        </div>

        {/* CTAs — moved up one row, immediately below the main paragraph */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToCall}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal px-6 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60"
          >
            <Phone className="h-5 w-5" />
            Call to Test
          </button>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#124E8C] px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#0e3f72] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#124E8C]/40"
          >
            Book a Demo
          </a>
        </div>

        {/* Calculation */}
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Calculation: {metrics.midpointCalls} missed calls per day × 30 days ={" "}
          {metrics.missedCallsPerMonth.toLocaleString("en-US")} total missed calls per month.{" "}
          {metrics.midpointCalls} missed calls per day × {money(metrics.clientValue)} average transaction × 30 days ={" "}
          {money(metrics.midpointRevenue)} estimated monthly sales lost.
        </p>

        {/* Disclaimer — directly below the calculation line */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          This estimate is based on the information provided and illustrates potential opportunity. Actual results may
          vary.
        </p>
      </div>
    </div>
  )
}
