"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { CALENDLY_URL } from "@/lib/site-config"

type Scene = "restaurant" | "law" | "dental"

// Value-focused feature checklist row.
type Benefit = { title: string; description: string }

/**
 * Body copy is generated per-scene. The restaurant slide uses dedicated
 * "Virtual Waitress" sales copy; law/dental fall back to the original
 * professional-service copy with terminology that flips per industry
 * (clients/case ⇄ patients/procedure).
 */
function buildBodyParagraphs(scene: Scene): string[] {
  if (scene === "restaurant") {
    return [
      "When hungry customers hit a busy line or get sent to voicemail during peak lunch or dinner hours, they don't wait—they hang up and call the restaurant down the street. Every unanswered call is literally cash walking out your door and into your competitor's register.",
      "Your Virtual Waitress provides 24/7 phone coverage to take takeout orders, answer menu questions, and secure table reservations automatically. By turning busy signals into paid takeout orders, the service easily pays for itself with a single saved rush hour.",
    ]
  }
  const clientsTerm = scene === "dental" ? "patients" : "clients"
  const outcomeTerm = scene === "dental" ? "procedure" : "case"
  return [
    `When prospective ${clientsTerm} hit voicemail during peak operational hours or after closing, most won't leave a message—they immediately hang up and call a competitor. Every missed call represents lost revenue and a missed opportunity to build a long-term relationship.`,
    `My Virtual Receptionist provides 24/7, white-glove coverage to capture high-value inquiries, gather comprehensive intake details, and seamlessly schedule appointments. By turning missed calls into booked business, the service easily pays for itself with a single saved ${outcomeTerm}.`,
  ]
}

// Restaurant-specific benefit checklist (4 items) shown on the Thai restaurant slide.
const RESTAURANT_BENEFITS: Benefit[] = [
  {
    title: "Stop Losing $3,000/Month to Busy Signals",
    description:
      "A front-desk worker can answer one phone call. Your Virtual Waitress answers 50 calls at the exact same time. Every missed call is a $40 order walking straight into your competitor's register. You instantly capture 100% of the food sales you're currently throwing in the trash.",
  },
  {
    title: "Buy Back 30 Hours of Paid Labor Every Month",
    description:
      'Your team wastes 1 hour every single day answering "What time do you close?" and "Where do I park?" That\'s 30 hours a month you pay them to answer basic questions instead of serving the paying guests in your dining room. The Virtual Waitress answers every question instantly with zero human effort.',
  },
  {
    title: "Replace a $1,600/Mo Employee for a Fraction of the Cost",
    description:
      "A part-time phone worker taking calls for just 3 hours a day at $20/hr costs you $1,600 a month—plus taxes, training, and the headache when they call in sick. The Virtual Waitress works 24/7, never calls out, never asks for a raise, and costs a tiny fraction of a human worker.",
  },
  {
    title: "Eliminate Unpaid Takeout and Stolen Food",
    description:
      "When customers order over the phone and don't show up, you burn raw food costs and labor. The Virtual Waitress automatically texts a payment link to their phone and gets you paid BEFORE your kitchen starts cooking. Zero unpaid orders. Zero wasted food. Pure profit.",
  },
]

// Professional-service benefit checklist (5 items) shown on the law & dental slides.
const PROFESSIONAL_BENEFITS: Benefit[] = [
  {
    title: "Exceptional Customer Support",
    description:
      "Eliminates 80% of repetitive staff calls overnight. Answers every FAQ with 100% precision, perfect patience, zero complaints, and never takes a sick day.",
  },
  {
    title: "Instant 24/7 Response",
    description:
      "Stop lighting ad dollars on fire. Captures high-value leads instantly during peak hours, nights, and weekends before they hang up and call your competitor.",
  },
  {
    title: "Custom Intake Summaries",
    description:
      "Built strictly to your exact operational rules. Collects essential prospect details automatically and drops clean, actionable leads straight into your inbox.",
  },
  {
    title: "Direct Calendar Booking",
    description:
      "Turns raw caller intent into paid calendar appointments on autopilot, without your team lifting a finger.",
  },
  {
    title: "Automated Reminders",
    description:
      "Crushes costly no-shows instantly with automated SMS/call confirmations, ensuring your schedule stays full and profitable.",
  },
]

// Ordered list of carousel slides. Index 0 is shown on page load.
const SCENES: Scene[] = ["restaurant", "law", "dental"]

const COPY: Record<Scene, { lead: string; alt: string; src: string; objectPosition: string }> = {
  restaurant: {
    lead: "How much is one new order worth to your restaurant?",
    src: "/bg-restaurant-hero.png",
    alt: "A young, friendly Thai waitress in her early 20s smiling while speaking on a landline telephone, taking a takeout order in a modern upscale restaurant dining area with warm wood accents and an indoor running-water wall feature behind her",
    objectPosition: "object-[50%_28%]",
  },
  law: {
    lead: "How much is one new client worth to your firm?",
    src: "/bg-lawfirm-hero.png",
    alt: "A blonde professional virtual receptionist wearing a headset, seated behind a law firm front desk with a computer monitor, taking a call, with law books and windows behind her",
    objectPosition: "object-[50%_28%]",
  },
  dental: {
    lead: "How much is one new patient worth to your practice?",
    src: "/bg-dental-hero.png",
    alt: "A professional virtual receptionist with brown hair wearing a headset, seated behind a marble reception counter taking a call, with a dentist treating a patient and a waiting patient in the softly blurred background",
    objectPosition: "object-[50%_28%]",
  },
}

