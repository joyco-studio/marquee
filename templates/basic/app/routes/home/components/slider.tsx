'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/cn'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-2 overflow-hidden rounded-full grow bg-secondary/30">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-5 h-5 transition-colors border-2 rounded-full cursor-ew-resize border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
