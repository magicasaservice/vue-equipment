<template>
  <transition :name="mappedTransition">
    <div
      v-if="channel.active"
      :id="id"
      class="magic-menu-channel"
      :data-initialized="state.active"
      :data-id="mappedId"
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
  transition?: string
}

const { transition, id } = defineProps<MagicMenuChannelProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)
const contentId = inject(MagicMenuContentId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuChannel must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuChannel must be nested inside MagicMenuView')
}

if (!id) {
  throw new Error('MagicMenuChannel requires an id')
}

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

if (!contentId) {
  if (state.options.debug) {
    console.warn('MagicMenuChannel is not nested inside MagicMenuContent')
  }
}

const mappedId = computed(() => `magic-menu-channel-${id}`)
const mappedActive = computed(() => channel.active)
const mappedTransition = computed(
  () => transition ?? state.options.transition.channel
)

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
provide(MagicMenuChannelActive, mappedActive)
</script>

<style>
.magic-menu-channel-enter-active {
  animation: fade-in 225ms ease;
  &[data-initialized='true'] {
    position: absolute;
  }
}

.magic-menu-channel-leave-active {
  animation: fade-out 225ms ease;
  &[data-initialized='true'] {
    position: absolute;
  }
}
</style>
