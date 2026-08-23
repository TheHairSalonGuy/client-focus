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
                  I built <strong className="font-semibold text-foreground">My Virtual Receptionist</strong>{" "}after
                  seeing how many restaurants lose sales simply because their floor staff or operators are overwhelmed.
                  Whether it&apos;s taking multiple lunch or dinner orders at the same time, managing reservation books,
                  answering repetitive inquiries, or handling takeout requests, busy teams often struggle to keep up
                  with incoming calls—especially during peak hours, lunch rushes, and after hours.
                </p>
                <p>
                  When a hungry diner or prospective customer reaches a busy tone or a voicemail box, they don&apos;t
                  wait—they immediately go back to{" "}
                  <strong className="font-semibold text-foreground">Google or Yelp</strong> and call the next competitor
                  on the list.
                </p>
                <p>
                  My background spans operations management, software engineering, and restaurant ownership as a trained
                  Owner/Chef. Those experiences taught me a fundamental truth:{" "}
                  <strong className="font-semibold text-foreground">
                    reliable intake systems, instant communication, and efficient follow-up workflows are essential to
                    converting hungry callers into paying customers and keeping them coming back.
                  </strong>
                </p>
                <p>
                  <strong className="font-semibold text-foreground">My Virtual Receptionist</strong> was created to
                  bridge this gap specifically for restaurant owners and operators. We ensure every call is handled
                  seamlessly without adding expensive administrative overhead.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-navy-deep">Why Restaurants Trust Us</h3>
              <div className="mt-4 space-y-6 text-lg leading-relaxed text-foreground/80">
                <p>
                  Unlike off-the-shelf, generic software, I am personally involved in building, customizing, and
                  continually optimizing our conversational voice models for every restaurant we serve. We break down
                  our service into two fundamental pillars engineered to transform your operations:
                </p>

                <div>
                  <h4 className="text-xl font-semibold text-navy-deep">Pillar 1: An Unbreakable 24/7 Safety Net</h4>
                  <p className="mt-2">
                    <strong className="font-semibold text-foreground">Never miss a hungry caller again.</strong> Our
                    system picks up every inbound call instantly on Ring 1—24 hours a day, 7 days a week, 365 days a
                    year. It answers customer FAQs, takes accurate food and table orders, and captures hot sales long
                    before they hit voicemail or send diners to a competitor.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-navy-deep">Pillar 2: Total Operational Efficiency</h4>
                  <p className="mt-2">
                    We eliminate floor distraction by automating your most repetitive front-of-house tasks. From
                    handling multiple lunch orders at once and managing booking schedules to pulling actionable
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
                  When you partner with us, your restaurant operations become predictable, efficient, and unstoppable.
                </p>
                <p className="mt-3 font-medium text-foreground/90">
                  By deploying a bulletproof virtual receptionist to handle everyday phone traffic, we help you capture
                  more sales, increase table turns, and eliminate staff burnout. Your staff spends less time putting out
                  fires on the phone and more time focused on high-value, guest-facing service—boosting morale across
                  your entire floor while ensuring you never miss a single customer.
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
