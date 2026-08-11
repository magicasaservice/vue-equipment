export type ToIndexArgs = {
  col: number
  row: number
  cols: number
}

export function toIndex({ col, row, cols }: ToIndexArgs): number {
  return row * cols + col
}
