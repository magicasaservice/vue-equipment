<template>
  <transition :name="mappedTransition">
    <div
      :class="['magic-menu-channel', { '-initialized': state.active }]"
      v-if="channel.active"
      :data-id="mappedId"
      :id="id"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, inject, provide } from 'vue'
import { useMenuChannel } from '../composables/private/useMenuChannel'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
  MagicMenuChannelId,
  MagicMenuChannelActive,
} from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'

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

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const mappedId = computed(() => `magic-menu-channel-${props.id}`)
const mappedTransition = computed(() => state.options.transition.channel)

// Register channel
const { initializeChannel } = useMenuChannel({
  instanceId,
  viewId,
})

const channel = initializeChannel({
  id: mappedId.value,
})

// Pass id and active state to children
provide(MagicMenuChannelId, mappedId.value)
provide(MagicMenuChannelActive, channel.active)
</script>

<style>
.magic-menu-channel-enter-active {
  animation: fade-in 300ms ease;
  &.-initialized {
    position: absolute;
  }
}

.magic-menu-channel-leave-active {
  animation: fade-out 300ms ease;
  &.-initialized {
    position: absolute;
  }
}
</style>
