"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { Check, Info } from "lucide-react"
import {
  CALENDLY_URL,
  STRIPE_CHECKOUT_URL,
  ESSENTIAL_ANNUAL_CHECKOUT_URL,
  PROFESSIONAL_MONTHLY_CHECKOUT_URL,
  PROFESSIONAL_ANNUAL_CHECKOUT_URL,
} from "@/lib/site-config"

type Billing = "monthly" | "annual"

type TooltipContent = {
  heading: string
  items: string[]
}

const ESSENTIAL_SETUP_TOOLTIP: TooltipContent = {
  heading: "Your Setup & Launch includes:",
  items: [
    "Connecting your existing phone system to your virtual receptionist",
    "Configuring call routing, greetings, and business hours",
    "Training your virtual receptionist on how your office operates",
    "Setting up missed-call email notifications and call workflows",
    "Complete testing, launch, and go-live support",
  ],
}

const PROFESSIONAL_SETUP_TOOLTIP: TooltipContent = {
  heading: "Your Setup & Launch includes:",
  items: [
    "Connecting your existing phone system, business calendar, and scheduling workflow",
    "Training your virtual receptionist on how your office operates",
    "Building customized intake conversations and call workflows",
    "Creating customized client summaries for your staff",
    "Complete testing, launch, and go-live support",
  ],
}

const ENTERPRISE_SETUP_TOOLTIP: TooltipContent = {
  heading: "Your custom multi-office Setup & Launch includes:",
  items: [
    "Connecting each office's phone system and call-routing setup",
    "Creating location-specific greetings, knowledge, and workflows",
    "Training your virtual receptionist on how each office operates",
    "Configuring supported integrations and connected calendars",
    "Complete per-location testing, launch, and go-live coordination",
  ],
}

type Setup = {
  /** Original crossed-out price, e.g. "$1,499 Setup Fee". Omitted for Enterprise. */
  strikethrough?: string
  /** The effective / highlighted setup value, e.g. "$0 Setup Fee" or a custom label. */
  headline: string
  /** Small note under the setup line, e.g. "Code VIPCLIENT applied". */
  note?: string
  tooltip: TooltipContent
  tooltipLabel: string
}

/** A feature row is either plain text, or a bold title paired with an inline supporting detail. */
type Feature = string | { label: string; detail: string }

type Plan = {
  name: string
  description: string
  monthly: { price: string; suffix: string }
  annual: { price: string; suffix: string; billed: string; save: string }
  setup: Setup
  cta: string
  /** Optional second line rendered under the CTA label, e.g. "($0 Setup)". */
  ctaSubline?: string
  /** Risk-reversal helper text shown directly under the CTA button. */
  riskReversal: string
  /** CTA destination. Essential/Professional → Stripe checkout; Enterprise → Calendly. */
  href: string
  /** Optional billing-specific override used when Annual is selected (falls back to href). */
  annualHref?: string
  /** Optional billing-specific override used when Monthly is selected (falls back to href). */
  monthlyHref?: string
  features: Feature[]
  badge?: string
  accent?: "gold" | "navy"
  featured?: boolean
}

