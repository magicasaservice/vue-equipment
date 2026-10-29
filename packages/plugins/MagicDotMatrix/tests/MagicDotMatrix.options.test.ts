import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDotMatrix } from './test-utils'
import { MatrixId } from './enums'

describe('MagicDotMatrix - Options', () => {
  it('defaults to a 7x7 grid', async () => {
    render(createDotMatrix(MatrixId.OptDefaults, [[0]]))
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.OptDefaults}']`)
    expect(root!.querySelectorAll('.magic-dot-matrix__dot').length).toBe(49)
  })

  it('derives the dot geometry from CSS variables', async () => {
    render(createDotMatrix(MatrixId.OptCssVars, [[0]], { cols: 3, rows: 2 }))
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.OptCssVars}']`)
    if (root instanceof HTMLElement) {
      root.style.width = '20px'
      root.style.setProperty('--magic-dot-matrix-gap', '4px')
      root.style.setProperty('--magic-dot-matrix-radius', '0.5')
    }
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const svg = root!.querySelector('svg')
    const dots = root!.querySelectorAll('.magic-dot-matrix__dot')

    expect(getComputedStyle(dots[0]!).width).toBe('4px')
    expect(getComputedStyle(dots[0]!).rx).toBe('2px')
    expect(getComputedStyle(dots[4]!).x).toBe('8px')
    expect(getComputedStyle(dots[4]!).y).toBe('8px')
    expect(getComputedStyle(svg!).height).toBe('12px')
  })

  it('does not play when autoplay is disabled', async () => {
    render(
      createDotMatrix(MatrixId.OptAutoplay, [[0], [1]], {
        autoplay: false,
        interval: 20,
      })
    )
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    const root = document.querySelector(`[data-id='${MatrixId.OptAutoplay}']`)
    expect(root!.getAttribute('data-playing')).toBe('false')

    const dots = root!.querySelectorAll('.magic-dot-matrix__dot')
    expect(dots[0]!.getAttribute('data-active')).toBe('true')
    expect(dots[1]!.hasAttribute('data-active')).toBe(false)
  })
})
