import type { Metadata } from "next"
import {
  LegalDocument,
  LegalLink,
  LegalList,
  LegalSection,
} from "@/components/legal-document"
import { SmsDisclosures } from "@/components/sms-disclosures"

export const metadata: Metadata = {
  title: "Privacy Policy | Never Miss Customer",
  description:
    "Privacy Policy for Gig AI Inc dba Swish Voice, including how we collect, use, and protect call, order, and SMS data. We do not sell or share mobile phone numbers or SMS opt-in consent with third parties for their marketing.",
  alternates: {
    canonical: "https://www.nevermisscustomer.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Never Miss Customer",
    description:
      "How Gig AI Inc dba Swish Voice collects, uses, and protects information, including transactional SMS for restaurant voice orders.",
    url: "https://www.nevermisscustomer.com/privacy",
    type: "website",
  },
}

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="September 3, 2026"
    >
      <LegalSection title="Who we are">
        <p>
          This Privacy Policy explains how Gig AI Inc, doing business as Swish
          Voice (&quot;Gig AI,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;), collects, uses, and shares information when you
          visit{" "}
          <LegalLink href="https://www.nevermisscustomer.com">
            www.nevermisscustomer.com
          </LegalLink>
          , use our website, or use our voice and SMS services. We also operate
          My Virtual Receptionist and Never Miss Customer restaurant voice
          products on this site.
        </p>
        <p>
          Questions:{" "}
          <LegalLink href="mailto:support@myVRteam.com">
            support@myVRteam.com
          </LegalLink>{" "}
          or{" "}
          <LegalLink href="mailto:joe@myVRteam.com">joe@myVRteam.com</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>Depending on how you interact with us, we may collect:</p>
        <LegalList
          items={[
            "Call audio and transcripts as needed to answer the phone, take orders, and provide support.",
            "Phone numbers, including mobile numbers you verbally provide or confirm on a call.",
            "Order details such as items, special instructions, pickup time, and payment status.",
            "Contact and business information you submit on our website (for example, assessment or get-started forms), such as name, email, restaurant name, and phone number.",
            "Technical information about website visits, such as browser type, device type, pages viewed, and approximate location derived from IP address, through cookies or similar tools used for analytics and advertising measurement.",
          ]}
        />
      </LegalSection>

      <LegalSection title="How we use information">
        <p>We use this information to:</p>
        <LegalList
          items={[
            "Fulfill restaurant voice orders and related customer requests.",
            "Send transactional SMS messages, including a secure payment link and order status updates.",
            "Operate, secure, and improve our website, voice, and SMS services.",
            "Provide customer support and communicate with restaurant operators who request a demo, assessment, or trial.",
            "Comply with law, prevent fraud or abuse, and enforce our terms.",
          ]}
        />
      </LegalSection>

      <LegalSection id="sms" title="Text messaging (SMS)">
        <SmsDisclosures />
      </LegalSection>

      <LegalSection title="How we share information">
        <p>
          We share information with service providers that help us operate the
          service — for example, voice and SMS carriers (including Twilio),
          payment processors for secure pay links, hosting, analytics, and
          customer-support tools. Those providers may process information only
          to perform services for us.
        </p>
        <p>
          We may also share information with the restaurant whose virtual
          receptionist handled the call, so that restaurant can fulfill the
          order and support the guest.
        </p>
        <p>
          We do not sell personal information for money. We do not sell or share
          mobile phone numbers or SMS opt-in consent with third parties for
          their marketing.
        </p>
        <p>
          We may disclose information if required by law, legal process, or to
          protect the rights, safety, or property of Gig AI, our customers, or
          others.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep call recordings, transcripts, phone numbers, and order details
          for as long as needed to fulfill the order, provide support, maintain
          security, meet legal or accounting requirements, and resolve disputes.
          We then delete or de-identify the information when it is no longer
          needed for those purposes. Website analytics data is retained
          according to the settings of our analytics providers.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use reasonable administrative, technical, and organizational
          measures designed to protect personal information, including encrypted
          transport, access controls, and secure storage of call and order
          records. No method of transmission or storage is completely secure. If
          you believe your information has been compromised, contact us at the
          addresses below.
        </p>
      </LegalSection>

      <LegalSection title="California and other consumer privacy rights">
        <p>
          Depending on where you live, you may have the right to request access
          to, correction of, or deletion of personal information we hold about
          you, and to appeal a denial of such a request. California residents
          may also have rights under the California Consumer Privacy Act (CCPA),
          including the right to know what personal information we collect, the
          right to delete it (subject to legal exceptions), and the right not to
          be discriminated against for exercising those rights.
        </p>
        <p>
          To make a request, email{" "}
          <LegalLink href="mailto:support@myVRteam.com">
            support@myVRteam.com
          </LegalLink>{" "}
          or{" "}
          <LegalLink href="mailto:joe@myVRteam.com">joe@myVRteam.com</LegalLink>{" "}
          and describe the request. We will verify your identity before
          fulfilling it. You may also designate an authorized agent to submit a
          request on your behalf.
        </p>
      </LegalSection>

      <LegalSection title="Children’s privacy">
        <p>
          Our website and services are not directed at children under 13, and we
          do not knowingly collect personal information from children under 13.
          If you believe a child has provided us information, contact us and we
          will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The effective
          date at the top of this page will change when we do. Continued use of
          the website or services after an update means you acknowledge the
          revised policy. Material changes will be posted on this page.
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
          <LegalLink href="/terms">Terms of Service</LegalLink>
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
