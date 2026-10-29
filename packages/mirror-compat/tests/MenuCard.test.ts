import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MMenuCard from '../src/components/MenuCard.vue'
import MMenuCardChild from '../src/components/MenuCardChild.vue'

import type { MMenuCardSize } from '../src/types/menu-card'

const SIZES: MMenuCardSize[] = ['xs', 'sm', 'md', 'lg']

/** Every unprefixed utility on the element that sets the given property. */
function restingUtilities(classes: string[], property: string) {
  return classes.filter((c) => !c.includes(':') && c.startsWith(`${property}-`))
}

describe('MMenuCard', () => {
  it('renders a div with the v1 defaults', () => {
    const wrapper = mount(MMenuCard, {
      slots: { default: () => h(MMenuCardChild, null, () => 'Studio') },
    })
    const el = wrapper.get('.m-menu-card')

    expect(el.element.tagName).toBe('DIV')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.attributes('data-selected')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.classes()).toContain('cursor-pointer')
  })

  it('walks the size ramp for padding, gap, radius and type', () => {
    const expected: Record<MMenuCardSize, string[]> = {
      xs: ['py-0.25', 'gap-3.5', 'rounded-component-sm', 'type-component-xs'],
      sm: ['py-3', 'gap-4', 'rounded-component-md', 'type-component-sm'],
      md: ['py-3.5', 'gap-4.5', 'rounded-component-lg', 'type-component-md'],
      lg: ['py-4', 'gap-5', 'rounded-component-xl', 'type-component-lg'],
    }

    for (const size of SIZES) {
      const el = mount(MMenuCard, { props: { size } }).get('.m-menu-card')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
      expect(el.classes()).toContain('px-1')
    }
  })

  it('reproduces v1’s minimum height, which skipped md', () => {
    // v1’s size loop ran over `xs, sm, lg` and the base rule set none, so an
    // `md` card has no minimum height of its own. The child inside holds the
    // row open to the same three rem either way.
    const expected: Record<MMenuCardSize, string | undefined> = {
      xs: 'min-h-8',
      sm: 'min-h-10',
      md: undefined,
      lg: 'min-h-14',
    }

    for (const size of SIZES) {
      const classes = mount(MMenuCard, { props: { size } })
        .get('.m-menu-card')
        .classes()
      const found = classes.filter((c) => c.startsWith('min-h-'))

      if (expected[size]) {
        expect(found).toEqual([expected[size]])
      } else {
        expect(found).toHaveLength(0)
      }
    }
  })

  it('keeps exactly one utility per CSS property across the matrix', () => {
    for (const size of SIZES) {
      for (const selected of [false, true]) {
        for (const disabled of [false, true]) {
          const classes = mount(MMenuCard, {
            props: { size, selected, disabled },
          })
            .get('.m-menu-card')
            .classes()

          expect(restingUtilities(classes, 'bg')).toHaveLength(1)
          expect(restingUtilities(classes, 'type')).toHaveLength(1)
          expect(restingUtilities(classes, 'rounded')).toHaveLength(1)
          expect(restingUtilities(classes, 'gap')).toHaveLength(1)
          expect(restingUtilities(classes, 'py')).toHaveLength(1)
          expect(restingUtilities(classes, 'px')).toHaveLength(1)

          // The card paints no text colour: v1 put every one of them on the
          // wrappers inside the child, through the card’s state.
          expect(restingUtilities(classes, 'text')).toHaveLength(0)
        }
      }
    }
  })

  it('paints v1’s ghost backgrounds', () => {
    const resting = mount(MMenuCard).get('.m-menu-card').classes()

    expect(resting).toContain('bg-transparent')
    expect(resting).toContain('hover:bg-primary-subtle')
    expect(resting).toContain('active:bg-primary-subtle-hover')

    const selected = mount(MMenuCard, { props: { selected: true } })
      .get('.m-menu-card')
      .classes()

    // v1’s `.-selected` sat after the `:hover` rule at equal specificity, so
    // it held the active colour through hover too.
    expect(selected).toContain('bg-primary-subtle-hover')
    expect(selected).toContain('hover:bg-primary-subtle-hover')

    const disabled = mount(MMenuCard, { props: { disabled: true } }).get(
      '.m-menu-card'
    )

    expect(disabled.attributes('data-disabled')).toBe('true')
    expect(disabled.classes()).toContain('bg-transparent')
    expect(
      disabled.classes().filter((c) => c.startsWith('hover:'))
    ).toHaveLength(0)
    expect(
      disabled.classes().filter((c) => c.startsWith('active:'))
    ).toHaveLength(0)
  })

  it('renders v1’s three wrappers and flags the filled slots', () => {
    const wrapper = mount(MMenuCard, {
      slots: {
        start: () => h(MMenuCardChild, { start: true }, () => 'avatar'),
        default: () => h(MMenuCardChild, null, () => 'Studio'),
        end: () => h(MMenuCardChild, { end: true }, () => '⌘ 1'),
      },
    })
    const el = wrapper.get('.m-menu-card')

    expect(el.attributes('data-slot-start')).toBe('true')
    expect(el.attributes('data-slot-end')).toBe('true')
    expect(wrapper.get('.m-menu-card__start').text()).toBe('avatar')
    expect(wrapper.get('.m-menu-card__label').text()).toBe('Studio')
    expect(wrapper.get('.m-menu-card__end').text()).toBe('⌘ 1')
  })

  it('drops the start and end wrappers when the slots are empty', () => {
    const wrapper = mount(MMenuCard, {
      slots: { default: () => h(MMenuCardChild, null, () => 'Studio') },
    })

    expect(wrapper.find('.m-menu-card__start').exists()).toBe(false)
    expect(wrapper.find('.m-menu-card__end').exists()).toBe(false)
    expect(
      wrapper.get('.m-menu-card').attributes('data-slot-start')
    ).toBeUndefined()
  })
})

