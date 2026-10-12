export type MBadgeVariant =
  'primary' | 'secondary' | 'accent' | 'success' | 'danger'

export type MBadgeMode = 'solid' | 'muted' | 'subtle' | 'outline'

export type MBadgeSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MBadgeProps {
  variant?: MBadgeVariant
  mode?: MBadgeMode
  size?: MBadgeSize
  round?: boolean
  square?: boolean
}
