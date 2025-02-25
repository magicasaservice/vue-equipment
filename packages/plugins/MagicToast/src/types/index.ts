import type { MaybeRef } from 'vue'
import type { RequireAll } from '@maas/vue-equipment/utils'

type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom'
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
  dragStart: Date | undefined
  dragging: boolean
  shouldClose: boolean
  interpolateTo: number | undefined
  snappedX: number
  snappedY: number
  originX: number
  originY: number
  lastDraggedX: number
  lastDraggedY: number
  draggedX: number
  draggedY: number
}

export type ToastState = {
  id: string
  views: ToastView[]
  options: ToastDefaultOptions
  expanded: boolean
  animating: boolean
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
  debug?: boolean
  position?: Position
  duration?: number
  scrollLock?: boolean | { padding: boolean }
  teleport?: {
    target?: string
    disabled?: boolean
  }
  transition?: string
  layout?: {
    expand?: false | 'hover' | 'click'
    max?: number
  }
  animation?: {
    snap?: {
      duration?: number
      easing?: (t: number) => number
    }
  }
  initial?: {
    expanded?: boolean
  }
  threshold?: {
    lock?: number
    distance?: number
    momentum?: number
  }
}

export type ToastDefaultOptions = RequireAll<MagicToastOptions> & {
  threshold: RequireAll<MagicToastOptions['threshold']>
  animation: RequireAll<MagicToastOptions['animation']>
  initial: RequireAll<MagicToastOptions['initial']>
}
