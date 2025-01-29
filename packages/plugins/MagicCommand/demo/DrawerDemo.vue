<template>
  <magic-command-provider id="magic-command-drawer-demo">
    <magic-command-trigger view-id="initial-drawer-view" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <magic-command-drawer :options="{ focusTrap: false }">
      <div
        class="p-2 pb-[calc(var(--magic-drawer-drag-overshoot)+0.5rem)] w-full h-full"
      >
        <m-menu-box class="w-full h-full">
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
#magic-command-drawer-demo {
  --magic-drawer-width: 40rem;
  --magic-drawer-height: 30rem;
  /* --magic-drawer-drag-overshoot: 0px; */
}
</style>
