import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicScrollProvider from '../src/components/MagicScrollProvider.vue'
import MagicScrollScene from '../src/components/MagicScrollScene.vue'
import MagicScrollMotion from '../src/components/MagicScrollMotion.vue'

// Motion sequences use complex types from the motion library,
// so `as any` is acceptable here for test data
function createMotion(
  sequence: unknown[] = [],
  extraProps: string = ''
) {
  return defineComponent({
    components: {
      MagicScrollProvider,
      MagicScrollScene,
      MagicScrollMotion,
    },
    setup() {
      return { sequence }
    },
    template: `
      <MagicScrollProvider>
        <MagicScrollScene>
          <MagicScrollMotion :sequence="sequence" ${extraProps}>
            <div class="animated-content">Animated</div>
          </MagicScrollMotion>
        </MagicScrollScene>
      </MagicScrollProvider>
    `,
  })
}

describe('MagicScroll - Motion', () => {
  describe('rendering', () => {
    it('renders with sequence prop', async () => {
      const sequence = [
        [{ opacity: [0, 1] }, { duration: 1 }],
      ] as any

      render(createMotion(sequence))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector(
        '.magic-scroll-motion'
      ) as HTMLElement
      expect(el).not.toBeNull()
      expect(
        el.querySelector('.animated-content')!.textContent
      ).toBe('Animated')
    })
  })

  describe('props', () => {
    it('accepts sequenceOptions prop', async () => {
      render(
        defineComponent({
          components: {
            MagicScrollProvider,
            MagicScrollScene,
            MagicScrollMotion,
          },
          setup() {
            const sequence = [
              [
                {
                  transform: [
                    'translateY(0px)',
                    'translateY(100px)',
                  ],
                },
                { duration: 0.5 },
              ],
            ] as any
            const sequenceOptions = { duration: 2, delay: 0.1 }
            return { sequence, sequenceOptions }
          },
          template: `
            <MagicScrollProvider>
              <MagicScrollScene>
                <MagicScrollMotion :sequence="sequence" :sequence-options="sequenceOptions">
                  <div>Animated</div>
                </MagicScrollMotion>
              </MagicScrollScene>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(
        document.querySelector('.magic-scroll-motion')
      ).not.toBeNull()
    })

    it('accepts direct progress prop', async () => {
      const sequence = [
        [{ opacity: [0, 1] }, { duration: 1 }],
      ] as any

      render(createMotion(sequence, ':progress="0.5"'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      expect(
        document.querySelector('.magic-scroll-motion')
      ).not.toBeNull()
    })
  })

  describe('nesting', () => {
    it('multiple motions render in same scene', async () => {
      render(
        defineComponent({
          components: {
            MagicScrollProvider,
            MagicScrollScene,
            MagicScrollMotion,
          },
          template: `
            <MagicScrollProvider>
              <MagicScrollScene>
                <MagicScrollMotion :sequence="[]">
                  <div class="motion-1">First</div>
                </MagicScrollMotion>
                <MagicScrollMotion :sequence="[]">
                  <div class="motion-2">Second</div>
                </MagicScrollMotion>
              </MagicScrollScene>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      const motions = document.querySelectorAll('.magic-scroll-motion')
      expect(motions.length).toBe(2)
      expect(
        document.querySelector('.motion-1')!.textContent
      ).toBe('First')
      expect(
        document.querySelector('.motion-2')!.textContent
      ).toBe('Second')
    })
  })
})
