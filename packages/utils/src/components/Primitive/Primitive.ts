// https://github.com/radix-vue/radix-vue/blob/main/packages/radix-vue/src/Primitive/Primitive.ts

import { type Component, type PropType, defineComponent, h } from 'vue'
import { PrimitiveSlot } from './PrimitiveSlot'

export type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string) // any other string

export interface PrimitiveProps {
  asChild?: boolean
  as?: AsTag | Component
}

export const Primitive = defineComponent({
  name: 'Primitive',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
    as: {
      type: [String, Object] as PropType<AsTag | Component>,
      default: 'div',
    },
  },
  setup(props, { attrs, slots }) {
    const asTag = props.asChild ? 'template' : props.as

    // For self closing tags, don’t provide default slots because of hydration issue
    const SELF_CLOSING_TAGS = ['area', 'img', 'input']

    switch (true) {
      case typeof asTag === 'string' && SELF_CLOSING_TAGS.includes(asTag):
        return () => h(asTag, attrs)
      case asTag !== 'template':
        return () => h(props.as, attrs, { default: slots.default })
      default:
        return () => h(PrimitiveSlot, attrs, { default: slots.default })
    }
  },
})
