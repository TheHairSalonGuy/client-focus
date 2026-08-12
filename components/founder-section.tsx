import Image from "next/image"

export function FounderSection() {
  return (
    <section id="founder" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-8 md:px-10">
        {/* Card container */}
        <div className="relative rounded-3xl border border-border bg-card p-8 shadow-xl shadow-navy/5 sm:p-12">
          {/* Header */}
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-navy-deep text-balance sm:text-5xl">
            Meet the Founder
          </h2>

          {/* Founder identity */}
          <div className="mt-8 flex items-center gap-5">
            <div className="relative h-[100px] w-[100px] flex-none overflow-hidden rounded-full ring-2 ring-teal/30 sm:h-[120px] sm:w-[120px]">
              <Image
                src="/joe-suit-headshot.jpg"
                alt="Portrait of Joe Chia, Founder of My Virtual Receptionist"
                fill
                sizes="120px"
                quality={95}
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-deep">Joe Chia</p>
              <p className="mt-1 text-base font-medium text-teal-bright">
                Founder, Operator &amp; Lead Developer
              </p>
            </div>
          </div>

          {/* Body content */}
          <div className="mt-10 space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-navy-deep">
                Why I Built My Virtual Receptionist
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/80">
                <p>
                  I built <strong className="font-semibold text-foreground">My Virtual Receptionist</strong>{" "}
                  after seeing how many businesses lose revenue simply because their front-desk staff or admin teams
                  are
                  overwhelmed. Whether it&apos;s answering repetitive inquiries, taking food orders, managing
                  appointment books, or screening clients, busy teams often struggle to keep up with incoming
                  calls—especially during peak hours, lunch breaks, and after hours.
                </p>
                <p>
                  When a prospective client reaches a busy tone or a voicemail box, they don&apos;t wait—they
                  immediately go back to <strong className="font-semibold text-foreground">Google or Yelp</strong> and
                  call the next competitor on the list.
                </p>
                <p>
                  My background spans operations management, financial services, software engineering, and restaurant
                  ownership. Those experiences taught me a fundamental truth:{" "}
                  <strong className="font-semibold text-foreground">
                    reliable intake systems, instant communication, and efficient follow-up workflows are essential to
                    converting prospects into paying clients and keeping them long-term.
                  </strong>
                </p>
                <p>
                  <strong className="font-semibold text-foreground">My Virtual Receptionist</strong> was created to
                  bridge this gap for high-touch businesses—whether you run a restaurant, a law firm, dental practice,
                  or accounting firm. We ensure every inquiry is handled seamlessly without adding
                  expensive administrative overhead.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-navy-deep">Why Businesses Trust Us</h3>
              <div className="mt-4 space-y-6 text-lg leading-relaxed text-foreground/80">
                <p>
                  Unlike off-the-shelf, generic software, I am personally involved in building, customizing, and
                  continually optimizing our conversational voice models for every business we serve. We break down
                  our service into two fundamental pillars engineered to transform your operations:
                </p>

                <div>
                  <h4 className="text-xl font-semibold text-navy-deep">Pillar 1: An Unbreakable 24/7 Safety Net</h4>
                  <p className="mt-2">
                    <strong className="font-semibold text-foreground">Never miss a client again.</strong> Our system
                    picks up every inbound call instantly on Ring 1—24 hours a day, 7 days a week, 365 days a year. It
                    answers client FAQs, conducts customized intake questionnaires, and captures hot leads long before
                    they hit voicemail or call your competitor.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-navy-deep">Pillar 2: Total Operational Efficiency</h4>
                  <p className="mt-2">
                    We eliminate front-desk drag by automating your most repetitive administrative tasks. From taking
                    multiple lunch orders at the same time and automating appointment reminders to pulling actionable
                    post-call summaries, we turn manual busywork into a seamless background machine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Commitment callout */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-teal/20 bg-teal/10">
            <div className="flex gap-4 border-l-4 border-teal p-6 sm:gap-5 sm:p-7">
              <div className="text-base leading-relaxed text-navy-deep">
                <p className="text-lg font-bold text-navy-deep">Our Core Commitment</p>
                <p className="mt-2 font-medium text-foreground/90">
                  When you partner with us, your business becomes predictable, efficient, and unstoppable.
                </p>
                <p className="mt-3 font-medium text-foreground/90">
                  By deploying a bulletproof virtual receptionist to automate everyday admin tasks, we help you capture
                  more sales, leads, revenue and eliminate staff burnout. Your staff spends less
                  time putting out fires and more time focused on high-value, client-facing work—boosting morale across
                  your entire team while ensuring you never miss a client.
                </p>
              </div>
            </div>
          </div>

          {/* Small accent headshot offset outside the bottom-right corner (25% larger) */}
          <div className="absolute -bottom-6 -right-4 h-[100px] w-[100px] overflow-hidden rounded-full border-4 border-background bg-card shadow-lg sm:-right-6 sm:h-[120px] sm:w-[120px]">
            <Image
              src="/joe-in-japan.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
