interface isWithinRangeArgs {
  input: number
  base: number
  threshold: number
}

export function isWithinRange(args: isWithinRangeArgs): boolean {
  const { input, base, threshold } = args
  return input >= base - threshold && input <= base + threshold
}
