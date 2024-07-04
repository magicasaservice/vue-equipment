<template>
  <primitive
    :class="[
      'magic-menu-remote',
      { '-active': channel?.active, '-disabled': disabled },
    ]"
    :data-id="`${channelId}-remote`"
    :as-child="asChild"
    @pointerdown="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :channel-active="channel?.active" :remote-disabled="disabled" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, watch } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuChannel } from '../composables/private/useMenuChannel'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'

import type { Interaction } from '../types'
import { useMenuRemote } from '../composables/private/useMenuRemote'

interface MagicMenuRemoteProps {
  channelId: string
  viewId?: string
  instanceId?: string
  disabled?: boolean
  trigger?: Interaction[]
  asChild?: boolean
}

const props = defineProps<MagicMenuRemoteProps>()

const instanceId = inject(MagicMenuInstanceId, props.instanceId)
const viewId = inject(MagicMenuViewId, props.viewId)

if (!instanceId) {
  throw new Error(
    'MagicMenuRemote must be nested inside MagicMenuProvider or an instanceId must be provided'
  )
}

if (!viewId) {
  throw new Error(
    'MagicMenuTrigger must be nested inside MagicMenuView or a viewId must be provided'
  )
}

if (!props.channelId) {
  throw new Error('MagicMenuRemote requires a channelId')
}

const mappedChannelId = computed(() => `magic-menu-channel-${props.channelId}`)

const mappedTrigger = computed<Interaction[]>(
  () => props.trigger ?? ['mouseenter']
)

const { getView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeChannel, deleteChannel } = useMenuChannel({
  instanceId,
  viewId,
})

const { onClick, onMouseenter } = useMenuRemote({
  viewId,
  instanceId,
  mappedChannelId,
  mappedTrigger,
})

let channel = initializeChannel({ id: mappedChannelId.value })

watch(
  () => view?.active,
  (value) => {
    // Reset if parent view is inactive
    if (!value) {
      deleteChannel(mappedChannelId.value)
      channel = initializeChannel({ id: mappedChannelId.value })
    }
  }
)
</script>

<style>
.magic-menu-remote {
  cursor: var(--magic-menu-remote-cursor, pointer);
}

.magic-menu-remote.-disabled {
  pointer-events: none;
}
</style>
