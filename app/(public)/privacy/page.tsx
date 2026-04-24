import LegalLayout from "@/components/layout/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 2026">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">1. Overview</h2>
          <p>
            TaskHub (“we” or “us”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect about Users and Taskers (“you”), why we collect it, how we use it, and your rights under the Nigerian Data Protection Regulation (NDPR) and other laws. By using TaskHub, you consent to the data practices described here.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">2. Information We Collect</h2>
          <p>We collect Personal Data that you provide when using TaskHub:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, profile photo, address, and (for Taskers and User) professional details (skills, experience).</li>
            <li><strong>KYC Data:</strong> To comply with KYC/AML rules, Taskers must submit identity documents (passport or national ID/NIN) and a live selfie. We also collect NIN for certain verifications. Didit and Authentify verify these; we do not retain sensitive raw data longer than needed.</li>
            <li><strong>Contact & Payment Details:</strong> Bank account or mobile wallet info (for Tasker withdrawals) and payment card details (for Users to pay). We store only necessary payment tokens; full card data is handled by payment partners.</li>
            <li><strong>Task Data:</strong> Task descriptions, locations, messages between participants, and history of booked/completed tasks.</li>
            <li><strong>Usage Data:</strong> Device information, IP addresses, browser type, login times, and cookies or analytics data to understand how you use the platform and to improve it.</li>
            <li><strong>Other Data:</strong> Any other information you provide (e.g. support inquiries, survey responses).</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
          <p>We process your data for these purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Providing Services:</strong> To create and manage your account, display relevant service listings, and match you with Taskers/Users.</li>
            <li><strong>KYC/Verification:</strong> To verify Tasker identities (via Didit and Authentify) and comply with anti-fraud and regulatory requirements.</li>
            <li><strong>Payments & Transactions:</strong> To process payments, hold funds in escrow, and send payouts to Taskers. This includes fraud detection and AML checks.</li>
            <li><strong>Communication:</strong> To send you transactional messages (booking confirmations, receipts, reminders) and important updates (policy changes, promotions).</li>
            <li><strong>Platform Improvement:</strong> To analyze usage, fix bugs, and enhance features and user experience.</li>
            <li><strong>Security & Compliance:</strong> To protect against fraud or abuse, enforce our Terms, and comply with legal obligations (e.g. tax, law enforcement requests).</li>
            <li><strong>Advertising & Marketing (if any):</strong> With your consent, we may use contact info for marketing newsletters or promotions (Users can opt out anytime).</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">4. KYC & Third-Party Verification</h2>
          <p>
            We use trusted third-party identity verification services to confirm user identities: Didit (for document verification) and AuthentifyNG (for NIN and facial match). When you submit KYC data, we share only the necessary information (e.g. ID number, selfie image) with these providers. You consent to this sharing by using our verification feature. These providers are bound by their own strict privacy commitments and NDPR compliance.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">5. Sharing of Information</h2>
          <p>We do not sell your personal data. We may share data in limited cases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>With Other Participants:</strong> Task details (like name, contact, task description) are shared with Taskers when a task is posted or booked, so they can complete the job.</li>
            <li><strong>Service Providers:</strong> We share data with processors under contract (e.g. Didit and Authentify for KYC; payment gateways; cloud hosting providers; email/SMS services) as needed to operate TaskHub.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect the rights, safety, or property of others.</li>
            <li><strong>Business Transfers:</strong> If TaskHub is acquired, we will ensure your data remains protected under the NDPR or inform you before any change in ownership of your personal data.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">6. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking tools to personalize your experience and analyze traffic. Most web browsers allow you to block or erase cookies, but doing so may prevent some features from working properly.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">7. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, such as encryption (TLS) in transit and secure databases at rest, firewalls, and restricted access controls. Only authorized personnel may access your data, under strict privacy obligations.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">8. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary for the purposes outlined. By default, we delete or anonymize inactive accounts and associated data after a period of inactivity, except where we must keep logs for legal reasons. You can request deletion of your account at any time.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">9. Your Rights</h2>
          <p>Under NDPR and related laws, you have rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access:</strong> You can request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> You can ask us to correct inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> You can request deletion of your data (subject to legal limits).</li>
            <li><strong>Portability:</strong> You may request your data in a portable format.</li>
            <li><strong>Withdraw Consent:</strong> You can withdraw consent for processing based on consent.</li>
            <li><strong>Object:</strong> You may object to certain processing (e.g. direct marketing).</li>
            <li><strong>Complaint:</strong> You can lodge a complaint with the National Information Technology Development Agency (NITDA) or NDPC.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">10. Dispute Resolution & Refund Policy</h2>
          <p>
            If a User disputes a transaction (e.g. non-delivery of service), both parties must provide evidence. TaskHub reviews disputes within 14 days (see Terms section 8).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Refunds:</strong> Approved refunds may be full or partial. If a Tasker fails to start the work, the User may receive a full refund.</li>
            <li><strong>Chargebacks:</strong> If a User disputes a payment via their bank instead of TaskHub, we may suspend the account and pursue incurred fees.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">11. Tasker Withdrawal Policy</h2>
          <p>
            Taskers earn money added to their TaskHub wallet after each completed task. Withdrawal rules: Taskers must have completed KYC and have at least ₦[X,000] in their wallet. Withdrawals are processed weekly (or on request within 1–2 business days), subject to the TaskHub commission and small network fees.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">12. Children’s Privacy</h2>
          <p>
            TaskHub is not directed to children under 18. We do not knowingly collect personal data from minors.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">13. Policy Updates</h2>
          <p>
            We may update this Privacy Policy. Material changes will be communicated via email or notice on the Platform.
          </p>
        </div>

        <div className="space-y-8 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold">14. Contact Information</h2>
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
