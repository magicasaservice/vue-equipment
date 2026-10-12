export type MInputSize = 'xs' | 'sm' | 'md' | 'lg'

export type MInputType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url'

export interface MInputProps {
  modelValue: string | number
  id?: string
  label: string
  size?: MInputSize
  type?: MInputType
  simple?: boolean
  blur?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  disabled?: boolean
  spellcheck?: boolean
  error?: boolean
  required?: boolean
}