const plans: Plan[] = [
  {
    name: "Essential",
    description:
      "Reliable call coverage for offices that want every caller answered professionally, around the clock.",
    monthly: { price: "$499", suffix: "/mo" },
    annual: { price: "$415", suffix: "/mo", billed: "Billed $4,980/yr", save: "Save 2 months" },
    setup: {
      strikethrough: "$1,499 Setup Fee",
      headline: "$0 Setup Fee",
      note: "Limited Time Offer",
      tooltip: ESSENTIAL_SETUP_TOOLTIP,
      tooltipLabel: "What the setup fee includes",
    },
    cta: "Claim 30-Day Free Trial",
    ctaSubline: "($0 Setup)",
    riskReversal: "Pay $0 today. Cancel anytime within 30 days and pay nothing.",
    href: STRIPE_CHECKOUT_URL,
    annualHref: ESSENTIAL_ANNUAL_CHECKOUT_URL,
    badge: "Fast-Start",
    features: [
      "Answers calls 24/7/365 with zero hold times",
      "Handles multiple incoming callers at the exact same time",
      "Speaks multiple languages to seamlessly serve your diverse client base",
      "Uses your practice's exact custom greeting and tone",
      "Provides exceptional customer support by answering commonly asked questions with unlimited business knowledge",
      "Collects caller name, phone number, and reason for calling",
      "Filters out spam calls and unwanted sales telemarketers",
      "Delivers organized call intake summaries directly to your inbox",
    ],
  },
  {
    name: "Professional",
    description:
      "Customized caller intake that gives your staff the important details before they follow up.",
    monthly: { price: "$999", suffix: "/mo" },
    annual: { price: "$830", suffix: "/mo", billed: "Billed $9,960/yr", save: "Save 2 months" },
    setup: {
      strikethrough: "$1,499 Setup Fee",
      headline: "$299 Setup Fee",
      note: "Limited Time Offer",
      tooltip: PROFESSIONAL_SETUP_TOOLTIP,
      tooltipLabel: "What the setup fee includes",
    },
    cta: "Start 30-Day Risk-Free Trial",
    riskReversal:
      "30-Day Free Trial. 100% money-back guarantee on the $299 setup fee if canceled before Day 30.",
    href: STRIPE_CHECKOUT_URL,
    monthlyHref: PROFESSIONAL_MONTHLY_CHECKOUT_URL,
    annualHref: PROFESSIONAL_ANNUAL_CHECKOUT_URL,
    features: [
      {
        label: "Full Baseline Access",
        detail: "Includes every feature from the Essential Plan, unlocked out of the box.",
      },
      {
        label: "Two-Way Real-Time Calendar Sync",
        detail:
          "Direct appointment booking straight onto your office calendar with instant schedule verification and zero double-bookings.",
      },
      {
        label: "30-Second Executive Summaries",
        detail:
          "Distills complex caller intakes into brief, scannable reports so you and your team don't waste time reading long transcripts.",
      },
      {
        label: "High-Value Lead Prioritization",
        detail:
          "Automatically flags estimated service values and high-priority inquiries in reports so your staff focuses on closing top revenue first.",
      },
      {
        label: "Deep Intake Questionnaires",
        detail:
          "Tailored screening protocols built specifically around your company's exact intake requirements and qualification criteria.",
      },
      {
        label: "Complex Business Knowledge Base",
        detail:
          "Answers detailed, multi-step customer questions accurately using your customized business logic with zero fatigue.",
      },
      {
        label: "Live Transfer & Emergency Escalation",
        detail:
          "Immediate direct line transfers for priority calls and urgent client needs based on your custom team schedule.",
      },
      {
        label: "Instant Email Appointment Escalation",
        detail:
          "Immediately dispatches priority email alerts containing full caller details and scheduled calendar slots directly to your team so high-value appointments are never overlooked.",
      },
      {
        label: "Automated SMS No-Show Reduction",
        detail:
          "Dispatches timed text message reminders leading up to scheduled times to keep your calendar full and active.",
      },
      {
        label: "White-Glove Script Tuning & Updates",
        detail:
          "Continuous model optimization, script adjustments, and intake logic updates fully managed by our technical team.",
      },
    ],
    badge: "Highest ROI — Most Popular",
    accent: "gold",
    featured: true,
  },
  {
    name: "Enterprise",
    description:
      "Bespoke 24/7 client intake infrastructure built for premier practices and multi-provider offices.",
    monthly: { price: "$4,999", suffix: "/mo" },
    annual: { price: "$4,150", suffix: "/mo", billed: "Billed $49,800/yr", save: "Save 2 months" },
    setup: {
      headline: "Custom Multi-Office Setup & Launch",
      tooltip: ENTERPRISE_SETUP_TOOLTIP,
      tooltipLabel: "What the multi-office setup includes",
    },
    cta: "Book an Enterprise Consultation",
    riskReversal: "Custom SLAs, dedicated onboarding, and priority support.",
    href: CALENDLY_URL,
    features: [
      "Everything included in Professional",
      {
        label: "Dedicated Private Client Portal",
        detail:
          "Centralized dashboard to view after-hours intake logs, recordings, and lead transcripts in real time.",
      },
      {
        label: "Multi-Provider & Department Routing",
        detail:
          "Intelligent caller qualification and live routing customized by practice area or provider schedules.",
      },
      {
        label: "Custom Multi-Department Workflows",
        detail:
          "Tailored intake protocols built specifically for high-value consultations and specialized care.",
      },
      {
        label: "High-Volume Simultaneous Call Capacity",
        detail:
          "Guarantees zero caller wait times during high-demand marketing campaigns or peak office hours.",
      },
      {
        label: "Multi-Calendar & Staff Sync",
        detail:
          "Direct appointment booking across 20+ provider calendars with customizable buffer controls.",
      },
      {
        label: "Priority VIP & Urgent Escalation",
        detail:
          "Immediate alerts and direct line transfer protocols for emergency cases and key partners.",
      },
      {
        label: "Enterprise Data Security & Compliance",
        detail:
          "Encrypted call logging, secure transcript storage, and enterprise-grade privacy protection standards.",
      },
      {
        label: "White-Glove Intake Scripts",
        detail:
          "Bespoke tone, vocabulary, and screening rules crafted to reflect your firm's brand prestige.",
      },
      {
        label: "Dedicated Account Manager & Ongoing Tuning",
        detail:
          "Continuous script optimization, custom intake logic updates, and dedicated monthly review sessions.",
      },
    ],
    badge: "High-Volume & Enterprise",
    accent: "navy",
  },
]

