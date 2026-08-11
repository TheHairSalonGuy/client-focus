export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-[1500px] px-8 md:px-10">
        {/* Contact blocks: side-by-side on desktop, stacked on mobile */}
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-center sm:gap-20">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              Client Success
            </p>
            <a
              href="mailto:joe@myVRteam.com"
              className="rounded-sm text-base text-teal-bright underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-bright focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              joe@myVRteam.com
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              Customer Support
            </p>
            <a
              href="mailto:support@myVRteam.com"
              className="rounded-sm text-base text-teal-bright underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-bright focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              support@myVRteam.com
            </a>
          </div>
        </div>

        {/* Copyright in a narrow row beneath the contacts */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          &copy; 2026 Never Miss a Client. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
