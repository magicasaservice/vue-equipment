<template>
  <!-- Filter -->
  <m-menu-item mode="plain" size="sm" disabled class="pointer-events-none">
    <m-menu-item-child> Filter </m-menu-item-child>
  </m-menu-item>
  <div class="flex gap-2 flex-wrap p-2">
    <magic-command-item
      v-for="tag in tags.slice(0, 30)"
      :key="tag.id"
      v-slot="{ itemActive }"
      as-child
    >
      <m-badge :mode="itemActive ? 'solid' : 'translucent'" size="lg">
        {{ tag.name }}
      </m-badge>
    </magic-command-item>
  </div>
</template>

<script lang="ts" setup>
import { MBadge, MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import { tags } from '../data/search.json'
</script>
