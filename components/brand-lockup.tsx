import Image from "next/image"
import Link from "next/link"

/**
 * Shared branding lockup: transparent logo + wordmark.
 * "MY" is navy, "VIRTUAL RECEPTIONIST" is warm gold, and a subtle white reflection
 * sweeps across the glyphs via the .brand-glint overlay. Always links to the home page.
 *
 * Used in the site header and on the distraction-free assessment page (top-left).
 * `className` lets callers adjust outer spacing (e.g. the header's negative margins).
 */
export function BrandLockup({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="My Virtual Receptionist — home"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center sm:h-11 sm:w-11">
        <Image
          src="/my-virtual-receptionist-icon.png"
          alt="My Virtual Receptionist logo — a customer-service headset with a sound-wave motif"
          width={452}
          height={452}
          priority
          sizes="44px"
          className="h-full w-full object-contain"
        />
      </span>
      <span className="relative font-serif text-lg font-normal uppercase leading-none tracking-tight sm:text-xl">
        <span className="text-navy-deep">My</span>{" "}
        <span className="text-gold">Virtual Receptionist</span>
        <span
          aria-hidden="true"
          className="brand-glint pointer-events-none absolute inset-0 select-none"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 44%, rgba(255,255,255,0.9) 50%, transparent 56%)",
            backgroundSize: "220% 100%",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          <span>My</span> <span>Virtual Receptionist</span>
        </span>
      </span>
    </Link>
  )
}
