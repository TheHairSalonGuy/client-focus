"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { CALENDLY_URL } from "@/lib/site-config"

// Value-focused feature checklist row.
type Benefit = { title: string; description: string }

// A single restaurant-category carousel slide. Copy is shared across all slides;
// only the image (and its alt text) changes per category.
type Slide = { id: string; label: string; src: string; alt: string; objectPosition: string }

// Fixed "Virtual Waitress" body copy shown on every slide.
const BODY_PARAGRAPH =
  "When hungry customers hit a busy line during peak hours, they hang up and call the restaurant down the street—cash walking straight into your competitor's register. Your Virtual Waitress provides 24/7 coverage to take orders, answer menu questions, and book reservations automatically, paying for itself with a single saved rush hour."

const LEAD = "How much is one new order worth to your restaurant?"

// Restaurant-specific benefit checklist (4 items).
const BENEFITS: Benefit[] = [
  {
    title: "Stop Losing $3,000/Month to Busy Signals",
    description:
      "Your Virtual Waitress answers 50 calls at once, so every $40 order you're missing lands in your register instead of your competitor's.",
  },
  {
    title: "Buy Back 30 Hours of Paid Labor Every Month",
    description:
      "It answers every hours, parking, and menu question instantly, freeing your team to serve the paying guests in your dining room.",
  },
  {
    title: "Replace a $1,600/Mo Employee for a Fraction of the Cost",
    description:
      "It works 24/7, never calls out, and never asks for a raise—for a tiny fraction of what a part-time phone worker costs.",
  },
  {
    title: "Eliminate Unpaid Takeout and Stolen Food",
    description:
      "It texts a payment link and gets you paid before the kitchen starts cooking, so there are zero unpaid orders and zero wasted food.",
  },
]

// Ordered carousel slides. Index 0 (Fine Dining) is shown on page load.
const SLIDES: Slide[] = [
  {
    id: "thai-restaurant",
    label: "Asian Dining",
    src: "/hero-thai-restaurant.png",
    alt: "An Asian female restaurant host in a navy blazer with gold trim smiling while taking a phone call at a wooden host podium in a warm, upscale Thai restaurant with diners and a lit water feature in the background",
    objectPosition: "object-[60%_28%]",
  },
  {
    id: "fine-dining",
    label: "Fine Dining",
    src: "/hero-fine-dining.png",
    alt: "A young blonde maître d' in a white blouse and black blazer smiling while taking a reservation call at the host stand of an upscale steakhouse with a wine wall and dark wood accents",
    objectPosition: "object-[50%_28%]",
  },
  {
    id: "casual-dining",
    label: "Casual Dining",
    src: "/hero-casual-dining.png",
    alt: "A friendly young female host in a black polo smiling while taking a takeout order on the phone at the host stand of a casual full-service dining room with a pickup counter behind her",
    objectPosition: "object-[50%_28%]",
  },
  {
    id: "quick-service",
    label: "Quick Service",
    src: "/hero-quick-service.png",
    alt: "An energetic young female employee in a branded polo and visor wearing a headset and taking an order at the counter of a bright fast-casual sandwich shop with a menu board and prep station behind her",
    objectPosition: "object-[50%_28%]",
  },
  {
    id: "bar-grill",
    label: "Sports Bar Bistro",
    src: "/hero-bar-grill.png",
    alt: "A blonde female sports-bar host in a black Endzone Sports Bar tee smiling while taking a phone call at a wooden host podium with a tablet, in front of exposed brick, warm string lights, TVs showing football, and patrons at tables",
    objectPosition: "object-[60%_28%]",
  },
]

