<template>
  <primitive
    class="magic-menu-remote"
    :data-id="`${channelId}-remote`"
    :data-disabled="disabled"
    :data-active="channel?.active"
    :as-child="asChild"
    @click="onClick"
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

const { disabled, channelId, instanceId, viewId, trigger } =
  defineProps<MagicMenuRemoteProps>()

const injectedInstanceId = inject(MagicMenuInstanceId, instanceId)
const injectedViewId = inject(MagicMenuViewId, viewId)

const mappedInstanceId = computed(() => instanceId ?? injectedInstanceId)
const mappedViewId = computed(() => viewId ?? injectedViewId)

if (!mappedInstanceId.value) {
  throw new Error(
    'MagicMenuRemote must be nested inside MagicMenuProvider or an instanceId must be provided'
  )
}

if (!mappedViewId.value) {
  throw new Error(
    'MagicMenuTrigger must be nested inside MagicMenuView or a viewId must be provided'
  )
}

if (!channelId) {
  throw new Error('MagicMenuRemote requires a channelId')
}

const mappedChannelId = computed(() => `magic-menu-channel-${channelId}`)

const mappedTrigger = computed<Interaction[]>(() => trigger ?? ['mouseenter'])

const { getView } = useMenuView(mappedInstanceId.value)
const view = getView(mappedViewId.value)

const { initializeChannel, deleteChannel } = useMenuChannel({
  instanceId: mappedInstanceId.value,
  viewId: mappedViewId.value,
})

const { onClick, onMouseenter } = useMenuRemote({
  instanceId: mappedInstanceId.value,
  viewId: mappedViewId.value,
  mappedChannelId,
  mappedTrigger,
})

let channel = initializeChannel({ id: mappedChannelId.value })

watch(
  () => view?.active,
  (value) => {
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

.magic-menu-remote[data-disabled='true'] {
  pointer-events: none;
}
</style>
