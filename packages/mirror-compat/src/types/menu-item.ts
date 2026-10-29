import type { InjectionKey, MaybeRef } from 'vue'

export type MMenuItemMode = 'ghost' | 'subtle'

export type MMenuItemSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MMenuItemProps {
  mode?: MMenuItemMode
  size?: MMenuItemSize
  selected?: boolean
  disabled?: boolean
}

export interface MMenuItemChildProps {
  start?: boolean
  end?: boolean
  spread?: boolean
  truncate?: boolean
  size?: MMenuItemSize
}

/**
 * The size a menu item hands down to the children inside it.
 *
 * v1 shipped this as a symbol in the component directory. There is no such
 * directory here, and `src/components` takes `.vue` files only, so the key
 * sits with the props it belongs to. It is internal.
 *
 * v1 handed the mode down as well, but only to write a `-ghost` or `-subtle`
 * class on the child that no rule in `menu-item.css` ever matched. The command
 * colours are the same in both modes, so nothing needs it.
 */
export const MenuItemSizeKey = Symbol('m-menu-item-size') as InjectionKey<
  MaybeRef<MMenuItemSize>
>
