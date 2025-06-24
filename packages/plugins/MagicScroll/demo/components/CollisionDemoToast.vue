<template>
  <div
    class="bg-component-primary-translucent backdrop-blur-xl flex w-[264px] flex-col justify-between gap-2 rounded-md p-4"
  >
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="translucent">ID</m-badge>
      <m-badge size="sm" mode="translucent">{{ payload.id }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="translucent">Scroll Direction</m-badge>
      <m-badge size="sm" mode="translucent">{{ payload.direction }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="translucent">Scroll Container Edge</m-badge>
      <m-badge size="sm" mode="translucent">{{ payload.parentEdge }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="translucent">Element Edge</m-badge>
      <m-badge size="sm" mode="translucent">{{ payload.childEdge }}</m-badge>
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
