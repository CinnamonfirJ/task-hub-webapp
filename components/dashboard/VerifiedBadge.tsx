import { Stars } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
}

export function VerifiedBadge({ isVerified, className = "" }: VerifiedBadgeProps) {
  if (!isVerified) return null;

  return (
    <span 
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA] ${className}`}
    >
      <Stars size={10} fill="currentColor" />
      Verified
    </span>
  );
}
