import type { InjectionKey, MaybeRef } from 'vue'

export type MMenuCardSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MMenuCardProps {
  size?: MMenuCardSize
  selected?: boolean
  disabled?: boolean
}

export interface MMenuCardChildProps {
  start?: boolean
  end?: boolean
  spread?: boolean
  size?: MMenuCardSize
}

/**
 * The size a menu card hands down to the children inside it.
 *
 * v1 shipped this as a symbol in the component directory. There is no such
 * directory here, and `src/components` takes `.vue` files only, so the key
 * sits with the props it belongs to. It is internal.
 */
export const MenuCardSizeKey = Symbol('m-menu-card-size') as InjectionKey<
  MaybeRef<MMenuCardSize>
>
