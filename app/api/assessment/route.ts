import { type NextRequest, NextResponse } from "next/server"
import { calculateMetrics, calculateScore, getCategory, type Answers } from "@/lib/assessment"
import { saveAssessment, sendAssessmentEmail, type AssessmentPayload } from "@/lib/leads"

// Sending email requires the Node.js runtime; never statically cache this route.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const parsed = body as { answers?: Answers; contact?: Record<string, string>; completedAt?: string }
  const answers = (parsed?.answers ?? {}) as Answers
  const contact = parsed?.contact ?? {}

  // Basic validation.
  if (!contact?.email || !contact?.fullName) {
    return NextResponse.json({ error: "Missing contact information" }, { status: 400 })
  }

  // Recompute the score and business metrics server-side so the values are authoritative.
  const score = calculateScore(answers)
  const category = getCategory(score)
  const metrics = calculateMetrics(answers)

  const payload: AssessmentPayload = {
    contact: {
      fullName: contact.fullName ?? "",
      practiceName: contact.practiceName ?? "",
      email: contact.email ?? "",
      role: (contact.role ?? "") as AssessmentPayload["contact"]["role"],
      phone: contact.phone ?? "",
    },
    answers,
    score,
    categoryKey: category.key,
    categoryHeading: category.heading,
    metrics,
    completedAt: typeof parsed?.completedAt === "string" ? parsed.completedAt : new Date().toISOString(),
  }

  // Primary deliverable: email the notification to the team. Its success/failure
  // determines the response status the client sees.
  const emailResult = await sendAssessmentEmail(payload)

  // Best-effort durable backup + optional CRM webhook. A persistence hiccup must
  // not fail the request when the email (the primary channel) has been sent.
  try {
    await saveAssessment(payload)
  } catch (error) {
    console.log("[v0] Assessment backup persistence failed (non-fatal):", error)
  }

  if (!emailResult.ok) {
    return NextResponse.json({ error: emailResult.error ?? "Failed to send notification email." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, id: emailResult.id, score, categoryKey: category.key }, { status: 200 })
}
