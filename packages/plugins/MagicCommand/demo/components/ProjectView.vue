<template>
  <magic-command-item v-slot="{ itemActive }">
    <magic-command-view>
      <magic-command-trigger>
        <m-menu-item mode="ghost" size="sm" :active="itemActive">
          <m-menu-item-child>Past Projects</m-menu-item-child>
        </m-menu-item>
      </magic-command-trigger>
      <magic-command-content class="relative h-full w-full flex flex-col">
        <div class="flex gap-2">
          <m-input v-model="search" label="Search Projects" simple />
        </div>
        <div class="pt-2 overflow-auto">
          <magic-command-item
            v-for="(project, i) in projects"
            :key="project.id"
            :initial="i === 0"
            v-slot="{ itemActive }"
          >
            <m-menu-item mode="ghost" size="sm" :active="itemActive">
              <m-menu-item-child>{{ project.name }}</m-menu-item-child>
            </m-menu-item>
          </magic-command-item>
        </div>
        <div
          class="w-full absolute bottom-2 flex justify-center pointer-events-none"
        >
          <magic-command-trigger action="close" as-child>
            <m-button mode="tone" class="w-36 pointer-events-auto">
              Go Back
            </m-button>
          </magic-command-trigger>
        </div>
      </magic-command-content>
    </magic-command-view>
  </magic-command-item>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton, MInput, MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import { projects } from '../data/search.json'

const search = ref('')
</script>
