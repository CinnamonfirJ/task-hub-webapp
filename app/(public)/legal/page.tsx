import LegalLayout from "@/components/layout/LegalLayout";

export default function LegalOverviewPage() {
  return (
    <LegalLayout title="Legal Overview">
      <section className="space-y-4">
        <p>
          TaskHub is a Nigerian online marketplace connecting customers (“users”) with local service providers (“taskers”). These documents formalize how the platform works and ensure legal compliance, especially with Nigeria’s Data Protection Regulation.
        </p>
        <p>
          The <strong>Terms & Conditions</strong> define roles, responsibilities, payments (including escrow), disputes, refunds, and service rules.
        </p>
        <p>
          The <strong>Privacy Policy</strong> (augmented to include dispute, refund, and tasker withdrawal policies) explains what data we collect (personal information, KYC data, and usage data), how we use and protect it, and users’ rights under NDPR.
        </p>
        <p>
          The <strong>Data Processing & Protection Policy Certificate</strong> attests to TaskHub’s commitment to NDPR compliance, describing lawful bases for processing, third-party processors (Didit, Authentify), security measures, and user rights.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Key Points</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Verification:</strong> Taskers must complete strict KYC (via passport or NIN + selfie using Didit and Authentify).</li>
          <li><strong>Payments:</strong> Payments use an escrow wallet: customers pay up front, and funds are held until task completion.</li>
          <li><strong>Earnings:</strong> Taskers earn payment minus [Commission 15%] once the job is confirmed.</li>
          <li><strong>Disputes:</strong> Disputes are handled by TaskHub’s support through an evidence-based review within approximately 14 days.</li>
          <li><strong>Trust and Safety:</strong> Our policies emphasize verified providers only, secure escrow payments, and clear refund rules (full or partial) if tasks fail.</li>
        </ul>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <p className="text-blue-800 text-sm italic">
          With these policies, TaskHub prioritizes security, legal compliance, and a trustworthy marketplace experience for all our users and partners.
        </p>
      </section>
    </LegalLayout>
  );
}
