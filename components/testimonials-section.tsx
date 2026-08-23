"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Attribution controls the small card label and is the single switch to flip
 * these illustrative placeholders to verified customer testimonials later.
 * When "verified" is used, supply a real approved quote plus `attributionName`
 * (an authorized name/company) and permission to use the image/identity.
 */
type Attribution = "illustrative" | "verified"
type Industry = "Restaurant" | "Law Firm" | "Dental Practice"

type Scenario = {
  quote: string
  /** Person's name, shown directly beneath the portrait. */
  name: string
  role: string
  industry: Industry
  image: string
  alt: string
  attribution: Attribution
  /** Only shown for verified testimonials (e.g. "Jane Doe, Doe & Partners"). */
  attributionName?: string
}

const SCENARIOS: Scenario[] = [
  {
    quote:
      "Since letting Ashley handle our phone lines, our lunch take-out orders have surged. We had no idea how many paying customers we were losing to busy signals until Ashley captured every single call—it's a game-changer for any restaurant looking to boost daily revenue without adding extra staff.",
    name: "P' Joe",
    role: 'Owner/Chef\n"Modern Thai Cuisine"',
    industry: "Restaurant",
    image: "/images/testimonials/chef-joe.png",
    alt: "Portrait of a restaurant owner and chef",
    attribution: "illustrative",
  },
  {
    quote:
      "Our front desk team used to drown in phone traffic trying to answer menu questions and take messages during dinner service. Ashley now captures all caller inquiries and manages peak-hour volume smoothly. Our floor staff can keep 100% of their focus on the guests sitting right in front of them.",
    name: "Danielle Sterling",
    role: "General Manager, Mastro Seafood Grill",
    industry: "Restaurant",
    image: "/images/testimonials/photo-1.png",
    alt: "Portrait of a managing attorney",
    attribution: "illustrative",
  },
  {
    quote:
      "People looking for a table on a Saturday night hate voicemail. Ashley gives our restaurant immediate 24/7 responsiveness, handling schedule inquiries and guest FAQs instantly. It’s like having a dedicated receptionist who never takes a break and keeps our dining room fully booked.",
    name: "Antonia Rossi",
    role: "Managing Partner, Rossi's Italian Bistro",
    industry: "Restaurant",
    image: "/images/testimonials/photo-2.png",
    alt: "Portrait of a dental office manager",
    attribution: "illustrative",
  },
  {
    quote:
      "During our Friday night game rushes, the phone would ring constantly while our bartenders were slammed making drinks. Ashley picks up every call instantly on the first ring, answers table questions, and handles reservations without missing a beat. Our weekend sales jumped significantly because callers aren't hitting a busy signal anymore.",
    name: "Maria Vance",
    role: "Owner, The Foundry Sports Bar & Grill",
    industry: "Restaurant",
    image: "/images/testimonials/photo-3.png",
    alt: "Portrait of a sports bar and grill owner",
    attribution: "illustrative",
  },
  {
    quote:
      "Our wholesale clients used to struggle to reach us when our office team was tied up on other lines. Ashley manages high call volumes effortlessly, routes urgent orders to the right department, and logs every caller's details accurately. It completely eliminated our missed order opportunities.",
    name: "Michelle Chen",
    role: "Director of Operations, Michael & Son Food Distributor",
    industry: "Restaurant",
    image: "/images/testimonials/photo-4.png",
    alt: "Portrait of a dental practice owner",
    attribution: "illustrative",
  },
  {
    quote:
      "As an owner-chef, I can't be glued to the phone while running the kitchen line. Ashley handles our phone traffic seamlessly, answering questions about our daily specials and hours. It has captured missed sales we used to lose to nearby competitors simply because our phones went to voicemail.",
    name: "Carla Mendez",
    role: "Owner & Executive Chef, Azul Modern Mexican",
    industry: "Restaurant",
    image: "/images/testimonials/photo-5.png",
    alt: "Portrait of a legal intake manager",
    attribution: "illustrative",
  },
  {
    quote:
      "Ashley answers approved menu and seating questions with total accuracy while recording the exact reason for the call. That drastically reduces repetitive interruptions for our floor staff during the dinner rush, saving us hours daily and letting us focus entirely on guest satisfaction.",
    name: "Sarah Jenkins",
    role: "Front-of-House Lead, Harborview Steakhouse & Bar",
    industry: "Restaurant",
    image: "/images/testimonials/photo-6.png",
    alt: "Portrait of a dental practice administrator",
    attribution: "illustrative",
  },
  {
    quote:
      "During our busiest lunch hours, Ashley provides bulletproof overflow coverage and logs what each caller needs. Our team can return inquiries in an organized way instead of sorting through chaotic, incomplete voicemail messages. It's transformed our daily operations.",
    name: "Danielle Thorne",
    role: "Owner, Thorne's Downtown Tap House",
    industry: "Restaurant",
    image: "/images/testimonials/photo-7.png",
    alt: "Portrait of a founding attorney",
    attribution: "illustrative",
  },
  {
    quote:
      "Pearl can answer approved questions about our hours, location, and services while collecting the reason for the call. That reduces repetitive interruptions for our front-desk team. We saved hours daily and use those hours on improving client services.",
    name: "Diana Montessori",
    role: "Front Office Coordinator",
    industry: "Dental Practice",
    image: "/images/testimonials/photo-8.png",
    alt: "Portrait of a dental front office coordinator",
    attribution: "illustrative",
  },
  {
    quote:
      "When customers called during peak lunch hours, they used to hit busy signals. Since hiring Ashley Virtual Waitress, our take-out orders have doubled because she handles multiple callers simultaneously. Best decision we've made for the restaurant!",
    name: "Susan Cho",
    role: "Restaurant Owner",
    industry: "Law Firm",
    image: "/images/testimonials/photo-9.jpg",
    alt: "Portrait of a legal office manager",
    attribution: "illustrative",
  },
  {
    quote:
      "During our busiest hours, Pearl provides overflow coverage and records what each caller needs. Our staff can return calls in an organized way instead of sorting through incomplete voicemail messages.",
    name: "Bernadette Marks",
    role: "Dental Operations Manager",
    industry: "Dental Practice",
    image: "/images/testimonials/photo-10.png",
    alt: "Portrait of a dental operations manager",
    attribution: "illustrative",
  },
]

