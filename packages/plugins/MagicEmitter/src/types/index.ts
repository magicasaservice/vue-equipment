import type { CollisionEvents } from '../../../MagicScroll'
import type { CommandEvents } from '../../../MagicCommand'
import type { CookieEvents } from '../../../MagicCookie'
import type { DrawerEvents } from '../../../MagicDrawer'
import type { ModalEvents } from '../../../MagicModal'
import type { ToastEvents } from '../../../MagicToast'

type Merge<T extends any[]> = T extends [infer First, ...infer Rest]
  ? MergeTypes<First, Merge<Rest>>
  : {}

type MergeTypes<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K]
} & U

export type MagicEmitterEvents = Merge<
  [
    CollisionEvents,
    CommandEvents,
    CookieEvents,
    DrawerEvents,
    ModalEvents,
    ToastEvents
  ]
>
