import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const dimensions = {
    sm: { width: 90, height: 30 },
    md: { width: 120, height: 40 },
    lg: { width: 180, height: 60 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src='/assets/logo.png'
        alt='Taskhub Logo'
        width={width}
        height={height}
        className='h-auto w-auto object-contain'
        priority
      />
    </div>
  );
}
