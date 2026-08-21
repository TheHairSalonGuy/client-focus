"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { CALENDLY_URL } from "@/lib/site-config"

// Value-focused feature checklist row.
type Benefit = { title: string; description: string }

// A single restaurant-category carousel slide. The active slide id also selects
// which industry copy block renders in the left content panel.
type Slide = { id: string; label: string; src: string; alt: string; objectPosition: string }

// Per-industry hero copy. Keyed by the same slide ids the carousel already uses,
// so advancing the carousel swaps the headline, stat, body, and bullets together.
type IndustryCopy = {
  headlineWord: string
  statSubhead: string
  mathLinkText: string
  bodyCopy: string
  bullets: Benefit[]
  ctaLabel: string
}

const MATH_LINK_TEXT = "Here's the math on one missed call."

const INDUSTRY_COPY: Record<string, IndustryCopy> = {
  "fine-dining": {
    headlineWord: "Customer.",
    statSubhead: "Your Phone Is Losing You $60,000 A Year.",
    mathLinkText: MATH_LINK_TEXT,
    bodyCopy:
      "One missed call is one missed reservation. One missed reservation is a $500 average check — gone, straight to the restaurant down the street. Do that 10 times a month and you've lost $5,000. Do that for a year and it's $60,000 — enough to hire two more servers or just keep as pure profit. Ashley answers every call, every time, so that number goes to zero.",
    bullets: [
      {
        title: "Never Lose Another $500 Table.",
        description:
          "Ashley picks up 10 calls at once. No busy signal, no hold music, no reason for a guest to hang up and dial your competitor.",
      },
      {
        title: "Get 30 Hours Back Every Month.",
        description: `That's how long your staff spends answering "are you open" and "is there parking." Ashley answers it in 2 seconds so your team sells instead of answering phones.`,
      },
      {
        title: "She Never Calls Out. Never Quits. Never Forgets an Allergy.",
        description: "Ashley works every shift, knows every ingredient, and never needs a raise.",
      },
      {
        title: "8 Out Of 10 People Won't Leave a Voicemail.",
        description:
          "They hang up and book somewhere else. Ashley answers at 11pm on a Tuesday exactly like she does at 7pm on a Saturday.",
      },
    ],
    ctaLabel: "Book a Demo",
  },

  "casual-dining": {
    headlineWord: "Table.",
    statSubhead: "Your Phone Is Losing You $36,000 A Year.",
    mathLinkText: MATH_LINK_TEXT,
    bodyCopy:
      "One missed call is one missed table. A party of four at a $75 average check is $300 walking out the door — to the place with the shorter wait. Do that 10 times a month and that's $3,000. Do it for a year and you've handed your competitor $36,000. Ashley answers every call on the first ring, so that number goes to zero.",
    bullets: [
      {
        title: "Never Lose Another $300 Table.",
        description:
          "Ashley picks up 10 calls at once during the dinner rush. No busy signal, no hold music, no reason for a family to call somewhere else.",
      },
      {
        title: "Get 30 Hours Back Every Month.",
        description: `That's how long your hosts spend answering "how long is the wait" and "do you take reservations." Ashley answers in 2 seconds so your team works the floor instead of the phone.`,
      },
      {
        title: "Every Takeout Order, Captured Correctly.",
        description:
          "Ashley takes the order, repeats it back, and sends it to the kitchen — no misheard items, no comped meals, no wasted food.",
      },
      {
        title: "8 Out Of 10 People Won't Leave a Voicemail.",
        description:
          "They hang up and eat somewhere else. Ashley answers at 9pm on a Monday exactly like she does at 7pm on a Friday.",
      },
    ],
    ctaLabel: "Book a Demo",
  },

  "quick-service": {
    headlineWord: "Order.",
    statSubhead: "Your Phone Is Losing You $28,000 A Year.",
    mathLinkText: MATH_LINK_TEXT,
    bodyCopy:
      "One missed call is one missed order. A $35 family pickup order is gone the second the line rings busy — and they order from the shop down the block instead. Miss 15 a week and that's $2,100 a month. Over a year it's more than $28,000 in orders your kitchen never saw. Ashley answers every call instantly, so that number goes to zero.",
    bullets: [
      {
        title: "Never Lose Another $35 Order.",
        description:
          "Ashley takes 10 orders at the same time during the lunch rush. No busy signal, no hold music, no customer hanging up hungry.",
      },
      {
        title: "Get 30 Hours Back Every Month.",
        description: `That's how long your crew spends answering "are you open" and "how long for pickup." Ashley handles it in 2 seconds so your line keeps moving.`,
      },
      {
        title: "Get Paid Before The Kitchen Starts Cooking.",
        description:
          "Ashley texts a payment link and confirms the order, so there are no no-shows, no unpaid pickups, and no thrown-out food.",
      },
      {
        title: "8 Out Of 10 People Won't Leave a Voicemail.",
        description:
          "They hang up and order elsewhere. Ashley answers at 11pm on a Tuesday exactly like she does at noon on a Saturday.",
      },
    ],
    ctaLabel: "Book a Demo",
  },

  "bar-grill": {
    headlineWord: "Fan.",
    statSubhead: "Your Phone Is Losing You $48,000 A Year.",
    mathLinkText: MATH_LINK_TEXT,
    bodyCopy:
      "One missed call is one missed party. A group of eight coming in for the game at a $50 head is $400 — and on game day they will not call twice. Miss 10 of those a month and that's $4,000. Over a season and a year it adds up to $48,000 in tabs you never rang. Ashley answers every call, even mid-rush, so that number goes to zero.",
    bullets: [
      {
        title: "Never Lose Another $400 Party.",
        description:
          "Ashley picks up 10 calls at once on game day. No busy signal, no hold music, no group booking the sports bar across town.",
      },
      {
        title: "Get 30 Hours Back Every Month.",
        description: `That's how long your staff spends answering "are you showing the fight" and "can we get a table for ten." Ashley answers in 2 seconds so your team keeps pouring.`,
      },
      {
        title: "Big-Party And Game-Day Bookings, Locked In.",
        description:
          "Ashley captures the group size, the game they are coming for, and a callback number — then hands your team a clean, ready-to-seat list.",
      },
      {
        title: "8 Out Of 10 People Won't Leave a Voicemail.",
        description:
          "They hang up and watch the game somewhere else. Ashley answers at midnight exactly like she does at kickoff.",
      },
    ],
    ctaLabel: "Book a Demo",
  },

  "thai-restaurant": {
    headlineWord: "Guest.",
    statSubhead: "Your Phone Is Losing You $42,000 A Year.",
    mathLinkText: MATH_LINK_TEXT,
    bodyCopy:
      "One missed call is one missed guest. A takeout order or a table for four at a $85 average check is $340 — and a hungry caller will simply dial the next restaurant on the list. Do that 10 times a month and you've lost $3,500. Do it for a year and it's $42,000. Ashley answers every call, in a clear and friendly voice, so that number goes to zero.",
    bullets: [
      {
        title: "Never Lose Another $340 Guest.",
        description:
          "Ashley picks up 10 calls at once through the dinner rush. No busy signal, no hold music, no reason for a guest to order elsewhere.",
      },
      {
        title: "Get 30 Hours Back Every Month.",
        description: `That's how long your staff spends answering "are you open" and "how spicy is it." Ashley answers in 2 seconds so your team serves the dining room.`,
      },
      {
        title: "She Knows Every Dish, Every Spice Level, Every Allergy.",
        description:
          "Ashley explains the menu accurately every time and flags peanut, shellfish, and gluten questions without hesitating.",
      },
      {
        title: "8 Out Of 10 People Won't Leave a Voicemail.",
        description:
          "They hang up and order from the next place. Ashley answers at 10pm on a Tuesday exactly like she does at 7pm on a Saturday.",
      },
    ],
    ctaLabel: "Book a Demo",
  },
}

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
    src: "/hero-sports-bar.png",
    alt: "A blonde female sports-bar host in a black tee smiling while taking a phone call at a wooden host podium with a tablet, in front of exposed brick, warm string lights, TVs showing sports, and patrons at tables",
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

  // Hero copy follows the active carousel slide, falling back to fine dining.
  const copy = INDUSTRY_COPY[SLIDES[index].id] ?? INDUSTRY_COPY["fine-dining"]

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
                    <span>{copy.headlineWord}</span>
                    <span>Order.</span>
                  </span>
                </span>
              </span>
            </h2>

            {/* Supporting headline + math sub-lead */}
            <h3 className="mt-5 text-pretty text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {copy.statSubhead}
            </h3>
            <p className="mt-2 text-pretty text-xl font-semibold text-teal sm:text-2xl">{copy.mathLinkText}</p>

            {/* Supporting copy */}
            <div className="mt-4 space-y-3">
              <p className="text-pretty text-2xl font-medium leading-relaxed text-foreground">{copy.bodyCopy}</p>
            </div>

            {/* Benefit rows — each keeps the subtle proximity hover (lift + scale + brighten). */}
            <ul className="mt-5 grid gap-2.5">
              {copy.bullets.map((benefit) => (
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
                <span className="relative z-[1]">{copy.ctaLabel}</span>
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
