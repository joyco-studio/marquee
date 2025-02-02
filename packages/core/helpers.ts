export const pxPerSecond = (px: number, seconds: number) => (px / seconds) * 1000
export const warn = (message: string) => console.warn(`[@joycostudio/marquee]: ${message}`)