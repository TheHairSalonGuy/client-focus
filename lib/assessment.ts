// ---------------------------------------------------------------------------
// Virtual Receptionist Opportunity Assessment — data model + calculations.
//
// Phase 1 goal: collect enough information to calculate a Monthly Revenue
// Opportunity range, Staff Time Recovered range, and Labor Cost Recovered range.
// These values are computed and persisted here but are NOT displayed on the
// interim results page — Phase 2 will present them as a visual ROI comparison.
// ---------------------------------------------------------------------------

export const ROLE_OPTIONS = [
  "Attorney",
  "Dentist",
  "Owner",
  "Office Manager",
  "Practice Manager",
  "Administrator",
  "Receptionist",
  "Other",
] as const

export type Role = (typeof ROLE_OPTIONS)[number]

export interface ContactInfo {
  fullName: string
  practiceName: string
  email: string
  role: Role | ""
  phone: string
}

export type QuestionId = "missedCalls" | "clientValue" | "conversion" | "intakeTime" | "priority"

export type QuestionType = "choice" | "number"

export interface AssessmentQuestion {
  id: QuestionId
  type: QuestionType
  prompt: string
  /** Optional supporting line shown under the prompt. */
  helper?: string
  /** Choice questions: the selectable options (higher index = higher signal). */
  options?: string[]
  /** Number questions: input affordances. */
  prefix?: string
  placeholder?: string
}

// The five questions, in order.
export const QUESTIONS: AssessmentQuestion[] = [
  {
    id: "missedCalls",
    type: "choice",
    prompt:
      "How many potential new client calls do you estimate go unanswered during a typical business day because your office is busy, at lunch, after-hours, or closed?",
    options: ["1–5", "6–10", "11–15", "16 or more"],
  },
  {
    id: "clientValue",
    type: "number",
    prompt: "On average, how much revenue does one new paying client generate for your firm or practice?",
    helper: "Enter a typical lifetime or case value in whole dollars.",
    prefix: "$",
    placeholder: "5,000",
  },
  {
    id: "conversion",
    type: "choice",
    prompt: "Out of every 10 qualified people who contact your office, approximately how many become paying clients?",
    // Rendered as "1 out of 10" … "10 out of 10"; converted internally to 10%…100%.
    options: Array.from({ length: 10 }, (_, i) => `${i + 1} out of 10`),
  },
  {
    id: "intakeTime",
    type: "choice",
    prompt:
      "On average, how many minutes does your front desk spend collecting information from each new caller before an attorney or provider can review the case?",
    options: ["0–15 minutes", "16–30 minutes", "31–60 minutes", "More than 60 minutes"],
  },
  {
    id: "priority",
    type: "choice",
    prompt: "If your front desk had more time every day, what would create the greatest value for your business?",
    helper: "This helps us personalize your recommendations.",
    options: [
      "Delivering a better client experience",
      "Following up with more potential clients",
      "Reducing missed appointments and scheduling issues",
      "Supporting attorneys/providers instead of administrative work",
      "All of the above",
    ],
  },
]

/**
 * Answers.
 * - Choice questions store the selected option index.
 * - clientValue stores the raw whole-dollar amount the user entered.
 */
export interface Answers {
  missedCalls?: number
  clientValue?: number
  conversion?: number
  intakeTime?: number
  priority?: number
}

// ---------------------------------------------------------------------------
// Calculation inputs (single source of truth for the ranges/rates).
// ---------------------------------------------------------------------------

/** [min, max] unanswered calls per option in QUESTION 1. */
export const MISSED_CALL_RANGES: ReadonlyArray<readonly [number, number]> = [
  [1, 5],
  [6, 10],
  [11, 15],
  [16, 20],
]

/**
 * Single representative unanswered-call count per QUESTION 1 option, used for the
 * headline "one number" revenue estimate. Rule: (min + max) / 2 rounded up; the
 * open-ended "16 or more" bucket is capped at 16 per product spec.
 *   1–5 → 3, 6–10 → 8, 11–15 → 13, 16 or more → 16
 */
export const MISSED_CALL_MIDPOINTS: ReadonlyArray<number> = [3, 8, 13, 16]

/** [min, max] intake minutes per option in QUESTION 4. */
export const INTAKE_MINUTE_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0, 15],
  [16, 30],
  [31, 60],
  [61, 90],
]

/** Hourly labor rate used for the Labor Cost Recovered calculation (configurable later). */
export const LABOR_RATE = 27

// ---------------------------------------------------------------------------
// Metrics — the values Phase 2 will visualize.
// ---------------------------------------------------------------------------

