<template>
  <div
    class="magic-menu-channel"
    v-if="channel.active"
    :data-id="mappedId"
    :id="id"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, onBeforeUnmount } from 'vue'
import { useMenuChannel } from '../composables/private/useMenuChannel'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
  MagicMenuChannelId,
  MagicMenuChannelActive,
} from '../symbols'

interface MagicMenuChannelProps {
  id: string
}

const props = defineProps<MagicMenuChannelProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const contentId = inject(MagicMenuContentId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuChannel must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuChannel must be nested inside MagicMenuView')
}

if (!contentId) {
  throw new Error('MagicMenuChannel must be nested inside MagicMenuContent')
}

if (!props.id) {
  throw new Error('MagicMenuChannel requires an id')
}

const mappedId = computed(() => `magic-menu-channel-${props.id}`)

// Register channel
const { initializeChannel, deleteChannel } = useMenuChannel({
  instanceId,
  viewId,
})

const channel = initializeChannel({
  id: mappedId.value,
})

// Pass id and active state to children
provide(MagicMenuChannelId, mappedId.value)
provide(MagicMenuChannelActive, channel.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteChannel(mappedId.value)
})
</script>
