import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  type: string;
  className?: string;
}

export function NotificationBadge({ type, className }: NotificationBadgeProps) {
  const getStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case "announcement":
        return "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50";
      case "promotional":
        return "bg-green-50 text-green-600 border-green-100 hover:bg-green-50";
      case "maintenance":
        return "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-50";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50";
      default:
        return "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-50";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full",
        getStyles(type),
        className
      )}
    >
      {type}
    </Badge>
  );
}
