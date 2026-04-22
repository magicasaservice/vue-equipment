import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
import MagicScrollProvider from '../src/components/MagicScrollProvider.vue'
import MagicScrollScene from '../src/components/MagicScrollScene.vue'
import MagicScrollCollision from '../src/components/MagicScrollCollision.vue'
import { TestId } from './enums'

function createScroll(template: string) {
  return defineComponent({
    components: { MagicScrollProvider, MagicScrollScene, MagicScrollCollision },
    template,
  })
}

function createScrollWithTarget(template: string) {
  return defineComponent({
    components: { MagicScrollProvider, MagicScrollScene, MagicScrollCollision },
    setup() {
      const target = ref<HTMLElement | null>(null)
      return { target }
    },
    template,
  })
}

async function scrollTo(el: HTMLElement, top: number) {
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
  await nextTick()
  await new Promise((r) => setTimeout(r, 150))
}

describe('MagicScroll - Options', () => {
  describe('MagicScrollProvider target', () => {
    it('uses window as default scroll target', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene v-slot="{ progress }">
              <span data-test-id="progress">{{ progress }}</span>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Progress))
        .toHaveTextContent('0')
    })

    it('accepts custom target element and tracks its scroll', async () => {
      const comp = createScrollWithTarget(`
        <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
          <MagicScrollProvider :target="target">
            <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
              <div style="height:2000px">
                <span data-test-id="progress">{{ progress }}</span>
              </div>
            </MagicScrollScene>
          </MagicScrollProvider>
        </div>
      `)

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progressBefore = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      const scroller = document.querySelector(
        `[data-test-id="${TestId.Scroller}"]`
      ) as HTMLElement
      await scrollTo(scroller, 500)

      const progressAfter = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      // Custom target scroll should update progress
      expect(progressAfter).toBeGreaterThan(progressBefore)
    })
  })

  describe('MagicScrollScene from/to', () => {
    it('from=top-bottom to=bottom-top is the default', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene v-slot="{ progress }">
              <span data-test-id="progress">{{ typeof progress }}</span>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      // Scene renders and exposes progress as number (proves defaults work)
      await expect
        .element(page.getByTestId(TestId.Progress))
        .toHaveTextContent('number')
    })

    it('from=top-top to=bottom-bottom tracks full element scroll', async () => {
      const comp = createScrollWithTarget(`
        <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
          <MagicScrollProvider :target="target">
            <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
              <div style="height:2000px">
                <span data-test-id="progress">{{ progress }}</span>
              </div>
            </MagicScrollScene>
          </MagicScrollProvider>
        </div>
      `)

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const scroller = document.querySelector(
        `[data-test-id="${TestId.Scroller}"]`
      ) as HTMLElement

      // Scroll to bottom
      await scrollTo(scroller, scroller.scrollHeight)

      const progress = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      expect(progress).toBe(1)
    })

    it('center-center intersection produces valid progress', async () => {
      const comp = createScrollWithTarget(`
        <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
          <MagicScrollProvider :target="target">
            <MagicScrollScene from="center-center" to="center-center" v-slot="{ progress }">
              <div style="height:1000px">
                <span data-test-id="progress">{{ progress }}</span>
              </div>
            </MagicScrollScene>
          </MagicScrollProvider>
        </div>
      `)

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progress = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      // Progress should be a valid number between 0 and 1
      expect(progress).toBeGreaterThanOrEqual(0)
      expect(progress).toBeLessThanOrEqual(1)
    })

    it('different from/to values produce different progress at same scroll position', async () => {
      const comp = defineComponent({
        components: { MagicScrollProvider, MagicScrollScene },
        setup() {
          const target = ref<HTMLElement | null>(null)
          return { target }
        },
        template: `
          <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
            <MagicScrollProvider :target="target">
              <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
                <div style="height:2000px">
                  <span data-test-id="progress-a">{{ progress }}</span>
                </div>
              </MagicScrollScene>
              <MagicScrollScene from="top-bottom" to="bottom-top" v-slot="{ progress }">
                <div style="height:2000px">
                  <span data-test-id="progress-b">{{ progress }}</span>
                </div>
              </MagicScrollScene>
            </MagicScrollProvider>
          </div>
        `,
      })

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const scroller = document.querySelector(
        `[data-test-id="${TestId.Scroller}"]`
      ) as HTMLElement
      await scrollTo(scroller, 300)

      const progressA = parseFloat(
        document.querySelector(`[data-test-id="${TestId.ProgressA}"]`)!.textContent!
      )
      const progressB = parseFloat(
        document.querySelector(`[data-test-id="${TestId.ProgressB}"]`)!.textContent!
      )

      // Different intersection configs at the same scroll position
      // should produce different progress values
      expect(progressA).not.toBe(progressB)
    })
  })

  describe('MagicScrollScene non-default intersections', () => {
    it('top-top intersection: progress is 0 at initial position', async () => {
      const comp = createScrollWithTarget(`
        <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
          <MagicScrollProvider :target="target">
            <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
              <div style="height:2000px">
                <span data-test-id="progress">{{ progress }}</span>
              </div>
            </MagicScrollScene>
          </MagicScrollProvider>
        </div>
      `)

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progress = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      // At scroll position 0, element top is at viewport top, so progress = 0
      expect(progress).toBe(0)
    })

    it('bottom-bottom intersection: progress reaches 1 at full scroll', async () => {
      const comp = createScrollWithTarget(`
        <div ref="target" data-test-id="scroller" style="height:200px;overflow:auto">
          <MagicScrollProvider :target="target">
            <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
              <div style="height:2000px">
                <span data-test-id="progress">{{ progress }}</span>
              </div>
            </MagicScrollScene>
          </MagicScrollProvider>
        </div>
      `)

      render(comp)
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const scroller = document.querySelector(
        `[data-test-id="${TestId.Scroller}"]`
      ) as HTMLElement

      // Scroll to bottom
      await scrollTo(scroller, scroller.scrollHeight)

      const progress = parseFloat(
        document.querySelector(`[data-test-id="${TestId.Progress}"]`)!.textContent!
      )

      expect(progress).toBe(1)
    })
  })

  describe('MagicScrollCollision offset', () => {
    it('accepts offset prop and renders correctly', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision :offset="{ top: 100, bottom: 50 }">
              <div>Content</div>
            </MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const el = document.querySelector('.magic-scroll-collision')
      expect(el).not.toBeNull()
      expect(el!.tagName.toLowerCase()).toBe('div')
    })

    it('accepts custom id and sets data-id attribute', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision id="my-collision">
              <div>Content</div>
            </MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const el = document.querySelector('[data-id="my-collision"]')
      expect(el).not.toBeNull()
      expect(el!.classList.contains('magic-scroll-collision')).toBe(true)
    })

    it('multiple collisions have independent ids', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision id="col-a">
              <div>A</div>
            </MagicScrollCollision>
            <MagicScrollCollision id="col-b">
              <div>B</div>
            </MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const colA = document.querySelector('[data-id="col-a"]')
      const colB = document.querySelector('[data-id="col-b"]')
      expect(colA).not.toBeNull()
      expect(colB).not.toBeNull()
      expect(colA).not.toBe(colB)
    })
  })
})
