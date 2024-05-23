import type { CollisionEvents } from '../../../MagicScroll'
import type { CommandEvents } from '../../../MagicCommand'
import type { CookieEvents } from '../../../MagicCookie'
import type { DraggableEvents } from '../../../MagicDraggable'
import type { DrawerEvents } from '../../../MagicDrawer'
import type { ModalEvents } from '../../../MagicModal'
import type { ToastEvents } from '../../../MagicToast'

type MergeTypes<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K]
} & Omit<U, keyof T>

type Merge<T extends unknown[]> = T extends [infer First, ...infer Rest]
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
