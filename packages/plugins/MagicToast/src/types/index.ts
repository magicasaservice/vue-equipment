import type { MaybeRef } from 'vue'
import type { PickPartial } from '@maas/vue-equipment/utils'

type MagicToast = {
  id: string
  component: Object
  props?: MaybeRef<Record<string, any>>
  remove: Function
}

type MagicToastInstance = {
  id: string
  toasts: MagicToast[]
  add: (args: AddToastArgs) => string
  remove: (id: string) => void
}

type MagicToastOptions = {
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transitions?: {
    list: string
  }
  layout?: {
    expand?: boolean | 'hover' | 'click'
    max?: false | number
  }
}

type ActiveElement = {
  id: string
  height: number
  padding: {
    top: number
    bottom: number
  }
}

type MagicToastEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

type AddToastArgs = Pick<MagicToast, 'component'> &
  PickPartial<MagicToast, 'props'> & { duration?: number }

export type {
  MagicToast,
  MagicToastInstance,
  MagicToastOptions,
  ActiveElement,
  MagicToastEvents,
  AddToastArgs,
}
