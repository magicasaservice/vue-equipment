<template>
  <magic-command-provider id="magic-command-demo" class="flex flex-col gap-6">
    <magic-command-trigger view-id="initial-default-view" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <div class="type-surface-body-sm text-surface-subtle">
      <span>or press ⌘+K / ⌃+K</span>
    </div>

    <magic-command-modal :options="{ focusTrap: false }">
      <m-menu-box class="h-[30rem] w-[40rem]">
        <magic-command-renderer />
      </m-menu-box>
    </magic-command-modal>

    <default-view id="initial-default-view" />
  </magic-command-provider>
</template>

<script lang="ts" setup>
import { MButton, MMenuBox } from '@maas/mirror/vue'
import DefaultView from './components/DefaultView.vue'
</script>
