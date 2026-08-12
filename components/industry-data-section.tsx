"use client"

import { useState } from "react"
import { Check, ArrowRight, Scale, Stethoscope, UtensilsCrossed } from "lucide-react"

type Segment = "restaurant" | "law" | "dental"

type StatCard = {
  stat: string
  title: string
  desc: string
  badge: string
  linkLabel: string
  href: string
}

const DATA: Record<Segment, StatCard[]> = {
  restaurant: [
    {
      stat: "67%–70%",
      title: "Unreachable or During Rushes",
      desc: "Over half of customer food inquiries arrive during peak lunch and dinner rushes or go unanswered because staff are busy servicing customers in the dining room.",
      badge: "500+ Secret Shoppers",
      linkLabel: "Verify via Industry Studies",
      href: "https://www.nrn.com/",
    },
    {
      stat: "80%",
      title: "Hang Up on Voicemails",
      desc: "80% of hungry customers who hit an automated voicemail hang up without leaving a message and immediately dial the next restaurant.",
      badge: "Restaurant Intake Audit",
      linkLabel: "Verify via Hospitality Benchmark",
      href: "https://www.nrn.com/",
    },
    {
      stat: "$3,000 – $15,000+",
      title: "Recovered Monthly Take-Out Revenue",
      desc: "The total amount a restaurant earns back when 100% of take-out calls are answered and no orders are lost to busy signals or voicemails.",
      badge: "Revenue Recovery",
      linkLabel: "Verify via Voice Automation Data",
      href: "https://www.nrn.com/",
    },
  ],
  law: [
    {
      stat: "67%–70%",
      title: "Unreachable or After-Hours",
      desc: "Over half of prospective client inquiries arrive outside standard 9-to-5 working hours or go unanswered during daytime rushes.",
      badge: "500+ Secret Shoppers",
      linkLabel: "Verify via Clio Legal Trends Report",
      href: "https://www.clio.com/resources/legal-trends/",
    },
    {
      stat: "80%",
      title: "Hang Up on Voicemails",
      desc: "80% of callers who hit an automated voicemail hang up without leaving a message and immediately dial a competing firm.",
      badge: "Legal Intake Audit",
      linkLabel: "Verify via Ruby Answer360",
      href: "https://www.ruby.com/resources/",
    },
    {
      stat: "$3,000 – $15,000+",
      title: "Lost Value per Missed Lead",
      desc: "A single missed phone call after hours represents thousands in lost case retainer revenue.",
      badge: "Retainer Benchmarks",
      linkLabel: "Verify via Legal Marketing Assoc.",
      href: "https://www.legalmarketing.org/",
    },
  ],
  dental: [
    {
      stat: "45%",
      title: "Calls Arrive After Hours",
      desc: "Nearly half of routine cleaning bookings and emergency inquiries happen early morning, evening, or on weekends.",
      badge: "Nationwide Dental Study",
      linkLabel: "Verify via PatientPop Report",
      href: "https://www.patientpop.com/resources/reports/",
    },
    {
      stat: "32%",
      title: "Missed During Day Rushes",
      desc: "1 in 3 daytime calls go unanswered because front-desk staff are checking in patients or occupied on line 1.",
      badge: "Call Analytics Data",
      linkLabel: "Verify via Dental Intelligence",
      href: "https://www.dentalintel.com/",
    },
    {
      stat: "$10,000+",
      title: "Lifetime Value per Patient",
      desc: "Losing a new patient lead to a generic voicemail costs thousands over their long-term family care lifecycle.",
      badge: "ADA Economic Study",
      linkLabel: "Verify via ADA Policy Institute",
      href: "https://www.ada.org/resources/research/health-policy-institute",
    },
  ],
}

const SEGMENTS: { id: Segment; label: string; Icon: typeof Scale }[] = [
  { id: "restaurant", label: "Restaurants", Icon: UtensilsCrossed },
  { id: "law", label: "Law Firms", Icon: Scale },
  { id: "dental", label: "Dental Practices", Icon: Stethoscope },
]

export function IndustryDataSection() {
  const [segment, setSegment] = useState<Segment>("restaurant")
  const cards = DATA[segment]

  return (
    <section
      id="industry-data"
      className="scroll-mt-24 bg-slate-950 py-20 text-slate-100 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1600px] px-8 sm:px-10">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#FACC15]">
            Independently Verified Research
          </span>
          <h2 className="mt-6 font-serif text-5xl font-normal leading-tight tracking-tight text-white sm:text-6xl">
            The Cold, Hard Numbers
            <br />
            Behind Missed Inbound Calls
          </h2>
          <p className="mt-6 text-pretty text-xl leading-relaxed text-slate-400">
            <span className="relative mr-1 inline-block font-serif text-2xl italic text-slate-200">
              Verifiable
              <svg
                aria-hidden="true"
                viewBox="0 0 200 34"
                preserveAspectRatio="none"
                className="absolute -bottom-4 left-0 h-6 w-[110%] overflow-visible"
              >
                <path
                  d="M4 20 C 40 8, 95 4, 140 12 C 168 17, 186 24, 197 28 C 188 19, 168 9, 138 4 C 92 -3, 38 1, 6 14 Z"
                  fill="#FACC15"
                />
              </svg>
            </span>
            research from reputable industry firms proves that standard voicemails and delayed responses directly cause
            revenue leaks.
          </p>
        </div>

        {/* Segmented toggle */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Choose an industry"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 p-1.5"
          >
            {SEGMENTS.map(({ id, label, Icon }) => {
              const active = segment === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSegment(id)}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:text-lg ${
                    active
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3-card grid — keyed on segment so the content transitions on switch */}
        <div
          key={segment}
          className="mt-12 grid gap-8 md:grid-cols-3 [animation:industry-fade-in_0.4s_ease-out]"
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/40 p-10 transition-colors duration-300 hover:border-cyan-400/40"
            >
              <span className="inline-flex w-fit items-center rounded-md bg-slate-800 px-3.5 py-1.5 text-sm font-medium uppercase tracking-wide text-cyan-300">
                {card.badge}
              </span>

              <p className="mt-6 font-serif text-6xl font-normal leading-none text-white sm:text-7xl">
                {card.stat}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-100">{card.title}</h3>
              <p className="mt-4 flex-1 text-pretty text-base leading-relaxed text-slate-400">{card.desc}</p>

              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 text-base font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{card.linkLabel}</span>
                <ArrowRight className="h-5 w-5 flex-none transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
