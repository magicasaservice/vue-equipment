export interface MSliderStep {
  label: string
  value: number | string
}

export interface MSliderProps {
  modelValue: string | number
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  /** Named stops. Present, they replace `min`, `max` and `step` with an index. */
  steps?: MSliderStep[]
}
