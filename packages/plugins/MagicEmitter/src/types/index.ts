import type { MagicCollisionEvents } from '../../../MagicScroll'
import type { MagicCommandEvents } from '../../../MagicCommand'
import type { MagicCookieEvents } from '../../../MagicCookie'
import type { MagicDrawerEvents } from '../../../MagicDrawer'
import type { MagicModalEvents } from '../../../MagicModal'
import type { MagicToastEvents } from '../../../MagicToast'

type Merge<T extends any[]> = T extends [infer First, ...infer Rest]
  ? MergeTypes<First, Merge<Rest>>
  : {}

type MergeTypes<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K]
} & U

export type MagicEmitterEvents = Merge<
  [
    MagicCollisionEvents,
    MagicCommandEvents,
    MagicCookieEvents,
    MagicDrawerEvents,
    MagicModalEvents,
    MagicToastEvents
  ]
>
