export type MTextareaSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MTextareaProps {
  modelValue: string | number
  id?: string
  label: string
  size?: MTextareaSize
  simple?: boolean
  blur?: boolean
  disabled?: boolean
  spellcheck?: boolean
  error?: boolean
  required?: boolean
}
