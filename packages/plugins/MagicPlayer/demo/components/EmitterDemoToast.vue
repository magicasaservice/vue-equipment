<template>
  <div
    class="bg-component-primary-translucent flex w-[264px] flex-col justify-between gap-2 rounded-md p-4 backdrop-blur-xl"
  >
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="translucent">Event</m-badge>
      <m-badge size="sm" mode="translucent">{{ event }}</m-badge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MBadge } from '@maas/mirror/vue'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

interface CollisionToastProps {
  event: keyof MagicEmitterEvents
}

defineProps<CollisionToastProps>()
</script>
