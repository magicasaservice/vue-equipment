import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import { useMagicEmitter } from '../index'

function createEmitterWrapper() {
  return defineComponent({
    setup() {
      const emitter = useMagicEmitter()
      return { emitter }
    },
    template: '<div data-test-id="wrapper">emitter</div>',
  })
}

describe('MagicEmitter - API', () => {
  describe('emit and on', () => {
    it('on() receives emitted events', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeEnter', handler)
          return { emitter }
        },
        template: `
          <div>
            <button data-test-id="emit-btn" @click="emitter.emit('beforeEnter', 'test-id')">Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('emit-btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledOnce()
      expect(handler).toHaveBeenCalledWith('test-id')
    })

    it('on() receives payload data', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeEnter', handler)

          function emitEvent() {
            emitter.emit('beforeEnter', 'modal-123')
          }

          return { emitEvent }
        },
        template: `
          <div>
            <button data-test-id="emit-btn" @click="emitEvent">Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('emit-btn').click()
      await nextTick()

      expect(handler).toHaveBeenCalledWith('modal-123')
    })

    it('multiple handlers on same event all fire', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('enter', handler1)
          emitter.on('enter', handler2)
          emitter.on('enter', handler3)

          function emitEvent() {
            emitter.emit('enter', 'test')
          }

          return { emitEvent }
        },
        template: `
          <div>
            <button data-test-id="emit-btn" @click="emitEvent">Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('emit-btn').click()
      await nextTick()

      expect(handler1).toHaveBeenCalledOnce()
      expect(handler2).toHaveBeenCalledOnce()
      expect(handler3).toHaveBeenCalledOnce()
    })

    it('handlers for different events are independent', async () => {
      const enterHandler = vi.fn()
      const leaveHandler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('enter', enterHandler)
          emitter.on('leave', leaveHandler)

          function emitEnter() {
            emitter.emit('enter', 'test')
          }

          return { emitEnter }
        },
        template: `
          <div>
            <button data-test-id="emit-btn" @click="emitEnter">Emit Enter</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('emit-btn').click()
      await nextTick()

      expect(enterHandler).toHaveBeenCalledOnce()
      expect(leaveHandler).not.toHaveBeenCalled()
    })

    it('emit without listeners does not error', async () => {
      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()

          function emitEvent() {
            emitter.emit('afterLeave', 'test')
          }

          return { emitEvent }
        },
        template: `
          <div>
            <button data-test-id="emit-btn" @click="emitEvent">Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      // Should not throw
      await screen.getByTestId('emit-btn').click()
      await nextTick()
    })
  })

  describe('off', () => {
    it('off() removes specific handler', async () => {
      const handler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('beforeLeave', handler)

          function removeAndEmit() {
            emitter.off('beforeLeave', handler)
            emitter.emit('beforeLeave', 'test')
          }

          return { removeAndEmit }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="removeAndEmit">Remove & Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler).not.toHaveBeenCalled()
    })

    it('off() only removes specified handler, not others', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('afterEnter', handler1)
          emitter.on('afterEnter', handler2)

          function removeFirstAndEmit() {
            emitter.off('afterEnter', handler1)
            emitter.emit('afterEnter', 'test')
          }

          return { removeFirstAndEmit }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="removeFirstAndEmit">Go</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledOnce()
    })
  })

  describe('wildcard listener', () => {
    it('wildcard * receives all events', async () => {
      const wildHandler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('*', wildHandler)

          function emitMultiple() {
            emitter.emit('beforeEnter', 'id-1')
            emitter.emit('afterLeave', 'id-2')
          }

          return { emitMultiple }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="emitMultiple">Emit</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(wildHandler).toHaveBeenCalledTimes(2)
      // Wildcard receives (eventName, payload)
      expect(wildHandler).toHaveBeenCalledWith('beforeEnter', 'id-1')
      expect(wildHandler).toHaveBeenCalledWith('afterLeave', 'id-2')
    })

    it('wildcard can be removed with off()', async () => {
      const wildHandler = vi.fn()

      const wrapper = defineComponent({
        setup() {
          const emitter = useMagicEmitter()
          emitter.on('*', wildHandler)

          function removeAndEmit() {
            emitter.off('*', wildHandler)
            emitter.emit('enter', 'test')
          }

          return { removeAndEmit }
        },
        template: `
          <div>
            <button data-test-id="btn" @click="removeAndEmit">Go</button>
          </div>
        `,
      })

      const screen = render(wrapper)
      await screen.getByTestId('btn').click()
      await nextTick()

      expect(wildHandler).not.toHaveBeenCalled()
    })
  })
})
