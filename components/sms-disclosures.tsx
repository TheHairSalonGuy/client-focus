import { LegalLink } from "@/components/legal-document"

/** Shared Twilio A2P SMS disclosures used on Privacy and referenced from Terms. */
export function SmsDisclosures({
  showPrivacyCrossLink = false,
}: {
  showPrivacyCrossLink?: boolean
}) {
  return (
    <div className="space-y-4">
      <p>
        Gig AI Inc dba Swish Voice (also operating My Virtual Receptionist and
        Never Miss Customer restaurant voice products) may send transactional
        text messages related to a phone order you place with a participating
        restaurant. Messages are sent by Gig AI Inc dba Swish Voice and/or the
        restaurant&apos;s virtual receptionist product.
      </p>
      <p>
        How you opt in: during a phone voice order, the caller verbally provides
        or confirms their mobile number so we can text a secure payment link
        (and related order messages). Consent is collected verbally on the call
        for transactional SMS related to that order.
      </p>
      <p>
        Message frequency: typically 1–5 SMS messages per order (order
        confirmation / pay link / status). This is not a marketing blast
        program.
      </p>
      <p>
        Message and data rates may apply.
      </p>
      <p>
        Reply <strong>STOP</strong> to opt out / cancel. Reply{" "}
        <strong>HELP</strong> for help. After you reply STOP, we will send a
        one-time confirmation that you have been unsubscribed and will not send
        further SMS messages unless you opt in again.
      </p>
      <p>
        We do not sell or share mobile phone numbers or SMS opt-in consent with
        third parties for their marketing.
      </p>
      {showPrivacyCrossLink ? (
        <p>
          The full text-messaging policy, including how we collect, use, and
          retain mobile numbers, is in our{" "}
          <LegalLink href="/privacy#sms">Privacy Policy — Text messaging (SMS)</LegalLink>
          .
        </p>
      ) : null}
    </div>
  )
}