export interface AssessmentMetrics {
  minCalls: number
  maxCalls: number
  /** Single representative unanswered-call count (see MISSED_CALL_MIDPOINTS). */
  midpointCalls: number
  clientValue: number
  /** 0..1 (e.g. 0.3 for "3 out of 10"). */
  conversionRate: number
  conversionPercent: number
  minRevenue: number
  maxRevenue: number
  /** Headline "one number" monthly revenue = midpointCalls × clientValue × 30 days × conversionRate. */
  midpointRevenue: number
  minRecoveredHours: number
  maxRecoveredHours: number
  minLaborSavings: number
  maxLaborSavings: number
  /** Selected Question 5 label (personalization only), or null if unanswered. */
  priorityLabel: string | null
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Turn the raw answers into the business metrics.
 *
 * Revenue Opportunity (Part 3):
 *   min = minCalls × clientValue × conversionRate
 *   max = maxCalls × clientValue × conversionRate
 *
 * Time Recovered (Part 4):
 *   minHours = (minCalls × minIntakeMinutes) / 60
 *   maxHours = (maxCalls × maxIntakeMinutes) / 60
 *
 * Labor Savings (Part 5):
 *   min = minHours × LABOR_RATE
 *   max = maxHours × LABOR_RATE
 */
export function calculateMetrics(answers: Answers): AssessmentMetrics {
  const [minCalls, maxCalls] = MISSED_CALL_RANGES[answers.missedCalls ?? -1] ?? [0, 0]
  const midpointCalls = MISSED_CALL_MIDPOINTS[answers.missedCalls ?? -1] ?? 0
  const clientValue = Math.max(0, Math.round(answers.clientValue ?? 0))
  const conversionRate = typeof answers.conversion === "number" ? (answers.conversion + 1) / 10 : 0
  const [minMinutes, maxMinutes] = INTAKE_MINUTE_RANGES[answers.intakeTime ?? -1] ?? [0, 0]

  // Question 1 counts are PER BUSINESS DAY, so monthly figures multiply by 30 days.
  const DAYS_PER_MONTH = 30
  const minRevenue = Math.round(minCalls * clientValue * DAYS_PER_MONTH * conversionRate)
  const maxRevenue = Math.round(maxCalls * clientValue * DAYS_PER_MONTH * conversionRate)
  const midpointRevenue = Math.round(midpointCalls * clientValue * DAYS_PER_MONTH * conversionRate)

  const minRecoveredHours = round2((minCalls * minMinutes) / 60)
  const maxRecoveredHours = round2((maxCalls * maxMinutes) / 60)

  const minLaborSavings = Math.round(minRecoveredHours * LABOR_RATE)
  const maxLaborSavings = Math.round(maxRecoveredHours * LABOR_RATE)

  const priorityQuestion = QUESTIONS.find((q) => q.id === "priority")
  const priorityLabel =
    typeof answers.priority === "number" ? (priorityQuestion?.options?.[answers.priority] ?? null) : null

  return {
    minCalls,
    maxCalls,
    midpointCalls,
    clientValue,
    conversionRate,
    conversionPercent: Math.round(conversionRate * 100),
    minRevenue,
    maxRevenue,
    midpointRevenue,
    minRecoveredHours,
    maxRecoveredHours,
    minLaborSavings,
    maxLaborSavings,
    priorityLabel,
  }
}

// ---------------------------------------------------------------------------
// Score + category (kept for the interim results gauge; Phase 2 replaces this).
// ---------------------------------------------------------------------------

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

/**
 * Weighted 0–100 opportunity score used only by the interim results gauge.
 * Higher missed-call volume, higher client value, more intake time, and a higher
 * conversion rate (more revenue recoverable per captured call) all raise the score.
 */
export function calculateScore(answers: Answers): number {
  const missedN = typeof answers.missedCalls === "number" ? answers.missedCalls / (MISSED_CALL_RANGES.length - 1) : 0
  const intakeN = typeof answers.intakeTime === "number" ? answers.intakeTime / (INTAKE_MINUTE_RANGES.length - 1) : 0
  const conversionN = typeof answers.conversion === "number" ? answers.conversion / 9 : 0
  const valueN = clamp01((answers.clientValue ?? 0) / 10000)

  const total = 0.3 * missedN + 0.25 * valueN + 0.25 * intakeN + 0.2 * conversionN
  return Math.round(total * 100)
}

export type CategoryKey = "critical" | "high" | "moderate" | "emerging" | "low"

export interface ResultCategory {
  key: CategoryKey
  min: number
  max: number
  heading: string
  explanation: string
  /** Accent token used by the gauge/meter for this range. */
  accent: string
}

export const CATEGORIES: ResultCategory[] = [
  {
    key: "critical",
    min: 90,
    max: 100,
    heading: "Critical Need for a Virtual Receptionist",
    explanation:
      "Your front desk may be overwhelmed, and valuable client opportunities are likely being lost. Immediate support could significantly improve productivity, staff morale, response time, and revenue capture.",
    accent: "var(--destructive)",
  },
  {
    key: "high",
    min: 75,
    max: 89,
    heading: "High Need for a Virtual Receptionist",
    explanation:
      "Your office appears to be missing important systems that could help it operate more efficiently. Missed calls, manual intake, and repetitive scheduling tasks may be limiting growth and placing unnecessary pressure on your staff.",
    accent: "var(--coral)",
  },
  {
    key: "moderate",
    min: 50,
    max: 74,
    heading: "Moderate Need for a Virtual Receptionist",
    explanation:
      "Your current process may work during slower periods, but busy hours, after-hours calls, and repetitive administrative work could still be costing your office time and client opportunities.",
    accent: "var(--gold)",
  },
  {
    key: "emerging",
    min: 25,
    max: 49,
    heading: "Emerging Opportunity",
    explanation:
      "Your office may not be experiencing severe front-desk pressure yet, but automating selected tasks could improve consistency, reduce interruptions, and make future growth easier to manage.",
    accent: "var(--teal)",
  },
  {
    key: "low",
    min: 0,
    max: 24,
    heading: "Low Immediate Need",
    explanation:
      "Your current front-desk process appears manageable. A Virtual Receptionist may still be useful for after-hours coverage, overflow calls, or selected appointment and reminder tasks.",
    accent: "var(--teal-bright)",
  },
]

export function getCategory(score: number): ResultCategory {
  return CATEGORIES.find((c) => score >= c.min && score <= c.max) ?? CATEGORIES[CATEGORIES.length - 1]
}

export interface Observation {
  title: string
  detail: string
}

/**
 * Build up to three qualitative observations for the interim results page.
 * These stay intentionally qualitative — the dollar/hour ranges are reserved for
 * the Phase 2 visual ROI presentation, so no computed figures are shown here.
 */
export function buildObservations(answers: Answers): Observation[] {
  const missedIdx = answers.missedCalls ?? 0
  const intakeIdx = answers.intakeTime ?? 0
  const conversionIdx = answers.conversion ?? 0
  const hasValue = typeof answers.clientValue === "number" && answers.clientValue > 0

  const missedN = missedIdx / (MISSED_CALL_RANGES.length - 1)
  const intakeN = intakeIdx / (INTAKE_MINUTE_RANGES.length - 1)
  // Lower conversion = larger upside from capturing more of the calls you already get.
  const conversionUpside = 1 - conversionIdx / 9

  const candidates: Array<{ relevance: number; priority: number; obs: Observation }> = [
    {
      relevance: missedN,
      priority: 5,
      obs: {
        title: "Unanswered Call Volume",
        detail:
          "Calls that go unanswered during lunch, busy periods, and after-hours are opportunities competitors may be capturing instead. Consistent coverage helps you keep more of the demand you already generate.",
      },
    },
    {
      relevance: intakeN,
      priority: 4,
      obs: {
        title: "Front-Desk Time on Intake",
        detail:
          "Your team spends meaningful time gathering caller information by hand. A virtual receptionist can collect and organize those details automatically, freeing staff for higher-value work.",
      },
    },
    {
      relevance: conversionUpside * (hasValue ? 1 : 0.6),
      priority: 3,
      obs: {
        title: "Conversion Upside",
        detail:
          "There is room to turn more of the qualified people who contact you into paying clients. Faster, more consistent responses and follow-up typically lift conversion over time.",
      },
    },
    {
      relevance: 0.5,
      priority: 2,
      obs: {
        title: "Scheduling and No-Show Risk",
        detail:
          "Booking, rescheduling, and reminder tasks are easy to automate. Consistent follow-up here typically reduces no-shows and keeps your calendar full.",
      },
    },
    {
      relevance: (intakeN + missedN) / 2,
      priority: 1,
      obs: {
        title: "Front-Desk Workload Pressure",
        detail:
          "Repetitive administrative work is adding pressure to your front desk. Offloading it can improve consistency, response time, and staff morale.",
      },
    },
  ]

  return candidates
    .sort((a, b) => b.relevance - a.relevance || b.priority - a.priority)
    .slice(0, 3)
    .map((c) => c.obs)
}

/** One recommended next step, tuned to the result category. */
export function getNextStep(category: CategoryKey): string {
  switch (category) {
    case "critical":
    case "high":
      return "Book a short demo to see how a virtual receptionist would answer, qualify, and route your calls — and start a 14-day free trial to measure the impact right away."
    case "moderate":
      return "Start a 14-day free trial focused on your busiest hours and after-hours coverage to see how many opportunities you can recover."
    case "emerging":
      return "Try a 14-day free trial on select tasks — like appointment booking and reminders — to build consistency before your next growth push."
    case "low":
    default:
      return "Consider a virtual receptionist for after-hours and overflow calls. Book a demo whenever you're ready to explore coverage options."
  }
}

export interface AssessmentResult {
  score: number
  category: ResultCategory
  observations: Observation[]
  nextStep: string
  /** All Phase 2 values (revenue/time/labor ranges + inputs). */
  metrics: AssessmentMetrics
}

export function buildResult(answers: Answers): AssessmentResult {
  const score = calculateScore(answers)
  const category = getCategory(score)
  return {
    score,
    category,
    observations: buildObservations(answers),
    nextStep: getNextStep(category.key),
    metrics: calculateMetrics(answers),
  }
}

/** Full payload persisted with each completed assessment. */
export interface AssessmentSubmission {
  contact: ContactInfo
  answers: Answers
  score: number
  categoryKey: CategoryKey
  categoryHeading: string
  metrics: AssessmentMetrics
  completedAt: string
}
