import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDotMatrix } from './test-utils'
import { MatrixId } from './enums'

describe('MagicDotMatrix - Rendering', () => {
  it('renders an svg with one rect per grid cell', async () => {
    render(createDotMatrix(MatrixId.RenderDefault, [[0]], { cols: 3, rows: 4 }))
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.RenderDefault}']`)
    expect(root!.querySelector('svg')).not.toBeNull()
    expect(root!.querySelectorAll('rect.magic-dot-matrix__dot').length).toBe(12)
  })

  it('marks the first frame’s dots as active', async () => {
    render(
      createDotMatrix(MatrixId.RenderActive, [[0, 3]], { cols: 2, rows: 2 })
    )
    await nextTick()

    const dots = document.querySelectorAll(
      `[data-id='${MatrixId.RenderActive}'] .magic-dot-matrix__dot`
    )
    expect(dots[0]!.getAttribute('data-active')).toBe('true')
    expect(dots[1]!.hasAttribute('data-active')).toBe(false)
    expect(dots[2]!.hasAttribute('data-active')).toBe(false)
    expect(dots[3]!.getAttribute('data-active')).toBe('true')
  })

  it('colors each layer of a frame with its own variable', async () => {
    render(
      createDotMatrix(MatrixId.RenderLayers, [[[0, 3], [1]]], {
        cols: 2,
        rows: 2,
      })
    )
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.RenderLayers}']`)
    if (root instanceof HTMLElement) {
      root.style.setProperty('--magic-dot-matrix-color-1', 'rgb(255, 0, 0)')
      root.style.setProperty('--magic-dot-matrix-color-2', 'rgb(0, 0, 255)')
    }

    const dots = root!.querySelectorAll('.magic-dot-matrix__dot')
    expect(dots[0]!.getAttribute('data-active')).toBe('true')
    expect(dots[1]!.getAttribute('data-active')).toBe('true')
    expect(dots[2]!.hasAttribute('data-active')).toBe(false)
    expect(getComputedStyle(dots[0]!).fill).toBe('rgb(255, 0, 0)')
    expect(getComputedStyle(dots[1]!).fill).toBe('rgb(0, 0, 255)')
    expect(getComputedStyle(dots[3]!).fill).toBe('rgb(255, 0, 0)')
  })

  it('falls back to the active color for layers without a variable', async () => {
    render(
      createDotMatrix(MatrixId.RenderLayerFallback, [[[0], [1]], [2]], {
        cols: 2,
        rows: 2,
        autoplay: false,
      })
    )
    await nextTick()

    const root = document.querySelector(
      `[data-id='${MatrixId.RenderLayerFallback}']`
    )
    if (root instanceof HTMLElement) {
      root.style.setProperty('--magic-dot-matrix-color', 'rgb(0, 128, 0)')
      root.style.setProperty('--magic-dot-matrix-color-2', 'rgb(0, 0, 255)')
    }

    const dots = root!.querySelectorAll('.magic-dot-matrix__dot')
    expect(getComputedStyle(dots[0]!).fill).toBe('rgb(0, 128, 0)')
    expect(getComputedStyle(dots[1]!).fill).toBe('rgb(0, 0, 255)')
  })
})
