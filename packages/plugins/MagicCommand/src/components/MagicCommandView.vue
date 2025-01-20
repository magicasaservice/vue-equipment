<template>
  <div :id="mappedId" class="magic-menu-view">
    <slot :view-active="view.active" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId } from 'vue'
import { useCommandView } from '../composables/private/useCommandView'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandParentTree,
  MagicCommandItemId,
  MagicCommandViewActive,
} from '../symbols'

interface MagicCommandViewProps {
  id?: string
  initial?: boolean
}

const { id, initial = false } = defineProps<MagicCommandViewProps>()

const parentTree = inject(MagicCommandParentTree, [])
const instanceId = inject(MagicCommandInstanceId, undefined)
const itemId = inject(MagicCommandItemId, undefined)

if (!instanceId) {
  throw new Error('MagicCommandView must be nested inside MagicCommandProvider')
}

const mappedId = computed(() => id ?? `magic-menu-view-${useId()}`)
const mappedParentTree = computed(() => [...parentTree, mappedId.value])

// Register view
const { initializeView, deleteView } = useCommandView(instanceId)

const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
  initial,
})

// Pass id, active state and parent tree to children
provide(MagicCommandParentTree, mappedParentTree.value)
provide(MagicCommandViewId, mappedId.value)
provide(MagicCommandViewActive, view.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
