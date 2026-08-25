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
          description="Call the number below and place a take-out order. Ask to pay before you pick up, and Ashley will text you a secure payment link to complete it right then."
          phoneDisplay="(626) 621-5577"
          phoneHref="tel:+16266215577"
          callLabel="Call Ashley"
          capabilities={[
            "Answer multiple calls at the same time so customers never hit a busy signal and ALL orders are captured instantly",
            "Handle routine menu FAQs and take-out orders, saving your waitresses hours of phone duty and freeing them up to better service dining-in customers",
            "Available 24/7—including after hours, weekends, and peak lunch/dinner rushes",
            "Increase average order value with consistent upsell suggestions—drinks, sides, and add-ons a rushed staff member often forgets to mention",
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
