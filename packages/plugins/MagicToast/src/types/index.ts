import type { MaybeRef, Slots } from 'vue'
import type { RequireAllNested } from '@maas/vue-equipment/utils'
import type { UseToastTimeout } from '../composables/private/useToastTimeout'

type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

export interface ToastView {
  id: string
  component: object
  props?: MaybeRef<Record<string, unknown>>
  slots?: Slots
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
  timeout: UseToastTimeout | undefined
}

export interface ToastState {
  id: string
  refCount: number
  views: ToastView[]
  expanded: boolean
  animating: boolean
  options: RequiredMagicToastOptions
}

export interface ActiveToast {
  id: string
  height: number
  padding: {
    top: number
    bottom: number
  }
}

export interface ToastEvents {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
}

export interface MagicToastOptions {
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

export type RequiredMagicToastOptions = RequireAllNested<MagicToastOptions>
