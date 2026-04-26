import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  width?: number;
  height?: number;
  href?: string;
  variant?: "default" | "footer";
}

export function Logo({
  className = "",
  size = "lg",
  width: customWidth,
  height: customHeight,
  href = "/",
  variant = "default",
}: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 55 },
    md: { width: 150, height: 65 },
    lg: { width: 180, height: 80 },
  };

  const { width: presetWidth, height: presetHeight } = dimensions[size];
  const width = customWidth || presetWidth;
  const height = customHeight || presetHeight;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      <Image
        src='/assets/taskhub-logo.svg'
        alt='TaskHub Logo'
        width={width}
        height={height}
        className={`object-contain ${variant === "footer" ? "brightness-0 invert" : ""}`}
        priority
      />
    </Link>
  );
}
