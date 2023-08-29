import type { Component, MaybeRef } from 'vue'

type Toast = {
  id: string
  component: Component
  props?: MaybeRef<Record<string, unknown>>
  remove: Function
}

interface ToastInstance {
  id: string
  toasts: Toast[]
  add: (args: AddArgs) => string
  remove: (id: string) => void
}

interface Options {
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
