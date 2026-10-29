export type MCheckboxMode = 'solid' | 'subtle'

export type MCheckboxSize = 'sm' | 'md' | 'lg'

/** v1 folded the mixed state into the value rather than into a second prop. */
export type MCheckboxValue = boolean | 'indeterminate'

export interface MCheckboxProps {
  modelValue: MCheckboxValue
  id?: string
  label?: string
  mode?: MCheckboxMode
  size?: MCheckboxSize
  reverse?: boolean
  disabled?: boolean
  error?: boolean
}
