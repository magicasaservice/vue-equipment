<template>
  <div :id="mappedId" class="magic-menu-view">
    <slot :view-active="view.active" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId } from 'vue'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuParentTree,
  MagicMenuItemId,
  MagicMenuViewActive,
} from '../symbols'
import type { Placement } from '@floating-ui/vue'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuViewProps {
  id?: string
  placement?: Placement
}

const { id, placement } = defineProps<MagicMenuViewProps>()

const parentTree = inject(MagicMenuParentTree, [])
const instanceId = inject(MagicMenuInstanceId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuView must be nested inside MagicMenuProvider')
}

const mappedId = computed(() => id ?? `magic-menu-view-${useId()}`)
const mappedParentTree = computed(() => [...parentTree, mappedId.value])

// Register view
const { initializeView, deleteView } = useMenuView(instanceId)
const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const mappedPlacement = computed(() => {
  if (placement) {
    return placement
  }

  switch (state.options.mode) {
    case 'navigation':
      return 'bottom'
    case 'menubar':
      return !itemId ? 'bottom-start' : 'right-start'
    case 'dropdown':
      return !itemId ? 'bottom' : 'right-start'
    case 'context':
      return 'right-start'
    default:
      return undefined
  }
})

const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
  placement: mappedPlacement.value ?? 'bottom',
})

// Pass id, active state and parent tree to children
provide(MagicMenuParentTree, mappedParentTree.value)
provide(MagicMenuViewId, mappedId.value)
provide(MagicMenuViewActive, view.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
