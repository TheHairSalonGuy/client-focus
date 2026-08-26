import { CALENDLY_URL } from "@/lib/site-config"

export function CtaSection() {
  return (
    <section id="contact" className="relative border-t border-border py-28 md:py-40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, color-mix(in oklch, var(--teal) 22%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="mt-6 font-serif text-4xl font-light leading-tight tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
          Custom pricing built around your business.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Every restaurant and food service business runs differently, so we build a virtual
          receptionist and a plan to match your business. Book a demo and we&apos;ll walk through
          your call volume, workflows, and a quote tailored to you.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a demo — opens Calendly in a new tab"
            className="inline-flex items-center justify-center rounded-full bg-[var(--yellow-cta)] px-14 py-4 text-base font-semibold text-[var(--yellow-cta-ink)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_0_28px_-4px_color-mix(in_oklch,var(--yellow-cta)_80%,transparent)]"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  )
}
