import LegalLayout from "@/components/layout/LegalLayout";

export default function DataProtectionPage() {
  return (
    <LegalLayout title="Data Protection Certification">
      <div className="space-y-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <p className="italic text-slate-700 leading-relaxed">
            TaskHub (the “Company”), a Nigerian service marketplace, hereby certifies that it handles personal data in accordance with the Nigeria Data Protection Regulation (NDPR) 2019 and related laws. This Certificate outlines TaskHub’s commitment to lawful, transparent, and secure data processing for all Users and Taskers of the platform.
          </p>
        </div>

        <section className="space-y-4">
          <ul className="space-y-4 list-none pl-0">
            <li>
              <h3 className="font-bold text-gray-900">● Data Controller</h3>
              <p>TaskHub (Team TaskHub, Abuja, Nigeria) is the Data Controller. We are responsible for personal data collected on our platform.</p>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Purposes of Processing</h3>
              <p>We process personal data for core platform functions: user registration and KYC verification, service matching, payment processing (escrow and payouts), customer support, and fraud prevention. We also use data for platform improvement, analytics, and marketing (with consent).</p>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Lawful Bases</h3>
              <div className="pl-4 space-y-2 text-sm">
                <p><strong>Consent:</strong> Explicit consent is obtained for KYC verification and marketing.</p>
                <p><strong>Contract:</strong> Processing is necessary to perform the service agreement.</p>
                <p><strong>Legal Obligation:</strong> Certain processing is required by law (e.g. AML/CFT regulations).</p>
                <p><strong>Legitimate Interest:</strong> Processing for security (fraud detection) and service improvement.</p>
              </div>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Data Categories</h3>
              <p>Identification data, contact data, financial data, transaction data, and technical data (IP, device info, cookies).</p>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Third-Party Processors</h3>
              <div className="pl-4 space-y-2 text-sm">
                <p><strong>Didit (didit.me):</strong> For ID document verification and liveness checks.</p>
                <p><strong>AuthentifyNG (authentify.com.ng):</strong> For NIN and BVN verification with facial recognition.</p>
                <p><strong>Payment Processors:</strong> PayStack and Stellar for handling card payments and disbursements.</p>
              </div>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Security Measures</h3>
              <p>TaskHub has implemented robust technical and organizational measures: encrypted databases, TLS for all data in transit, strict access controls, routine security audits, and staff training on data protection. Personal data is stored on secure servers located in Oregon, with multi-factor access.</p>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Data Retention</h3>
              <p>Inactive accounts are purged after a set period. KYC data and transactional records are retained for Five(5) years to comply with financial regulations, then securely deleted.</p>
            </li>
            <li>
              <h3 className="font-bold text-gray-900">● Data Subject Rights</h3>
              <p>TaskHub ensures that all users can exercise their NDPR rights: access, correction, deletion, objection, etc.</p>
            </li>
          </ul>
        </section>

        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
          <div className="max-w-md ml-auto text-right space-y-2">
            <p className="text-gray-500 text-sm italic">Authorized Signature:</p>
            <div className="h-12 flex items-end justify-end">
               {/* Placeholder for signature visual */}
               <p className="font-serif text-2xl text-gray-800 border-b border-gray-400 px-4">Ayuba Agiri</p>
            </div>
            <p className="font-bold text-gray-900">Head of Operations, TaskHub</p>
            <p className="text-gray-500 text-sm">Date: 20th April 2026</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
