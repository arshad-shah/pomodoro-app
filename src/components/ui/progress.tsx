import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full "
    )}
    {...props}
  >
        <ProgressPrimitive.Indicator
				className={cn(`ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full transition-transform duration-[660ms]`,className)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
			/>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
