import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

function createWrapper(
  accordionId: string,
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
        <button data-test-id="select-v1" @click="selectView('v1')">Select V1</button>
        <button data-test-id="select-v2" @click="selectView('v2')">Select V2</button>
        <button data-test-id="unselect-v1" @click="unselectView('v1')">Unselect V1</button>
        <MagicAccordionProvider id="${accordionId}" :options="options">
          <MagicAccordionView id="v1">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 1</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="content-v1">Content 1</div>
              </MagicAccordionContent>
              <span data-test-id="active-v1">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
          <MagicAccordionView id="v2">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 2</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="content-v2">Content 2</div>
              </MagicAccordionContent>
              <span data-test-id="active-v2">{{ viewActive }}</span>
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

describe('MagicAccordion - API', () => {
  describe('selectView', () => {
    it('selectView() opens a panel', async () => {
      const screen = render(createWrapper('api-select'), {
        global: { stubs: { AutoSize } },
      })

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')
    })

    it('selectView() in single mode closes other panels', async () => {
      const screen = render(createWrapper('api-single'), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')

      await screen.getByTestId('select-v2').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('active-v2'))
        .toHaveTextContent('true')
    })

    it('selectView() in multiple mode keeps other panels open', async () => {
      const screen = render(
        createWrapper('api-multiple', { mode: 'multiple' }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await screen.getByTestId('select-v2').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-v2'))
        .toHaveTextContent('true')
    })
  })

  describe('unselectView', () => {
    it('unselectView() closes a panel', async () => {
      const screen = render(createWrapper('api-unselect'), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')

      await screen.getByTestId('unselect-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
    })
  })

  describe('initial active state', () => {
    it('view with active=true starts open', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionContent,
          MagicAccordionTrigger,
          AutoSize,
        },
        setup() {
          useMagicAccordion('api-initial')
          return {}
        },
        template: `
          <MagicAccordionProvider id="api-initial">
            <MagicAccordionView id="init-view" :active="true">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger><span>Trigger</span></MagicAccordionTrigger>
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

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })

  describe('composable return shape', () => {
    it('returns selectView and unselectView', () => {
      let api: ReturnType<typeof useMagicAccordion> | undefined

      const wrapper = defineComponent({
        setup() {
          api = useMagicAccordion('api-shape')
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
