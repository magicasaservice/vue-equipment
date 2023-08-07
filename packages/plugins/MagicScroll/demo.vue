<template>
  <div class="flex gap-4">
    <div class="w-full">
      <p>Window</p>

      <div class="w-full h-[300vh]">
        <magic-scroll-provider class="h-full">
          <magic-scroll-scene
            from="top-top"
            to="bottom-bottom"
            class="h-full"
            v-slot="{ progress }"
          >
            <div
              class="w-full h-20 bg-gray-500/5 text-white sticky top-[5rem] flex items-center justify-center"
            >
              {{ Math.round(progress * 100) }}%
            </div>
          </magic-scroll-scene>
        </magic-scroll-provider>
      </div>
    </div>
    <div class="w-full">
      <p>Element</p>
      <div
        class="relative w-full h-[300px] bg-gray-500/5 overflow-scroll sticky top-[5rem]"
        ref="parentRef"
      >
        <magic-scroll-provider :el="parentRef">
          <div class="w-full h-screen">
            <magic-scroll-scene
              from="top-top"
              to="bottom-bottom"
              class="h-full"
              v-slot="{ progress }"
            >
              <div
                class="w-full h-20 bg-gray-200/5 text-white sticky top-0 flex items-center justify-center"
              >
                {{ Math.round(progress * 100) }}%
              </div>
            </magic-scroll-scene>
          </div>
        </magic-scroll-provider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const parentRef = ref<HTMLElement | undefined>(undefined)
</script>
