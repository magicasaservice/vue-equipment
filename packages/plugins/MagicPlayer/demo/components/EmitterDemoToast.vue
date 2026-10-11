<template>
  <div
    class="bg-component-primary-translucent flex w-[264px] flex-col justify-between gap-2 rounded-md p-4 backdrop-blur-xl"
  >
    <div class="relative inline-flex gap-2">
      <m-badge size="sm" mode="subtle">Event</m-badge>
      <m-badge size="sm" mode="subtle">{{ event }}</m-badge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MBadge } from 'mirror-compat'

import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

interface CollisionToastProps {
  event: keyof MagicEmitterEvents
}

defineProps<CollisionToastProps>()
</script>
