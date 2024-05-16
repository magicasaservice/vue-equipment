<template>
  <div class="base-item" :class="{ '-active bg-gray-300 text-red': isActive }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import { MagicMenuItemActive } from '@maas/vue-equipment/plugins'

const isActive = inject(MagicMenuItemActive, ref(false))
</script>
