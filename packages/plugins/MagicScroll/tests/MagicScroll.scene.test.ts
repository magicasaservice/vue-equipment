import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick, ref } from 'vue'
import MagicScrollProvider from '../src/components/MagicScrollProvider.vue'
import MagicScrollScene from '../src/components/MagicScrollScene.vue'

describe('MagicScroll - Scene', () => {
  describe('progress tracking', () => {
    it('progress starts at 0 or a valid number', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollScene },
          template: `
            <MagicScrollProvider>
              <MagicScrollScene v-slot="{ progress }">
                <div style="height:500px">
                  <span data-test-id="progress">{{ progress }}</span>
                </div>
              </MagicScrollScene>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const el = document.querySelector('[data-test-id="progress"]')
      const progress = parseFloat(el!.textContent!)
      expect(progress).toBeGreaterThanOrEqual(0)
      expect(progress).toBeLessThanOrEqual(1)
    })

    it('progress increases when scrolling down a custom target', async () => {
      const scrollTarget = ref<HTMLElement | null>(null)

      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollScene },
          setup() {
            return { scrollTarget }
          },
          template: `
            <div ref="scrollTarget" data-test-id="scroller" style="height:200px;overflow:auto">
              <MagicScrollProvider :target="scrollTarget">
                <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
                  <div style="height:2000px">
                    <span data-test-id="progress">{{ progress }}</span>
                  </div>
                </MagicScrollScene>
              </MagicScrollProvider>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progressBefore = parseFloat(
        document.querySelector('[data-test-id="progress"]')!.textContent!
      )

      // Scroll the container significantly
      const scroller = scrollTarget.value!
      scroller.scrollTop = 500
      scroller.dispatchEvent(new Event('scroll'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progressAfter = parseFloat(
        document.querySelector('[data-test-id="progress"]')!.textContent!
      )

      // Progress must have increased — this is the core behavior
      expect(progressAfter).toBeGreaterThan(progressBefore)
    })

    it('progress reaches 1 at end of scroll', async () => {
      const scrollTarget = ref<HTMLElement | null>(null)

      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollScene },
          setup() {
            return { scrollTarget }
          },
          template: `
            <div ref="scrollTarget" style="height:200px;overflow:auto">
              <MagicScrollProvider :target="scrollTarget">
                <MagicScrollScene from="top-top" to="bottom-bottom" v-slot="{ progress }">
                  <div style="height:2000px">
                    <span data-test-id="progress">{{ progress }}</span>
                  </div>
                </MagicScrollScene>
              </MagicScrollProvider>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      // Scroll to very bottom
      const scroller = scrollTarget.value!
      scroller.scrollTop = scroller.scrollHeight
      scroller.dispatchEvent(new Event('scroll'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      const progress = parseFloat(
        document.querySelector('[data-test-id="progress"]')!.textContent!
      )

      expect(progress).toBe(1)
    })
  })

  describe('multiple scenes', () => {
    it('renders multiple scenes in same provider', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollScene },
          template: `
            <MagicScrollProvider>
              <MagicScrollScene>
                <div class="scene-1" style="height:200px">Scene 1</div>
              </MagicScrollScene>
              <MagicScrollScene>
                <div class="scene-2" style="height:200px">Scene 2</div>
              </MagicScrollScene>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      const scenes = document.querySelectorAll('.magic-scroll-scene')
      expect(scenes.length).toBe(2)
      expect(document.querySelector('.scene-1')).not.toBeNull()
      expect(document.querySelector('.scene-2')).not.toBeNull()
    })
  })

  describe('intersection observer', () => {
    it('scene element is observable', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollScene },
          template: `
            <MagicScrollProvider>
              <MagicScrollScene>
                <div style="height:100px">Observable</div>
              </MagicScrollScene>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      const scene = document.querySelector('.magic-scroll-scene') as HTMLElement
      expect(scene).not.toBeNull()
      expect(scene.tagName.toLowerCase()).toBe('div')
    })
  })
})