const AUTOPLAY_MS = 6500

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

function usePerView() {
  const [perView, setPerView] = useState(2)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      // Landscape (wide) cards: 1 on mobile, 2 side-by-side from md up.
      setPerView(w < 768 ? 1 : 2)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return perView
}

export function TestimonialsSection() {
  const perView = usePerView()
  const reducedMotion = useReducedMotion()
  const total = SCENARIOS.length
  const maxIndex = Math.max(0, total - perView)

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Keep the active index valid when the visible count changes on resize.
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, total - perView)))
  }, [perView, total])

  const goTo = useCallback(
    (next: number) => {
      setIndex(() => {
        if (next < 0) return maxIndex
        if (next > maxIndex) return 0
        return next
      })
    },
    [maxIndex],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Slow autoplay; paused on hover/focus and disabled for reduced motion.
  useEffect(() => {
    if (reducedMotion || paused || maxIndex === 0) return
    const id = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion, paused, maxIndex])

  // Touch / pointer swipe support.
  const startX = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) next()
      else prev()
    }
    startX.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    }
  }

  // The centered visible card gets the highlight treatment.
  const highlightedIndex = index + Math.floor(perView / 2)
  const pageCount = maxIndex + 1

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1380px] px-8 md:px-10">
        <div className="max-w-3xl">
          <h2
            id="testimonials-heading"
            className="font-serif text-4xl font-light leading-tight tracking-tight text-foreground text-balance sm:text-5xl"
          >
            Testimonials
          </h2>
          <p className="mt-3 text-[10px] italic leading-relaxed text-muted-foreground">
            Illustrative examples reflecting the experiences and outcomes commonly reported by our clients.
          </p>
        </div>

        {/* Carousel */}
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Illustrative call-coverage scenarios"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="group relative mt-14 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          {/* Cards track with edge arrows overlaid at the vertical middle */}
          <div className="relative">
            <div className="overflow-hidden" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              <ul
                className="flex items-stretch transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
              >
                {SCENARIOS.map((s, i) => (
                  <li
                    key={`${s.role}-${i}`}
                    className="w-full shrink-0 px-1.5 md:w-1/2"
                    aria-hidden={i < index || i >= index + perView}
                  >
                    <TestimonialCard scenario={s} highlighted={i === highlightedIndex} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Far-left arrow, vertically centered on the cards */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous scenarios"
              className="absolute left-0 top-1/2 z-10 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Far-right arrow, vertically centered on the cards */}
            <button
              type="button"
              onClick={next}
              aria-label="Next scenarios"
              className="absolute right-0 top-1/2 z-10 inline-flex h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Pagination dots, centered on their own row */}
          <div
            className="mt-10 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Choose scenario group"
          >
            {Array.from({ length: pageCount }).map((_, i) => {
              const active = i === index
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to scenario group ${i + 1} of ${pageCount}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active ? "w-7 bg-teal" : "w-2.5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ scenario, highlighted }: { scenario: Scenario; highlighted: boolean }) {
  const cardClass = highlighted
    ? "bg-navy-deep text-primary-foreground shadow-xl ring-1 ring-navy-deep/20"
    : "bg-card text-card-foreground shadow-sm ring-1 ring-border"

  const accentBarByIndustry: Record<Industry, string> = {
    Restaurant: "bg-[#e07a3f]",
    "Law Firm": "bg-[#e6b800]",
    "Dental Practice": "bg-teal",
  }
  const accentBar = accentBarByIndustry[scenario.industry]

  return (
    <article
      className={`relative flex h-full min-h-[22rem] flex-col gap-6 overflow-hidden rounded-[1.75rem] p-8 transition-colors duration-300 sm:flex-row sm:items-stretch sm:gap-8 ${cardClass}`}
    >
      {/* Slim industry accent bar along the left edge (landscape orientation) */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${accentBar}`} />

      {/* Left column: portrait with name and title directly beneath it */}
      <div
        className={`flex flex-none flex-col gap-3 sm:w-52 sm:border-r sm:pr-8 ${
          highlighted ? "sm:border-primary-foreground/15" : "sm:border-border"
        }`}
      >
        {/* Fixed-size circular frame prevents layout shift while the image loads */}
        <span className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-full bg-secondary ring-4 ring-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scenario.image || "/placeholder.svg"}
            alt={scenario.alt}
            width={96}
            height={96}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </span>

        <div>
          {/* Name sits directly beneath the portrait */}
          <p className={`text-base font-semibold ${highlighted ? "text-primary-foreground" : "text-foreground"}`}>
            {scenario.name}
          </p>
          {/* Title moved down one row, below the name */}
          <p
            className={`mt-0.5 whitespace-pre-line text-sm ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            {scenario.role}
          </p>
        </div>
      </div>

      {/* Right column: the quote fills the wide side of the card */}
      <blockquote
        className={`flex flex-1 items-center text-pretty text-lg leading-relaxed ${
          highlighted ? "text-primary-foreground/90" : "text-foreground/90"
        }`}
      >
        {`\u201C${scenario.quote}\u201D`}
      </blockquote>
    </article>
  )
}
