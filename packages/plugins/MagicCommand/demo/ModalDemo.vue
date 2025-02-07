<template>
  <magic-command-provider
    id="magic-command-modal-demo"
    :options="{ keyListener: { open: false } }"
  >
    <magic-command-trigger view-id="initial-modal-view" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <magic-command-modal :options="{ focusTrap: false }">
      <m-menu-box class="h-[30rem] w-[40rem]">
        <magic-command-renderer />
      </m-menu-box>
    </magic-command-modal>

    <default-view id="initial-modal-view" />
  </magic-command-provider>
</template>

<script lang="ts" setup>
import { MButton, MMenuBox } from '@maas/mirror/vue'
import DefaultView from './components/DefaultView.vue'
</script>
