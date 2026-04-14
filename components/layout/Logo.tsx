import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  width?: number;
  height?: number;
}

export function Logo({
  className = "",
  size = "lg",
  width: customWidth,
  height: customHeight,
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
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src='/assets/logo.png'
        alt='Taskhub Logo'
        width={width}
        height={height}
        className='object-contain'
        priority
      />
    </div>
  );
}
