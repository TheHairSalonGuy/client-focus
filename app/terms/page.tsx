import type { Metadata } from "next"
import {
  LegalDocument,
  LegalLink,
  LegalList,
  LegalSection,
} from "@/components/legal-document"
import { SmsDisclosures } from "@/components/sms-disclosures"

export const metadata: Metadata = {
  title: "Terms of Service | Never Miss Customer",
  description:
    "Terms of Service for Gig AI Inc dba Swish Voice, covering use of the Never Miss Customer website and restaurant voice/SMS services.",
  alternates: {
    canonical: "https://www.nevermisscustomer.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | Never Miss Customer",
    description:
      "Terms governing the Never Miss Customer website and Gig AI Inc dba Swish Voice voice and SMS services.",
    url: "https://www.nevermisscustomer.com/terms",
    type: "website",
  },
}

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate="September 3, 2026"
    >
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
          <LegalLink href="https://www.nevermisscustomer.com">
            www.nevermisscustomer.com
          </LegalLink>{" "}
          and the voice and SMS services operated by Gig AI Inc, doing business
          as Swish Voice (&quot;Gig AI,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). We also operate My Virtual Receptionist and Never
          Miss Customer restaurant voice products on this site.
        </p>
        <p>
          By visiting the website, calling a virtual receptionist number, or
          receiving transactional SMS messages from us, you agree to these
          Terms. If you do not agree, do not use the website or services.
        </p>
      </LegalSection>

      <LegalSection title="Use of the website and voice/SMS services">
        <p>
          The website describes our virtual receptionist products and lets
          restaurant operators request a demo, assessment, or onboarding. The
          voice service answers restaurant phone calls, takes orders, and — when
          you verbally provide or confirm a mobile number on the call — may send
          transactional SMS messages related to that order, such as a
          confirmation, secure payment link, and status updates.
        </p>
        <p>
          Restaurant operators who subscribe to the service are responsible for
          providing accurate menu, hours, and business information, and for
          fulfilling orders placed through the virtual receptionist.
        </p>
      </LegalSection>

      <LegalSection id="sms" title="Text messaging (SMS)">
        <p>
          The following SMS terms apply whenever you receive texts from Gig AI
          Inc dba Swish Voice or a restaurant&apos;s virtual receptionist
          product. They are also stated in our{" "}
          <LegalLink href="/privacy#sms">Privacy Policy</LegalLink>.
        </p>
        <SmsDisclosures showPrivacyCrossLink />
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Use the website or services for any unlawful purpose, or to place fraudulent, harassing, or abusive calls or messages.",
            "Interfere with or disrupt the website, voice lines, SMS delivery, or other users.",
            "Attempt to gain unauthorized access to systems, accounts, or data.",
            "Copy, scrape, reverse engineer, or resell the services except as allowed by law.",
            "Misrepresent your identity or a restaurant’s identity when using the services.",
          ]}
        />
        <p>
          We may suspend or terminate access if we reasonably believe these
          Terms have been violated.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          THE WEBSITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
          AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW, GIG AI INC
          DBA SWISH VOICE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,
          INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not warrant
          that the website, voice service, or SMS delivery will be uninterrupted,
          error-free, or free of harmful components, or that every call or
          message will be completed.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, GIG AI INC DBA SWISH VOICE AND
          ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR
          ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL,
          ARISING OUT OF OR RELATED TO YOUR USE OF THE WEBSITE OR SERVICES, EVEN
          IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATED TO THE
          WEBSITE OR SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU
          PAID US FOR THE SERVICES IN THE TWELVE MONTHS BEFORE THE CLAIM, OR (B)
          ONE HUNDRED U.S. DOLLARS (US $100). Some jurisdictions do not allow
          certain limitations; in those places, our liability is limited to the
          fullest extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the State of California,
          United States, without regard to conflict-of-law rules. You agree that
          courts located in California, USA, will have exclusive jurisdiction
          over disputes arising from these Terms or the services, except that we
          may seek injunctive relief in any jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these Terms from time to time. The effective date at the
          top of this page will change when we do. Continued use of the website
          or services after an update means you accept the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Gig AI Inc dba Swish Voice
          <br />
          Website:{" "}
          <LegalLink href="https://www.nevermisscustomer.com">
            www.nevermisscustomer.com
          </LegalLink>
          <br />
          Support:{" "}
          <LegalLink href="mailto:support@myVRteam.com">
            support@myVRteam.com
          </LegalLink>
          <br />
          Founder:{" "}
          <LegalLink href="mailto:joe@myVRteam.com">joe@myVRteam.com</LegalLink>
        </p>
        <p>
          Related:{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink>
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
