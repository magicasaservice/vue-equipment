import type { AsyncComponentLoader, MaybeRef } from 'vue'

type Toast = {
  id: string
  component: AsyncComponentLoader
  props?: MaybeRef<Record<string, any>>
  remove: Function
}

type ToastInstance = {
  id: string
  toasts: Toast[]
  add: (args: AddArgs) => string
  remove: (id: string) => void
}

type Options = {
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transitions?: {
    list: string
  }
  layout?: {
    stack?: boolean
    max?: number
  }
}

type AddArgs = Pick<Toast, 'component' | 'props'> & { duration?: number }

export type { Toast, ToastInstance, Options, AddArgs }
