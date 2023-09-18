<template>
  <div>
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button class="w-full h-full px-6 py-4" @click="toggleAnimations">
        Change Animation
      </button>
    </div>
    <div class="flex gap-4">
      <div class="w-full">
        <p>Window</p>
        <div class="relative w-full h-[300vh]">
          <magic-scroll-provider class="h-full">
            <magic-scroll-scene
              v-slot="{ progress }"
              from="top-top"
              to="bottom-bottom"
              class="h-full"
            >
              <div
                class="w-full h-20 bg-gray-500/5 sticky top-[5rem] flex items-center justify-center"
              >
                <span>{{ Math.round(progress * 100) }}%</span>
                <magic-scroll-motion
                  class="absolute w-full h-full -bottom-[100%] left-0 z-10 py-4"
                  :keyframes="keyframes"
                >
                  <div class="w-12 h-12 rounded-full shadow-md bg-red" />
                </magic-scroll-motion>
              </div>
            </magic-scroll-scene>
          </magic-scroll-provider>
        </div>
      </div>
      <div class="w-full">
        <p>Element</p>
        <div
          ref="parentRef"
          class="relative w-full h-[300px] bg-gray-500/5 overflow-scroll sticky top-[5rem]"
        >
          <magic-scroll-provider :el="parentRef">
            <div class="w-full h-screen">
              <magic-scroll-scene
                v-slot="{ progress }"
                from="top-top"
                to="bottom-bottom"
                class="h-full"
              >
                <div
                  class="w-full h-20 bg-gray-200/5 sticky top-0 flex items-center justify-center"
                >
                  <span>{{ Math.round(progress * 100) }}%</span>

                  <magic-scroll-motion
                    class="absolute w-full h-full -bottom-[100%] left-0 z-10 py-4"
                    :keyframes="keyframes"
                  >
                    <div class="w-12 h-12 rounded-full shadow-md bg-red" />
                  </magic-scroll-motion>
                </div>
              </magic-scroll-scene>
            </div>
          </magic-scroll-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const parentRef = ref<HTMLElement | undefined>(undefined)
const keyframes = ref<Record<string, any> | null | undefined>(undefined)

const presets = [
  {
    transform: [
      'translateX(0)',
      'translateX(calc(100% - 3rem))',
      'translateX(0)',
      'translateX(calc(100% - 3rem))',
    ],
  },
  {
    transform: [
      'translateY(0)',
      'translateY(calc(100% - 3rem))',
      'translateY(0)',
      'translateY(calc(100% - 3rem))',
    ],
  },
  {
    transform: ['scale(1)', 'scale(0.5)', 'scale(1)', 'scale(0.5)'],
  },
]

keyframes.value = presets[0]

function toggleAnimations() {
  keyframes.value = presets[Math.floor(Math.random() * presets.length)]
}
</script>
