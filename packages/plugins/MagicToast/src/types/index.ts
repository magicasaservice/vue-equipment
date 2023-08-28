type Toast = {
  id: string
  component: InstanceType<any>
  destroy: Function
}

type ToastInstance = {
  id: string
  toasts: Toast[]
  add: Function
  remove: Function
}

type DefaultOptions = {
  teleport?: {
    target: string
    disabled?: boolean
  }
}

export type { Toast, ToastInstance, DefaultOptions }
