// Shared, single-source-of-truth card faces used by both the on-screen preview
// (app/business-card/page.tsx, rendered at max-w-2xl = 672px) and the fixed-size
// print routes (app/business-card/print/*, rendered at 672px trim width).
//
// PRINT SIZING NOTE:
//   The card trim renders at 672px = 3.5in, i.e. 192px per inch.
//   Therefore 1pt = 1/72in = 2.6667px. Font sizes are set in px via inline
//   styles so their PHYSICAL point size is exact and viewport-independent.
//     7pt = 18.67px | 8pt = 21.33px | 9pt = 24px | 10pt = 26.67px
//     11pt = 29.33px | 12pt = 32px | 16pt = 42.67px | 18pt = 48px
//   LeCards requires readable body text >= 7pt (8pt preferred), so all
//   supporting copy is >= 8pt and headings/phone numbers stay larger.

// Card-specific brand values.
// Dark navy field with teal brand accent and subtle metallic gold detailing.
export const TEAL = "#2bb3ad"
export const GOLD = "#c9a25a"
export const NAVY = "#0c1a2b"
export const NAVY_PANEL = "#12263d"
export const INK_LIGHT = "#eaf3f6"
export const INK_MUTED = "#9db4c4"

// Physical point sizes expressed in artboard px (192px/in => 1pt = 2.6667px).
const PT = (pt: number) => `${(pt * 192) / 72}px`

/** Thin metallic gold rule used as a subtle luxury divider. */
function GoldDivider({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-full ${className}`} style={{ backgroundColor: GOLD }} />
}

export function FrontCard() {
  return (
    <article
      aria-label="Business card front"
      className="relative flex aspect-[1.75/1] w-full flex-col justify-between overflow-hidden rounded-2xl px-6 py-4 ring-1 ring-white/10"
      style={{ backgroundColor: NAVY, color: INK_LIGHT }}
    >
      <div className="flex flex-1 items-stretch gap-4">
        {/* Left half: brand + identity (top-aligned so the name sits near the header) */}
        <div className="flex flex-1 flex-col justify-start">
          {/* Company brand — logo in front of the name */}
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mvr-logo.jpg"
              alt="My Virtual Receptionist logo"
              width={40}
              height={40}
              className="h-10 w-10 flex-none rounded-full object-cover ring-1 ring-white/15"
            />
            {/* Brand line: 8pt */}
            <p
              className="font-sans font-bold uppercase leading-tight tracking-[0.12em]"
              style={{ color: TEAL, fontSize: PT(8) }}
            >
              My Virtual Receptionist
            </p>
          </div>

          {/* Center identity — Joe Chia is the visual focal point (13pt heading) */}
          <div className="mt-1">
            <h1
              className="font-semibold leading-none tracking-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: PT(13) }}
            >
              Joe Chia
            </h1>
            {/* Client Success: 8pt */}
            <p
              className="mt-1.5 font-sans font-bold uppercase tracking-[0.18em]"
              style={{ color: GOLD, fontSize: PT(8) }}
            >
              Client Success
            </p>

            {/* Contact section: call -> visit -> email */}
            {/* Label: 8pt */}
            <p
              className="mt-1.5 font-sans font-semibold uppercase tracking-[0.1em]"
              style={{ color: INK_MUTED, fontSize: PT(8) }}
            >
              Experience my virtual receptionist
            </p>
            {/* Phone: 11pt (larger than supporting text) */}
            <p className="mt-1 font-sans font-bold tracking-wide" style={{ color: TEAL, fontSize: PT(11) }}>
              (213) 277-7729
            </p>
            {/* Website: 8pt (kept on one line) */}
            <p className="mt-1 whitespace-nowrap font-sans font-semibold" style={{ color: TEAL, fontSize: PT(8) }}>
              www.nevermiss-client.com
            </p>
            {/* Email: 8pt */}
            <p className="mt-1 font-sans font-medium tracking-wide" style={{ color: INK_MUTED, fontSize: PT(8) }}>
              joe@maxcovered.com
            </p>
          </div>
        </div>

        {/* Right half: QR centered within its half */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div
            className="flex items-center justify-center rounded-md bg-white p-1.5"
            style={{ height: 150, width: 150, border: `1px solid ${GOLD}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mvr-qr-code.png"
              alt="QR code to experience My Virtual Receptionist"
              width={150}
              height={150}
              className="h-full w-full object-contain"
            />
          </div>
          {/* QR caption: 8pt */}
          <span
            className="text-center font-sans font-semibold leading-tight tracking-wide"
            style={{ color: INK_MUTED, maxWidth: 168, fontSize: PT(8) }}
          >
            Scan &amp; experience it
          </span>
        </div>
      </div>

      {/* Tagline centered across the full width of the card (8pt) */}
      <p
        className="mt-1 text-center font-sans font-medium leading-snug tracking-wide"
        style={{ color: INK_MUTED, fontSize: PT(8) }}
      >
        Every call answered. Every opportunity captured.
      </p>
    </article>
  )
}

