<template>
  <magic-command-item v-slot="{ itemActive }">
    <magic-command-view>
      <magic-command-trigger>
        <m-menu-item mode="ghost" size="sm" :selected="itemActive">
          <m-menu-item-child>Past Projects</m-menu-item-child>
        </m-menu-item>
      </magic-command-trigger>
      <magic-command-content class="relative flex h-full w-full flex-col">
        <div class="flex gap-2">
          <m-input v-model="search" label="Search Projects" simple />
        </div>
        <div class="scrollbar-none overflow-auto pt-2">
          <magic-command-item
            v-for="(project, i) in projects"
            :key="project.id"
            v-slot="{ itemActive }"
            :initial="i === 0"
          >
            <m-menu-item mode="ghost" size="sm" :selected="itemActive">
              <m-menu-item-child>{{ project.name }}</m-menu-item-child>
            </m-menu-item>
          </magic-command-item>
        </div>
        <div
          class="pointer-events-none absolute bottom-2 flex w-full justify-center"
        >
          <magic-command-trigger action="close" as-child>
            <m-button mode="tone" class="pointer-events-auto w-36">
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
