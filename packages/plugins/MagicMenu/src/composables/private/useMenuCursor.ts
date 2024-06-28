import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { Coordinates, MenuView } from '../../types'

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

export function useMenuCursor(view: MenuView, debug = false) {
  // Private state
  let cancelListener = new AbortController()
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

    switch (view?.placement) {
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

  function getTriangle(fromBounding: DOMRect, toBounding: DOMRect) {
    const { top, left, bottom, right } = toBounding

    const centerPoint = view.state.clicked
      ? view.state.clicked
      : {
          x: (fromBounding.left + fromBounding.right) / 2,
          y: (fromBounding.top + fromBounding.bottom) / 2,
        }

    const sidePoints: Coordinates[] = []

    switch (view.placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        const topDist = Math.abs(top - centerPoint.y)
        const bottomDist = Math.abs(bottom - centerPoint.y)
        const mappedY = topDist < bottomDist ? top : bottom
        sidePoints.push({ x: left, y: mappedY })
        sidePoints.push({ x: right, y: mappedY })
        break
      case 'right':
      case 'right-start':
      case 'right-end':
      case 'left':
      case 'left-start':
      case 'left-end':
        const rightDist = Math.abs(right - centerPoint.x)
        const leftDist = Math.abs(left - centerPoint.x)
        const mappedX = rightDist < leftDist ? right : left
        sidePoints.push({ x: mappedX, y: top })
        sidePoints.push({ x: mappedX, y: bottom })
        break
    }

    const [a, b, c] = extendTriangle(
      [centerPoint, sidePoints[0], sidePoints[1]],
      16
    )

    return [a, b, c]
  }

  function triangleOverlap(
    cursor: Coordinates,
    fromBounding: DOMRect,
    toBounding: DOMRect
  ) {
    const [a, b, c] = getTriangle(fromBounding, toBounding)

    return isPointInTriangle({
      p: cursor,
      a,
      b,
      c,
    })
  }

  function elementOverlap(cursor: Coordinates, bounding: DOMRect) {
    const { top, left, bottom, right } = bounding

    return isPointInRectangle({
      p: cursor,
      top: top,
      left: left,
      bottom: bottom,
      right: right,
    })
  }

  function onMousemove(e: PointerEvent) {
    const from = Array.from(
      document.querySelectorAll(`[data-id="${view?.id}-trigger"]`)
    ) as HTMLElement[]

    const to = document.querySelector(
      `[data-id="${view?.id}-content"] .magic-menu-content__inner`
    ) as HTMLElement

    if (from.length && to) {
      const cursor = { x: e.clientX, y: e.clientY }
      const toBounding = to.getBoundingClientRect()
      isInsideTo.value = elementOverlap(cursor, toBounding)

      isInsideFrom.value = from.some((trigger) => {
        const fromBounding = trigger.getBoundingClientRect()
        const overlap = elementOverlap(cursor, fromBounding)

        return overlap
      })

      isInsideTriangle.value = from.some((trigger) => {
        const fromBounding = trigger.getBoundingClientRect()
        const overlap = triangleOverlap(cursor, fromBounding, toBounding)

        return overlap
      })

      // Debugging
      if (debug) {
        const allCoords: Coordinates[] = []
        from.forEach((trigger) => {
          const fromBounding = trigger.getBoundingClientRect()
          const [a, b, c] = getTriangle(fromBounding, toBounding)

          allCoords.push(a, b, c)
        })

        coords.value = allCoords
      }
    }
  }

  function initialize() {
    cancelListener.abort()
    cancelListener = new AbortController()

    useEventListener(document, 'mousemove', onMousemove, {
      signal: cancelListener.signal,
    })
  }

  function destroy() {
    coords.value = []
    isInsideFrom.value = false
    isInsideTo.value = false
    isInsideTriangle.value = false

    cancelListener.abort()
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
