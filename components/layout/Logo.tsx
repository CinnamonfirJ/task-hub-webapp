import { Activity } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
        <Activity size={24} strokeWidth={2.5} />
      </div>
      <div className="flex items-baseline text-2xl font-extrabold tracking-tight">
        <span>Task</span>
        <span className="text-purple-600">hub</span>
        <div className="ml-0.5 h-1.5 w-1.5 rounded-full bg-purple-600" />
      </div>
    </div>
  );
}
