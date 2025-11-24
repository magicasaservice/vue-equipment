<template>
  <div :data-id="mappedId" class="magic-command-view">
    <slot :view-active="view.active" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId, watch } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
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

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommandView',
})

const parentTree = inject(MagicCommandParentTree, [])
const instanceId = inject(MagicCommandInstanceId, undefined)
const itemId = inject(MagicCommandItemId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCommandView must be nested inside MagicCommandProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = computed(() => id ?? `magic-command-view-${useId()}`)
const mappedParentTree = computed(() => [...parentTree, mappedId.value])
const mappedActive = computed(() => view.active)

// Register view
const { initializeView, deleteView, sortViewItems } = useCommandView(instanceId)

const view = initializeView({
  id: mappedId.value,
  parent: { views: parentTree, item: itemId ?? '' },
  initial,
})

// Pass id, active state and parent tree to children
provide(MagicCommandViewId, mappedId.value)
provide(MagicCommandViewActive, mappedActive)
provide(MagicCommandParentTree, mappedParentTree.value)

// Lifecycle
watch(
  () => view?.items,
  () => {
    sortViewItems(mappedId.value)
  }
)

onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
