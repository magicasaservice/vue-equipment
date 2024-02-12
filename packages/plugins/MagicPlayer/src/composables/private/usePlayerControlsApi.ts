import { ref, computed, watch, toValue, type MaybeRef, type Ref } from 'vue'
import {
  useResizeObserver,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import { clampValue, mapValue } from '@maas/vue-equipment/utils'
import { usePlayerMediaApi } from './usePlayerMediaApi'
import { usePlayerVideoApi } from './usePlayerVideoApi'
import { usePlayerStateEmitter } from './usePlayerStateEmitter'

export type UsePlayerControlsApiArgs = {
  id: MaybeRef<string>
  barRef?: Ref<HTMLDivElement | undefined>
  trackRef?: Ref<HTMLDivElement | undefined>
  popoverRef?: Ref<HTMLDivElement | undefined>
}

export function usePlayerControlsApi(args: UsePlayerControlsApiArgs) {
  // Private state
  const resumePlay = ref(false)
  const barRect = ref<DOMRect | undefined>(undefined)
  const trackRect = ref<DOMRect | undefined>(undefined)
  const popoverRect = ref<DOMRect | undefined>(undefined)

  const { trackRef, barRef, popoverRef } = args

  const { buffered, duration, playing, currentTime } = usePlayerMediaApi({
    id: args.id,
  })
  const { play, pause, seek } = usePlayerVideoApi({
    id: args.id,
  })

  // Public state
  const dragging = ref(false)
  const mouseEntered = ref(false)
  const seekedTime = ref(0)
  const seekedPercentage = ref(0)
  const scrubbedPercentage = ref(0)
  const thumbPercentage = ref(0)
  const popoverOffsetX = ref(0)

  const bufferedPercentage = computed(() => {
    if (!buffered) return 0

    const endBuffer = buffered.value?.length > 0 ? buffered.value[0][1] : 0
    const percentage = (endBuffer / duration.value) * 100
    return clampValue(percentage, 0, thumbPercentage.value)
  })

  // Private functions
  function getPopoverOffsetX() {
    if (!trackRect.value || !popoverRect.value || !barRect.value) {
      return 0
    } else {
      const trackFactor = barRect.value.width / trackRect.value.width

      const offsetXPercentage =
        (Math.abs(trackRect.value.x - barRect.value.x) / barRect.value.width) *
        100

      const popoverWidthPercentage =
        (popoverRect.value.width / barRect.value.width) * 100

      const maxPercentage = 100 - popoverWidthPercentage

      const percentage =
        seekedPercentage.value / trackFactor +
        offsetXPercentage -
        popoverWidthPercentage / 2

      popoverOffsetX.value = clampValue(percentage, 0, maxPercentage)
    }
  }

  function getTimelineTrackSize() {
    // Safe guard against undefined ref
    if (!toValue(trackRef)) {
      return
    }

    trackRect.value = toValue(trackRef)!.getBoundingClientRect()
    thumbPercentage.value =
      100 - (trackRect.value.height / trackRect.value.width) * 100
  }

  function getPopoverSizes() {
    // Safe guard against undefined refs
    if (!toValue(barRef) || !toValue(popoverRef)) {
      return
    }

    barRect.value = toValue(barRef)!.getBoundingClientRect()
    popoverRect.value = toValue(popoverRef)!.getBoundingClientRect()
  }

  function seekToTrackPosition(absX: number) {
    if (!trackRect.value) {
      throw new Error('trackRect is undefined')
    }

    const relX = absX - trackRect.value!.x - trackRect.value!.height / 2
    const percentage = Math.round((relX / trackRect.value!.width) * 100)

    seekedPercentage.value = clampValue(percentage, 0, thumbPercentage.value)

    seekedTime.value =
      (duration.value *
        mapValue(seekedPercentage.value, 0, thumbPercentage.value, 0, 100)) /
      100

    if (dragging.value) {
      scrubbedPercentage.value = seekedPercentage.value
      seek(seekedTime.value)
    }

    // Update popover offset (side effect)
    getPopoverOffsetX()
  }

  // Public functions
  function onMouseenter() {
    getTimelineTrackSize()
    getPopoverSizes()
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
    dragging.value = false
    seekedTime.value = 0
  }

  function onPointerdown(e: MouseEvent | TouchEvent) {
    dragging.value = true
    resumePlay.value = playing.value
    pause()
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    seekToTrackPosition(x)
  }

  function onPointerup() {
    dragging.value = false
    if (resumePlay.value) {
      play()
    }
  }

  function onPointermove(e: MouseEvent | TouchEvent) {
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    seekToTrackPosition(x)
  }

  // Lifecycle
  watch(() => trackRef, getTimelineTrackSize)
  watch(() => popoverRef, getPopoverSizes)
  watch(() => barRef, getPopoverSizes)

  watch(currentTime, (value) => {
    const percentage = (value / duration?.value) * 100
    scrubbedPercentage.value = mapValue(
      percentage,
      0,
      100,
      0,
      thumbPercentage.value
    )
  })

  useResizeObserver(trackRef, getTimelineTrackSize)
  useResizeObserver(popoverRef, getPopoverSizes)

  useEventListener(
    defaultWindow,
    'resize',
    () => {
      getTimelineTrackSize
      getPopoverSizes
    },
    {
      passive: true,
    }
  )

  const emitter = usePlayerStateEmitter()

  // Listen to updates
  emitter.on('update', (payload) => {
    if (payload.id !== toValue(args.id)) return

    if (payload.api === 'controls') {
      switch (payload.key) {
        case 'dragging': {
          dragging.value = payload.value as boolean
          break
        }
        case 'mouseEntered': {
          mouseEntered.value = payload.value as boolean
          break
        }
        case 'seekedTime': {
          seekedTime.value = payload.value as number
          break
        }
        case 'seekedPercentage': {
          seekedPercentage.value = payload.value as number
          break
        }
        case 'scrubbedPercentage': {
          scrubbedPercentage.value = payload.value as number
          break
        }
        case 'thumbPercentage': {
          thumbPercentage.value = payload.value as number
          break
        }
        case 'popoverOffsetX': {
          popoverOffsetX.value = payload.value as number
          break
        }
        case 'barRect': {
          barRect.value = payload.value as DOMRect
          break
        }
        case 'trackRect': {
          trackRect.value = payload.value as DOMRect
          break
        }
        case 'popoverRect': {
          popoverRect.value = payload.value as DOMRect
          break
        }
      }
    }
  })

  // Emit updates
  watch(dragging, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'dragging',
      value,
    })
  })

  watch(mouseEntered, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'mouseEntered',
      value,
    })
  })

  watch(seekedTime, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'seekedTime',
      value,
    })
  })

  watch(seekedPercentage, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'seekedPercentage',
      value,
    })
  })

  watch(scrubbedPercentage, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'scrubbedPercentage',
      value,
    })
  })

  watch(bufferedPercentage, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'bufferedPercentage',
      value,
    })
  })

  watch(thumbPercentage, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'thumbPercentage',
      value,
    })
  })

  watch(popoverOffsetX, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'popoverOffsetX',
      value,
    })
  })

  watch(resumePlay, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'resumePlay',
      value,
    })
  })

  watch(barRect, (value) => {
    if (!value) return

    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'barRect',
      value,
    })
  })

  watch(trackRect, (value) => {
    if (!value) return

    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'trackRect',
      value,
    })
  })

  watch(popoverRect, (value) => {
    if (!value) return

    emitter.emit('update', {
      id: toValue(args.id),
      api: 'controls',
      key: 'popoverRect',
      value,
    })
  })

  return {
    mouseEntered,
    dragging,
    seekedTime,
    seekedPercentage,
    scrubbedPercentage,
    bufferedPercentage,
    thumbPercentage,
    popoverOffsetX,
    onMouseenter,
    onMouseleave,
    onPointerdown,
    onPointerup,
    onPointermove,
    trackRect,
  }
}

export type UsePlayerControlsApiReturn = ReturnType<typeof usePlayerControlsApi>
