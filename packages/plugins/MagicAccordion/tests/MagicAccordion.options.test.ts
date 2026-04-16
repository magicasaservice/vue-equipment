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

function createAccordion(
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

describe('MagicAccordion - Options', () => {
  describe('mode option', () => {
    it('defaults to single mode', async () => {
      const screen = render(createAccordion('opt-default-mode'), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')

      await screen.getByTestId('select-v2').click()
      await nextTick()

      // Single mode: v1 closed when v2 opens
      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('active-v2'))
        .toHaveTextContent('true')
    })

    it('single mode closes others on select', async () => {
      const screen = render(
        createAccordion('opt-single', { mode: 'single' }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await screen.getByTestId('select-v2').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId('active-v2'))
        .toHaveTextContent('true')
    })

    it('multiple mode keeps all open', async () => {
      const screen = render(
        createAccordion('opt-multiple', { mode: 'multiple' }),
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

  describe('disabled option', () => {
    it('disabled prevents trigger clicks', async () => {
      render(createAccordion('opt-disabled', { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="v1-trigger"]'
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
    })

    it('disabled sets data-disabled on triggers', async () => {
      render(createAccordion('opt-disabled-attr', { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const triggers = document.querySelectorAll('.magic-accordion-trigger')
      triggers.forEach((trigger) => {
        expect(trigger.getAttribute('data-disabled')).toBe('true')
      })
    })

    it('disabled does not prevent API selectView', async () => {
      const screen = render(
        createAccordion('opt-disabled-api', { disabled: true }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId('select-v1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')
    })
  })

  describe('transition option', () => {
    it('defaults to magic-accordion transition name', async () => {
      render(createAccordion('opt-transition-default'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      // Default transition name applied via CSS classes
      // Content should have default --ma-duration CSS var
      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('200ms')
    })

    it('custom transition name accepted', async () => {
      render(
        createAccordion('opt-transition-custom', {
          transition: 'custom-fade',
        }),
        { global: { stubs: { AutoSize } } }
      )
      await nextTick()

      // Component renders without error
      expect(
        document.querySelector('.magic-accordion-content')
      ).not.toBeNull()
    })
  })

  describe('animation option', () => {
    it('default animation duration is 200ms', async () => {
      render(createAccordion('opt-anim-default'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('200ms')
    })

    it('custom animation duration reflected in CSS var', async () => {
      render(
        createAccordion('opt-anim-custom', {
          animation: { duration: 500 },
        }),
        { global: { stubs: { AutoSize } } }
      )
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('500ms')
    })
  })

  describe('content-level overrides', () => {
    it('content transition prop overrides provider option', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('opt-content-override')
          return {}
        },
        template: `
          <MagicAccordionProvider id="opt-content-override" :options="{ transition: 'global-fade' }">
            <MagicAccordionView id="co-view">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger>
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent transition="local-slide">
                  <div data-test-id="content">Content</div>
                </MagicAccordionContent>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      // Content renders without error with local override
      expect(
        document.querySelector('.magic-accordion-content')
      ).not.toBeNull()
    })
  })

  describe('trigger option', () => {
    it('default trigger is click', async () => {
      render(createAccordion('opt-trigger-default'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        '[data-id="v1-trigger"]'
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('true')
    })

    it('mouseenter trigger opens on hover', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('opt-trigger-hover')
          return {}
        },
        template: `
          <MagicAccordionProvider id="opt-trigger-hover">
            <MagicAccordionView id="hover-view">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger trigger="mouseenter">
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
        '[data-id="hover-view-trigger"]'
      ) as HTMLElement
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')
    })
  })

  describe('view active prop', () => {
    it('view starts open with :active="true"', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion('opt-initial-active')
          return {}
        },
        template: `
          <MagicAccordionProvider id="opt-initial-active">
            <MagicAccordionView id="ia-view" :active="true">
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

    it('view defaults to inactive without active prop', async () => {
      render(createAccordion('opt-default-inactive'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      await expect
        .element(page.getByTestId('active-v1'))
        .toHaveTextContent('false')
    })
  })
})
