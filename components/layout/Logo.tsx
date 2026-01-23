import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image 
        src="/assets/logo.png" 
        alt="Taskhub Logo" 
        width={120} 
        height={40} 
        className="h-8 w-auto object-contain"
        priority
      />
    </div>
  );
}
