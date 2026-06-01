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
import { CommandId, ViewId, ItemId, TestId } from './enums'

// ─── Globals ──────────────────────────────────────────────────────────────────

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

function createCommand(commandId: CommandId) {
  return defineComponent({
    components: {
      MagicCommandProvider,
      MagicCommandView,
      MagicCommandContent,
      MagicCommandItem,
      MagicCommandRenderer,
    },
    setup() {
      const { api, openCommand } = useOpenHelper(commandId)
      return { api, openCommand }
    },
    template: `
      <div>
        <span data-test-id="${TestId.Active}">{{ api.isActive.value }}</span>
        <button data-test-id="${TestId.Open}" @click="openCommand()">Open</button>
        <button data-test-id="${TestId.Close}" @click="api.close()">Close</button>
        <MagicCommandProvider id="${commandId}">
          <MagicCommandRenderer />
          <MagicCommandView id="${ViewId.V0}" :initial="true">
            <MagicCommandContent>
              <MagicCommandItem id="${ItemId.KbItem1}">
                <div>Item 1</div>
              </MagicCommandItem>
              <MagicCommandItem id="${ItemId.KbItem2}">
                <div>Item 2</div>
              </MagicCommandItem>
              <MagicCommandItem id="${ItemId.KbItem3}">
                <div>Item 3</div>
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
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await nextTick()
  window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

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
      const screen = render(createCommand(CommandId.Escape), gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')

      await pressKey('Escape')

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('arrow navigation', () => {
    it('ArrowDown selects first item', async () => {
      const screen = render(createCommand(CommandId.ArrowDown), gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await pressKey('ArrowDown')

      expect(
        document
          .querySelector(`[data-id="${ItemId.KbItem1}"]`)!
          .getAttribute('data-active')
      ).toBe('true')
    })

    it('two ArrowDown presses select second item', async () => {
      const screen = render(createCommand(CommandId.ArrowCycle), gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await pressKey('ArrowDown')
      await pressKey('ArrowDown')

      expect(
        document
          .querySelector(`[data-id="${ItemId.KbItem2}"]`)!
          .getAttribute('data-active')
      ).toBe('true')
    })

    it('ArrowUp after two ArrowDown selects first item', async () => {
      const screen = render(createCommand(CommandId.ArrowUp), gc)
      await nextTick()

      await screen.getByTestId(TestId.Open).click()
      await nextTick()
      await nextTick()
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await pressKey('ArrowDown')
      await pressKey('ArrowDown')
      await pressKey('ArrowUp')

      expect(
        document
          .querySelector(`[data-id="${ItemId.KbItem1}"]`)!
          .getAttribute('data-active')
      ).toBe('true')
    })
  })
})
