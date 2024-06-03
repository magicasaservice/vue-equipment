import type { CookieEvents } from '../../../MagicCookie/src/types/index'
import type { DraggableEvents } from '../../../MagicDraggable/src/types/index'
import type { DrawerEvents } from '../../../MagicDrawer/src/types/index'
import type { ModalEvents } from '../../../MagicModal/src/types/index'
import type { MenuEvents } from '../../../MagicMenu/src/types/index'
import type { ScrollEvents } from '../../../MagicScroll/src/types/index'
import type { ToastEvents } from '../../../MagicToast/src/types/index'

type MergeTypes<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K]
} & Omit<U, keyof T>

type Merge<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? MergeTypes<First, Merge<Rest>>
  : {}

export type MagicEmitterEvents = Merge<
  [
    CookieEvents,
    DraggableEvents,
    DrawerEvents,
    ModalEvents,
    MenuEvents,
    ScrollEvents,
    ToastEvents
  ]
>