export function Hero() {
  // Index-based carousel: 0 = Fine Dining (default) → Casual → Quick Service → Bar & Grill.
  const [index, setIndex] = useState(0)

  const goPrev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length)

  // Labels for the slides the arrows will reveal, surfaced as hover tooltips.
  const prevLabel = SLIDES[(index - 1 + SLIDES.length) % SLIDES.length].label
  const nextLabel = SLIDES[(index + 1) % SLIDES.length].label

  return (
    <section id="top" className="relative w-full">
      {/* Split hero: ~45% light content panel (left) + ~55% image panel (right).
          On mobile/tablet these stack (content first, image below) via grid-cols-1. */}
      <div className="grid w-full grid-cols-1 lg:min-h-[85vh] lg:grid-cols-[45%_55%]">
        {/* ---------------- LEFT: content panel ---------------- */}
        <div className="relative z-10 w-full flex flex-col justify-center bg-background px-6 pb-12 pt-20 sm:px-10 lg:justify-start lg:pl-12 lg:pr-12 lg:pb-8 lg:pt-[72px] xl:pl-16 xl:pr-16">
          <div className="mx-auto w-full max-w-4xl lg:ml-auto lg:mr-0">
            {/* Main sales headline. "Never Miss Another" navy, final word teal, elegant
                serif, forced onto exactly two lines. The final word is an interactive vertical
                text-swap: on hover "Client" slides up out of view while "Order" slides in from
                below. */}
            <h2 className="word-swap-group relative font-serif text-7xl font-normal leading-[1.03] tracking-tight text-balance lg:text-8xl">
              <span className="block text-navy-deep">Never Miss</span>
              <span className="block">
                <span className="text-navy-deep">Another </span>
                <span className="word-swap-window text-teal">
                  <span className="word-swap-track">
                    <span>Client.</span>
                    <span>Order.</span>
                  </span>
                </span>
              </span>
            </h2>

            {/* Supporting question heading */}
            <h3 className="mt-5 text-pretty text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {LEAD}
            </h3>

            {/* Supporting copy */}
            <div className="mt-4 space-y-3">
              <p className="text-pretty text-2xl font-medium leading-relaxed text-foreground">{BODY_PARAGRAPH}</p>
            </div>

            {/* Benefit rows — each keeps the subtle proximity hover (lift + scale + brighten). */}
            <ul className="mt-5 grid gap-2.5">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit.title}
                  className="group flex origin-left transform-gpu items-start gap-3 py-0.5 text-xl leading-relaxed text-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:brightness-110 sm:text-2xl"
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

            {/* Book a Demo button — matches the navigation CTA (teal pill + running highlight). */}
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

        {/* ---------------- RIGHT: image panel (4-slide carousel) ---------------- */}
        {/* Full-bleed photo carousel across the four restaurant categories. Each slide
            cross-fades; the right arrow advances Fine Dining → Casual → Quick Service →
            Bar & Grill (wrapping), the left arrow steps back. */}
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[500px]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
              aria-hidden={i !== index}
            >
              <Image
                src={slide.src || "/placeholder.svg"}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover ${slide.objectPosition}`}
              />
            </div>
          ))}

          {/* Category label chip, top-left over the image */}
          <div className="absolute left-4 top-4 z-30 rounded-full bg-navy-deep/85 px-4 py-1.5 text-sm font-semibold text-primary-foreground backdrop-blur-md md:left-6 md:top-6">
            {SLIDES[index].label}
          </div>

          {/* Carousel navigation, vertically centered over the image */}
          <button
            type="button"
            onClick={goPrev}
            className="group absolute left-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:left-6"
            aria-label={`Previous slide: ${prevLabel}`}
          >
            <ChevronLeft className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full bg-navy-deep/90 px-3 py-1.5 text-sm font-semibold text-primary-foreground opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
              {prevLabel}
            </span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="group absolute right-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:h-16 hover:w-16 hover:bg-teal hover:text-primary-foreground hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60 md:right-6"
            aria-label={`Next slide: ${nextLabel}`}
          >
            <ChevronRight className="h-6 w-6 transition-all duration-300 group-hover:h-8 group-hover:w-8" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy-deep/90 px-3 py-1.5 text-sm font-semibold text-primary-foreground opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
              {nextLabel}
            </span>
          </button>

          {/* Slide indicator dots */}
          <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.label}`}
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
