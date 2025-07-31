<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>
  <magic-drawer id="magic-drawer-vertical-demo" :options="{ focusTrap: false }">
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'

const drawerApi = useMagicDrawer('magic-drawer-vertical-demo')
</script>
