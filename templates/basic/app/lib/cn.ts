import clsx, { type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

export const isArbitraryValue = (value: string) => /^\[.+\]$/.test(value)

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      /* This prevents text-em value wipping other text-* classes */
      'font-size': [{ 'text-em': [isArbitraryValue] }],
    },
  },
})

// Allows merging of Tailwind class
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
