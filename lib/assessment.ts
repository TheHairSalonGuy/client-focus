// ---------------------------------------------------------------------------
// Assessment engine
//
// Single source of truth for the "How much are missed client calls costing your
// office?" assessment. It defines the questions, the contact schema, and all of
// the scoring / business-metric math. Both the client flow
// (components/assessment/*) and the server route (app/api/assessment/route.ts)
// import from here so the numbers shown to the visitor and the numbers persisted
// for the sales team are always computed identically.
//
// Consumers:
//   - components/assessment/assessment-flow.tsx  -> QUESTIONS, ROLE_OPTIONS,
//     buildResult, Answers, ContactInfo
//   - components/assessment/results-view.tsx     -> buildResult, Answers
//   - app/api/assessment/route.ts                -> calculateScore, getCategory,
//     calculateMetrics, Answers
//   - lib/leads.ts                               -> QUESTIONS, getCategory,
//     Answers, AssessmentMetrics, ContactInfo
// ---------------------------------------------------------------------------

/* ------------------------------- Question model ------------------------------ */

export type QuestionType = "choice" | "number"

export interface Question {
  /** Stable key used as the answer map key. Never reorder/rename casually. */
  id: string
  /** Main question text shown to the visitor. */
  prompt: string
  /** "choice" renders selectable options; "number" renders a numeric input. */
  type: QuestionType
  /** Optional supporting sentence under the prompt. */
  helper?: string
  /** Options for choice questions. The answer stores the selected index. */
  options?: string[]
  /** Prefix for number questions (e.g. "$"). */
  prefix?: string
  /** Placeholder for number questions. */
  placeholder?: string
}

/**
 * Answer map. Choice questions store the selected option index; number
 * questions store the raw numeric value. A missing/undefined entry means the
 * question was skipped and a conservative default is used in the math.
 */
export type Answers = Record<string, number | undefined>

/* --------------------------------- Contact ---------------------------------- */

export const ROLE_OPTIONS = [
  "Owner / Doctor / Partner",
  "Office Manager",
  "Front Desk / Reception",
  "Practice Administrator",
  "Other",
] as const

export type Role = (typeof ROLE_OPTIONS)[number] | ""

export interface ContactInfo {
  fullName: string
  practiceName: string
  email: string
  role: Role
  phone: string
}

/* ------------------------------- Questions ---------------------------------- */
//
// The order here defines the flow order and progress percentage. There are five
// questions: four choice questions and one numeric (average client value).

export const QUESTIONS: Question[] = [
  {
    id: "missedCalls",
    type: "choice",
    prompt:
      "On a typical day, how many calls does your restaurant miss, send to voicemail, or fail to answer in time?",
    helper: "Include busy signals, after-hours calls, and callers who hang up before someone answers.",
    options: ["1–3 calls", "4–7 calls", "8–12 calls", "13 or more calls"],
  },
  {
    id: "whenMissed",
    type: "choice",
    prompt: "When do most of these missed calls happen?",
    helper:
      "Callers who reach voicemail during business hours or after hours rarely leave a message or call back—they call the next restaurant.",
    options: [
      "During peak lunch and dining hours",
      "During staff breaks",
      "After hours and on weekends",
      "When front desk is servicing walk-in customers",
    ],
  },
  {
    id: "clientValue",
    type: "number",
    prompt: "What is the average transaction from one order, transaction, or reservation?",
    helper: "Your best rough estimate value is fine—this drives your opportunity estimate.",
    prefix: "$",
    placeholder: "85",
  },
  {
    id: "visitFrequency",
    type: "choice",
    prompt: "How often do your regular customers visit your restaurant per year?",
    helper: "This helps calculate the lifetime customer value of captured calls.",
    options: ["Once a week", "Twice a week", "Once a month", "Once every 3 months"],
  },
  {
    id: "phoneTime",
    type: "choice",
    prompt: "How much time does your front desk team spend asking repetitive questions calls each day?",
    helper: "Time on the phone is time not spent servicing walk-in customers.",
    options: ["Less than 1 hour", "1–2 hours", "2–4 hours", "More than 4 hours"],
  },
]

/* ----------------------------- Scoring tables ------------------------------- */
//
// Each choice question maps its selected index to a set of numeric factors used
// by the score and the business metrics. Keep these arrays index-aligned with
// the options above.