function ReceptionistBlock({
  name,
  role,
  phone,
}: {
  name: string
  role: string
  phone: string
}) {
  return (
    <div className="flex-1">
      {/* Name: 10pt heading */}
      <h3
        className="font-semibold leading-none tracking-tight"
        style={{ color: INK_LIGHT, fontFamily: "var(--font-playfair)", fontSize: PT(10) }}
      >
        {name}
      </h3>
      {/* Role: 7pt, single line so both phones align */}
      <p
        className="mt-1 whitespace-nowrap font-sans font-semibold uppercase tracking-[0.08em]"
        style={{ color: TEAL, fontSize: PT(7) }}
      >
        {role}
      </p>
      {/* Phone: 10pt (larger than supporting text) */}
      <p className="mt-1 font-sans font-semibold tracking-wide" style={{ color: INK_LIGHT, fontSize: PT(10) }}>
        {phone}
      </p>
    </div>
  )
}

export function BackCard() {
  return (
    <article
      aria-label="Business card back"
      className="relative flex aspect-[1.75/1] w-full flex-col justify-between overflow-hidden rounded-2xl px-6 py-4 ring-1 ring-white/10"
      style={{ backgroundColor: NAVY, color: INK_LIGHT }}
    >
      <div>
        {/* Heading: 11pt */}
        <h2
          className="font-semibold leading-tight tracking-tight text-balance"
          style={{ fontFamily: "var(--font-playfair)", fontSize: PT(11) }}
        >
          Never Miss Another Client Opportunity.
        </h2>
        {/* Supporting sentence: 8pt, full width to minimize line count */}
        <p
          className="mt-1.5 font-sans font-medium leading-snug tracking-wide"
          style={{ color: INK_MUTED, fontSize: PT(8) }}
        >
          Call either number and experience a receptionist that answers every call, qualifies leads, and books
          appointments.
        </p>
      </div>

      <div className="flex items-start justify-between gap-5">
        <ReceptionistBlock name="Grace" role="Built for Law Firms" phone="(626) 774-8018" />
        <ReceptionistBlock name="Pearl" role="Built for Dental Practices" phone="(626) 657-2129" />
      </div>

      <div>
        <div className="mx-auto w-96">
          <GoldDivider />
        </div>
        {/* Four benefit labels: 7pt, fixed 2-column grid so they never overflow */}
        <ul className="mx-auto mt-2 grid w-fit grid-cols-2 gap-x-6 gap-y-1">
          {["Never misses calls", "Books Appointments", "Delivers Intake Summaries", "Sends Reminders"].map(
            (benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-1.5 whitespace-nowrap font-sans font-bold uppercase leading-tight tracking-[0.08em]"
                style={{ color: TEAL, fontSize: PT(7) }}
              >
                <span aria-hidden="true" className="h-1 w-1 flex-none rounded-full" style={{ backgroundColor: TEAL }} />
                {benefit}
              </li>
            ),
          )}
        </ul>
      </div>
    </article>
  )
}
