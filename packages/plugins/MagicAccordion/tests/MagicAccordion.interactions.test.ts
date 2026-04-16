import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
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

function createAccordion(
  accordionId: string,
  opts: {
    mode?: string
    disabled?: boolean
    trigger?: string
  } = {}
) {
  const { mode = 'single', disabled = false, trigger = 'click' } = opts

  return defineComponent({
    components: {
      MagicAccordionProvider,
      MagicAccordionView,
      MagicAccordionTrigger,
      MagicAccordionContent,
      AutoSize,
    },
    setup() {
      useMagicAccordion(accordionId)
      return {}
    },
    template: `
      <MagicAccordionProvider id="${accordionId}" :options="{ mode: '${mode}', disabled: ${disabled} }">
        <MagicAccordionView id="panel-1">
          <template #default="{ viewActive }">
            <MagicAccordionTrigger trigger="${trigger}">
              <span data-test-id="trigger-1">Trigger 1</span>
            </MagicAccordionTrigger>
            <MagicAccordionContent>
              <div data-test-id="content-1">Content 1</div>
            </MagicAccordionContent>
            <span data-test-id="active-1">{{ viewActive }}</span>
          </template>
        </MagicAccordionView>
        <MagicAccordionView id="panel-2">
          <template #default="{ viewActive }">
            <MagicAccordionTrigger trigger="${trigger}">
              <span data-test-id="trigger-2">Trigger 2</span>
            </MagicAccordionTrigger>
            <MagicAccordionContent>
              <div data-test-id="content-2">Content 2</div>
            </MagicAccordionContent>
            <span data-test-id="active-2">{{ viewActive }}</span>
          </template>
        </MagicAccordionView>
      </MagicAccordionProvider>
    `,
  })
}

describe('MagicAccordion - Interactions', () => {
  describe('click trigger', () => {
    it('clicking trigger opens panel', async () => {
      render(createAccordion('int-click-open'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector(
        '[data-test-id="trigger-1"]'
      ) as HTMLElement
      trigger.closest('button')!.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
    })

    it('clicking open trigger closes panel (toggle)', async () => {
      render(createAccordion('int-click-toggle'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')

      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('false')
    })

    it('single mode: clicking second trigger closes first', async () => {
      render(createAccordion('int-single-switch'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn1 = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      const btn2 = document.querySelector(
        '[data-id="panel-2-trigger"]'
      ) as HTMLElement

      btn1.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')

      btn2.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')
    })

    it('multiple mode: clicking second trigger keeps first open', async () => {
      render(createAccordion('int-multi-open', { mode: 'multiple' }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn1 = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      const btn2 = document.querySelector(
        '[data-id="panel-2-trigger"]'
      ) as HTMLElement

      btn1.click()
      await nextTick()

      btn2.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('active-2'))
        .toHaveTextContent('true')
    })
  })

  describe('mouseenter trigger', () => {
    it('hovering trigger opens panel', async () => {
      render(
        createAccordion('int-hover', { trigger: 'mouseenter' }),
        { global: { stubs: { AutoSize } } }
      )
      await nextTick()

      const btn = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
    })
  })

  describe('disabled state', () => {
    it('clicking disabled trigger does nothing', async () => {
      render(createAccordion('int-disabled', { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('false')
    })

    it('disabled trigger has data-disabled=true', async () => {
      render(createAccordion('int-disabled-attr', { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      expect(btn.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('keyboard interaction', () => {
    it('Enter key opens panel when trigger focused', async () => {
      render(createAccordion('int-keyboard'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="panel-1-trigger"]'
      ) as HTMLElement
      btn.focus()
      await nextTick()

      await userEvent.keyboard('{Enter}')
      await nextTick()

      await expect
        .element(page.getByTestId('active-1'))
        .toHaveTextContent('true')
    })
  })

  describe('trigger with explicit viewId', () => {
    it('trigger outside view can control panel via viewId prop', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('int-external-trigger')
          return {}
        },
        template: `
          <MagicAccordionProvider id="int-external-trigger">
            <MagicAccordionTrigger view-id="ext-panel">
              <span data-test-id="external-trigger">External</span>
            </MagicAccordionTrigger>
            <MagicAccordionView id="ext-panel">
              <template #default="{ viewActive }">
                <span data-test-id="active">{{ viewActive }}</span>
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

      const btn = document.querySelector(
        '[data-id="ext-panel-trigger"]'
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })
})
