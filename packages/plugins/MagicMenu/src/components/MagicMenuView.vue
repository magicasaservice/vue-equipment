<template>
  <div class="magic-menu-view" :id="mappedId">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
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

const props = defineProps<MagicMenuViewProps>()

const parentTree = inject(MagicMenuParentTree, [])
const instanceId = inject(MagicMenuInstanceId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuView must be nested inside MagicMenuProvider')
}

const mappedId = computed(() => props.id ?? `magic-menu-view-${uuid()}`)
const mappedParentTree = computed(() => [...parentTree, mappedId.value])

// Register view
const { initializeView, deleteView } = useMenuView(instanceId)
const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const mappedPlacement = computed(() => {
  if (props.placement) {
    return props.placement
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
      return 'bottom'
  }
})

const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
  placement: mappedPlacement.value,
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