/** Daily missed-call ranges keyed to the "missedCalls" options. */
const CALL_RANGES: { min: number; max: number }[] = [
  { min: 1, max: 3 },
  { min: 4, max: 7 },
  { min: 8, max: 12 },
  { min: 13, max: 18 },
]

/**
 * Annual visit counts keyed to the "visitFrequency" options. Used for the
 * lifetime-value figure (average transaction × visits per year).
 */
const VISITS_PER_YEAR = [52, 104, 12, 4]

/** Daily front-desk phone-time (recoverable hours) keyed to "phoneTime". */
const HOURS_RANGES: { min: number; max: number }[] = [
  { min: 0.5, max: 1 },
  { min: 1, max: 2 },
  { min: 2, max: 4 },
  { min: 4, max: 6 },
]

/** Urgency weight (0–25) keyed to the "whenMissed" options. */
const WHEN_MISSED_WEIGHT = [10, 14, 25, 18]

/** Blended hourly cost of front-desk staff time, used for labor-savings math. */
const LABOR_RATE = 22

/** Conservative fallbacks when a question was skipped. */
const DEFAULTS = {
  missedCalls: 1,
  whenMissed: 3,
  visitFrequency: 2,
  phoneTime: 1,
  clientValue: 85,
}

/* --------------------------------- Helpers ---------------------------------- */

/** Read a choice index, clamping to a valid range and applying a fallback. */
function choiceIndex(answers: Answers, id: string, length: number, fallback: number): number {
  const raw = answers[id]
  if (typeof raw !== "number" || Number.isNaN(raw)) return fallback
  return Math.min(Math.max(Math.round(raw), 0), length - 1)
}

/** Read the numeric client value, applying a floor and a sensible fallback. */
function clientValueOf(answers: Answers): number {
  const raw = answers.clientValue
  if (typeof raw !== "number" || Number.isNaN(raw) || raw <= 0) return DEFAULTS.clientValue
  return Math.round(raw)
}

function round(n: number): number {
  return Math.round(n)
}

/* --------------------------------- Metrics ---------------------------------- */

export interface AssessmentMetrics {
  /** Inputs echoed back for transparency. */
  clientValue: number
  visitsPerYear: number
  /** Average transaction × visits per year. */
  lifetimeValue: number
  /** Daily unanswered-call range and its midpoint. */
  minCalls: number
  maxCalls: number
  midpointCalls: number
  /** Missed calls per month (midpoint daily calls × 30). */
  missedCallsPerMonth: number
  /** Estimated monthly sales lost range and midpoint. */
  minRevenue: number
  maxRevenue: number
  midpointRevenue: number
  /** Daily staff time (hours) that could be recovered. */
  minRecoveredHours: number
  maxRecoveredHours: number
  /** Daily labor cost recovered (recovered hours × blended rate). */
  minLaborSavings: number
  maxLaborSavings: number
}

/**
 * Derive the business metrics from the answers.
 *
 * Models (must stay in sync with the calculation line rendered in
 * results-view.tsx):
 *   missed calls / month = missed calls per day × 30
 *   sales lost / month   = missed calls per day × average transaction × 30
 */
export function calculateMetrics(answers: Answers): AssessmentMetrics {
  const callIdx = choiceIndex(answers, "missedCalls", CALL_RANGES.length, DEFAULTS.missedCalls)
  const visitIdx = choiceIndex(answers, "visitFrequency", VISITS_PER_YEAR.length, DEFAULTS.visitFrequency)
  const hoursIdx = choiceIndex(answers, "phoneTime", HOURS_RANGES.length, DEFAULTS.phoneTime)

  const clientValue = clientValueOf(answers)
  const visitsPerYear = VISITS_PER_YEAR[visitIdx]
  const lifetimeValue = round(clientValue * visitsPerYear)

  const minCalls = CALL_RANGES[callIdx].min
  const maxCalls = CALL_RANGES[callIdx].max
  const midpointCalls = round((minCalls + maxCalls) / 2)
  const missedCallsPerMonth = round(midpointCalls * 30)

  const revenueFor = (calls: number) => round(calls * clientValue * 30)
  const minRevenue = revenueFor(minCalls)
  const maxRevenue = revenueFor(maxCalls)
  const midpointRevenue = revenueFor(midpointCalls)

  const minRecoveredHours = HOURS_RANGES[hoursIdx].min
  const maxRecoveredHours = HOURS_RANGES[hoursIdx].max
  const minLaborSavings = round(minRecoveredHours * LABOR_RATE)
  const maxLaborSavings = round(maxRecoveredHours * LABOR_RATE)

  return {
    clientValue,
    visitsPerYear,
    lifetimeValue,
    minCalls,
    maxCalls,
    midpointCalls,
    missedCallsPerMonth,
    minRevenue,
    maxRevenue,
    midpointRevenue,
    minRecoveredHours,
    maxRecoveredHours,
    minLaborSavings,
    maxLaborSavings,
  }
}

