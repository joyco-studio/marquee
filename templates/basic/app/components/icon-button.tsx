import { cn } from '@/lib/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const iconButtonVariants = cva('flex font-mono font-medium uppercase items-center justify-center transition-colors', {
  variants: {
    variant: {
      outline: 'text-background hover:bg-background/10 border-2 border-background',
      filled: 'bg-background text-foreground border-2 border-background',
    },
    size: {
      large: 'size-em-[64] rounded-em-[6] text-em-[18] leading-[1]',
      medium: 'size-em-[48] rounded-em-[4] text-em-[16] leading-[1]',
      small: 'size-em-[32] rounded-em-[2] text-em-[14] leading-[1]',
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'medium',
  },
})

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  size?: 'large' | 'medium' | 'small'
}

export const IconButton = ({ className, variant, size, children, ...props }: IconButtonProps) => {
  return (
    <button className={cn(iconButtonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  )
}
