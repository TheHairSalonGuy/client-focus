"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { CALENDLY_URL } from "@/lib/site-config"

type Scene = "law" | "dental"

/**
 * Body copy is generated per-scene so the industry terminology flips automatically:
 * law → "clients / case", dental → "patients / procedure".
 */
function buildBodyParagraphs(isDental: boolean): string[] {
  const clientsTerm = isDental ? "patients" : "clients"
  const outcomeTerm = isDental ? "procedure" : "case"
  return [
    `When prospective ${clientsTerm} hit voicemail during peak operational hours or after closing, most won't leave a message—they immediately hang up and call a competitor. Every missed call represents lost revenue and a missed opportunity to build a long-term professional relationship.`,
    `My Virtual Receptionist provides 24/7, white-glove coverage to capture high-value inquiries, gather comprehensive intake details, and seamlessly schedule appointments. By turning missed calls into booked consultations, the service easily pays for itself with a single saved ${outcomeTerm}.`,
  ]
}

// Value-focused feature checklist. Shared across both scenes since the copy
// speaks to "case or patient" details generically.
type Benefit = { title: string; description: string }

const BENEFITS: Benefit[] = [
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

const COPY: Record<Scene, { label: string; lead: string; benefits: Benefit[]; alt: string; src: string }> = {
  law: {
    label: "Built for Law Firms",
    lead: "How much is one new client worth to your firm?",
    benefits: BENEFITS,
    src: "/bg-lawfirm-hero.png",
    alt: "A blonde professional virtual receptionist wearing a headset, seated behind a law firm front desk with a computer monitor, taking a call, with law books and windows behind her",
  },
  dental: {
    label: "Built for Dental Practices",
    lead: "How much is one new patient worth to your practice?",
    benefits: BENEFITS,
    src: "/bg-dental-hero.png",
    alt: "A professional virtual receptionist with brown hair wearing a headset, seated behind a marble reception counter taking a call, with a dentist treating a patient and a waiting patient in the softly blurred background",
  },
}

export function Hero() {
  const [scene, setScene] = useState<Scene>("law")
  const isDental = scene === "dental"
  const copy = COPY[scene]
  // Terminology flips with the active slide (client/case ⇄ patient/procedure).
  const bodyParagraphs = buildBodyParagraphs(isDental)

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
                hero content starts here (moved up ~2 rows). "Never Miss Another" navy,
                "Client." teal, elegant serif, forced onto exactly two lines. */}
            <h2 className="relative font-serif text-7xl font-normal leading-[1.03] tracking-tight text-balance lg:text-8xl">
              <span className="block text-navy-deep">Never Miss</span>
              <span className="block">
                <span className="text-navy-deep">Another </span>
                <span className="text-teal">Client.</span>
              </span>

              {/* Animated white light reflection sweeping across the headline in reading
                  order (Never → Miss → Another → Client). The gradient is clipped to the
                  duplicated text so the shine only rides the glyphs, never the panel. */}
              <span
                aria-hidden="true"
                className="headline-glint pointer-events-none absolute inset-0 select-none"
                style={{
                  backgroundImage:
                    "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.85) 50%, transparent 58%)",
                  backgroundSize: "220% 100%",
                  backgroundRepeat: "no-repeat",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                <span className="block">Never Miss</span>
                <span className="block">Another Client.</span>
              </span>
            </h2>

            {/* 3. Industry badge (synced with scene) */}
            <div className="mt-5 inline-flex select-none">
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-lg font-semibold text-foreground shadow-sm transition-colors hover:border-teal">
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                {copy.label}
              </span>
            </div>

            {/* 4. Supporting question heading */}
            <h3 key={`${scene}-lead`} className="mt-5 text-pretty text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {copy.lead}
            </h3>

            {/* 5. Supporting copy — two structured paragraphs with scene-aware terminology.
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

            {/* 6. Five benefit rows — order fixed; each keeps the subtle proximity hover
                (lift + scale from the left + brighten). */}
            <ul className="mt-6 grid gap-3">
              {copy.benefits.map((benefit) => (
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

            {/* 7. Book a Demo button — matches the navigation CTA (teal pill + running highlight).
                Sits directly beneath the bullet list, attached to the content stack. */}
            <div className="mt-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a demo — opens Calendly in a new tab"
                className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#124E8C] px-28 py-5 text-2xl font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#0e3f72] hover:shadow-[0_0_24px_-4px_rgba(18,78,140,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#124E8C]/50"
              >
                <span aria-hidden="true" className="cta-runner" />
                <span className="relative z-[1]">Book a Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: image panel ---------------- */}
        {/* Full-bleed receptionist photo, no smoke/blur/overlay. The tall panel + a slightly
            upward-biased crop keeps her face, headset, upper body, the monitor, and the desk /
            keyboard in view (zoomed out vs. the previous tight full-viewport crop). */}
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-screen lg:max-h-screen">
          {/* Law firm slide — visible when scene === "law" */}
          <div className="absolute inset-0 transition-opacity duration-700 ease-out" style={{ opacity: isDental ? 0 : 1 }}>
            <Image
              src={COPY.law.src}
              alt={COPY.law.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[50%_28%]"
            />
          </div>
          {/* Dental practice slide — visible when scene === "dental" */}
          <div className="absolute inset-0 transition-opacity duration-700 ease-out" style={{ opacity: isDental ? 1 : 0 }}>
            <Image
              src={COPY.dental.src}
              alt={COPY.dental.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[50%_28%]"
            />
          </div>

          {/* Scene switch controls, vertically centered over the image */}
          <button
            type="button"
            onClick={() => setScene("dental")}
            aria-pressed={isDental}
            className="group absolute left-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:left-6"
            aria-label="View dental office"
          >
            <ChevronLeft className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Dental Office
            </span>
          </button>
          <button
            type="button"
            onClick={() => setScene("law")}
            aria-pressed={!isDental}
            className="group absolute right-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:right-6"
            aria-label="View law office"
          >
            <ChevronRight className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
            <span
              role="tooltip"
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Law Firms
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
