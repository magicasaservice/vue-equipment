<template>
  <magic-menu-trigger
    :view-id="mappedViewId"
    :disabled="disabled"
    :trigger="trigger"
    as-child
  >
    <primitive
      :class="[
        'magic-menu-remote',
        { '-active': channel?.active, '-disabled': disabled },
      ]"
      :data-id="`${channelId}-remote`"
      :as-child="asChild"
      @click="onClick"
      @mouseenter="onMouseenter"
    >
      <slot :channel-active="channel?.active" :remote-disabled="disabled" />
    </primitive>
  </magic-menu-trigger>
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

const { channelId, instanceId, viewId, trigger } =
  defineProps<MagicMenuRemoteProps>()

const mappedInstanceId = inject(MagicMenuInstanceId, instanceId)
const mappedViewId = inject(MagicMenuViewId, viewId)

if (!mappedInstanceId) {
  throw new Error(
    'MagicMenuRemote must be nested inside MagicMenuProvider or an instanceId must be provided'
  )
}

if (!mappedViewId) {
  throw new Error(
    'MagicMenuTrigger must be nested inside MagicMenuView or a viewId must be provided'
  )
}

if (!channelId) {
  throw new Error('MagicMenuRemote requires a channelId')
}

const mappedChannelId = computed(() => `magic-menu-channel-${channelId}`)

const mappedTrigger = computed<Interaction[]>(() => trigger ?? ['mouseenter'])

const { getView } = useMenuView(mappedInstanceId)
const view = getView(mappedViewId)

const { initializeChannel, deleteChannel } = useMenuChannel({
  instanceId: mappedInstanceId,
  viewId: mappedViewId,
})

const { onClick, onMouseenter } = useMenuRemote({
  instanceId: mappedInstanceId,
  viewId: mappedViewId,
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
