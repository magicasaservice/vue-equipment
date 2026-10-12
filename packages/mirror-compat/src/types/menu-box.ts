import type { Component, InjectionKey, MaybeRef } from 'vue'
import type { ElementOrComponent } from '@maas/mirror/vue'

export type MMenuBoxSize = 'xs' | 'sm' | 'md' | 'lg'

export interface MMenuBoxProps {
  size?: MMenuBoxSize
  as?: Extract<ElementOrComponent, 'ol' | 'ul' | 'div' | 'dialog'> | Component
  asChild?: boolean
}

/**
 * The size a menu box hands down to the items inside it.
 *
 * v1 shipped this as a symbol in the component directory. There is no such
 * directory here, and `src/components` takes `.vue` files only, so the key
 * sits with the props it belongs to. It is internal: nothing outside this
 * package injects it.
 */
export const MenuBoxSizeKey = Symbol('m-menu-box-size') as InjectionKey<
  MaybeRef<MMenuBoxSize>
>
