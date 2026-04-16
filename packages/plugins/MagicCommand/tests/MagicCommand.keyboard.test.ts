import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicCommandProvider from '../src/components/MagicCommandProvider.vue'
import MagicCommandView from '../src/components/MagicCommandView.vue'
import MagicCommandContent from '../src/components/MagicCommandContent.vue'
import MagicCommandItem from '../src/components/MagicCommandItem.vue'
import MagicCommandRenderer from '../src/components/MagicCommandRenderer.vue'
import { useMagicCommand } from '../src/composables/useMagicCommand'
import { useMagicEmitter } from '../../MagicEmitter/src/composables/useMagicEmitter'

const gc = {
  global: {
    components: {
      MagicCommandProvider,
      MagicCommandView,
      MagicCommandContent,
      MagicCommandItem,
      MagicCommandRenderer,
    },
  },
}

function useOpenHelper(id: string) {
  const api = useMagicCommand(id)
  const emitter = useMagicEmitter()

  async function openCommand() {
    await api.open()
    emitter.emit('enter', id)
  }

  return { api, openCommand }
}

function createCommand(id: string) {
  return defineComponent({
    components: {
      MagicCommandProvider,
      MagicCommandView,
      MagicCommandContent,
      MagicCommandItem,
      MagicCommandRenderer,
    },
    setup() {
      const { api, openCommand } = useOpenHelper(id)
      return { api, openCommand }
    },
    template: `
      <div>
        <span data-test-id="active">{{ api.isActive.value }}</span>
        <button data-test-id="open" @click="openCommand()">Open</button>
        <button data-test-id="close" @click="api.close()">Close</button>
        <MagicCommandProvider id="${id}">
          <MagicCommandRenderer />
          <MagicCommandView id="v0" :initial="true">
            <MagicCommandContent>
              <MagicCommandItem id="kb-item-1">
                <div data-test-id="item-1">Item 1</div>
              </MagicCommandItem>
              <MagicCommandItem id="kb-item-2">
                <div data-test-id="item-2">Item 2</div>
              </MagicCommandItem>
              <MagicCommandItem id="kb-item-3">
                <div data-test-id="item-3">Item 3</div>
              </MagicCommandItem>
            </MagicCommandContent>
          </MagicCommandView>
        </MagicCommandProvider>
      </div>
    `,
  })
}

// useMagicKeys needs keydown+keyup on window
async function pressKey(key: string) {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true })
  )
  await nextTick()
  window.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true })
  )
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))
}

describe('MagicCommand - Keyboard', () => {
  let rejectHandler: (e: PromiseRejectionEvent) => void
  beforeEach(() => {
    rejectHandler = (e: PromiseRejectionEvent) => {
      if (e.reason?.name === 'MagicError') {
        e.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', rejectHandler)
  })
  afterEach(() => {
    window.removeEventListener('unhandledrejection', rejectHandler)
  })

  describe('escape', () => {
    it('Escape closes command palette', async () => {
      const screen = render(createCommand('kb-esc'), gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('true')

      await pressKey('Escape')

      await expect
        .element(page.getByTestId('active'))
        .toHaveTextContent('false')
    })
  })

  describe('arrow navigation', () => {
    it('ArrowDown selects next item', async () => {
      const screen = render(createCommand('kb-arrow-down'), gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      // Content should be rendered
      const content = document.querySelector('.magic-command-content')
      expect(content).not.toBeNull()

      await pressKey('ArrowDown')

      const item1 = document.querySelector('[data-id="kb-item-1"]')
      expect(item1!.getAttribute('data-active')).toBe('true')
    })

    it('multiple ArrowDown cycles through items', async () => {
      const screen = render(createCommand('kb-arrow-cycle'), gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await pressKey('ArrowDown')
      await pressKey('ArrowDown')

      const item2 = document.querySelector('[data-id="kb-item-2"]')
      expect(item2!.getAttribute('data-active')).toBe('true')
    })

    it('ArrowUp selects previous item', async () => {
      const screen = render(createCommand('kb-arrow-up'), gc)
      await nextTick()

      await screen.getByTestId('open').click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await pressKey('ArrowDown')
      await pressKey('ArrowDown')
      await pressKey('ArrowUp')

      const item1 = document.querySelector('[data-id="kb-item-1"]')
      expect(item1!.getAttribute('data-active')).toBe('true')
    })
  })
})
