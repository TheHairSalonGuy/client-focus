"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"
import {
  QUESTIONS,
  ROLE_OPTIONS,
  buildResult,
  type Answers,
  type ContactInfo,
} from "@/lib/assessment"
import { ResultsView } from "@/components/assessment/results-view"

type Step = "intro" | "contact" | number | "results"

const STORAGE_KEY = "vr-assessment-v1"
const TOTAL = QUESTIONS.length

const emptyContact: ContactInfo = { fullName: "", practiceName: "", email: "", role: "", phone: "" }

export function AssessmentFlow() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>("intro")
  const [contact, setContact] = useState<ContactInfo>(emptyContact)
  const [answers, setAnswers] = useState<Answers>({})
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({})
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "done" | "error">("idle")
  const submittedRef = useRef(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Every visit to the assessment starts a brand-new session at the introduction.
  // We intentionally do NOT restore a previous step/answers — clearing any stale
  // saved progress guarantees visitors never resume mid-flow (e.g. jumping to Q5).
  useEffect(() => {
    setMounted(true)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore storage access errors */
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const submit = useCallback(
    async (finalAnswers: Answers) => {
      if (submittedRef.current) return
      submittedRef.current = true
      setSubmitState("submitting")
      const result = buildResult(finalAnswers)
      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact,
            answers: finalAnswers,
            score: result.score,
            categoryKey: result.category.key,
            categoryHeading: result.category.heading,
            completedAt: new Date().toISOString(),
          }),
        })
        setSubmitState(res.ok ? "done" : "error")
      } catch {
        setSubmitState("error")
      }
    },
    [contact],
  )

  function validateContact(): boolean {
    const next: Partial<Record<keyof ContactInfo, string>> = {}
    if (!contact.fullName.trim()) next.fullName = "Please enter your full name."
    if (!contact.practiceName.trim()) next.practiceName = "Please enter your firm or practice name."
    if (!contact.email.trim()) next.email = "Please enter your email."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) next.email = "Please enter a valid email address."
    if (!contact.role) next.role = "Please select your role."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function advanceFrom(qIndex: number, currentAnswers: Answers) {
    if (qIndex < TOTAL - 1) {
      setStep(qIndex + 1)
    } else {
      setStep("results")
      void submit(currentAnswers)
    }
  }

  // Choice questions record the option index and auto-advance after a brief beat.
  function selectAnswer(qIndex: number, optionIndex: number) {
    const q = QUESTIONS[qIndex]
    const next = { ...answers, [q.id]: optionIndex }
    setAnswers(next)
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => advanceFrom(qIndex, next), 280)
  }

  // Number questions (e.g. client value) update as the user types; advancing is
  // manual via Continue so they can review the amount before moving on.
  function setNumberAnswer(qIndex: number, value: number | undefined) {
    const q = QUESTIONS[qIndex]
    setAnswers((a) => ({ ...a, [q.id]: value }))
  }

  function continueFromNumber(qIndex: number) {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceFrom(qIndex, answers)
  }

  // Begin a fresh assessment from the intro: wipe answers, contact, errors, and
  // submission flags so nothing from a prior run carries over into Q1 / 0%.
  function startAssessment() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    submittedRef.current = false
    setSubmitState("idle")
    setAnswers({})
    setContact(emptyContact)
    setErrors({})
    setStep("contact")
  }

  function goBack() {
    if (step === "contact") setStep("intro")
    else if (typeof step === "number") setStep(step === 0 ? "contact" : step - 1)
    else if (step === "results") setStep(TOTAL - 1)
  }

  // Avoid hydration flash: render the intro shell until mounted, then hydrate saved state.
  if (!mounted) {
    return <div className="min-h-[60vh]" aria-hidden="true" />
  }

  // The results step renders in a wide container; all other steps stay narrow.
  if (step === "results") {
    return (
      <div className="mx-auto w-full max-w-6xl px-6">
        <ResultsView answers={answers} submitState={submitState} />
      </div>
    )
  }

  return (
    // The intro gets a wider column so its headline and subtext each hold two rows.
    <div className={`mx-auto w-full px-6 ${step === "intro" ? "max-w-5xl" : "max-w-3xl"}`}>
      {step === "intro" && <IntroStep onStart={startAssessment} />}

      {step === "contact" && (
        <ContactStep
          contact={contact}
          errors={errors}
          onChange={(patch) => setContact((c) => ({ ...c, ...patch }))}
          onBack={goBack}
          onContinue={() => {
            if (validateContact()) setStep(0)
          }}
        />
      )}

      {typeof step === "number" && (
        <QuestionStep
          index={step}
          value={answers[QUESTIONS[step].id]}
          onSelect={(optionIndex) => selectAnswer(step, optionIndex)}
          onChangeNumber={(value) => setNumberAnswer(step, value)}
          onContinueNumber={() => continueFromNumber(step)}
          onBack={goBack}
        />
      )}
    </div>
  )
}

