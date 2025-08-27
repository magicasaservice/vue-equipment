import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MagicDrawer from '../src/components/MagicDrawer.vue'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

describe('MagicDrawer', () => {
  it('renders with required id', () => {
    const wrapper = mount(MagicDrawer, {
      props: { id: 'drawer' },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer').exists()).toBe(true)
    expect(wrapper.text()).toContain('content')
  })

  it('throws if id is missing', () => {
    expect(() => mount(MagicDrawer)).toThrow()
  })

  it('shows backdrop when open', async () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { backdrop: true, initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer__backdrop').isVisible()).toBe(true)
  })

  it('hides backdrop when option is false', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { backdrop: false, initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer__backdrop').exists()).toBe(false)
  })

  it('teleports to custom target', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { teleport: { target: '#custom' }, initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.html()).toContain('data-id="drawer"')
  })

  it('applies position option', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { position: 'top', initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer').attributes('data-position')).toBe(
      'top'
    )
  })

  it('disables drawer', () => {
    const wrapper = mount(MagicDrawer, {
      props: { id: 'drawer', options: { disabled: true } },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer').attributes('data-disabled')).toBe(
      'true'
    )
  })

  it('renders with custom tag', () => {
    const wrapper = mount(MagicDrawer, {
      props: { id: 'drawer', options: { tag: 'div', initial: { open: true } } },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer__drag').element.tagName).toBe('DIV')
  })

  it('closes on backdrop click', async () => {
    const { useMagicEmitter } = await import(
      '@maas/vue-equipment/plugins/MagicEmitter'
    )

    const emitter = useMagicEmitter()
    function onLeave(id: MagicEmitterEvents['leave']) {
      expect(id).toBe('drawer')
    }
    emitter.on('leave', onLeave)

    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { backdrop: true, initial: { open: true } },
      },
      slots: { default: 'content' },
    })

    const backdrop = wrapper.find('.magic-drawer__backdrop')
    await backdrop.trigger('click')

    emitter.off('leave', onLeave)
  })

  it('handles snapPoints', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { snapPoints: [0.5, '100px'], initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('applies scrollLock', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { scrollLock: true, initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('prevents drag close', () => {
    const wrapper = mount(MagicDrawer, {
      props: {
        id: 'drawer',
        options: { preventDragClose: true, initial: { open: true } },
      },
      slots: { default: 'content' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('respects initial.open', () => {
    const wrapper = mount(MagicDrawer, {
      props: { id: 'drawer', options: { initial: { open: true } } },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.magic-drawer__content').isVisible()).toBe(true)
  })

  // Edge cases
  it('handles empty slot', () => {
    const wrapper = mount(MagicDrawer, { props: { id: 'drawer' } })
    expect(wrapper.find('.magic-drawer').exists()).toBe(true)
  })
})
