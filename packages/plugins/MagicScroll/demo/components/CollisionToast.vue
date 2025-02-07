<template>
  <div
    class="bg-surface-elevation-base flex w-[264px] flex-col justify-between gap-2 rounded-md p-4"
  >
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="tone">ID</m-badge>
      <m-badge size="sm">{{ payload.id }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="tone">Scroll Direction</m-badge>
      <m-badge size="sm">{{ payload.direction }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="tone">Scroll Container Edge</m-badge>
      <m-badge size="sm">{{ payload.parentEdge }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="tone">Element Edge</m-badge>
      <m-badge size="sm">{{ payload.childEdge }}</m-badge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins'
import { MBadge } from '@maas/mirror/vue'

interface CollisionToastProps {
  payload: MagicEmitterEvents['collision']
}

defineProps<CollisionToastProps>()
</script>
