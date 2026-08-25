import { ArrowUpRight } from "lucide-react"
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-bright">
          Let&apos;s talk
        </p>
        <h2 className="mt-6 font-serif text-4xl font-light leading-tight tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
          Ready to give every caller your best?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Book a discovery call and we&apos;ll customize a virtual receptionist for your business,
          so no client slips through the cracks.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a discovery call — opens Calendly in a new tab"
            className="group inline-flex items-center gap-3 rounded-full bg-teal px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_40px_-6px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)]"
          >
            Book a Discovery Call
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
