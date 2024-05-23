import type { CollisionEvents } from '../../../MagicScroll'
import type { CommandEvents } from '../../../MagicCommand'
import type { CookieEvents } from '../../../MagicCookie'
import type { DraggableEvents } from '../../../MagicDraggable'
import type { DrawerEvents } from '../../../MagicDrawer'
import type { ModalEvents } from '../../../MagicModal'
import type { ToastEvents } from '../../../MagicToast'

type MergeTypes<T, U> = {
  [K in keyof (T & U)]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K]
      : T[K]
    : K extends keyof U
    ? U[K]
    : never
}

type Merge<T extends any[]> = T extends [infer First, ...infer Rest]
  ? MergeTypes<First, Merge<Rest>>
  : {}

export type MagicEmitterEvents = Merge<
  [
    CollisionEvents,
    CommandEvents,
    CookieEvents,
    DraggableEvents,
    DrawerEvents,
    ModalEvents,
    ToastEvents
  ]
>
