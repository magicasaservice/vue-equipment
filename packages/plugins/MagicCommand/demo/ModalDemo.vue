<template>
  <magic-command-provider id="magic-command-modal-demo">
    <magic-command-trigger view-id="initial-view" as-child>
      <m-button> Open Modal </m-button>
    </magic-command-trigger>

    <magic-command-modal>
      <magic-command-renderer
        class="w-[40rem] h-[30rem] relative inset-0 bg-surface-elevation-high flex flex-col"
      />
    </magic-command-modal>

    <magic-command-view :initial="true" id="initial-view">
      <magic-command-content class="overflow-auto bg-neutral-800">
        <div class="px-2 pt-2">
          <div class="w-full border border-neutral-600 p-3 border-b-solid">
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div class="py-2">
          <span class="p-4 text-xs text-neutral-600">Suggestions</span>

          <magic-command-item>
            <magic-command-view>
              <magic-command-trigger as-child>
                <m-menu-item>View Projects</m-menu-item>
              </magic-command-trigger>
              <magic-command-content
                class="h-full w-full bg-neutral-800 overflow-auto"
              >
                <div class="sticky top-0 px-4 py-4 bg-neutral-900">
                  <div class="w-full">
                    <input type="text" placeholder="Search Projects" />
                  </div>
                </div>
                <div class="pb-2 pt-2">
                  <magic-command-item
                    v-for="nth in 20"
                    :key="nth"
                    :initial="nth === 1"
                  >
                    <m-menu-item>Project {{ nth }}</m-menu-item>
                  </magic-command-item>
                </div>
                <div class="sticky bottom-0 px-2 bg-neutral-800">
                  <div
                    class="w-full border border-neutral-600 px-2 py-4 border-t-solid flex items-center"
                  >
                    <magic-command-trigger
                      action="close"
                      class="leading-none text-xs text-neutral-600"
                    >
                      Go Back
                    </magic-command-trigger>
                  </div>
                </div>
              </magic-command-content>
            </magic-command-view>
          </magic-command-item>
        </div>
        <div>
          <span class="p-4 text-xs text-neutral-600">Filter</span>
          <magic-command-item v-for="nth in 20" :key="nth">
            <m-menu-item>{{ nth }}</m-menu-item>
          </magic-command-item>
        </div>
      </magic-command-content>
    </magic-command-view>
  </magic-command-provider>
</template>

<script setup lang="ts">
import { MButton, MMenuItem } from '@maas/mirror/vue'
</script>
