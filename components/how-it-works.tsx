const steps = [
  {
    title: "Call Grace or Pearl",
    body: "Dial the number and hear the experience for yourself, no setup required.",
  },
  {
    title: "Experience a live virtual receptionist",
    body: "Feel how a caller is greeted, guided, and cared for from the first hello.",
  },
  {
    title: "Book a Discovery Call",
    body: "Talk through your business, your callers, and what a great call looks like.",
  },
  {
    title: "We customize the system for your business",
    body: "We tailor the receptionist to your practice, your intake, and your follow-up.",
  },
  {
    title: "Start capturing calls your team might otherwise miss",
    body: "Every caller gets a professional experience, even when your team can't pick up.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-8 md:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-bright">
            How It Works
          </p>
          <h2 className="mt-5 font-serif text-4xl font-light leading-tight tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
            Five simple steps to never miss a caller.
          </h2>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="group flex flex-col bg-card p-8 transition-colors duration-300 hover:bg-secondary"
            >
              <span className="font-serif text-5xl font-light text-teal-bright/80 transition-colors group-hover:text-teal-bright">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-lg font-semibold leading-snug text-foreground text-balance">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
