import type { MaybeRef } from 'vue'

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToastView = {
  id: string
  component: object
  props?: MaybeRef<Record<string, unknown>>
  dimensions?: {
    height: number
    padding: {
      top: number
      bottom: number
    }
  }
}

export type ToastState = {
  id: string
  views: ToastView[]
  options: MagicToastOptions
  expanded: boolean
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
  position?: Position
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transition?: string
  layout?: {
    expand?: boolean | 'hover' | 'click'
    max?: false | number
  }
  initial?: {
    expanded?: boolean
  }
}
