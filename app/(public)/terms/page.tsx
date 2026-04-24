import LegalLayout from "@/components/layout/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms and Conditions" lastUpdated="April 2026">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">1. Acceptance and Definitions</h2>
          <p>
            By accessing or using TaskHub (the “Platform”), you agree to these Terms & Conditions. “TaskHub”, “we”, or “us” refers to the TaskHub platform. A User (or “Customer”) is anyone who posts tasks or hires services. A Tasker (Service Provider) is a registered individual or business offering services on TaskHub. Both Users and Taskers are collectively “Participants”. “Services” means the tasks or jobs offered or requested via TaskHub.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">2. Eligibility and Accounts</h2>
          <p>
            You must be at least 18 years old and provide accurate, complete account information. Users provide name, email address, contact, payment details; Taskers also complete identity verification (see KYC below). Each Participant is responsible for all activity under their account. You may not share accounts.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">3. KYC & Verification</h2>
          <p>
            Taskers must complete identity verification before offering services. We require valid identification (NIN or international passport) and a live selfie. Verification is performed via third-party providers (Didit and Authentify) to confirm identity. Until verified, Taskers cannot accept jobs or withdraw earnings. Both Users and Taskers will verify their email address by submitting a One-Time Password (OTP) sent to the email they provided. By registering, you consent to this verification; failure or fraud may lead to suspension. TaskHub may perform additional background checks or request documents for compliance (e.g. to combat fraud or illegal activity).
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">4. Service Listings & Hiring</h2>
          <p>
            Users may post tasks with descriptions, location, date/time, and proposed payment. Taskers can browse and bid or accept posted tasks. TaskHub does not guarantee any Tasker will respond; TaskHub is not a party to contracts between Users and Taskers. Once a Tasker agrees to a task, it is considered “in progress.”
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">5. Payments & Escrow</h2>
          <p>
            All payments are handled through TaskHub’s escrow system. A User must deposit the agreed task fee into escrow before work begins. These funds are held securely until the task is marked complete. Taskers receive payment from escrow only after successful completion and confirmation by the User. TaskHub charges a platform fee (commission) of [Commission 15%] on each transaction (the amount withheld from the Tasker’s payout). Payment methods (e.g. card, bank transfer) are subject to our payment processor’s terms. Under no circumstances should participants agree to off-platform payments; doing so violates these Terms.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">6. Completion, Confirmation & Release of Funds</h2>
          <p>
            When a Tasker finishes the work, they mark the task as completed. The User then has a limited time (e.g. 24–48 hours) to confirm satisfactory completion. If the User confirms, escrow is released: TaskHub deducts its commission and the remainder is paid to the Tasker. If the User does not respond in time, the task is auto-completed and funds are released.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">7. Cancellation & Refunds</h2>
          <p>
            Users may cancel a task before any Tasker accepts it, with no penalty (full refund to the User). After acceptance, cancellations are subject to fees or partial refunds at TaskHub’s discretion. If a Tasker fails to start or complete a confirmed task, the User may request a refund. TaskHub’s Dispute Policy governs such cases: see below. Refunds may be full or partial based on work done; any refund decision is at TaskHub’s discretion after review.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">8. Disputes and Resolution</h2>
          <p>
            If there is a problem (quality issues, no-show, payment errors, etc.), either party can file a dispute through TaskHub’s support center. Both User and Tasker should submit evidence (messages, photos, etc.). TaskHub will review disputes promptly (typically within 14 days) and make a binding decision: awarding full payment to Tasker, a full refund to the User, or a partial split. TaskHub’s decision is final. Participants agree to cooperate in good faith. We reserve the right to suspend or terminate accounts for abusive or fraudulent disputes.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">9. Participant Obligations</h2>
          <div className="space-y-4">
            <p><strong>Users:</strong> Provide clear task details, reasonable budgets, and timely payment. Accurately rate and review completed tasks. Communicate respectfully. Confirm completion honestly.</p>
            <p><strong>Taskers:</strong> Accurately describe skills and pricing. Complete tasks as agreed (on time and to specifications). Maintain professionalism and safety. Charge only the agreed price. Honor scheduled appointments and notify the User promptly of any issues.</p>
            <p>Neither party should solicit private payments or poach outside TaskHub. Violations may result in penalties or banning.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">10. Ratings & Reviews</h2>
          <p>
            Upon task completion, Users may rate and review Taskers, and vice versa. Reviews must be honest, civil, and based on the actual experience. Fraudulent or defamatory reviews are prohibited. TaskHub may remove reviews that violate guidelines. Highly-rated Taskers may receive a “Top Rated” badge.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">11. Prohibited Conduct</h2>
          <p>
            Participants must not use TaskHub for unlawful or unethical tasks (e.g. fraud, illegal substances, dangerous services, professional advice requiring licenses, etc.). Harassment, hate speech, bribery, or other abuse is strictly prohibited. We reserve the right to refuse any task request that violates laws or these rules.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">12. Account Suspension and Termination</h2>
          <p>
            TaskHub may suspend or terminate any account at any time for reasons including but not limited to: violation of these Terms, failure to pay fees, fraud, repeated complaints, or inactivity. Upon termination, pending tasks are cancelled and any remaining escrow funds may be refunded to the User. Terminated Taskers forfeit any funds not yet cleared from escrow.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">13. Limitation of Liability</h2>
          <p>
            TaskHub is an intermediary platform and is not a party to service contracts. We do not guarantee the identity, background, or performance of any Participant. To the fullest extent permitted by law, TaskHub disclaims liability for any losses, damages, or injuries arising from using the platform or from transactions between Users and Taskers. Neither party will hold TaskHub liable for indirect or consequential damages.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">14. Indemnification</h2>
          <p>
            Participants agree to indemnify and hold TaskHub and its affiliates harmless from any claims, losses, or liabilities (including legal fees) arising from their use of the platform, breach of these Terms, or violation of law.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">15. Amendments</h2>
          <p>
            TaskHub may modify these Terms at any time (updated Terms are posted on our site). Continued use of the platform after changes constitutes acceptance. Significant changes (e.g. new fees) will be communicated via email or announcement, and Users must consent to updated terms before continuing use.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">16. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Nigeria (e.g. Nigerian Civil Code and applicable business laws). Any disputes not resolved through TaskHub’s process shall be submitted to the courts of Nigeria.
          </p>
        </div>

        <div className="space-y-8 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold">17. Contact Information</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:support@ngtaskhub.com" className="text-primary hover:underline">support@ngtaskhub.com</a></p>
          <div className="bg-gray-50 p-6 rounded-xl space-y-2 text-sm">
            <p className="font-bold">Address:</p>
            <p>Wagtail Road, blakenall Walsall, United Kingdom</p>
            <p>Row E, NNPC Housing estate, Eleme, Rivers state, Nigeria</p>
            <p>Reg no: 8449599</p>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
