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
} from '../symbols'
import { useMenuItem } from '../composables/private/useMenuItem'

interface MagicMenuViewProps {
  id?: string
}

const props = defineProps<MagicMenuViewProps>()

const parentTree = inject(MagicMenuParentTree, [])
const instanceId = inject(MagicMenuInstanceId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuView must be used inside a MagicMenuProvider')
}

const mappedId = computed(() => props.id ?? `magic-menu-view-${uuid()}`)
const mappedParentTree = computed(() => [...parentTree, mappedId.value])

// Register view
const { initializeView, deleteView } = useMenuView(instanceId)
initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
})

// Pass id and parent tree to children
provide(MagicMenuParentTree, mappedParentTree.value)
provide(MagicMenuViewId, mappedId.value)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
