<template>
  <div
    class="magic-menu-trigger"
    ref="elRef"
    :class="{ '-active': view?.active, '-disabled': mappedDisabled }"
    :data-magic-menu-id="`${viewId}-trigger`"
    :tabindex="mappedTabindex"
    @click="onClick"
    @contextmenu="onClick"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot :is-active="view?.active" :is-disabled="mappedDisabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuTrigger } from '../composables/private/useMenuTrigger'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

import type { MenuTrigger } from '../types'

interface MagicMenuTriggerProps {
  disabled?: boolean
  trigger?: MenuTrigger[]
}

const props = defineProps<MagicMenuTriggerProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView, getRelativeViewIndex } = useMenuView(instanceId)
const view = getView(viewId)
const viewIndex = getRelativeViewIndex(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const { getItem } = useMenuItem({ instanceId, viewId })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled)

const mappedTrigger = computed<MenuTrigger[]>(() => {
  if (props.trigger?.length) {
    return props.trigger
  }

  switch (state.options.mode) {
    case 'menubar':
      return view?.parent.item
        ? ['mouseenter', 'mouseleave', 'click']
        : ['mouseenter', 'click']
    case 'dropdown':
      return view?.parent.item
        ? ['mouseenter', 'mouseleave', 'click']
        : ['click']
    case 'context':
      return view?.parent.item
        ? ['mouseenter', 'mouseleave', 'click']
        : ['right-click']
  }
})

const mappedTabindex = computed(() => {
  if (viewIndex === 0 && state.options.mode !== 'context' && !itemId) {
    return 0
  } else {
    return undefined
  }
})

const { initialize, onMouseenter, onClick, onMouseleave } = useMenuTrigger({
  instanceId,
  viewId,
  itemId,
  mappedDisabled,
  mappedTrigger,
  elRef,
})

// Initialize watcher
initialize()

watch(
  elRef,
  (value) => {
    if (view && value) {
      view.children.trigger = value
    }
  },
  { immediate: true }
)
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}
</style>
