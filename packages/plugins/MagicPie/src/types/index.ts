export interface MagicPieOptions {
  flip?: boolean
}

export interface PieState {
  id: string
  percentage: number
  interpolationId: number | undefined
}

export type PiePoint = [number, number]
