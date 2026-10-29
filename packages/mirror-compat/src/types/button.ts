import type { Component } from 'vue'
import type { ElementOrComponent } from '@maas/mirror/vue'

export type MButtonVariant =
  'primary' | 'secondary' | 'accent' | 'success' | 'danger'

export type MButtonMode =
  'solid' | 'muted' | 'subtle' | 'ghost' | 'outline' | 'plain'

export type MButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MButtonProps {
  as?: Extract<ElementOrComponent, 'a' | 'button' | 'div' | 'span'> | Component
  variant?: MButtonVariant
  mode?: MButtonMode
  size?: MButtonSize
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
  icon?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  square?: boolean
  round?: boolean
  block?: boolean
  selected?: boolean
  disabled?: boolean
  blur?: boolean
  inline?: boolean
}
