import { put } from "@vercel/blob"
import { Resend } from "resend"
import {
  QUESTIONS,
  getCategory,
  type Answers,
  type AssessmentMetrics,
  type ContactInfo,
} from "@/lib/assessment"

// Internal notification email settings.
const EMAIL_TO = "joe@myvrteam.com"
const EMAIL_FROM = "Assessment Notifications <notifications@nevermiss-client.com>"

// ---------------------------------------------------------------------------
// Lead capture + internal notification.
//
// Every completed assessment (and every trial request) is persisted durably to
// Blob storage as a backup. If a downstream CRM / lead workflow is connected via
// the LEAD_WEBHOOK_URL environment variable (e.g. a Zapier/Make/Slack/CRM inbound
// webhook), the same payload is forwarded there so Joe receives an internal
// notification with the contact info, answers, score, and recommended follow-up.
// When no webhook is configured we log the notification so nothing is lost.
// ---------------------------------------------------------------------------

export interface AssessmentPayload {
  contact: ContactInfo
  answers: Answers
  score: number
  categoryKey: string
  categoryHeading: string
  metrics: AssessmentMetrics
  completedAt: string
}

/** Turn the raw answers into readable "question → selected value" lines. */
function readableAnswers(answers: Answers): { question: string; answer: string }[] {
  return QUESTIONS.map((q) => {
    const value = answers[q.id]
    let answer = "No answer"
    if (typeof value === "number") {
      if (q.type === "number") {
        answer = `${q.prefix ?? ""}${value.toLocaleString("en-US")}`
      } else {
        answer = q.options?.[value] ?? "No answer"
      }
    }
    return { question: q.prompt, answer }
  })
}

/** Escape user-supplied strings before interpolating into the HTML email. */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatCurrency(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`
}

/** Build the internal notification email as a clean, table-based HTML layout. */
function renderAssessmentEmailHtml(data: AssessmentPayload): string {
  const { contact, metrics: m } = data
  const answersReadable = readableAnswers(data.answers)

  const cellBase = "padding:10px 14px;border:1px solid #e2e8f0;font-size:14px;line-height:1.5;"
  const labelCell = `${cellBase}background:#f8fafc;font-weight:600;color:#0f172a;width:44%;vertical-align:top;`
  const valueCell = `${cellBase}color:#334155;vertical-align:top;`
  const sectionTitle =
    "margin:28px 0 10px;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#0f766e;"

  const row = (label: string, value: string) =>
    `<tr><td style="${labelCell}">${escapeHtml(label)}</td><td style="${valueCell}">${escapeHtml(value)}</td></tr>`

  const contactRows = [
    ["Full Name", contact.fullName],
    ["Firm / Practice", contact.practiceName],
    ["Email", contact.email],
    ["Role", contact.role || "Not provided"],
    ["Phone", contact.phone || "Not provided"],
  ]
    .map(([l, v]) => row(l, v))
    .join("")

  const answerRows = answersReadable.map(({ question, answer }) => row(question, answer)).join("")

  const metricRows = [
    ["Estimated Monthly Sales Lost", formatCurrency(m.midpointRevenue)],
    ["Monthly Sales Lost Range", `${formatCurrency(m.minRevenue)} – ${formatCurrency(m.maxRevenue)}`],
    ["Average Transaction Value", formatCurrency(m.clientValue)],
    ["Customer Visits / Year", `${m.visitsPerYear}`],
    ["Lifetime Customer Value", formatCurrency(m.lifetimeValue)],
    ["Total Missed Calls / Month", `${m.missedCallsPerMonth}`],
    ["Unanswered Calls / Day (range)", `${m.minCalls} – ${m.maxCalls}`],
    ["Staff Time Recovered / Day", `${m.minRecoveredHours} – ${m.maxRecoveredHours} hrs`],
    ["Labor Cost Recovered / Day", `${formatCurrency(m.minLaborSavings)} – ${formatCurrency(m.maxLaborSavings)}`],
    ["Opportunity Score", `${data.score}/100 — ${data.categoryHeading}`],
    ["Recommended Follow-up", recommendedFollowUp(data.score)],
  ]
    .map(([l, v]) => row(l, v))
    .join("")

  const submittedAt = (() => {
    const d = new Date(data.completedAt)
    return Number.isNaN(d.getTime())
      ? data.completedAt
      : d.toLocaleString("en-US", { timeZone: "America/New_York" })
  })()

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
          <tr><td style="background:#0f172a;padding:24px 28px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">New Assessment Submission</p>
            <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Submitted ${escapeHtml(submittedAt)}</p>
          </td></tr>
          <tr><td style="padding:8px 28px 28px;">
            <p style="${sectionTitle}">Contact Details</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${contactRows}</table>
            <p style="${sectionTitle}">Assessment Responses</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${answerRows}</table>
            <p style="${sectionTitle}">Calculated Results</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${metricRows}</table>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

/**
 * Send the internal assessment notification email via Resend.
 * Returns a result object (never throws) so the caller can decide how to surface
 * a failure to the client with an appropriate status code.
 */
export async function sendAssessmentEmail(
  data: AssessmentPayload,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "Email service is not configured (missing RESEND_API_KEY)." }
  }

  const subjectName = data.contact.fullName?.trim() || data.contact.practiceName?.trim() || "New Lead"
  const subject =
    data.contact.practiceName && data.contact.practiceName !== subjectName
      ? `New Assessment Submission - ${subjectName} / ${data.contact.practiceName}`
      : `New Assessment Submission - ${subjectName}`

  const resend = new Resend(apiKey)

  try {
    const { data: sent, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: data.contact.email || undefined,
      subject,
      html: renderAssessmentEmailHtml(data),
    })

    if (error) {
      console.log("[v0] Resend send error:", error)
      return { ok: false, error: error.message || "Failed to send email." }
    }
    return { ok: true, id: sent?.id }
  } catch (err) {
    console.log("[v0] Unexpected error sending assessment email:", err)
    return { ok: false, error: "Unexpected error sending email." }
  }
}

