import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { GetStartedForm } from "@/components/get-started-form"

export const metadata: Metadata = {
  title: "Start Your 14-Day Free Trial | My Virtual Receptionist",
  description:
    "Set up your dedicated virtual receptionist. Share a few details and our team will help you activate your 14-day free trial.",
}

export default function GetStartedPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background px-6 pb-20 pt-28 sm:pt-32">
        <GetStartedForm />
      </main>
      <SiteFooter />
    </>
  )
}
