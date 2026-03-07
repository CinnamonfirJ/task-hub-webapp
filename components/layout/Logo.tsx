import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "lg" }: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 60 },
    md: { width: 150, height: 70 },
    lg: { width: 210, height: 90 },
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