/* ----------------------------- Intro (landing) ----------------------------- */

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto py-4 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm">
        <Sparkles className="h-4 w-4 text-teal" />
        Free Assessment
      </span>
      {/* Headline and subtext are each locked to two rows on desktop via explicit breaks. */}
      <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.12] tracking-tight text-navy-deep sm:text-5xl">
        How much are missed customer orders
        <br className="hidden sm:block" /> costing your restaurant?
      </h1>
      <p className="mx-auto mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
        Answer 5 quick questions to see how much sales of your restaurant goes to your competitors
        <br className="hidden sm:block" /> and how our Virtual Receptionist could help bring that money back to your
        business.
      </p>
      <div className="mt-9">
        <button
          type="button"
          onClick={onStart}
          className="group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--yellow-cta)] px-[5.5rem] py-4 text-lg font-semibold text-[var(--yellow-cta-ink)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_0_28px_-4px_color-mix(in_oklch,var(--yellow-cta)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklch,var(--yellow-cta)_60%,transparent)]"
        >
          <span aria-hidden="true" className="cta-runner" />
          <span className="relative z-[1] inline-flex items-center gap-2">
            Start Assessment
            <ArrowRight className="h-5 w-5" />
          </span>
        </button>
      </div>
      <p className="mt-5 text-sm font-medium text-muted-foreground">
        Free {"\u2022"} Takes under 2 minutes {"\u2022"} Get instant recommendations
      </p>
    </div>
  )
}

/* ------------------------------- Contact step ------------------------------ */

function Field({
  label,
  children,
  error,
  optional,
}: {
  label: string
  children: React.ReactNode
  error?: string
  optional?: boolean
}) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">(optional)</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm font-medium text-destructive">{error}</span>}
    </label>
  )
}

const inputClass =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/40"

