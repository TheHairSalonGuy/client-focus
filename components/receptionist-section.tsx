import { Phone, Check } from "lucide-react"

type ReceptionistSectionProps = {
  id: string
  eyebrow: string
  name: string
  role: string
  description: string
  phoneDisplay: string
  phoneHref: string
  callLabel: string
  capabilities: string[]
  align?: "left" | "right"
}

export function ReceptionistSection({
  id,
  eyebrow,
  name,
  role,
  description,
  phoneDisplay,
  phoneHref,
  callLabel,
  capabilities,
  align = "left",
}: ReceptionistSectionProps) {
  return (
    <section id={id} className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-8 md:px-10">
        <div
          className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-20 ${
            align === "right" ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Left: identity + phone */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-bright">
              {eyebrow}
            </p>
            <h2 className="mt-5 font-serif text-5xl font-light leading-none tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {name}
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">{role}</p>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/90">
              {description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={phoneHref}
                className="group inline-flex items-center gap-4 text-5xl font-medium tracking-tight text-foreground transition-colors hover:text-teal-bright md:text-7xl"
              >
                <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-teal/15 text-teal-bright transition-colors group-hover:bg-teal/25 md:h-20 md:w-20">
                  <Phone className="h-8 w-8 md:h-10 md:w-10" />
                </span>
                {phoneDisplay}
              </a>
            </div>

            <a
              href={phoneHref}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-4 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:brightness-110 sm:hidden"
            >
              <Phone className="h-4 w-4" />
              {callLabel}
            </a>
          </div>

          {/* Right: capabilities */}
          <div className="rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-sm md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
              What {name} can do
            </p>
            <ul className="mt-6 space-y-4">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal/15 text-teal-bright">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-base leading-relaxed text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