function InfoTooltip({ label, content }: { label: string; content: TooltipContent }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onClickOutside)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onClickOutside)
    }
  }, [open])

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex translate-y-0.5 align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Info className="h-5 w-5" />
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 block w-[min(21rem,calc(100vw-2rem))] -translate-x-1/2 overflow-visible whitespace-normal break-words rounded-xl border border-border bg-popover p-4 text-left font-normal normal-case tracking-normal text-popover-foreground shadow-xl duration-150 animate-in fade-in-0 zoom-in-95"
        >
          <span className="block text-xs font-semibold leading-snug text-foreground">{content.heading}</span>
          <ul className="mt-2 space-y-1.5">
            {content.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Check className="mt-0.5 h-3 w-3 flex-none text-teal-bright" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {/* Invisible hover bridge covering the gap between icon and bubble so
              the tooltip stays open while the cursor travels onto it. */}
          <span aria-hidden="true" className="pointer-events-auto absolute inset-x-0 -bottom-2 h-2" />
        </span>
      )}
    </span>
  )
}

function SetupBlock({ setup }: { setup: Setup }) {
  return (
    <div>
      <p className="text-base font-semibold leading-snug text-foreground">
        {setup.strikethrough ? (
          <span className="inline-flex flex-nowrap items-center gap-x-1.5">
            <span className="whitespace-nowrap text-xl font-bold text-muted-foreground line-through decoration-foreground decoration-[3px]">
              {setup.strikethrough}
            </span>
            <span aria-hidden="true" className="text-muted-foreground">
              →
            </span>
            <span className="inline-flex items-center gap-x-1 whitespace-nowrap text-teal-bright">
              {setup.headline}
              <InfoTooltip label={setup.tooltipLabel} content={setup.tooltip} />
            </span>
          </span>
        ) : (
          <span className="inline-flex items-start gap-x-1">
            {setup.headline}
            <InfoTooltip label={setup.tooltipLabel} content={setup.tooltip} />
          </span>
        )}
      </p>
      {setup.note && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-teal-bright">{setup.note}</p>}
    </div>
  )
}

function PriceBlock({ plan, billing }: { plan: Plan; billing: Billing }) {
  const data = billing === "monthly" ? plan.monthly : plan.annual
  return (
    <div className="mt-6 min-h-[6.25rem]">
      <div key={billing} className="flex items-end gap-1.5 duration-300 animate-in fade-in slide-in-from-bottom-1">
        <span className="font-serif text-5xl font-light leading-none tracking-tight text-foreground md:text-6xl">
          {data.price}
        </span>
        <span className="pb-1 text-lg text-muted-foreground">{data.suffix}</span>
      </div>
      {/* Annual note only occupies space when Annual is selected. */}
      {billing === "annual" && (
        <div
          key={`${billing}-note`}
          className="mt-1.5 text-sm leading-relaxed text-muted-foreground duration-300 animate-in fade-in"
        >
          {plan.annual.billed}
          <br />
          <span className="text-muted-foreground/80">{plan.annual.save}</span>
        </div>
      )}
    </div>
  )
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const cardAccent = plan.featured
    ? "border-[#c8a951] shadow-[0_0_0_1px_#c8a951,0_20px_50px_-24px_rgba(200,169,81,0.6)]"
    : plan.accent === "navy"
      ? "border-teal/40 shadow-[0_0_0_1px_color-mix(in_oklch,var(--teal)_30%,transparent)] hover:shadow-lg"
      : "border-border hover:shadow-lg"

  const ctaAccent = plan.featured
    ? "bg-[#e6b800] text-navy-deep hover:bg-[#f2c400] hover:shadow-[0_0_32px_-6px_rgba(230,184,0,0.75)]"
    : plan.accent === "navy"
      ? "bg-teal text-primary-foreground hover:bg-teal-bright hover:shadow-[0_0_28px_-8px_color-mix(in_oklch,var(--teal-bright)_75%,transparent)]"
      : "border border-teal bg-transparent text-teal-bright hover:bg-teal hover:text-primary-foreground"

  return (
    <div
      className={`relative z-0 flex h-full flex-col rounded-3xl border bg-card/50 p-8 backdrop-blur-sm transition-shadow duration-300 has-[[role=tooltip]]:z-50 md:p-9 ${cardAccent}`}
    >
      {/* Top header badge — fixed-height container so titles align across cards. */}
      <div className="flex min-h-[1.75rem] items-start">
        {plan.badge && (
          <span
            className={`absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center whitespace-nowrap rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-[0.15em] ${
              plan.featured ? "bg-[#c8a951] text-navy-deep" : "bg-teal text-primary-foreground"
            }`}
          >
            {plan.badge}
          </span>
        )}
      </div>

      {/* 1. Title & subtitle — fixed-height so the price row starts at the same spot. */}
      <h3 className="font-serif text-5xl font-light tracking-tight text-foreground">{plan.name}</h3>
      <p className="mt-3 min-h-[4.5rem] text-pretty text-sm leading-relaxed text-muted-foreground">
        {plan.description}
      </p>

      {/* 2. Price display */}
      <PriceBlock plan={plan} billing={billing} />

      {/* 3. Setup & launch fee — shared min-height keeps the CTA row aligned. */}
      <div className="mt-2 flex min-h-[4rem] flex-col justify-start">
        <SetupBlock setup={plan.setup} />
      </div>

      {/* 4. CTA button row — aligns horizontally across all three cards. */}
      <a
        href={billing === "annual" ? (plan.annualHref ?? plan.href) : (plan.monthlyHref ?? plan.href)}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative isolate mt-2 inline-flex min-h-[3.5rem] w-full items-center justify-center overflow-hidden rounded-full px-6 text-center text-base font-semibold leading-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/50 md:text-lg ${ctaAccent}`}
      >
        {plan.featured && <span aria-hidden="true" className="cta-white-runner" />}
        <span className="relative z-[1] flex flex-col items-center leading-tight">
          <span>{plan.cta}</span>
          {plan.ctaSubline && <span className="text-sm font-semibold opacity-90">{plan.ctaSubline}</span>}
        </span>
      </a>

      {/* 5. Risk-reversal micro-copy — shared min-height so feature lists start level. */}
      <p className="mt-3 min-h-[3rem] text-pretty text-center text-xs leading-relaxed text-muted-foreground">
        {plan.riskReversal}
      </p>

      {/* 6. Feature list — plain text or a bold title with an inline detail. */}
      <ul className="mt-4 space-y-3.5 border-t border-border pt-6">
        {plan.features.map((feature) => {
          const label = typeof feature === "string" ? feature : feature.label
          const detail = typeof feature === "string" ? undefined : feature.detail
          return (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal/15 text-teal-bright">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">
                {detail ? (
                  <>
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className="text-foreground/70">{` — ${detail}`}</span>
                  </>
                ) : (
                  label
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly")
  const monthlyRef = useRef<HTMLButtonElement>(null)
  const annualRef = useRef<HTMLButtonElement>(null)

  const onToggleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      setBilling("annual")
      annualRef.current?.focus()
    } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      setBilling("monthly")
      monthlyRef.current?.focus()
    }
  }

  return (
    <section id="pricing" className="relative border-t border-border pb-24 pt-14 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-[1460px] px-8 md:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl md:whitespace-nowrap">
            Choose the level of support your office needs.
          </h2>
        </div>

        {/* Billing toggle */}
        <div className="relative mt-8 flex flex-col items-center">
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="inline-flex items-center rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
          >
            <button
              ref={monthlyRef}
              type="button"
              role="radio"
              aria-checked={billing === "monthly"}
              tabIndex={billing === "monthly" ? 0 : -1}
              onClick={() => setBilling("monthly")}
              onKeyDown={onToggleKeyDown}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                billing === "monthly"
                  ? "bg-teal text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              ref={annualRef}
              type="button"
              role="radio"
              aria-checked={billing === "annual"}
              tabIndex={billing === "annual" ? 0 : -1}
              onClick={() => setBilling("annual")}
              onKeyDown={onToggleKeyDown}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                billing === "annual"
                  ? "bg-teal text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
                Annual — Save 2 Mths!
            </button>
          </div>

          {/* Gold starburst splash that pops in when Annual is selected.
              Absolutely positioned so it never shifts the toggle or cards. */}
          {billing === "annual" && (
            <div
              key="save-splash"
              aria-hidden="true"
              className="pricing-splash pointer-events-none absolute right-2 -top-12 z-20 flex h-36 w-36 items-center justify-center text-center sm:-right-2 sm:-top-14 sm:h-40 sm:w-40"
            >
              <span className="pricing-splash-shape absolute inset-0 bg-[#e6b800] shadow-[0_10px_30px_-8px_rgba(230,184,0,0.7)]" />
              <span className="relative rotate-[20deg] px-2 font-serif text-base font-semibold leading-tight text-navy-deep sm:text-lg">
                Save 2<br />Months!
              </span>
            </div>
          )}
        </div>

        {/* Cards: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="mx-auto mt-10 grid max-w-md grid-cols-1 items-stretch gap-8 md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} billing={billing} />
          ))}
        </div>
      </div>
    </section>
  )
}