function recommendedFollowUp(score: number): string {
  const category = getCategory(score)
  switch (category.key) {
    case "critical":
      return "High priority — reach out within 24 hours to book a demo and offer trial activation."
    case "high":
      return "Priority lead — follow up within 1–2 business days with a demo invite."
    case "moderate":
      return "Warm lead — send trial info and a demo link; follow up this week."
    case "emerging":
      return "Nurture — share task-specific value (booking/reminders) and check back."
    case "low":
    default:
      return "Low urgency — add to nurture list; mention after-hours/overflow coverage."
  }
}

async function forwardToWebhook(kind: string, body: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL
  const payload = { kind, ...body }
  if (!url) {
    // Fallback so the lead is never silently dropped when no CRM/webhook is set.
    console.log(`[v0] Lead notification (${kind}) — no LEAD_WEBHOOK_URL set:`, JSON.stringify(payload))
    return
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("[v0] Failed to forward lead to webhook:", error)
  }
}

export async function saveAssessment(data: AssessmentPayload) {
  const answersReadable = readableAnswers(data.answers)
  const followUp = recommendedFollowUp(data.score)

  const record = {
    type: "assessment",
    contact: data.contact,
    answers: data.answers,
    answersReadable,
    score: data.score,
    categoryKey: data.categoryKey,
    categoryHeading: data.categoryHeading,
    // Phase 2 business metrics (revenue/time/labor ranges + inputs).
    metrics: data.metrics,
    recommendedFollowUp: followUp,
    completedAt: data.completedAt,
  }

  // Durable backup storage. The connected Blob store is public, so we rely on a
  // timestamp + random suffix to make the object path effectively unguessable
  // (the URL is never surfaced to the client). The primary lead-delivery channel
  // is the notification webhook below.
  const safeName = (data.contact.email || "anonymous").replace(/[^a-z0-9@._-]/gi, "_")
  await put(`assessments/${Date.now()}-${safeName}.json`, JSON.stringify(record, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
  })

  // Internal notification for Joe / CRM workflow.
  await forwardToWebhook("assessment", {
    subject: `New assessment: ${data.contact.fullName} (${data.score}/100 — ${data.categoryHeading})`,
    contact: data.contact,
    score: data.score,
    category: data.categoryHeading,
    answers: answersReadable,
    metrics: data.metrics,
    recommendedFollowUp: followUp,
    completedAt: data.completedAt,
  })

  return record
}

export interface TrialPayload {
  fullName: string
  practiceName: string
  email: string
  phone?: string
  requestedAt: string
}

export async function saveTrialRequest(data: TrialPayload) {
  const record = { type: "trial", ...data }
  const safeName = (data.email || "anonymous").replace(/[^a-z0-9@._-]/gi, "_")
  await put(`trials/${Date.now()}-${safeName}.json`, JSON.stringify(record, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
  })

  await forwardToWebhook("trial", {
    subject: `New 30-day trial request: ${data.fullName} — ${data.practiceName}`,
    contact: data,
    recommendedFollowUp: "Contact to confirm setup details before activating the trial.",
    requestedAt: data.requestedAt,
  })

  return record
}
