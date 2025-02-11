export const rangeRemap = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
  return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
}
