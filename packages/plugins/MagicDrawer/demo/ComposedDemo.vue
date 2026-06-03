<template>
  <magic-drawer-provider id="magic-drawer-composed-demo" :options="{ focusTrap: false }">
    <magic-drawer-trigger as-child>
      <m-button>Open Drawer</m-button>
    </magic-drawer-trigger>
    <magic-drawer-teleport>
      <magic-drawer-backdrop />
      <magic-drawer-content>
        <div class="bg-surface-base absolute inset-0" />
      </magic-drawer-content>
    </magic-drawer-teleport>
  </magic-drawer-provider>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import {
  MagicDrawerProvider,
  MagicDrawerTeleport,
  MagicDrawerBackdrop,
  MagicDrawerContent,
  MagicDrawerTrigger,
} from '@maas/vue-equipment/plugins/MagicDrawer'
</script>
