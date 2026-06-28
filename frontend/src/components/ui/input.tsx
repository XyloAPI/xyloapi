import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[42px] w-full border border-border-color bg-black px-3 py-2.5 font-mono text-xs text-white rounded-none outline-none transition-colors placeholder:text-ash/50 focus:border-gold disabled:cursor-not-allowed disabled:opacity-50 box-sizing-border",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
