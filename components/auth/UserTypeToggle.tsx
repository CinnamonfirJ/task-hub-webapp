"use client";

import { motion } from "framer-motion";

interface UserTypeToggleProps {
  value: "user" | "tasker";
  onChange: (value: "user" | "tasker") => void;
}

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  return (
    <div className="relative flex w-full rounded-md bg-[#D9D1F0] p-1.5">
      <button
        type="button"
        onClick={() => onChange("user")}
        className={`relative z-10 flex-1 rounded-md py-2.5 text-sm font-semibold transition-colors ${
          value === "user" ? "text-white" : "text-white/90"
        }`}
      >
        Users
        {value === "user" && (
          <motion.div
            layoutId="toggle-active"
            className="absolute inset-0 -z-10 rounded-md bg-[#6B46C1]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("tasker")}
        className={`relative z-10 flex-1 rounded-md py-2.5 text-sm font-semibold transition-colors ${
          value === "tasker" ? "text-white" : "text-white/90"
        }`}
      >
        Taskers
        {value === "tasker" && (
          <motion.div
            layoutId="toggle-active"
            className="absolute inset-0 -z-10 rounded-md bg-[#6B46C1]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    </div>
  );
}