describe('MMenuCardChild', () => {
  it('renders one content wrapper for the label alone', () => {
    const wrapper = mount(MMenuCardChild, { slots: { default: 'Studio' } })
    const el = wrapper.get('.m-menu-card-child')

    expect(el.attributes('data-size')).toBe('md')
    expect(el.attributes('data-label')).toBeUndefined()
    expect(el.classes()).toContain('min-h-12')
    expect(wrapper.get('.m-menu-card-child__content').text()).toBe('Studio')
    expect(wrapper.find('.m-menu-card-child__end').exists()).toBe(false)
  })

  it('adds a sibling box once the end slot is filled', () => {
    // v1 put the end slot beside the content wrapper, not inside it, which is
    // where the menu item differs.
    const wrapper = mount(MMenuCardChild, {
      slots: { default: 'Studio', end: 'New' },
    })

    expect(wrapper.get('.m-menu-card-child').attributes('data-label')).toBe(
      'true'
    )
    expect(wrapper.get('.m-menu-card-child__end').text()).toBe('New')
    expect(
      wrapper.findAll('.m-menu-card-child__content .m-menu-card-child__end')
    ).toHaveLength(0)
  })

  it('walks the size ramp for the minimum height', () => {
    const expected: Record<MMenuCardSize, string> = {
      xs: 'min-h-8',
      sm: 'min-h-10',
      md: 'min-h-12',
      lg: 'min-h-14',
    }

    for (const size of SIZES) {
      expect(
        mount(MMenuCardChild, { props: { size } })
          .get('.m-menu-card-child')
          .classes()
      ).toContain(expected[size])
    }
  })

  it('writes v1’s modifiers as data attributes', () => {
    const el = mount(MMenuCardChild, {
      props: { start: true, end: true, spread: true },
    }).get('.m-menu-card-child')

    expect(el.attributes('data-start')).toBe('true')
    expect(el.attributes('data-end')).toBe('true')
    expect(el.attributes('data-spread')).toBe('true')

    const bare = mount(MMenuCardChild).get('.m-menu-card-child')

    expect(bare.attributes('data-start')).toBeUndefined()
    expect(bare.attributes('data-end')).toBeUndefined()
    expect(bare.attributes('data-spread')).toBeUndefined()
  })

  it('follows the card’s size unless it carries one', () => {
    const inherited = mount(MMenuCard, {
      props: { size: 'lg' },
      slots: { default: () => h(MMenuCardChild, null, () => 'Studio') },
    })

    expect(inherited.get('.m-menu-card-child').attributes('data-size')).toBe(
      'lg'
    )

    const own = mount(MMenuCard, {
      props: { size: 'lg' },
      slots: {
        default: () => h(MMenuCardChild, { size: 'xs' }, () => 'Studio'),
      },
    })

    expect(own.get('.m-menu-card-child').attributes('data-size')).toBe('xs')
  })
})

describe('the combinations the apps ask for', () => {
  it('renders MenuCardInternal, an icon beside a two line label', () => {
    const wrapper = mount(MMenuCard, {
      slots: {
        start: () => h(MMenuCardChild, { start: true }, () => 'avatar'),
        default: () =>
          h(MMenuCardChild, { class: 'w-full' }, () => [
            h('span', 'Studio'),
            h('span', 'What we do'),
          ]),
      },
    })

    expect(wrapper.get('.m-menu-card').attributes('data-slot-start')).toBe(
      'true'
    )
    expect(
      wrapper.findAll('.m-menu-card__label .m-menu-card-child__content > span')
    ).toHaveLength(2)
  })

  it('renders MenuCardExternal, a two line label with no icon', () => {
    const wrapper = mount(MMenuCard, {
      slots: {
        default: () =>
          h(MMenuCardChild, null, () => [
            h('span', 'Instagram'),
            h('span', 'Follow us'),
          ]),
      },
    })

    expect(
      wrapper.get('.m-menu-card').attributes('data-slot-start')
    ).toBeUndefined()
    expect(wrapper.get('.m-menu-card-child').attributes('data-size')).toBe('md')
  })

  it('renders MenuFeatureCard, which is not interactive', () => {
    const wrapper = mount(MMenuCard, {
      attrs: { class: 'pointer-events-none' },
      slots: {
        default: () =>
          h(MMenuCardChild, { class: 'w-full' }, () => [
            h('span', 'Studio'),
            h('span', 'What we do'),
          ]),
      },
    })

    expect(wrapper.get('.m-menu-card').classes()).toContain(
      'pointer-events-none'
    )
    expect(wrapper.get('.m-menu-card-child').classes()).toContain('w-full')
  })
})
