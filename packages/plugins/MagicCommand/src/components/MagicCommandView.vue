<template>
  <slot />
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, watch, useId } from 'vue'
import { useCommandView } from '../composables/private/useCommandView'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandViewActive,
  MagicCommandParentTree,
} from '../symbols'

interface MagicCommandViewProps {
  id?: string
  initial?: boolean
}

const props = withDefaults(defineProps<MagicCommandViewProps>(), {
  initial: false,
})

const parentTree = inject(MagicCommandParentTree, [])
const instanceId = inject(MagicCommandInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicCommandView must be nested inside MagicCommandProvider')
}

// Register view
const mappedId = computed(() => props.id ?? `magic-command-view-${useId()}`)
const { initializeView, deleteView, sortItems } = useCommandView(instanceId)

const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree },
  initial: props.initial,
})

// Pass id, active state and parent tree to children
provide(MagicCommandViewId, mappedId.value)
provide(MagicCommandViewActive, view.active)
provide(MagicCommandParentTree, [...parentTree, mappedId.value])

// Lifecycle
watch(
  () => view?.items,
  () => {
    sortItems(mappedId.value)
  }
)
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
