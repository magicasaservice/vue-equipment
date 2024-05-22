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

interface MagicMenuViewProps {
  id?: string
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
const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
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
