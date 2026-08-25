import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ReceptionistSection } from "@/components/receptionist-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { IndustryDataSection } from "@/components/industry-data-section"
import { FounderSection } from "@/components/founder-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />

        <ReceptionistSection
          id="grace"
          eyebrow="Grace — For Law Firms"
          name="Grace"
          role="Virtual Receptionist for Law Firms"
          description="Experience Grace, your law firm's virtual receptionist, by calling the number below. Pretend you're a potential client—ask difficult questions, interrupt her, and request a follow-up email to see how naturally she responds. Grace supports some of the country's leading law firms, and we believe she can deliver the same exceptional experience for yours."
          phoneDisplay="(626) 774-8018"
          phoneHref="tel:+16267748018"
          callLabel="Call Grace"
          capabilities={[
            "Available 24/7—including after hours, weekends, and lunch breaks",
            "Answer multiple calls at the same time so potential clients receive an immediate response",
            "Handle transferred intake calls and gather the information needed to evaluate a potential case",
            "Capture the caller's contact information, reason for calling, and the big-picture details of their situation",
            "Deliver an organized call summary so you or your staff can follow up with more detailed questions",
          ]}
        />

        <ReceptionistSection
          id="pearl"
          eyebrow="Pearl — For Dental Practices"
          name="Pearl"
          role="Virtual Receptionist for Dental Practices"
          description="Experience Pearl, your dental practice's virtual receptionist, by calling the number below. Pretend you're a patient—provide the reason for your call, ask her challenging questions and interrupt her. Pearl supports some of the country's leading dental practices, and we believe she can deliver the same exceptional experience for yours."
          phoneDisplay="(626) 657-2129"
          phoneHref="tel:+16266572129"
          callLabel="Call Pearl"
          align="right"
          capabilities={[
            "Available 24/7—including after hours, weekends, and lunch breaks",
            "Answer multiple calls at the same time so current and prospective patients receive an immediate response",
            "Handle transferred calls about treatments and gather the reason for each patient's call",
            "Capture patient contact details, dental concerns, and basic insurance information",
            "Deliver an organized call summary so you or your staff can follow up with more detailed questions",
          ]}
        />

        <IndustryDataSection />

        <HowItWorks />

        <TestimonialsSection />

        <PricingSection />
        <FounderSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
