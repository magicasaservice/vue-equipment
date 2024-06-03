<template>
  <div class="magic-command-view" :id="mappedId">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandView } from '../composables/private/useCommandView'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandViewActive,
} from '../symbols'

interface MagicCommandViewProps {
  id?: string
  default?: boolean
}

const props = withDefaults(defineProps<MagicCommandViewProps>(), {
  default: false,
})

const instanceId = inject(MagicCommandInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicCommandView must be nested inside MagicCommandProvider')
}

// Register view
const mappedId = computed(() => props.id ?? `magic-command-view-${uuid()}`)
const { initializeView, deleteView } = useCommandView(instanceId)
const view = initializeView({
  id: mappedId.value,
})

// Pass id, active state and parent tree to children
provide(MagicCommandViewId, mappedId.value)
provide(MagicCommandViewActive, view.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
