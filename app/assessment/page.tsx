import type { Metadata } from "next"
import { AssessmentFlow } from "@/components/assessment/assessment-flow"
import { BrandLockup } from "@/components/brand-lockup"

export const metadata: Metadata = {
  title: "Free Assessment — What Are Missed Customer Orders Costing Your Restaurant? | My Virtual Receptionist",
  description:
    "Answer 5 quick questions to see how much sales of your restaurant goes to your competitors and get your Virtual Receptionist Opportunity Score.",
}

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Distraction-free layout: no full site navigation during the assessment —
          just the clickable brand lockup (logo + name) that returns to the hero page. */}
      <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
        {/* Pulled ~1 inch farther left on wide screens (where the centered container
            leaves outer margin) so it sits near the viewport edge. */}
        <BrandLockup className="xl:-ml-10 2xl:-ml-24" />
      </div>

      <AssessmentFlow />
    </main>
  )
}
