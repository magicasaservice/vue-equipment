import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
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

// ─── Factory ──────────────────────────────────────────────────────────────────

function createWrapper(
  accordionId: AccordionId,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: {
      MagicAccordionProvider,
      MagicAccordionView,
      MagicAccordionTrigger,
      MagicAccordionContent,
      AutoSize,
    },
    setup() {
      const api = useMagicAccordion(accordionId)
      return { ...api }
    },
    template: `
      <div>
        <button data-test-id="${TestId.SelectV1}" @click="selectView('${ViewId.V1}')">Select V1</button>
        <button data-test-id="${TestId.SelectV2}" @click="selectView('${ViewId.V2}')">Select V2</button>
        <button data-test-id="${TestId.UnselectV1}" @click="unselectView('${ViewId.V1}')">Unselect V1</button>
        <MagicAccordionProvider id="${accordionId}" :options="options">
          <MagicAccordionView id="${ViewId.V1}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 1</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="${TestId.ContentV1}">Content 1</div>
              </MagicAccordionContent>
              <span data-test-id="${TestId.ActiveV1}">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
          <MagicAccordionView id="${ViewId.V2}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 2</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="${TestId.ContentV2}">Content 2</div>
              </MagicAccordionContent>
              <span data-test-id="${TestId.ActiveV2}">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
        </MagicAccordionProvider>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - API', () => {
  describe('selectView', () => {
    it('selectView() opens a panel', async () => {
      const screen = render(createWrapper(AccordionId.ApiSelect), {
        global: { stubs: { AutoSize } },
      })

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')
    })

    it('selectView() in single mode closes other panels', async () => {
      const screen = render(createWrapper(AccordionId.ApiSingle), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.SelectV2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.ActiveV2))
        .toHaveTextContent('true')
    })

    it('selectView() in multiple mode keeps other panels open', async () => {
      const screen = render(
        createWrapper(AccordionId.ApiMultiple, { mode: 'multiple' }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()

      await screen.getByTestId(TestId.SelectV2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.ActiveV2))
        .toHaveTextContent('true')
    })
  })

  describe('unselectView', () => {
    it('unselectView() closes a panel', async () => {
      const screen = render(createWrapper(AccordionId.ApiUnselect), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.UnselectV1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
    })
  })

  describe('initial active state', () => {
    it('view with :active="true" starts open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionContent,
          MagicAccordionTrigger,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.ApiInitial)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.ApiInitial}">
            <MagicAccordionView id="${ViewId.InitView}" :active="true">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger><span>Trigger</span></MagicAccordionTrigger>
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

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('composable return shape', () => {
    it('returns selectView and unselectView functions', () => {
      let api: ReturnType<typeof useMagicAccordion> | undefined

      const wrapper = defineComponent({
        setup() {
          api = useMagicAccordion(AccordionId.ApiShape)
          return {}
        },
        template: '<div>test</div>',
      })

      render(wrapper)

      expect(typeof api!.selectView).toBe('function')
      expect(typeof api!.unselectView).toBe('function')
    })
  })
})
