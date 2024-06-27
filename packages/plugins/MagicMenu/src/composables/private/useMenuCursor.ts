import { nextTick, ref, toValue, type MaybeRef } from 'vue'
import {
  useEventListener,
  useElementBounding,
  useResizeObserver,
  usePointer,
} from '@vueuse/core'
import type { Coordinates } from '../../types'
import type { Placement } from '@floating-ui/vue'

interface UseMenuCursorArgs {
  from: MaybeRef<HTMLElement | undefined>
  to: MaybeRef<HTMLElement | undefined>
  placement: MaybeRef<Placement>
  click: MaybeRef<Coordinates | undefined>
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

export function useMenuCursor(args: UseMenuCursorArgs) {
  // Private state
  const cancelListener = ref(new AbortController())
  const { x, y } = usePointer()
  const { from, to, placement, click } = args

  // Used for debugging, can be visualized by adding to MagicMenuContent
  // <span
  //     v-for="point in coords"
  //     :style="{
  //       background: 'red',
  //       position: 'fixed',
  //       top: point.y + 'px',
  //       left: point.x + 'px',
  //       width: '4px',
  //       height: '4px',
  //       zIndex: 1000,
  //       pointerEvents: 'none',
  //       transform: 'translate(-50%, -50%)',
  //     }"
  //   />
  const coords = ref<Coordinates[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ])

  // Public state
  const isInsideFrom = ref(false)
  const isInsideTo = ref(false)
  const isInsideTriangle = ref(false)

  // Private functions
  function extendTriangle(
    vertices: [Coordinates, Coordinates, Coordinates],
    pixelAmount: number
  ): [Coordinates, Coordinates, Coordinates] {
    const [a, b, c] = vertices

    switch (toValue(placement)) {
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
      case 'top':
      case 'top-start':
      case 'top-end':
        switch (true) {
          case a.y < b.y && a.y < c.y: // content is beneath trigger
            b.y += pixelAmount
            b.x -= pixelAmount
            c.y += pixelAmount
            c.x += pixelAmount
            break
          case a.y > b.y && a.y > c.y: // content is above trigger
            b.y -= pixelAmount
            b.x -= pixelAmount
            c.y -= pixelAmount
            c.x += pixelAmount
            break
        }
        break
      case 'right':
      case 'right-start':
      case 'right-end':
      case 'left':
      case 'left-start':
      case 'left-end':
        switch (true) {
          case a.x < b.x && a.x < c.x: // content is to the right of trigger
            b.x += pixelAmount
            b.y -= pixelAmount
            c.x += pixelAmount
            c.y += pixelAmount
            break
          case a.x > b.x && a.x > c.x: // content is to the left of trigger
            b.x -= pixelAmount
            b.y -= pixelAmount
            c.x -= pixelAmount
            c.y += pixelAmount
            break
        }
        break
    }

    coords.value = [a, b, c]

    return [a, b, c]
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

  function triangleOverlap(
    cursor: Coordinates,
    from: MaybeRef<HTMLElement | undefined>,
    to: MaybeRef<HTMLElement | undefined>
  ) {
    const fromBounding = useElementBounding(from, {
      windowScroll: false,
      windowResize: false,
    })
    const toBounding = useElementBounding(to, {
      windowScroll: false,
      windowResize: false,
    })

    const { top, left, bottom, right } = toBounding

    const centerPoint = toValue(click) ?? {
      x: (fromBounding.left.value + fromBounding.right.value) / 2,
      y: (fromBounding.top.value + fromBounding.bottom.value) / 2,
    }

    const sidePoints: Coordinates[] = []

    switch (toValue(placement)) {
      case 'top':
      case 'top-start':
      case 'top-end':
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        const topDist = Math.abs(top.value - centerPoint.y)
        const bottomDist = Math.abs(bottom.value - centerPoint.y)
        const mappedY = topDist < bottomDist ? top : bottom
        sidePoints.push({ x: left.value, y: mappedY.value })
        sidePoints.push({ x: right.value, y: mappedY.value })
        break
      case 'right':
      case 'right-start':
      case 'right-end':
      case 'left':
      case 'left-start':
      case 'left-end':
        const rightDist = Math.abs(right.value - centerPoint.x)
        const leftDist = Math.abs(left.value - centerPoint.x)
        const mappedX = rightDist < leftDist ? right : left
        sidePoints.push({ x: mappedX.value, y: top.value })
        sidePoints.push({ x: mappedX.value, y: bottom.value })
        break
    }

    const [a, b, c] = extendTriangle(
      [centerPoint, sidePoints[0], sidePoints[1]],
      16
    )

    return isPointInTriangle({
      p: cursor,
      a,
      b,
      c,
    })
  }

  function elementOverlap(
    cursor: Coordinates,
    element: MaybeRef<HTMLElement | undefined>
  ) {
    const { top, left, bottom, right } = useElementBounding(element, {
      windowScroll: false,
      windowResize: false,
    })

    return isPointInRectangle({
      p: cursor,
      top: top.value,
      left: left.value,
      bottom: bottom.value,
      right: right.value,
    })
  }

  function onMousemove(e: PointerEvent) {
    const cursor = { x: e.clientX, y: e.clientY }

    isInsideFrom.value = elementOverlap(cursor, from)
    isInsideTo.value = elementOverlap(cursor, to)
    isInsideTriangle.value = triangleOverlap(cursor, from, to)
  }

  function fromMouseenter() {
    isInsideFrom.value = true
  }

  function fromMouseleave() {
    isInsideFrom.value = false
  }

  function toMouseenter() {
    isInsideTo.value = true
  }

  function toMouseleave(e: PointerEvent) {
    isInsideTo.value = false
  }

  function onResize() {
    const cursor = { x: x.value, y: y.value }

    isInsideFrom.value = elementOverlap(cursor, from)
    isInsideTo.value = elementOverlap(cursor, to)
    isInsideTriangle.value = triangleOverlap(cursor, from, to)
  }

  function initialize() {
    cancelListener.value.abort()
    cancelListener.value = new AbortController()

    useEventListener(from, 'mouseenter', fromMouseenter, {
      signal: cancelListener.value.signal,
    })
    useEventListener(from, 'mouseleave', fromMouseleave, {
      signal: cancelListener.value.signal,
    })
    useEventListener(to, 'mouseenter', toMouseenter, {
      signal: cancelListener.value.signal,
    })
    useEventListener(to, 'mouseleave', toMouseleave, {
      signal: cancelListener.value.signal,
    })

    useEventListener(document, 'mousemove', onMousemove, {
      signal: cancelListener.value.signal,
    })

    useResizeObserver(to, onResize)
  }

  function destroy() {
    coords.value = []
    isInsideFrom.value = false
    isInsideTo.value = false
    isInsideTriangle.value = false

    cancelListener.value.abort()
  }

  return {
    coords,
    isInsideFrom,
    isInsideTo,
    isInsideTriangle,
    initialize,
    destroy,
  }
}
