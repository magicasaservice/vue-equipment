import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'
import { AccordionId, ViewId, TestId } from './enums'

// ─── Stubs ────────────────────────────────────────────────────────────────────

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - Edge Cases', () => {
  describe('auto-generated IDs', () => {
    it('view without id prop gets auto-generated id starting with "magic-accordion-view-"', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.AutoId)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.AutoId}">
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
      expect(dataId!.startsWith('magic-accordion-view-')).toBe(true)
    })
  })

  describe('rapid toggling', () => {
    it('rapid open/close sequence settles to final state', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion(AccordionId.Rapid)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Toggle}" @click="selectView('${ViewId.RapidV}')">Toggle</button>
            <button data-test-id="${TestId.Close}" @click="unselectView('${ViewId.RapidV}')">Close</button>
            <MagicAccordionProvider id="${AccordionId.Rapid}">
              <MagicAccordionView id="${ViewId.RapidV}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      // Rapid toggle: open, close, open, close, open (ends open)
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          await screen.getByTestId(TestId.Toggle).click()
        } else {
          await screen.getByTestId(TestId.Close).click()
        }
        await nextTick()
      }

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('dynamic views', () => {
    it('dynamically added view registers and can be selected', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion(AccordionId.Dynamic)
          const showExtra = ref(false)
          return { ...api, showExtra }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Add}" @click="showExtra = true">Add View</button>
            <button data-test-id="${TestId.SelectExtra}" @click="selectView('${ViewId.Extra}')">Select Extra</button>
            <MagicAccordionProvider id="${AccordionId.Dynamic}">
              <MagicAccordionView id="${ViewId.StaticV}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="${TestId.StaticActive}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
              <MagicAccordionView v-if="showExtra" id="${ViewId.Extra}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Extra Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Extra Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="${TestId.ExtraActive}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      await screen.getByTestId(TestId.Add).click()
      await nextTick()

      await screen.getByTestId(TestId.SelectExtra).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ExtraActive))
        .toHaveTextContent('true')
    })

    it('removed view is cleaned up from DOM', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion(AccordionId.Cleanup)
          const showView = ref(true)
          return { ...api, showView }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Remove}" @click="showView = false">Remove</button>
            <MagicAccordionProvider id="${AccordionId.Cleanup}">
              <MagicAccordionView v-if="showView" id="${ViewId.Removable}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div data-test-id="${TestId.RemovableContent}">Content</div>
                  </MagicAccordionContent>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.RemovableContent}"]`)
      ).not.toBeNull()

      await screen.getByTestId(TestId.Remove).click()
      await nextTick()

      expect(
        document.querySelector(`[data-test-id="${TestId.RemovableContent}"]`)
      ).toBeNull()
    })
  })

  describe('multiple providers', () => {
    it('two independent providers do not interfere with each other', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api1 = useMagicAccordion(AccordionId.Multi1)
          const api2 = useMagicAccordion(AccordionId.Multi2)
          return {
            selectView1: api1.selectView,
            selectView2: api2.selectView,
          }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open1}" @click="selectView1('${ViewId.M1V}')">Open 1</button>
            <button data-test-id="${TestId.Open2}" @click="selectView2('${ViewId.M2V}')">Open 2</button>
            <MagicAccordionProvider id="${AccordionId.Multi1}">
              <MagicAccordionView id="${ViewId.M1V}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger><span>T1</span></MagicAccordionTrigger>
                  <MagicAccordionContent><div>C1</div></MagicAccordionContent>
                  <span data-test-id="${TestId.Active1}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
            <MagicAccordionProvider id="${AccordionId.Multi2}">
              <MagicAccordionView id="${ViewId.M2V}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger><span>T2</span></MagicAccordionTrigger>
                  <MagicAccordionContent><div>C2</div></MagicAccordionContent>
                  <span data-test-id="${TestId.Active2}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      await screen.getByTestId(TestId.Open1).click()
      await nextTick()

      // Provider 1 opened, provider 2 untouched
      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Open2).click()
      await nextTick()

      // Both open independently
      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')
    })
  })

  describe('single view accordion', () => {
    it('accordion with one view opens and closes normally', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          const api = useMagicAccordion(AccordionId.SingleView)
          return { ...api }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Open}" @click="selectView('${ViewId.Sv}')">Open</button>
            <button data-test-id="${TestId.Close}" @click="unselectView('${ViewId.Sv}')">Close</button>
            <MagicAccordionProvider id="${AccordionId.SingleView}">
              <MagicAccordionView id="${ViewId.Sv}">
                <template #default="{ viewActive }">
                  <MagicAccordionTrigger>
                    <span>Trigger</span>
                  </MagicAccordionTrigger>
                  <MagicAccordionContent>
                    <div>Content</div>
                  </MagicAccordionContent>
                  <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
                </template>
              </MagicAccordionView>
            </MagicAccordionProvider>
          </div>
        `,
      })

      const screen = render(wrapper, { global: { stubs: { AutoSize } } })

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Close).click()
      await nextTick()
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('trigger disabled prop', () => {
    it('individual trigger :disabled prop blocks interaction without affecting other triggers', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.TriggerDisabled)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.TriggerDisabled}">
            <MagicAccordionView id="${ViewId.TdV}">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger :disabled="true">
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
                <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.TdV}-trigger"]`
      ) as HTMLElement
      expect(btn.getAttribute('data-disabled')).toBe('true')

      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })
})
