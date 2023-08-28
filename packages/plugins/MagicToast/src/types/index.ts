import type { Component } from 'vue'

type Toast = {
  id: string
  component: Component | string
  props?: Record<string, unknown>
  remove: Function
}

type ToastInstance = {
  id: string
  toasts: Toast[]
  add: Function
  remove: Function
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
