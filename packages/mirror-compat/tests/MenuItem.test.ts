import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MMenuItem from '../src/components/MenuItem.vue'
import MMenuItemChild from '../src/components/MenuItemChild.vue'

import type { MMenuItemMode, MMenuItemSize } from '../src/types/menu-item'

const MODES: MMenuItemMode[] = ['ghost', 'subtle']
const SIZES: MMenuItemSize[] = ['xs', 'sm', 'md', 'lg']

/** Every unprefixed utility on the element that sets the given property. */
function restingUtilities(classes: string[], property: string) {
  return classes.filter((c) => !c.includes(':') && c.startsWith(`${property}-`))
}

function pressEnter() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
}

describe('MMenuItem', () => {
  it('renders a div with the v1 defaults', () => {
    const wrapper = mount(MMenuItem, {
      slots: { default: () => h(MMenuItemChild, null, () => 'Menu Item') },
    })
    const el = wrapper.get('.m-menu-item')

    expect(el.element.tagName).toBe('DIV')
    expect(el.attributes('data-mode')).toBe('ghost')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.attributes('data-selected')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.attributes('data-slot-start')).toBeUndefined()
    expect(el.attributes('data-slot-end')).toBeUndefined()
  })

  it('walks the size ramp for height, gap, radius and type', () => {
    const expected: Record<MMenuItemSize, string[]> = {
      xs: ['h-8', 'gap-2', 'rounded-component-sm', 'type-component-sm'],
      sm: ['h-10', 'gap-3.75', 'rounded-component-md', 'type-component-md'],
      md: ['h-12', 'gap-4', 'rounded-component-lg', 'type-component-lg'],
      lg: ['h-14', 'gap-4.25', 'rounded-component-xl', 'type-component-xl'],
    }

    for (const size of SIZES) {
      const el = mount(MMenuItem, { props: { size } }).get('.m-menu-item')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
    }
  })

  it('keeps exactly one utility per CSS property across the matrix', () => {
    for (const mode of MODES) {
      for (const size of SIZES) {
        for (const selected of [false, true]) {
          for (const disabled of [false, true]) {
            const classes = mount(MMenuItem, {
              props: { mode, size, selected, disabled },
            })
              .get('.m-menu-item')
              .classes()

            expect(restingUtilities(classes, 'bg')).toHaveLength(1)
            expect(restingUtilities(classes, 'text')).toHaveLength(1)
            expect(restingUtilities(classes, 'type')).toHaveLength(1)
            expect(restingUtilities(classes, 'rounded')).toHaveLength(1)
            expect(restingUtilities(classes, 'cursor')).toHaveLength(1)
            expect(restingUtilities(classes, 'h')).toHaveLength(1)
            expect(restingUtilities(classes, 'gap')).toHaveLength(1)
          }
        }
      }
    }
  })

  it('paints v1’s ghost colours', () => {
    const classes = mount(MMenuItem).get('.m-menu-item').classes()

    // bg transparent, hover translucent.default, active translucent.hover,
    // label fg onTranslucent.
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('text-primary-on-subtle')
    expect(classes).toContain('hover:bg-primary-subtle')
    expect(classes).toContain('active:bg-primary-subtle-hover')
    expect(classes).toContain('cursor-pointer')
  })

  it('paints v1’s subtle colours', () => {
    const classes = mount(MMenuItem, { props: { mode: 'subtle' } })
      .get('.m-menu-item')
      .classes()

    // bg transparent, hover translucent.hover, active translucent.active,
    // label fg muted, lifting to onTranslucent on hover.
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('text-primary-muted')
    expect(classes).toContain('hover:bg-primary-subtle-hover')
    expect(classes).toContain('hover:text-primary-on-subtle')
    expect(classes).toContain('active:bg-primary-subtle-active')
  })

  it('lets selected hold the hover colour instead of layering a variant', () => {
    const ghost = mount(MMenuItem, { props: { selected: true } })
      .get('.m-menu-item')
      .classes()

    expect(ghost).toContain('bg-primary-subtle')
    expect(ghost).not.toContain('bg-transparent')

    const subtle = mount(MMenuItem, {
      props: { mode: 'subtle', selected: true },
    })
      .get('.m-menu-item')
      .classes()

    expect(subtle).toContain('bg-primary-subtle-hover')
    expect(subtle).toContain('text-primary-on-subtle')
  })

  it('lets disabled replace the mode colour rather than layer on it', () => {
    const ghost = mount(MMenuItem, { props: { disabled: true } }).get(
      '.m-menu-item'
    )

    expect(ghost.attributes('data-disabled')).toBe('true')
    expect(ghost.classes()).toContain('text-disabled-on-subtle')
    expect(ghost.classes()).toContain('cursor-not-allowed')
    expect(ghost.classes().filter((c) => c.startsWith('hover:'))).toHaveLength(
      0
    )
    expect(ghost.classes().filter((c) => c.startsWith('active:'))).toHaveLength(
      0
    )

    const subtle = mount(MMenuItem, {
      props: { mode: 'subtle', disabled: true },
    })
      .get('.m-menu-item')
      .classes()

    expect(subtle).toContain('text-disabled-muted')

    const selected = mount(MMenuItem, {
      props: { disabled: true, selected: true },
    })
      .get('.m-menu-item')
      .classes()

    expect(selected).toContain('bg-disabled-subtle')
    expect(selected).toContain('text-disabled-on-subtle')
  })

  it('renders v1’s three wrappers and flags the filled slots', () => {
    const wrapper = mount(MMenuItem, {
      slots: {
        start: () => h(MMenuItemChild, { start: true }, () => 'S'),
        default: () => h(MMenuItemChild, null, () => 'Menu Item'),
        end: () => h(MMenuItemChild, { end: true }, () => '⌘ 1'),
      },
    })
    const el = wrapper.get('.m-menu-item')

    expect(el.attributes('data-slot-start')).toBe('true')
    expect(el.attributes('data-slot-end')).toBe('true')
    expect(wrapper.find('.m-menu-item__start').exists()).toBe(true)
    expect(wrapper.get('.m-menu-item__label').text()).toBe('Menu Item')
    expect(wrapper.get('.m-menu-item__end').text()).toBe('⌘ 1')
  })

  it('drops the start and end wrappers when the slots are empty', () => {
    const wrapper = mount(MMenuItem, {
      slots: { default: () => h(MMenuItemChild, null, () => 'Menu Item') },
    })

    expect(wrapper.find('.m-menu-item__start').exists()).toBe(false)
    expect(wrapper.find('.m-menu-item__end').exists()).toBe(false)
    expect(wrapper.find('.m-menu-item__label').exists()).toBe(true)
  })

  it('emits enter on Return while selected', () => {
    const wrapper = mount(MMenuItem, { props: { selected: true } })

    pressEnter()

    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('stays quiet on Return when it is neither selected nor enabled', () => {
    const unselected = mount(MMenuItem)
    const disabled = mount(MMenuItem, {
      props: { selected: true, disabled: true },
    })

    pressEnter()

    expect(unselected.emitted('enter')).toBeUndefined()
    expect(disabled.emitted('enter')).toBeUndefined()
  })

  it('stops listening once it is gone', () => {
    const wrapper = mount(MMenuItem, { props: { selected: true } })
    wrapper.unmount()

    pressEnter()

    expect(wrapper.emitted('enter')).toBeUndefined()
  })
})

describe('MMenuItemChild', () => {
  it('renders one wrapper for the label alone', () => {
    const wrapper = mount(MMenuItemChild, { slots: { default: 'Menu Item' } })
    const el = wrapper.get('.m-menu-item-child')

    expect(el.attributes('data-size')).toBe('md')
    expect(el.attributes('data-label')).toBeUndefined()
    expect(wrapper.get('.m-menu-item-child__content').text()).toBe('Menu Item')
    expect(wrapper.findAll('.m-menu-item-child__content > span')).toHaveLength(
      0
    )
  })

  it('splits into two spans once the end slot is filled', () => {
    const wrapper = mount(MMenuItemChild, {
      slots: { default: 'Menu Item', end: 'New' },
    })

    expect(wrapper.get('.m-menu-item-child').attributes('data-label')).toBe(
      'true'
    )

    const spans = wrapper.findAll('.m-menu-item-child__content > span')
    expect(spans).toHaveLength(2)
    expect(spans[0]?.text()).toBe('Menu Item')
    expect(spans[1]?.text()).toBe('New')
  })

  it('writes v1’s modifiers as data attributes', () => {
    const el = mount(MMenuItemChild, {
      props: { start: true, end: true, spread: true, truncate: true },
    }).get('.m-menu-item-child')

    expect(el.attributes('data-start')).toBe('true')
    expect(el.attributes('data-end')).toBe('true')
    expect(el.attributes('data-spread')).toBe('true')
    expect(el.attributes('data-truncate')).toBe('true')
  })

  it('drops a false modifier rather than writing "false"', () => {
    const el = mount(MMenuItemChild).get('.m-menu-item-child')

    expect(el.attributes('data-start')).toBeUndefined()
    expect(el.attributes('data-end')).toBeUndefined()
    expect(el.attributes('data-spread')).toBeUndefined()
    expect(el.attributes('data-truncate')).toBeUndefined()
  })

  it('follows the item’s size unless it carries one', () => {
    const inherited = mount(MMenuItem, {
      props: { size: 'lg' },
      slots: { default: () => h(MMenuItemChild, null, () => 'Menu Item') },
    })

    expect(inherited.get('.m-menu-item-child').attributes('data-size')).toBe(
      'lg'
    )

    const own = mount(MMenuItem, {
      props: { size: 'lg' },
      slots: {
        default: () => h(MMenuItemChild, { size: 'xs' }, () => 'Menu Item'),
      },
    })

    expect(own.get('.m-menu-item-child').attributes('data-size')).toBe('xs')
  })

  it('carries a class from the call site through', () => {
    // BaseScrollNavigationItem passes v1’s `-truncate` modifier as a class.
    const el = mount(MMenuItemChild, {
      props: { end: true },
      attrs: { class: '-truncate w-full' },
    }).get('.m-menu-item-child')

    expect(el.classes()).toContain('-truncate')
    expect(el.classes()).toContain('w-full')
    expect(el.classes()).toContain('m-menu-item-child')
  })
})

describe('the combinations the apps ask for', () => {
  it('renders FooterColumn’s label item', () => {
    const wrapper = mount(MMenuItem, {
      props: { size: 'xs', mode: 'ghost' },
      attrs: { class: 'pointer-events-none' },
      slots: { default: () => h(MMenuItemChild, null, () => 'Products') },
    })

    expect(wrapper.get('.m-menu-item').classes()).toContain(
      'pointer-events-none'
    )
    expect(wrapper.get('.m-menu-item-child').attributes('data-size')).toBe('xs')
  })

  it('renders FooterMenuItem, whose child is `end` inside the default slot', () => {
    const wrapper = mount(MMenuItem, {
      props: { size: 'xs', mode: 'subtle' },
      slots: {
        default: () =>
          h(MMenuItemChild, { end: true, class: 'w-full' }, () => [
            h('span', 'Docs'),
            h('span', 'New'),
          ]),
      },
    })

    expect(
      wrapper.get('.m-menu-item').attributes('data-slot-end')
    ).toBeUndefined()
    expect(wrapper.get('.m-menu-item-child').attributes('data-end')).toBe(
      'true'
    )
  })

  it('renders BaseScrollNavigationItem', () => {
    const wrapper = mount(MMenuItem, {
      props: { size: 'xs', mode: 'subtle', selected: true },
      attrs: { 'data-theme': 'mono' },
      slots: {
        default: () =>
          h(MMenuItemChild, { end: true, class: '-truncate w-full' }, () =>
            h('span', 'Section')
          ),
      },
    })
    const el = wrapper.get('.m-menu-item')

    expect(el.attributes('data-theme')).toBe('mono')
    expect(el.attributes('data-selected')).toBe('true')
    expect(el.classes()).toContain('bg-primary-subtle-hover')
  })

  it('renders ColorModeSwitch’s selected item with a start slot', () => {
    const wrapper = mount(MMenuItem, {
      props: { mode: 'ghost', selected: true },
      slots: {
        start: () => h(MMenuItemChild, { start: true }, () => 'check'),
        default: () => h(MMenuItemChild, null, () => 'Dark'),
      },
    })

    expect(wrapper.get('.m-menu-item').attributes('data-slot-start')).toBe(
      'true'
    )
    expect(
      wrapper
        .get('.m-menu-item__start .m-menu-item-child')
        .attributes('data-start')
    ).toBe('true')
  })

  it('renders ToolbarGlyphSetSelect, start and end slots at once', () => {
    const wrapper = mount(MMenuItem, {
      props: { mode: 'ghost', selected: true },
      slots: {
        start: () => h(MMenuItemChild, { start: true }, () => 'check'),
        default: () => h(MMenuItemChild, null, () => 'Latin'),
        end: () => h(MMenuItemChild, { end: true }, () => '128'),
      },
    })

    expect(wrapper.findAll('.m-menu-item-child')).toHaveLength(3)
    expect(
      wrapper.get('.m-menu-item__end .m-menu-item-child').attributes('data-end')
    ).toBe('true')
  })

  it('renders MobileMenuItemInternal at size lg', () => {
    const wrapper = mount(MMenuItem, {
      props: { size: 'lg' },
      slots: {
        start: () => h(MMenuItemChild, { start: true }, () => 'avatar'),
        default: () => h(MMenuItemChild, null, () => h('span', 'Studio')),
      },
    })

    expect(wrapper.get('.m-menu-item').classes()).toContain('h-14')
    expect(
      wrapper
        .findAll('.m-menu-item-child')
        .every((c) => c.attributes('data-size') === 'lg')
    ).toBe(true)
  })
})
