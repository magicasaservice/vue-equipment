import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

describe('MagicAccordion - Edge Cases', () => {
  describe('auto-generated IDs', () => {
    it('view without id prop gets auto-generated id', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('edge-auto-id')
          return {}
        },
        template: `
          <MagicAccordionProvider id="edge-auto-id">
            <MagicAccordionView>
              <template #default="{ viewActive }">
                <MagicAccordionTrigger>
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      const view = document.querySelector('.magic-accordion-view')
      const dataId = view!.getAttribute('data-id')
      expect(dataId).toBeTruthy()
      // Auto-generated IDs start with "magic-accordion-view-"
      expect(dataId!.startsWith('magic-accordion-view-')).toBe(true)
    })
  })

  describe('rapid toggling', () => {
    it('rapid open/close settles correctly', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion('edge-rapid')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="selectView('rapid-v')">Toggle</button>
            <button data-test-id="close" @click="unselectView('rapid-v')">Close</button>
            <MagicAccordionProvider id="edge-rapid">
              <MagicAccordionView id="rapid-v">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="active">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      // Rapid toggle: open, close, open, close, open
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          await screen.getByTestId('toggle').click()
        } else {
          await screen.getByTestId('close').click()
        }
        await nextTick()
      }

      // Ended on open (indices 0, 2, 4 = open)
      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })

  describe('dynamic views', () => {
    it('dynamically added view registers correctly', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion('edge-dynamic')
          const showExtra = ref(false)
          return { ...api, showExtra }
        },
        template: `
          <div>
            <button data-test-id="add" @click="showExtra = true">Add View</button>
            <button data-test-id="select-extra" @click="selectView('extra')">Select Extra</button>
            <MagicAccordionProvider id="edge-dynamic">
              <MagicAccordionView id="static-v">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="static-active">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
              <MagicAccordionView v-if="showExtra" id="extra">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Extra Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Extra Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="extra-active">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      // Add extra view
      await screen.getByTestId('add').click()
      await nextTick()

      // Select the dynamically added view
      await screen.getByTestId('select-extra').click()
      await nextTick()

      await expect
        .element(page.getByTestId('extra-active'))
        .toHaveTextContent('true')
    })

    it('removed view is cleaned up from state', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion('edge-cleanup')
          const showView = ref(true)
          return { ...api, showView }
        },
        template: `
          <div>
            <button data-test-id="remove" @click="showView = false">Remove</button>
            <MagicAccordionProvider id="edge-cleanup">
              <MagicAccordionView v-if="showView" id="removable">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div data-test-id="removable-content">Content</div>
                  </MagicAccordionContent>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      // View exists
      expect(
        document.querySelector('[data-test-id="removable-content"]')
      ).not.toBeNull()

      // Remove view
      await screen.getByTestId('remove').click()
      await nextTick()

      // View DOM removed
      expect(
        document.querySelector('[data-test-id="removable-content"]')
      ).toBeNull()
    })
  })

  describe('multiple providers', () => {
    it('two independent providers do not interfere', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api1 = useMagicAccordion('edge-multi-1')
          const api2 = useMagicAccordion('edge-multi-2')
          return {
            selectView1: api1.selectView,
            selectView2: api2.selectView,
          }
        },
        template: `
          <div>
            <button data-test-id="open-1" @click="selectView1('m1-v')">Open 1</button>
            <button data-test-id="open-2" @click="selectView2('m2-v')">Open 2</button>
            <MagicAccordionProvider id="edge-multi-1">
              <MagicAccordionView id="m1-v">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger><span>T1</span></MagicAccordionTrigger>
                  <MagicAccordionContent><div>C1</div></MagicAccordionContent>
                  <span data-test-id="active-1">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
            <MagicAccordionProvider id="edge-multi-2">
              <MagicAccordionView id="m2-v">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger><span>T2</span></MagicAccordionTrigger>
                  <MagicAccordionContent><div>C2</div></MagicAccordionContent>
                  <span data-test-id="active-2">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      // Open only provider 1
      await screen.getByTestId('open-1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('false')

      // Open provider 2 — provider 1 stays open (different instances)
      await screen.getByTestId('open-2').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')
    })
  })

  describe('no options', () => {
    it('works with zero options passed', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('edge-no-opts')
          return {}
        },
        template: `
          <MagicAccordionProvider id="edge-no-opts">
            <MagicAccordionView id="no-opts-v">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger>
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div data-test-id="content">Content</div>
                </MagicAccordionContent>
                <span data-test-id="active">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      // Renders fine with defaults
      expect(
        document.querySelector('.magic-accordion-provider')
      ).not.toBeNull()
      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('single view accordion', () => {
    it('accordion with one view works normally', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion('edge-single-view')
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="open" @click="selectView('sv')">Open</button>
            <button data-test-id="close" @click="unselectView('sv')">Close</button>
            <MagicAccordionProvider id="edge-single-view">
              <MagicAccordionView id="sv">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="active">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      await screen.getByTestId('open').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')

      await screen.getByTestId('close').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('trigger disabled prop', () => {
    it('individual trigger disabled prop blocks interaction', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('edge-trigger-disabled')
          return {}
        },
        template: `
          <MagicAccordionProvider id="edge-trigger-disabled">
            <MagicAccordionView id="td-v">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger :disabled="true">
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
                <span data-test-id="active">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="td-v-trigger"]'
      ) as HTMLElement
      expect(btn.getAttribute('data-disabled')).toBe('true')

      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })
})
