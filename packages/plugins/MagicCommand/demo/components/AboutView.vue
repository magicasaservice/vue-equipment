<template>
  <magic-command-item v-slot="{ itemActive }">
    <magic-command-view>
      <magic-command-trigger>
        <m-menu-item mode="ghost" size="sm" :active="itemActive">
          <m-menu-item-child>About Us</m-menu-item-child>
        </m-menu-item>
      </magic-command-trigger>
      <magic-command-content
        class="relative h-full w-full flex flex-col overflow-auto"
      >
        <div class="w-full h-full flex px-8 pt-8 pb-6">
          <div class="flex flex-col gap-4 items-center">
            <h2 class="text-surface-subtle type-surface-callout-md">About</h2>
            <p class="type-surface-title-md text-center">{{ about }}</p>
          </div>
          <div class="absolute left-0 right-0 bottom-2 flex justify-center">
            <magic-command-trigger action="close" as-child>
              <m-button mode="tone" class="w-36">Go Back</m-button>
            </magic-command-trigger>
          </div>
        </div>
      </magic-command-content>
    </magic-command-view>
  </magic-command-item>
</template>

<script lang="ts" setup>
import { MMenuItem, MMenuItemChild, MButton } from '@maas/mirror/vue'
import { about } from '../data/about.json'
</script>
