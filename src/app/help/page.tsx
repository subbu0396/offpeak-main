const FAQS = [
  {
    question: 'How do I book a space?',
    answer:
      'Browse available spaces in the Explore tab, select a space that suits your needs, choose your desired date and time slot, and confirm your booking. You will receive a confirmation email with all the details.',
  },
  {
    question: 'What is off-peak pricing?',
    answer:
      'Off-peak pricing means you pay less to use a space during quieter times — for example, a parking spot on a Sunday morning or a restaurant private dining room on a Monday lunchtime. Owners set discounted rates for these periods to fill otherwise empty capacity.',
  },
  {
    question: 'How do bids work?',
    answer:
      'Some spaces allow you to submit a bid for a lower price. Enter the amount you are willing to pay for a booking. The owner will accept, counter, or decline your bid. If accepted, the booking is confirmed at your bid price.',
  },
  {
    question: 'How do I list my space?',
    answer:
      'Switch to the Owner role using the role switcher at the bottom of the screen. Navigate to Listings, then tap "Add Listing". Fill in your space details, set your pricing and off-peak slots, and publish. Your listing will be visible to seekers immediately.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Email us at support@offpeak.com and we will respond within one business day.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancellations made more than 24 hours before a booking start time are fully refunded. Cancellations within 24 hours may be subject to a 50% charge. Some spaces have custom policies — check the individual listing for details.',
  },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Help &amp; FAQ</h1>
        <p className="text-sm text-muted-foreground">
          Answers to the most common questions about OffPeak.
        </p>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-slate-200 bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-medium text-foreground select-none">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Still need help?{' '}
        <a href="mailto:support@offpeak.com" className="text-teal-600 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  )
}
