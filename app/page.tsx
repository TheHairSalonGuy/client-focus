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
          description="Experience Ashley, your restaurant's virtual waitress, by calling the number below. Pretend you're a hungry customer calling during peak dinner rush—place a take-out order, ask about menu items, and interrupt her to test how naturally she responds. Ashley handles multiple callers simultaneously so you never lose an order to a busy signal, and we believe she can deliver the same exceptional experience for yours."
          phoneDisplay="(626) 888-5138"
          phoneHref="tel:+16268885138"
          callLabel="Call Ashley"
          capabilities={[
            "Available 24/7—including after hours, weekends, and peak lunch/dinner rushes",
            "Answer multiple calls at the same time so customers never hit a busy signal and ALL orders are captured instantly",
            "Handle routine menu FAQs and take-out orders, saving your waitresses hours of phone duty and freeing them up to better service dining-in customers",
            "Reduce labor costs ($1600+ per month). When you switch to using Ashley you'll save thousands",
            "Deliver an organized order summary and text payment links so you get paid before the kitchen starts cooking, eliminating unpaid or wasted food",
          ]}
        />

        <ReceptionistSection
          id="grace"
          eyebrow="Grace — For Law Firms"
          name="Grace"
          role="Virtual Receptionist for Law Firms"
          description="Experience Grace, your law firm's virtual receptionist, by calling the number below. Pretend you're a potential client—ask difficult questions, interrupt her, and request a follow-up email to see how naturally she responds. Grace supports some of the country's leading law firms, and we believe she can deliver the same exceptional experience for yours."
          phoneDisplay="(626) 774-8018"
          phoneHref="tel:+16267748018"
          callLabel="Call Grace"
          align="right"
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

        <FounderSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
