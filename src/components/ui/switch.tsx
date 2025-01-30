"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: 'default' | 'violet' | 'blue' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

const getVariantStyles = (variant: SwitchProps['variant'] = 'default') => {
  const variants = {
    default: {
      base: 'shadow-sm',
      checked: 'data-[state=checked]:bg-primary',
      unchecked: 'data-[state=unchecked]:bg-input',
      hover: 'hover:data-[state=checked]:bg-primary/90',
      focusRing: 'focus-visible:ring-ring'
    },
    violet: {
      base: 'shadow-violet-200/50',
      checked: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-violet-600',
      unchecked: 'data-[state=unchecked]:bg-gray-200',
      hover: 'hover:data-[state=checked]:shadow-violet-200/80',
      focusRing: 'focus-visible:ring-violet-500'
    },
    blue: {
      base: 'shadow-blue-200/50',
      checked: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600',
      unchecked: 'data-[state=unchecked]:bg-gray-200',
      hover: 'hover:data-[state=checked]:shadow-blue-200/80',
      focusRing: 'focus-visible:ring-blue-500'
    },
    green: {
      base: 'shadow-green-200/50',
      checked: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600',
      unchecked: 'data-[state=unchecked]:bg-gray-200',
      hover: 'hover:data-[state=checked]:shadow-green-200/80',
      focusRing: 'focus-visible:ring-green-500'
    }
  };
  return variants[variant];
};

const getSizeStyles = (size: SwitchProps['size'] = 'md') => {
  const sizes = {
    sm: {
      root: 'h-4 w-7',
      thumb: 'h-3 w-3 data-[state=checked]:translate-x-3',
    },
    md: {
      root: 'h-6 w-11',
      thumb: 'h-5 w-5 data-[state=checked]:translate-x-5',
    },
    lg: {
      root: 'h-7 w-14',
      thumb: 'h-6 w-6 data-[state=checked]:translate-x-7',
    },
  };
  return sizes[size];
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const styles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        styles.base,
        styles.checked,
        styles.unchecked,
        styles.hover,
        styles.focusRing,
        sizeStyles.root,
        "hover:shadow-lg",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white",
          "shadow-lg ring-0",
          "transition-all duration-200",
          "data-[state=checked]:scale-105",
          "data-[state=unchecked]:translate-x-0",
          sizeStyles.thumb,
          "group-hover/switch:shadow-lg"
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }