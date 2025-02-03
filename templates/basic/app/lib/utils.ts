export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const rangeRemap = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
  return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
}
