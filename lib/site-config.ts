// Single source of truth for the Calendly scheduling URL.
// Every "Book a Demo" / "Book a Discovery Call" CTA must import this constant
// so the destination can never drift out of sync across components.
export const CALENDLY_URL = "https://calendly.com/myvirtualofficer/discoverycall"

// Single source of truth for the universal Stripe setup checkout used by the
// Essential and Professional "Get Started" buttons (same link for Monthly and
// Annual). Keep it here so the destination stays in sync across the site.
export const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/9B628k5zu8PY4CA5jPds404"

// Dedicated Stripe checkout for the Essential plan billed annually. When Annual is
// selected, the Essential "Get Started" button points here instead of the universal
// setup checkout above.
export const ESSENTIAL_ANNUAL_CHECKOUT_URL = "https://buy.stripe.com/aFa7sE8LG2rA6KIh2xds40a"

// Dedicated Stripe checkout for the Professional plan billed monthly. When Monthly is
// selected, the Professional "Get Started" button points here instead of the universal
// setup checkout above.
export const PROFESSIONAL_MONTHLY_CHECKOUT_URL = "https://buy.stripe.com/aFa8wI9PK7LU8SQ5jPds40b"

// Dedicated Stripe checkout for the Professional plan billed annually. When Annual is
// selected, the Professional "Get Started" button points here instead of the universal
// setup checkout above.
export const PROFESSIONAL_ANNUAL_CHECKOUT_URL = "https://buy.stripe.com/00wbIU8LG3vE6KIeUpds40c"

// Internal route for the Free Assessment experience (the top-right nav CTA and any
// "Start Free Assessment" link point here). Kept as a constant so the destination
// stays consistent across the site.
export const ASSESSMENT_URL = "/assessment"

// Lead-capture / onboarding destination for the "Start Your 30-Day Free Trial" CTA on
// the assessment results page. This is an onboarding page — it does NOT start the trial
// until the visitor completes the required signup steps.
export const FREE_TRIAL_URL = "/get-started"
