<template>
  <div
    class="magic-menu-trigger"
    ref="elRef"
    :class="{ '-active': view?.active, '-disabled': mappedDisabled }"
    :data-magic-menu-id="`${viewId}-trigger`"
    @click="onClick"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot :is-active="view?.active" :is-disabled="mappedDisabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

import type { MagicMenuTrigger } from '../types'
import { useMenuTrigger } from '../composables/private/useMenuTrigger'

interface MagicMenuTriggerProps {
  disabled?: boolean
  trigger?: MagicMenuTrigger[]
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

const { getView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const { getItem } = useMenuItem({ instanceId, viewId })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled)

const mappedTrigger = computed<MagicMenuTrigger[]>(() => {
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
      return ['right-click']
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
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}
</style>
