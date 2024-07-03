<template>
  <primitive
    ref="elRef"
    :class="[
      'magic-menu-trigger',
      { '-active': view?.active, '-disabled': mappedDisabled },
    ]"
    :data-id="`${viewId}-trigger`"
    :tabindex="mappedTabindex"
    :as-child="asChild"
    @pointerdown="onClick"
    @contextmenu="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :view-active="view?.active" :trigger-disabled="mappedDisabled" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toValue, watch } from 'vue'
import { Primitive } from '@maas/vue-equipment/utils'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuTrigger } from '../composables/private/useMenuTrigger'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

import type { Interaction } from '../types'
import { onKeyStroke } from '@vueuse/core'

interface MagicMenuTriggerProps {
  disabled?: boolean
  trigger?: Interaction[]
  asChild?: boolean
}

const props = defineProps<MagicMenuTriggerProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuTrigger must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuTrigger must be nested inside MagicMenuView')
}

const { getView, getRelativeViewIndex } = useMenuView(instanceId)
const view = getView(viewId)
const viewIndex = getRelativeViewIndex(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const { getItem } = useMenuItem({ instanceId, viewId })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled ?? false)

const mappedTrigger = computed<Interaction[]>(() => {
  if (props.trigger?.length) {
    return props.trigger
  }

  switch (state.options.mode) {
    case 'menubar':
      return view?.parent.item
        ? ['mouseenter', 'click']
        : state.active
        ? ['mouseenter', 'click']
        : ['click']
    case 'dropdown':
      return view?.parent.item ? ['mouseenter', 'click'] : ['click']
    case 'context':
      return view?.parent.item ? ['mouseenter', 'click'] : ['right-click']
    case 'navigation':
      return ['mouseenter']
  }
})

const mappedTabindex = computed(() => {
  if (viewIndex === 0 && state.options.mode !== 'context' && !itemId) {
    return 0
  } else {
    return undefined
  }
})

const { onMouseenter, onClick, onEnter } = useMenuTrigger({
  instanceId,
  viewId,
  itemId,
  mappedDisabled,
  mappedTrigger,
  elRef,
})

// watch(
//   () => view?.active,
//   async (value) => {
//     if (value) {
//       await new Promise((resolve) => requestAnimationFrame(resolve))
//       toValue(elRef)?.blur()
//     }
//   }
// )

onKeyStroke('Enter', onEnter)
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}

.magic-menu-trigger.-disabled {
  pointer-events: none;
}
</style>
