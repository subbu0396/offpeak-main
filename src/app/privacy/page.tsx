import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-teal-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: March 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-sm text-foreground">
        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect information you provide directly, such as your name, email address, phone
            number, and payment details when you register or make a booking. We also collect usage
            data automatically, including pages visited, search queries, and device information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your information to provide and improve the Service, process bookings and
            payments, send transactional communications, personalise your experience, and comply
            with legal obligations. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. Sharing Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We share your information with space owners when you make a booking, with payment
            processors to complete transactions, and with service providers who help us operate the
            platform. We may also disclose information when required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to maintain your session, remember your
            preferences, and analyse usage patterns. You can control cookie settings through your
            browser, though some features may not function correctly without them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal data for as long as your account is active or as needed to
            provide services. You may request deletion of your data at any time, subject to legal
            retention requirements (such as financial records).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including encryption in transit and at
            rest. However, no system is completely secure, and we cannot guarantee the absolute
            security of your data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            Depending on your location, you may have the right to access, correct, or delete your
            personal data, object to or restrict certain processing, and request data portability.
            To exercise these rights, contact us at the address below.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy periodically. We will notify you of material changes
            via email or a notice on the platform. Your continued use of the Service after changes
            are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related enquiries, please contact our Data Protection team at{' '}
            <a href="mailto:privacy@offpeak.com" className="text-teal-600 hover:underline">
              privacy@offpeak.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
