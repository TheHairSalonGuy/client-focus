import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ReceptionistSection } from "@/components/receptionist-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { IndustryDataSection } from "@/components/industry-data-section"
import { FounderSection } from "@/components/founder-section"
import { HowItWorks } from "@/components/how-it-works"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />

        <ReceptionistSection
          id="ashley"
          eyebrow="Ashley — For Restaurants"
          name="Ashley"
          role="Virtual Waitress for Restaurants"
          description="Experience Ashley, your restaurant's virtual waitress, by calling the number below. Place a take-out order the way a real customer would, then tell her you'd like to pay before you pick up—Ashley will text you a secure payment link on the spot. Click it, complete payment, and see for yourself how she captures the full order and gets it paid before it ever leaves the kitchen. She handles multiple callers at once so no order is ever lost to a busy signal, and we believe she can deliver that same experience for your restaurant."
          phoneDisplay="(626) 621-5577"
          phoneHref="tel:+16266215577"
          callLabel="Call Ashley"
          capabilities={[
            "Available 24/7—including after hours, weekends, and peak lunch/dinner rushes",
            "Answer multiple calls at the same time so customers never hit a busy signal and ALL orders are captured instantly",
            "Handle routine menu FAQs and take-out orders, saving your waitresses hours of phone duty and freeing them up to better service dining-in customers",
            "Reduce labor costs ($1600+ per month). When you switch to using Ashley you'll save thousands",
            "Deliver an organized order summary and text payment links so you get paid before the kitchen starts cooking, eliminating unpaid or wasted food",
          ]}
        />

        <IndustryDataSection />

        <HowItWorks />

        <TestimonialsSection />

        <FounderSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