/* ---------------------------------- Score ----------------------------------- */

/**
 * Opportunity score on a 0–100 scale. Higher means a larger, more urgent
 * revenue opportunity from missed calls. Weighted across four signals:
 *   - volume of missed calls  (max 35)
 *   - front-desk phone burden (max 25)
 *   - when calls are missed   (max 25, after-hours weighted highest)
 *   - visit frequency         (max 15, frequent regulars = each miss costs more)
 */
export function calculateScore(answers: Answers): number {
  const callIdx = choiceIndex(answers, "missedCalls", CALL_RANGES.length, DEFAULTS.missedCalls)
  const visitIdx = choiceIndex(answers, "visitFrequency", VISITS_PER_YEAR.length, DEFAULTS.visitFrequency)
  const hoursIdx = choiceIndex(answers, "phoneTime", HOURS_RANGES.length, DEFAULTS.phoneTime)
  const whenIdx = choiceIndex(answers, "whenMissed", WHEN_MISSED_WEIGHT.length, DEFAULTS.whenMissed)

  const lastCall = CALL_RANGES.length - 1
  const lastHours = HOURS_RANGES.length - 1
  const maxVisits = Math.max(...VISITS_PER_YEAR)

  const callScore = (callIdx / lastCall) * 35
  const hoursScore = (hoursIdx / lastHours) * 25
  // Visit frequency is not ordered by index, so scale on the visit count itself.
  const visitScore = (VISITS_PER_YEAR[visitIdx] / maxVisits) * 15
  const whenScore = WHEN_MISSED_WEIGHT[whenIdx]

  const total = callScore + hoursScore + visitScore + whenScore
  return Math.min(100, Math.max(0, Math.round(total)))
}

/* -------------------------------- Category ---------------------------------- */

export type CategoryKey = "critical" | "high" | "moderate" | "emerging" | "low"

export interface Category {
  key: CategoryKey
  heading: string
  description: string
}

const CATEGORIES: { threshold: number; category: Category }[] = [
  {
    threshold: 80,
    category: {
      key: "critical",
      heading: "Critical Revenue Leak",
      description:
        "Your office is likely losing significant revenue to missed calls every week. A Virtual Receptionist could pay for itself almost immediately.",
    },
  },
  {
    threshold: 65,
    category: {
      key: "high",
      heading: "High Opportunity",
      description:
        "There is a clear, sizable opportunity to recover missed calls and free up your front desk. Capturing even a fraction would more than cover the cost.",
    },
  },
  {
    threshold: 45,
    category: {
      key: "moderate",
      heading: "Moderate Opportunity",
      description:
        "You are leaving real revenue on the table. A Virtual Receptionist would help you capture more callers and give time back to your team.",
    },
  },
  {
    threshold: 25,
    category: {
      key: "emerging",
      heading: "Emerging Opportunity",
      description:
        "Your call volume is manageable today, but overflow and after-hours coverage would still help you avoid missed opportunities as you grow.",
    },
  },
  {
    threshold: 0,
    category: {
      key: "low",
      heading: "Low Urgency",
      description:
        "You have a good handle on your calls. After-hours and overflow coverage could still add a small margin of safety during your busiest moments.",
    },
  },
]

/** Map a 0–100 score to its opportunity category. */
export function getCategory(score: number): Category {
  const match = CATEGORIES.find(({ threshold }) => score >= threshold)
  // The final entry has threshold 0, so a match is always found; the fallback
  // simply satisfies the type checker.
  return (match ?? CATEGORIES[CATEGORIES.length - 1]).category
}

/* ------------------------------- buildResult -------------------------------- */

export interface AssessmentResult {
  answers: Answers
  score: number
  category: Category
  metrics: AssessmentMetrics
}

/**
 * Convenience aggregate used by the client. Combines the score, its category,
 * and the derived business metrics into a single object.
 */
export function buildResult(answers: Answers): AssessmentResult {
  const score = calculateScore(answers)
  const category = getCategory(score)
  const metrics = calculateMetrics(answers)
  return { answers, score, category, metrics }
}
