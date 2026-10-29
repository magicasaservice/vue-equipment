export type MSelectSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MSelectOption {
  value: string | number
  label: string
}

export interface MSelectProps {
  modelValue: string | number
  options: MSelectOption[]
  id?: string
  label: string
  placeholder: string
  size?: MSelectSize
  simple?: boolean
  blur?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  disabled?: boolean
  error?: boolean
  required?: boolean
}
