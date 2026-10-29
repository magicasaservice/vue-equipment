<template>
  <div
    class="bg-surface-higher shadow-component-high flex w-[264px] flex-col justify-between gap-2 rounded-md p-4"
  >
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="subtle">ID</m-badge>
      <m-badge size="sm" mode="subtle">{{ payload.id }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="subtle">Scroll Direction</m-badge>
      <m-badge size="sm" mode="subtle">{{ payload.direction }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="subtle">Scroll Container Edge</m-badge>
      <m-badge size="sm" mode="subtle">{{ payload.parentEdge }}</m-badge>
    </div>
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="subtle">Element Edge</m-badge>
      <m-badge size="sm" mode="subtle">{{ payload.childEdge }}</m-badge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MBadge } from 'mirror-compat'

import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

interface CollisionToastProps {
  payload: MagicEmitterEvents['collision']
}

defineProps<CollisionToastProps>()
</script>
