import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="mt-auto py-8 border-t border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-400">
        <Link href="/terms" className="hover:text-primary transition-colors">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <Link href="/data-protection" className="hover:text-primary transition-colors">
          Data Protection
        </Link>
        <Link href="/legal" className="hover:text-primary transition-colors">
          Legal Overview
        </Link>
        <p className="md:ml-auto">
          &copy; {new Date().getFullYear()} TaskHub
        </p>
      </div>
    </footer>
  );
}