function ContactStep({
  contact,
  errors,
  onChange,
  onBack,
  onContinue,
}: {
  contact: ContactInfo
  errors: Partial<Record<keyof ContactInfo, string>>
  onChange: (patch: Partial<ContactInfo>) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="mx-auto max-w-xl py-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-balance font-serif text-3xl font-normal tracking-tight text-navy-deep sm:text-4xl">
        Tell Us About Your Office
      </h1>
      <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
        We&apos;ll use this information to personalize your results.
      </p>

      <form
        className="mt-8 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          onContinue()
        }}
      >
        <Field label="Full Name" error={errors.fullName}>
          <input
            className={inputClass}
            value={contact.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="Your full name"
            autoComplete="name"
          />
        </Field>

        <Field label="Firm/Practice Name" error={errors.practiceName}>
          <input
            className={inputClass}
            value={contact.practiceName}
            onChange={(e) => onChange({ practiceName: e.target.value })}
            placeholder="Your firm or practice name"
            autoComplete="organization"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={contact.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@business.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Role in Office" error={errors.role}>
          <select
            className={`${inputClass} appearance-none`}
            value={contact.role}
            onChange={(e) => onChange({ role: e.target.value as ContactInfo["role"] })}
          >
            <option value="" disabled>
              Select your role
            </option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Phone Number" optional>
          <input
            type="tel"
            className={inputClass}
            value={contact.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
        </Field>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60"
        >
          Continue Assessment
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

/* ------------------------------ Question step ------------------------------ */

function QuestionStep({
  index,
  value,
  onSelect,
  onChangeNumber,
  onContinueNumber,
  onBack,
}: {
  index: number
  value: number | undefined
  onSelect: (optionIndex: number) => void
  onChangeNumber: (value: number | undefined) => void
  onContinueNumber: () => void
  onBack: () => void
}) {
  const q = QUESTIONS[index]
  const percent = Math.round(((index + 1) / TOTAL) * 100)

  return (
    <div className="py-4">
      {/* Progress header */}
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-foreground">
          Question {index + 1} of {TOTAL}
        </span>
        <span className="text-muted-foreground">{percent}% complete</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-teal transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Question. min-height keeps the layout from jumping between question types. */}
      <h1 className="mt-8 text-balance font-serif text-2xl font-normal leading-snug tracking-tight text-navy-deep sm:text-3xl">
        {q.prompt}
      </h1>
      {q.helper && <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">{q.helper}</p>}

      {q.type === "number" ? (
        <NumberQuestion
          value={value}
          prefix={q.prefix}
          placeholder={q.placeholder}
          onChange={onChangeNumber}
          onContinue={onContinueNumber}
        />
      ) : (
        <div className="mt-7 flex min-h-[320px] flex-col gap-3">
          {q.options?.map((option, optionIndex) => {
            const isSelected = value === optionIndex
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(optionIndex)}
                aria-pressed={isSelected}
                className={`group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 ${
                  isSelected
                    ? "border-teal bg-teal/10 text-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-teal hover:bg-teal/5"
                }`}
              >
                <span>{option}</span>
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border transition-colors ${
                    isSelected ? "border-teal bg-teal text-primary-foreground" : "border-border text-transparent group-hover:border-teal"
                  }`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  )
}

/* ------------------------- Numeric question (client value) ------------------------- */

function NumberQuestion({
  value,
  prefix,
  placeholder,
  onChange,
  onContinue,
}: {
  value: number | undefined
  prefix?: string
  placeholder?: string
  onChange: (value: number | undefined) => void
  onContinue: () => void
}) {
  // Keep a formatted display string (with thousands separators) while typing.
  const [raw, setRaw] = useState<string>(typeof value === "number" ? value.toLocaleString("en-US") : "")
  const [error, setError] = useState<string>("")

  function handleChange(input: string) {
    // Allow only digits and commas while typing; store the numeric value upstream.
    const digits = input.replace(/[^\d]/g, "")
    if (digits === "") {
      setRaw("")
      onChange(undefined)
      return
    }
    const num = Number.parseInt(digits, 10)
    setRaw(num.toLocaleString("en-US"))
    onChange(num)
    if (error) setError("")
  }

  function submit() {
    if (typeof value !== "number" || value <= 0) {
      setError("Please enter a whole dollar amount greater than $0.")
      return
    }
    onContinue()
  }

  return (
    <div className="mt-7 min-h-[320px]">
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          aria-label="Average transaction value in dollars"
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-xl border bg-card py-4 pr-5 text-2xl font-semibold text-foreground shadow-sm outline-none transition-colors placeholder:font-normal placeholder:text-muted-foreground focus:ring-2 focus:ring-teal/40 ${
            prefix ? "pl-11" : "pl-5"
          } ${error ? "border-destructive focus:border-destructive" : "border-input focus:border-teal"}`}
        />
      </div>
      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}

      <button
        type="button"
        onClick={submit}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-teal-bright hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--teal-bright)_80%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/60"
      >
        Continue
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}


