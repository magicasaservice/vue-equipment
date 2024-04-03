import { ref, computed, toValue, type MaybeRef } from 'vue'
import { useDrawerUtils } from './useDrawerUtils'

import { type DefaultOptions } from '../../utils/defaultOptions'

interface UseDrawerStateArgs {
  threshold: MaybeRef<DefaultOptions['threshold']>
}

const dragStart = ref<Date | undefined>(undefined)
const dragging = ref(false)
const shouldClose = ref(false)
const interpolateTo = ref<number | undefined>(undefined)

const originX = ref(0)
const originY = ref(0)
const pointerdownX = ref(0)
const pointerdownY = ref(0)
const lastDraggedX = ref(0)
const lastDraggedY = ref(0)

const draggedX = ref(0)
const draggedY = ref(0)

// Used to determine closest snap point
const relDirectionY = ref<'below' | 'above' | 'absolute'>('absolute')
const relDirectionX = ref<'below' | 'above' | 'absolute'>('absolute')

// Used to determine scroll lock
const absDirectionY = ref<'with' | 'against' | undefined>(undefined)
const absDirectionX = ref<'with' | 'against' | undefined>(undefined)

const elRect = ref<DOMRect | undefined>(undefined)
const wrapperRect = ref<DOMRect | undefined>(undefined)

export function useDrawerState(args: UseDrawerStateArgs) {
  const { threshold } = args
  const { isWithinRange } = useDrawerUtils()

  const hasDragged = computed(() => {
    const hasDraggedX = !isWithinRange({
      input: draggedX.value,
      base: lastDraggedX.value,
      threshold: toValue(threshold).lock,
    })

    const hasDraggedY = !isWithinRange({
      input: draggedY.value,
      base: lastDraggedY.value,
      threshold: toValue(threshold).lock,
    })

    return hasDraggedX || hasDraggedY
  })

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  return {
    dragStart,
    dragging,
    shouldClose,
    interpolateTo,
    originX,
    originY,
    pointerdownX,
    pointerdownY,
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
    relDirectionY,
    relDirectionX,
    absDirectionY,
    absDirectionX,
    elRect,
    wrapperRect,
    hasDragged,
    style,
  }
}
