import { MarqueeConfig } from './core'

export const pxPerSecond = (width: number, speed: number) => (width / speed) * 1000

export const warn = (message: string) => {
  if (MarqueeConfig.disableWarnings) return
  console.warn(`[@joycostudio/marquee]: ${message}`)
}

export const error = (message: string) => {
  console.error(`[@joycostudio/marquee]: ${message}`)
}

export const cn = (...classes: (string | undefined | null)[]) => classes.filter(Boolean).join(' ')
