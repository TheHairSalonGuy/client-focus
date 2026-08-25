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
          eyebrow="Ashley — For Restaurants and Food Service Businesses"
          name="Ashley"
          role="Virtual Receptionist for Restaurants and Food Service Businesses"
          description="Call the number below and place a take-out order. Ask to pay before you pick up, and Ashley will text you a secure payment link to complete it right then."
          phoneDisplay="(626) 621-5577"
          phoneHref="tel:+16266215577"
          callLabel="Call Ashley"
          capabilities={[
            "Handles multiple calls at once, so during your busiest rush every caller gets picked up instantly instead of hitting a busy signal and calling your competitor down the street",
            "Answers repetitive menu questions and takes full take-out orders on her own, giving your waitstaff hours back each week to focus on the tables actually in front of them",
            "Never clocks out—covers nights, weekends, and holidays so you stop losing after-hours calls to voicemail and to whichever competitor picks up first",
            "Suggests an add-on or upgrade on every single call, the same way your best server would, turning small orders into bigger tickets automatically",
            "Sends a clean order recap and a secure payment link so you're paid in full before the kitchen fires a single order, cutting out no-shows and wasted food",
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
