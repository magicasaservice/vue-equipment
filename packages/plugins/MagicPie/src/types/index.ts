export interface MagicPieOptions {
  flip?: boolean
}

export interface PieState {
  id: string
  refCount: number
  percentage: number
  interpolationId: number | undefined
}

export type PiePoint = [number, number]
