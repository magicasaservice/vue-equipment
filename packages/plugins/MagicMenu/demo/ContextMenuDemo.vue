<template>
  <magic-menu-provider
    id="magic-menu-context"
    :options="{ mode: 'context' }"
    class="w-full"
  >
    <magic-menu-view>
      <magic-menu-trigger
        class="w-full h-36 border-2 border-dashed border-surface rounded-lg flex items-center justify-center"
      >
        <span class="type-control-text-sm text-surface-subtle">
          Right Click
        </span>
      </magic-menu-trigger>
      <magic-menu-content>
        <div class="bg-surface-elevation-base p-1 rounded-2xl w-[220px]">
          <magic-menu-item>
            <m-menu-item>Item 1</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Item 2</m-menu-item>
          </magic-menu-item>
          <magic-menu-item>
            <m-menu-item>Item 3</m-menu-item>
          </magic-menu-item>
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script setup lang="ts">
import { MMenuItem } from '@maas/mirror/vue'
</script>
