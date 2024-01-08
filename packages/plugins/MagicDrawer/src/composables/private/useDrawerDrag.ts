import { ref, computed, onMounted, watch, toValue, type MaybeRef } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'

type UseDrawerDragArgs = {
  elRef: MaybeRef<HTMLDivElement | undefined>
  position: 'top' | 'right' | 'bottom' | 'left'
  threshold: MaybeRef<number>
  close: () => void
}

export function useDrawerDrag(args: UseDrawerDragArgs) {
  const { elRef, position, threshold, close } = args

  // Private state
  const originX = ref(0)
  const originY = ref(0)
  const dragging = ref(false)

  const elRect = ref<DOMRect | undefined>(undefined)

  let cancelPointermove: (() => void) | undefined = undefined

  // Public state
  const draggedX = ref(0)
  const draggedY = ref(0)

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  // Private functions
  function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
  }

  function setTransform({ x, y }: { x: number; y: number }) {
    if (position === 'bottom' || position === 'top') {
      draggedY.value = y - originY.value
    } else if (position === 'right' || position === 'left') {
      draggedX.value = x - originX.value
    }
  }

  function onPointerup() {
    dragging.value = false
    cancelPointermove?.()

    if (position === 'bottom' || position === 'top') {
      interpolate({
        from: draggedY.value,
        to: 0,
        duration: 50,
        callback: (value: number) => {
          draggedY.value = value
        },
      })
    } else if (position === 'right' || position === 'left') {
      interpolate({
        from: draggedX.value,
        to: 0,
        duration: 50,
        callback: (value: number) => {
          draggedX.value = value
        },
      })
    }
  }

  function onPointermove(e: PointerEvent) {
    setTransform({ x: e.screenX, y: e.screenY })

    switch (position) {
      case 'bottom':
        if (draggedY.value > toValue(threshold)) {
          dragging.value = false
          cancelPointermove?.()
          close()
        }
        break
      case 'top':
        if (draggedY.value < toValue(threshold) * -1) {
          dragging.value = false
          cancelPointermove?.()
          close()
        }
        break
      case 'right':
        if (draggedX.value > toValue(threshold)) {
          dragging.value = false
          cancelPointermove?.()
          close()
        }
        break
      case 'left':
        if (draggedX.value < toValue(threshold) * -1) {
          dragging.value = false
          cancelPointermove?.()
          close()
        }
        break
    }
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Make sure maintain pointer capture so that we keep receiving events
    ;(e.target! as HTMLElement).setPointerCapture(e.pointerId)

    dragging.value = true
    useEventListener(document, 'pointerup', onPointerup)
    cancelPointermove = useEventListener(document, 'pointermove', onPointermove)

    // Save origin
    originX.value = e.screenX
    originY.value = e.screenY

    // Set initial transform
    onPointermove(e)
  }

  // Lifecycle hooks and listeners
  onMounted(() => {
    getSizes()
  })

  watch(
    () => unrefElement(elRef),
    () => {
      getSizes()
    }
  )

  return {
    style,
    dragging,
    onPointerdown,
  }
}
