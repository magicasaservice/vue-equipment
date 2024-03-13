export function toNumber(value: string | number): number {
  return typeof value === 'string' ? parseFloat(value) : Number(value)
}
