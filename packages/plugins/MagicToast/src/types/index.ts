import type { MaybeRef } from 'vue'
import type { PickPartial } from '@maas/vue-equipment/utils'

export type Toast = {
  id: string
  component: object
  props?: MaybeRef<Record<string, unknown>>
  remove: () => void
}

export type AddToastArgs = Pick<Toast, 'component'> &
  PickPartial<Toast, 'props'> & { duration?: number }

export type ToastInstance = {
  id: string
  toasts: Toast[]
  add: (args: AddToastArgs) => string
  remove: (id: string) => void
}

export type ActiveToast = {
  id: string
  height: number
  padding: {
    top: number
    bottom: number
  }
}

export type ToastEvents = {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

export type MagicToastOptions = {
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
