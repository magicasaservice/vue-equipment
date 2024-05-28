import {
  ref,
  computed,
  watch,
  toValue,
  type ComputedRef,
  type MaybeRef,
  type Ref,
} from 'vue'
import {
  useEventListener,
  useElementBounding,
  useMagicKeys,
  useFocus,
  onKeyStroke,
} from '@vueuse/core'
import type { MenuTrigger, Coordinates } from '../../types/index'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'

type UseMenuTriggerArgs = {
  instanceId: MaybeRef<string>
  viewId: string
  itemId?: string
  mappedDisabled: ComputedRef<boolean>
  mappedTrigger: ComputedRef<MenuTrigger[]>
  elRef: Ref<HTMLElement | undefined>
}

type IsPointInTriangleArgs = {
  p: Coordinates
  a: Coordinates
  b: Coordinates
  c: Coordinates
}

type IsPointInRectangleArgs = {
  p: Coordinates
  top: number
  left: number
  bottom: number
  right: number
}

export function useMenuTrigger(args: UseMenuTriggerArgs) {
  // Private state
  const { instanceId, viewId, itemId, mappedTrigger, mappedDisabled, elRef } =
    args

  let cancelPointermove: (() => void) | undefined = undefined

  const mouseleaveCoordinates = ref<Coordinates | undefined>(undefined)

  const { getView, selectView, unselectView } = useMenuView(instanceId)
  const view = getView(viewId)

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { focused } = useFocus(elRef)

  const isInsideTriangle = ref(false)
  const isInsideTrigger = ref(false)
  const isInsideContent = ref(false)

  const isOutside = computed(() => {
    return (
      !isInsideTrigger.value &&
      !isInsideContent.value &&
      !isInsideTriangle.value
    )
  })

  const { shift, control } = useMagicKeys()

  // Private functions
  function resetState() {
    mouseleaveCoordinates.value = undefined
    isInsideTriangle.value = false
  }

  function disableCursor() {
    state.input.disabled = [...state.input.disabled, 'pointer']
  }

  function enableCursor() {
    state.input.disabled = state.input.disabled.filter((x) => x !== 'pointer')
  }

  function extendTriangle(
    vertices: [Coordinates, Coordinates, Coordinates],
    pixelAmount: number
  ) {
    // Calculate the centroid
    const centroid: Coordinates = {
      x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
      y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
    }

    function extendPoint(vertex: Coordinates): Coordinates {
      // Direction vector from centroid to vertex
      const dir = {
        x: vertex.x - centroid.x,
        y: vertex.y - centroid.y,
      }

      // Distance from centroid to vertex
      const distance = Math.sqrt(dir.x * dir.x + dir.y * dir.y)

      // Normalized direction vector
      const unitDir = {
        x: dir.x / distance,
        y: dir.y / distance,
      }

      // Scale direction vector by the pixel amount
      const scaledDir = {
        x: unitDir.x * pixelAmount,
        y: unitDir.y * pixelAmount,
      }

      // New vertex position
      return {
        x: vertex.x + scaledDir.x,
        y: vertex.y + scaledDir.y,
      }
    }

    // Extend all vertices
    return [
      extendPoint(vertices[0]),
      extendPoint(vertices[1]),
      extendPoint(vertices[2]),
    ]
  }

  function isPointInTriangle(args: IsPointInTriangleArgs) {
    const { p, a, b, c } = args

    // Vectors from point to triangle vertices
    const v0 = { x: c.x - a.x, y: c.y - a.y }
    const v1 = { x: b.x - a.x, y: b.y - a.y }
    const v2 = { x: p.x - a.x, y: p.y - a.y }

    // Dot products
    const dot00 = v0.x * v0.x + v0.y * v0.y
    const dot01 = v0.x * v1.x + v0.y * v1.y
    const dot02 = v0.x * v2.x + v0.y * v2.y
    const dot11 = v1.x * v1.x + v1.y * v1.y
    const dot12 = v1.x * v2.x + v1.y * v2.y

    // Barycentric coordinates
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom

    // Check if point is in triangle
    return u >= 0 && v >= 0 && u + v <= 1
  }

  function isPointInRectangle(args: IsPointInRectangleArgs) {
    const { p, top, left, bottom, right } = args
    return p.x >= left && p.x <= right && p.y >= top && p.y <= bottom
  }

  async function onPointermove(e: PointerEvent) {
    if (!mouseleaveCoordinates.value || !view?.children.content) {
      return
    }

    const mouseCoordinates = { x: e.clientX, y: e.clientY }
    const { top, left, bottom, right } = useElementBounding(
      view.children.content
    )

    const {
      top: topTrigger,
      left: leftTrigger,
      bottom: bottomTrigger,
      right: rightTrigger,
    } = useElementBounding(elRef)

    // Find the closest side of the content element
    const rightDistance = Math.abs(right.value - mouseleaveCoordinates.value.x)
    const leftDistance = Math.abs(left.value - mouseleaveCoordinates.value.x)
    const mappedX = rightDistance < leftDistance ? right : left

    // Extend triangle by 16 pixels for a better hit area
    const [a, b, c] = extendTriangle(
      [
        mouseleaveCoordinates.value,
        { x: mappedX.value, y: top.value },
        { x: mappedX.value, y: bottom.value },
      ],
      16
    )

    // Check if the mouse is inside the triangle
    isInsideTriangle.value = isPointInTriangle({
      p: mouseCoordinates,
      a,
      b,
      c,
    })

    // Check if the mouse is inside the content element
    isInsideContent.value = isPointInRectangle({
      p: mouseCoordinates,
      top: top.value,
      left: left.value,
      bottom: bottom.value,
      right: right.value,
    })

    // Check if the mouse is inside the trigger element
    isInsideTrigger.value = isPointInRectangle({
      p: mouseCoordinates,
      top: topTrigger.value,
      left: leftTrigger.value,
      bottom: bottomTrigger.value,
      right: rightTrigger.value,
    })
  }

  function onRightClick(e: MouseEvent) {
    console.log('e:', e)
    switch (e.button) {
      case 2:
        selectView(viewId)
        state.active = true

        // Save coordinates, later used for float positioning
        if (view) {
          view.click = { x: e.clientX, y: e.clientY }
        }

        // If the trigger is not nested inside an item, focus the view
        if (!itemId) {
          state.input.view = viewId
        }
        break
      default:
        state.active = false
        unselectView(viewId)
    }
  }

  function onEnter(e: KeyboardEvent) {
    if (focused.value && !mappedDisabled.value && !view?.active) {
      e.preventDefault()
      e.stopPropagation()

      state.active = true
      state.input.type = 'keyboard'
      state.input.view = viewId
      selectView(viewId)
    }
  }

  // Public functions
  function onMouseenter() {
    // Reset mouseleave coordinates and content element
    cancelPointermove?.()
    resetState()

    if (
      mappedTrigger.value.includes('mouseenter') &&
      view &&
      viewId &&
      state.active &&
      !mappedDisabled.value
    ) {
      selectView(viewId)

      // If the trigger is not nested inside an item, focus the view
      if (!itemId) {
        state.input.view = viewId
      }
    }
  }

  function onClick(e: MouseEvent) {
    if (
      mappedTrigger.value.includes('click') &&
      !mappedDisabled.value &&
      e.button === 0 &&
      viewId
    ) {
      switch (true) {
        case !state.active:
          state.active = true
          selectView(viewId)

          // If the trigger is not nested inside an item, focus the view
          if (!itemId) {
            state.input.view = viewId
          }
          break
        case state.active && !itemId:
          state.active = false
          unselectView(viewId)

          break
      }
    }

    if (mappedTrigger.value.includes('right-click') && viewId) {
      e.preventDefault()
      if (control.value || shift.value) {
        onRightClick(
          new MouseEvent(e.type, {
            ...e,
            button: 2,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        )
      } else {
        onRightClick(e)
      }
    }
  }

  function onMouseleave(e: MouseEvent) {
    if (mappedTrigger.value.includes('mouseleave') && viewId) {
      // Save mouse coordinates and content element
      mouseleaveCoordinates.value = { x: e.clientX, y: e.clientY }

      // Add pointermove listener
      cancelPointermove = useEventListener('pointermove', onPointermove)
    }
  }

  function initialize() {
    watch(
      () => view?.active,
      async (value) => {
        if (value) {
          await new Promise((resolve) => requestAnimationFrame(resolve))
          toValue(elRef)?.blur()
        }
      }
    )

    // Manage cursor
    watch(isInsideTriangle, async (value, oldValue) => {
      if (value && !oldValue) {
        disableCursor()
      } else if (!value && oldValue) {
        enableCursor()
      }
    })

    // Reset once content is reached
    watch(isInsideContent, (value, oldValue) => {
      if (value && !oldValue) {
        cancelPointermove?.()
        resetState()
      }
    })

    // Reset once pointer leaves again
    watch(isOutside, (value, oldValue) => {
      if (!cancelPointermove) {
        return
      }

      if (value && !oldValue) {
        unselectView(viewId)

        cancelPointermove()
        enableCursor()
        resetState()
      }
    })

    onKeyStroke('Enter', onEnter)
  }

  return {
    onMouseenter,
    onClick,
    onMouseleave,
    initialize,
  }
}
