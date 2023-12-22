import type { MaybeRef } from 'vue'
import type { PickPartial } from '@maas/vue-equipment/utils'

type Toast = {
  id: string
  component: Object
  props?: MaybeRef<Record<string, any>>
  remove: Function
}

type ToastInstance = {
  id: string
  toasts: Toast[]
  add: (args: AddArgs) => string
  remove: (id: string) => void
}

type ToastOptions = {
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

type ToastEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

type AddArgs = Pick<Toast, 'component'> &
  PickPartial<Toast, 'props'> & { duration?: number }

export type {
  Toast,
  ToastInstance,
  ToastOptions,
  ActiveElement,
  ToastEvents,
  AddArgs,
}
