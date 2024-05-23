import type { CollisionEvents } from '../../../MagicScroll/index'
import type { CommandEvents } from '../../../MagicCommand/index'
import type { CookieEvents } from '../../../MagicCookie/index'
import type { DraggableEvents } from '../../../MagicDraggable/index'
import type { DrawerEvents } from '../../../MagicDrawer/index'
import type { ModalEvents } from '../../../MagicModal/index'
import type { ToastEvents } from '../../../MagicToast/index'

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
