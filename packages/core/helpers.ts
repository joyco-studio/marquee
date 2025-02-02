import { MarqueeConfig } from './core'

export const pxPerSecond = (px: number, seconds: number) => (px / seconds) * 1000

export const warn = (message: string) => {
  if (MarqueeConfig.disableWarnings) return
  console.warn(`[@joycostudio/marquee]: ${message}`)
}
