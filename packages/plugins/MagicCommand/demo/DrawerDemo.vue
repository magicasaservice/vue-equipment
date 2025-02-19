<template>
  <magic-command-provider
    id="magic-command-drawer-demo"
    :options="{ keyListener: { open: false } }"
  >
    <magic-command-trigger view-id="initial-drawer-view" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <magic-command-drawer :options="{ focusTrap: false }">
      <div
        class="h-full w-full p-2 pb-[calc(var(--magic-drawer-drag-overshoot)+0.5rem)]"
      >
        <m-menu-box class="h-full w-full">
          <magic-command-renderer />
        </m-menu-box>
      </div>
    </magic-command-drawer>

    <default-view id="initial-drawer-view" />
  </magic-command-provider>
</template>

<script lang="ts" setup>
import { MButton, MMenuBox } from '@maas/mirror/vue'
import DefaultView from './components/DefaultView.vue'
</script>

<style>
[data-id='magic-command-drawer-demo'] {
  --magic-drawer-width: 40rem;
  --magic-drawer-height: 30rem;
}
</style>
