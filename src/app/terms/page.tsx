import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: March 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-sm text-foreground">
        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using OffPeak Spaces (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Service.
            These terms apply to all users, including space seekers, space owners, and administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            OffPeak Spaces is a marketplace platform that connects space owners with individuals and
            businesses looking to book spaces at off-peak prices. We facilitate bookings but are not
            a party to agreements between owners and seekers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity that occurs under your account. You must provide accurate and complete
            information when registering. You may not create accounts for fraudulent purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. Bookings and Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            All bookings are subject to availability and owner approval. Prices are displayed
            inclusive of applicable taxes unless otherwise stated. Payment is due at the time of
            booking unless the listing specifies a different arrangement. Refunds are subject to the
            cancellation policy detailed in each listing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Owner Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed">
            Space owners are responsible for ensuring their listings are accurate, that spaces are
            available as advertised, and that all necessary licences and permissions are in place.
            Owners must honour confirmed bookings and maintain spaces to a reasonable standard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Prohibited Conduct</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to use the Service for any unlawful purpose, to harass other users, to
            post false or misleading information, or to interfere with the proper functioning of the
            platform. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, OffPeak Spaces shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the Service.
            Our total liability shall not exceed the amount paid by you in the 12 months preceding
            the claim.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these terms from time to time. We will notify you of significant changes
            via email or a prominent notice on the platform. Continued use of the Service after
            changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@offpeak.com" className="text-teal-600 hover:underline">
              legal@offpeak.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
