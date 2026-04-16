import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, reactive } from 'vue'
import { useMagicEmitter } from '../index'

describe('MagicEmitter - Integration', () => {
  describe('cross-component communication', () => {
    it('emitter works across sibling components', async () => {
      const Sender = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          function send() {
            emitter.emit('beforeEnter', 'from-sender')
          }
          return { send }
        },
        template:
          '<button data-test-id="send-btn" @click="send">Send</button>',
      })

      const Receiver = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          const received = reactive<string[]>([])
          emitter.on('beforeEnter', (payload: unknown) => {
            received.push(String(payload))
          })
          return { received }
        },
        template:
          '<span data-test-id="received">{{ received.join(",") }}</span>',
      })

      const App = defineComponent({
        components: { Sender, Receiver },
        template: '<div><Sender /><Receiver /></div>',
      })

      const screen = render(App)
      await screen.getByTestId('send-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('received'))
        .toHaveTextContent('from-sender')
    })

    it('emitter shared across parent and child', async () => {
      const Child = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          function send() {
            emitter.emit('enter', 'child-event')
          }
          return { send }
        },
        template:
          '<button data-test-id="child-btn" @click="send">Child Send</button>',
      })

      const Parent = defineComponent({
        components: { Child },
        setup() {
          const emitter = useMagicEmitter()
          const received = reactive<string[]>([])
          emitter.on('enter', (payload: unknown) => {
            received.push(String(payload))
          })
          return { received }
        },
        template: `
          <div>
            <span data-test-id="parent-received">{{ received.join(",") }}</span>
            <Child />
          </div>
        `,
      })

      const screen = render(Parent)
      await screen.getByTestId('child-btn').click()
      await nextTick()

      await expect
        .element(page.getByTestId('parent-received'))
        .toHaveTextContent('child-event')
    })
  })

  describe('multiple emissions', () => {
    it('handler called once per emission', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('leave', handler)

          function emitThrice() {
            emitter.emit('leave', 'a')
            emitter.emit('leave', 'b')
            emitter.emit('leave', 'c')
          }

          return { emitThrice }
        },
        template:
          '<button data-test-id="btn" @click="emitThrice">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledTimes(3)
      expect(handler).toHaveBeenNthCalledWith(1, 'a')
      expect(handler).toHaveBeenNthCalledWith(2, 'b')
      expect(handler).toHaveBeenNthCalledWith(3, 'c')
    })
  })

  describe('singleton behavior', () => {
    it('useMagicEmitter() returns same emitter instance', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          // Two separate calls to useMagicEmitter
          const emitter1 = useMagicEmitter()
          const emitter2 = useMagicEmitter()

          emitter1.on('afterEnter', handler)

          function emitViaSecond() {
            emitter2.emit('afterEnter', 'shared')
          }

          return { emitViaSecond }
        },
        template:
          '<button data-test-id="btn" @click="emitViaSecond">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      // Handler registered on emitter1 fires from emitter2 emission
      expect(handler).toHaveBeenCalledWith('shared')
    })
  })
})
