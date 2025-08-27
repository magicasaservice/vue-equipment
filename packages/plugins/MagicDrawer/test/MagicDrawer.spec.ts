import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MagicDrawer from '../src/components/MagicDrawer.vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'
import { useMagicEmitter, type MagicEmitterEvents } from '../../MagicEmitter'

describe('MagicDrawer', function () {
  const emitter = useMagicEmitter()
  const id = 'drawer'

  const { open, snapTo } = useMagicDrawer(id)

  it('renders with slot', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer').exists()).toBe(true)
        expect(wrapper.text()).toContain('content')
      }
    })

    open()
  })

  it('renders without slot', function () {
    const wrapper = mount(MagicDrawer, { props: { id } })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer').exists()).toBe(true)
      }
    })

    open()
  })

  it('shows backdrop when open', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { backdrop: true } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer__backdrop').exists()).toBe(true)
      }
    })

    open()
  })

  it('hides backdrop when option is false', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { backdrop: false } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer__backdrop').exists()).toBe(false)
      }
    })

    open()
  })

  it('teleports to custom target', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { teleport: { target: 'body' } } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer').exists()).toBe(true)
      }
    })

    open()
  })

  it('applies position option', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { position: 'top' } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        const drawer = wrapper.find('.magic-drawer')
        expect(drawer.exists()).toBe(true)
        expect(drawer.attributes('data-position')).toBe('top')
      }
    })

    open()
  })

  it('disables drawer', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { disabled: true } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        const drawer = wrapper.find('.magic-drawer')
        expect(drawer.exists()).toBe(true)
        expect(drawer.attributes('data-disabled')).toBe('true')
      }
    })

    open()
  })

  it('renders with custom tag', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { tag: 'div' } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        const drag = wrapper.find('.magic-drawer__drag')
        expect(drag.exists()).toBe(true)
        expect(drag.element.tagName).toBe('DIV')
      }
    })

    open()
  })

  it('closes on backdrop click', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id, options: { backdrop: true } },
      slots: { default: 'content' },
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        const backdrop = wrapper.find('.magic-drawer__backdrop')
        expect(backdrop.exists()).toBe(true)
        backdrop.trigger('click')
      }
    })

    open()
  })

  it('handles snapPoints', function () {
    let snapPayload = null

    mount(MagicDrawer, {
      props: { id, options: { snapPoints: [0.5] } },
      slots: { default: 'content' },
    })

    emitter.on('snapTo', function (payload) {
      snapPayload = payload
    })

    open()
    snapTo(0.5)
    expect(snapPayload).toMatchObject({ id, snapPoint: 0.5 })
  })

  it('enables scrollLock', function () {
    mount(MagicDrawer, {
      props: { id },
      slots: { default: '<div style="height:2000px;">content</div>' },
      attachTo: document.body,
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        // Scroll body
        document.body.scrollTop = 100
        window.scrollTo(0, 100)

        expect(window.scrollY).toBe(0)
        expect(document.body.scrollTop).toBe(0)
        expect(document.body.style.overflow).toBe('hidden')
      }
    })

    emitter.on('afterLeave', function (payload) {
      if (payload === id) {
        expect(document.body.style.overflow).toBe('')
      }
    })

    open()
  })

  it('disables scrollLock', function () {
    mount(MagicDrawer, {
      props: { id, options: { scrollLock: false } },
      slots: { default: '<div style="height:2000px;">content</div>' },
      attachTo: document.body,
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        // Scroll body
        document.body.scrollTop = 100
        window.scrollTo(0, 100)

        expect(window.scrollY).toBe(200)
        expect(document.body.scrollTop).toBe(200)
        expect(document.body.style.overflow).toBe('hidden')
      }
    })

    emitter.on('afterLeave', function (payload) {
      if (payload === id) {
        expect(document.body.style.overflow).toBe('')
      }
    })

    open()
  })

  it('allows drag close', function () {
    let closed = false

    const wrapper = mount(MagicDrawer, {
      props: { id },
      slots: { default: 'content' },
    })

    emitter.on('leave', function () {
      closed = true
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        wrapper.trigger('pointerdown', { clientY: 100 })
        wrapper.trigger('pointermove', { clientY: 200 })
        wrapper.trigger('pointerup', { clientY: 200 })

        expect(closed).toBe(true)
      }
    })

    open()
  })

  it('prevents drag close', function () {
    let closed = false

    const wrapper = mount(MagicDrawer, {
      props: { id, options: { preventDragClose: true } },
      slots: { default: 'content' },
    })

    emitter.on('leave', function () {
      closed = true
    })

    emitter.on('afterEnter', function (payload) {
      if (payload === id) {
        wrapper.trigger('pointerdown', { clientY: 100 })
        wrapper.trigger('pointermove', { clientY: 200 })
        wrapper.trigger('pointerup', { clientY: 200 })

        expect(closed).toBe(false)
      }
    })

    open()
  })

  it('respects initial.open', function () {
    const wrapper = mount(MagicDrawer, {
      props: { id },
      slots: { default: 'content' },
    })

    function callback(payload: MagicEmitterEvents['afterEnter']) {
      if (payload === id) {
        expect(wrapper.find('.magic-drawer__content').exists()).toBe(true)
      }
    }

    emitter.on('afterEnter', callback)
    open()
  })

  emitter.off('*')
})
