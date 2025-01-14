<template>
  <m-button @click="drawerApi.open"> Open Drawer </m-button>
  <magic-drawer :id="id" :options="{ focusTrap: false }">
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script setup lang="ts">
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

const id = 'default-demo'
const drawerApi = useMagicDrawer(id)
</script>
