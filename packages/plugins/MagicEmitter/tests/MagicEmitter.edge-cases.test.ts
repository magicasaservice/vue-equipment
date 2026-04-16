import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'

import { defineComponent, nextTick, onBeforeUnmount, reactive } from 'vue'
import { useMagicEmitter } from '../index'

describe('MagicEmitter - Edge Cases', () => {
  describe('handler reference identity', () => {
    it('off() with wrong reference does not remove handler', async () => {
      const handler = vi.fn()
      const differentFn = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeEnter', handler)

          function tryRemoveAndEmit() {
            // Remove with different reference — should NOT remove handler
            emitter.off('beforeEnter', differentFn)
            emitter.emit('beforeEnter', 'still-here')
          }

          return { tryRemoveAndEmit }
        },
        template:
          '<button data-test-id="btn" @click="tryRemoveAndEmit">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('rapid emit', () => {
    it('rapid emissions all reach handler', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('enter', handler)

          function rapidFire() {
            for (let i = 0; i < 100; i++) {
              emitter.emit('enter', `event-${i}`)
            }
          }

          return { rapidFire }
        },
        template:
          '<button data-test-id="btn" @click="rapidFire">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledTimes(100)
    })
  })

  describe('cleanup pattern', () => {
    it('manual cleanup in onBeforeUnmount works', async () => {
      const handler = vi.fn()

      const Child = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeLeave', handler)

          onBeforeUnmount(() => {
            emitter.off('beforeLeave', handler)
          })
        },
        template: '<div>Child</div>',
      })

      const Parent = defineComponent({
        components: { Child },
        setup() {
          const emitter = useMagicEmitter()
          return { emitter }
        },
        data() {
          return { showChild: true }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="showChild = !showChild">Toggle</button>
            <button data-test-id="emit" @click="emitter.emit('beforeLeave', 'test')">Emit</button>
            <Child v-if="showChild" />
          </div>
        `,
      })

      const screen = render(Parent)

      // Emit while child mounted — handler fires
      await screen.getByTestId('emit').click()
      await nextTick()
      expect(handler).toHaveBeenCalledOnce()

      handler.mockClear()

      // Unmount child
      await screen.getByTestId('toggle').click()
      await nextTick()

      // Emit after unmount — handler should NOT fire
      await screen.getByTestId('emit').click()
      await nextTick()
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('emit with various payloads', () => {
    it('handles string payload', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeEnter', handler)
          function go() {
            emitter.emit('beforeEnter', 'hello')
          }
          return { go }
        },
        template: '<button data-test-id="btn" @click="go">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledWith('hello')
    })

    it('handles object payload', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('drag', handler)
          function go() {
            emitter.emit('drag', { id: 'test', x: 10, y: 20 })
          }
          return { go }
        },
        template: '<button data-test-id="btn" @click="go">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledWith({ id: 'test', x: 10, y: 20 })
    })
  })

  describe('re-registration', () => {
    it('registering same handler twice fires it twice', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('enter', handler)
          emitter.on('enter', handler)

          function go() {
            emitter.emit('enter', 'test')
          }
          return { go }
        },
        template: '<button data-test-id="btn" @click="go">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledTimes(2)
    })

    it('off() removes one registration when handler registered twice', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('leave', handler)
          emitter.on('leave', handler)

          function removeOneAndEmit() {
            emitter.off('leave', handler)
            emitter.emit('leave', 'test')
          }
          return { removeOneAndEmit }
        },
        template:
          '<button data-test-id="btn" @click="removeOneAndEmit">Go</button>',
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      // mitt removes first matching handler — one left
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('composable return shape', () => {
    it('returns on, off, and emit methods', () => {
      let api: ReturnType<typeof useMagicEmitter> | undefined

      const wrapper = defineComponent({
        setup() {
          api = useMagicEmitter()
          return {}
        },
        template: '<div>test</div>',
      })

      render(wrapper)

      expect(api).toBeDefined()
      expect(typeof api!.on).toBe('function')
      expect(typeof api!.off).toBe('function')
      expect(typeof api!.emit).toBe('function')
    })
  })
})
