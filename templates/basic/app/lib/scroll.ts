import { createLenis } from '@joycostudio/lenis'

export const { LenisContextProvider, store, useLenis } = createLenis({
  autoRaf: true,
  syncTouch: false,
})
