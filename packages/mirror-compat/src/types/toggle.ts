export type MToggleMode = 'solid' | 'subtle'

export type MToggleSize = 'sm' | 'md' | 'lg'

export interface MToggleProps {
  modelValue: boolean | 'indeterminate'
  id?: string
  label?: string
  mode?: MToggleMode
  size?: MToggleSize
  reverse?: boolean
  iconChecked?: boolean
  iconUnchecked?: boolean
  disabled?: boolean
}
