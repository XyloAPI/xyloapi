import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.05em] transition-colors rounded-none select-none",
        // Variants
        variant === "default" && "border-gold/30 bg-gold/10 text-gold shadow-[0_0_8px_rgba(212,175,55,0.05)]",
        variant === "secondary" && "border-border-color bg-charcoal text-white/80",
        variant === "destructive" && "border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.05)]",
        variant === "success" && "border-[#27C93F]/30 bg-[#27C93F]/10 text-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.05)]",
        variant === "warning" && "border-[#FFCC00]/30 bg-[#FFCC00]/10 text-[#FFCC00] shadow-[0_0_8px_rgba(255,204,0,0.05)]",
        variant === "info" && "border-[#0A84FF]/30 bg-[#0A84FF]/10 text-[#0A84FF] shadow-[0_0_8px_rgba(10,132,255,0.05)]",
        variant === "outline" && "border-border-color bg-transparent text-white/60",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