export function Hero() {
  // Index-based carousel: 0 = restaurant (default), 1 = law, 2 = dental.
  const [index, setIndex] = useState(0)
  const scene = SCENES[index]
  const copy = COPY[scene]
  // Body copy + benefit list flip with the active slide: restaurant shows the
  // "Virtual Waitress" copy (4 items), law/dental show the professional copy (5 items).
  const bodyParagraphs = buildBodyParagraphs(scene)
  const benefits = scene === "restaurant" ? RESTAURANT_BENEFITS : PROFESSIONAL_BENEFITS

  const goPrev = () => setIndex((i) => (i - 1 + SCENES.length) % SCENES.length)
  const goNext = () => setIndex((i) => (i + 1) % SCENES.length)

  return (
    <section id="top" className="relative w-full">
      {/* Split hero: ~45% light content panel (left) + ~55% image panel (right).
          On mobile/tablet these stack (content first, image below) via grid-cols-1. */}
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* ---------------- LEFT: content panel ---------------- */}
        {/* Clean light background, no scrim/haze, so every line is crisp and high-contrast.
            A wider column + trimmed padding lets paragraphs run more words per line
            (less vertical wrap); content is vertically centered on desktop. */}
        <div className="relative z-10 w-full flex flex-col justify-center bg-background px-6 pb-12 pt-20 sm:px-10 lg:justify-start lg:pl-12 lg:pr-12 lg:pb-8 lg:pt-[72px] xl:pl-16 xl:pr-16">
          <div className="mx-auto w-full max-w-3xl lg:ml-auto lg:mr-0">
            {/* Main sales headline — the branding lockup now lives in the header, so the
                hero content starts here. "Never Miss Another" navy, final word teal, elegant
                serif, forced onto exactly two lines. The final word is an interactive vertical
                text-swap: on hover "Client" slides up out of view while "Order" slides in from
                below. */}
            <h2 className="word-swap-group relative font-serif text-7xl font-normal leading-[1.03] tracking-tight text-balance lg:text-8xl">
              <span className="block text-navy-deep">Never Miss</span>
              <span className="block">
                <span className="text-navy-deep">Another </span>
                {/* Vertical text-swap: a fixed-height, overflow-hidden window holding two
                    stacked words. On group hover both translate up one line height, sliding
                    "Client" out the top and "Order" in from the bottom. */}
                <span className="word-swap-window text-teal">
                  <span className="word-swap-track">
                    <span>Client.</span>
                    <span>Order.</span>
                  </span>
                </span>
              </span>
            </h2>

            {/* Supporting question heading */}
            <h3
              key={`${scene}-lead`}
              className="mt-6 text-pretty text-2xl font-bold leading-snug text-foreground sm:text-3xl"
            >
              {copy.lead}
            </h3>

            {/* Supporting copy — two structured paragraphs with scene-aware terminology.
                Wider max-width lets each line hold more words, cutting wrapped rows. */}
            <div key={`${scene}-body`} className="mt-5 space-y-4">
              {bodyParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-pretty text-xl font-medium leading-relaxed text-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Five benefit rows — order fixed; each keeps the subtle proximity hover
                (lift + scale from the left + brighten). */}
            <ul key={`${scene}-benefits`} className="mt-6 grid gap-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="group flex origin-left transform-gpu items-start gap-3 py-1 text-lg leading-relaxed text-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:brightness-110 sm:text-xl"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal/15 text-teal transition-colors duration-300 ease-out group-hover:bg-teal/25 group-hover:text-teal-bright">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span>
                    <strong className="font-bold text-navy-deep">{benefit.title}</strong>
                    <span className="font-medium"> — {benefit.description}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Book a Demo button — matches the navigation CTA (teal pill + running highlight).
                Sits directly beneath the bullet list, attached to the content stack. */}
            <div className="mt-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a demo — opens Calendly in a new tab"
                className="group relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-[#124E8C] px-8 py-5 text-2xl font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#0e3f72] hover:shadow-[0_0_24px_-4px_rgba(18,78,140,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#124E8C]/50"
              >
                <span aria-hidden="true" className="cta-runner" />
                <span className="relative z-[1]">Book a Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: image panel (3-slide carousel) ---------------- */}
        {/* Full-bleed photo carousel. Each slide cross-fades; the right arrow advances
            restaurant → law → dental (wrapping), the left arrow steps back. */}
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-screen lg:max-h-screen">
          {SCENES.map((s, i) => (
            <div
              key={s}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
              aria-hidden={i !== index}
            >
              <Image
                src={COPY[s].src || "/placeholder.svg"}
                alt={COPY[s].alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover ${COPY[s].objectPosition}`}
              />
            </div>
          ))}

          {/* Carousel navigation, vertically centered over the image */}
          <button
            type="button"
            onClick={goPrev}
            className="group absolute left-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:left-6"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="group absolute right-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:right-6"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
          </button>

          {/* Slide indicator dots */}
          <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">
            {SCENES.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-teal" : "w-2.5 bg-card/80 hover:bg-card"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
