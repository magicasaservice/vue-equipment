import type { RequireAllNested } from '@maas/vue-equipment/utils'

export interface MagicCarouselOptions {
  loop?: boolean
  threshold?: {
    lock?: number
  }
  animation?: {
    snap?: {
      duration?: number
      easing?: (t: number) => number
    }
    momentum?: {
      friction?: number
      damping?: number
    }
  }
  disabled?: boolean
}

export type RequiredMagicCarouselOptions = Required<MagicCarouselOptions> & {
  threshold: Required<MagicCarouselOptions['threshold']>
  animation: RequireAllNested<NonNullable<MagicCarouselOptions['animation']>>
}

export type CarouselTriggerAction = 'previous' | 'next' | number

export interface CarouselSlide {
  id: string
  el: HTMLElement | null
  active: boolean
  width: number
  loopOffset: number
}

export interface CarouselMeasurements {
  scrollWidth: number
  width: number
  range: number
  period: number
  gap: number
  paddingStart: number
  paddingEnd: number
  scrollPaddingStart: number
  scrollPaddingEnd: number
  direction: 1 | -1
}

export interface CarouselState {
  id: string
  refCount: number
  options: RequiredMagicCarouselOptions
  trackEl: HTMLElement | null
  slides: Array<CarouselSlide>
  snapPositions: Array<number>
  measurements: CarouselMeasurements
  activeIndex: number
  dragging: boolean
  scrolling: boolean
  scrollingInternally: boolean
  snapping: boolean
  interpolationId: number | null
  draggable: boolean
  hasSnap: boolean
  snapMandatory: boolean
  arrivedStart: boolean
  arrivedEnd: boolean
  progress: number
  overshoot: number
  rubberbandOffset: number
}

export interface CarouselEvents {
  beforeDrag: {
    id: string
    x: number
    y: number
  }
  drag: {
    id: string
    x: number
    y: number
  }
  afterDrag: {
    id: string
    x: number
    y: number
  }
  beforeSnap: {
    id: string
    snapPoint: number
  }
  snapTo: {
    id: string
    snapPoint: number
    duration?: number
  }
  afterSnap: {
    id: string
    snapPoint: number
  }
  scrollEnd: string
}
