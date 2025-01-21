<template>
  <div class="w-full flex justify-center">
    <m-button @click="toggleAnimations"> Change Animation </m-button>
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
              class="w-full h-20 bg-surface-elevation-base text-white sticky top-[5rem] flex items-center justify-center"
            >
              <span>{{ Math.round(progress * 100) }}%</span>
              <magic-scroll-motion
                class="absolute w-full h-full -bottom-[100%] left-0 z-10 py-4"
                :keyframes="keyframes"
              >
                <div class="w-12 h-12 rounded-full shadow-md bg-[red]" />
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
        class="relative w-full h-[300px] bg-surface-elevation-base overflow-scroll sticky top-[5rem]"
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
                class="w-full h-20 bg-gray-200/5 text-white sticky top-0 flex items-center justify-center"
              >
                <span>{{ Math.round(progress * 100) }}%</span>

                <magic-scroll-motion
                  class="absolute w-full h-full -bottom-[100%] left-0 z-10 py-4"
                  :keyframes="keyframes"
                >
                  <div class="w-12 h-12 rounded-full shadow-md bg-[red]" />
                </magic-scroll-motion>
              </div>
            </magic-scroll-scene>
          </div>
        </magic-scroll-provider>
      </div>
    </div>
  </div>
  <div class="w-full">
    <magic-scroll-provider class="h-[50svh] flex items-center justify-center">
      <magic-scroll-collision
        :entries="[
          {
            data: { payload: 'test' },
            offset: { top: 64 },
            element: '.-collision',
          },
        ]"
      >
        <div class="-collision w-36 h-36 rounded-full shadow-md bg-blue" />
      </magic-scroll-collision>
    </magic-scroll-provider>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { ref, onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'

const parentRef = ref<HTMLElement | undefined>(undefined)
const keyframes = ref<Record<string, (string | number)[]> | null | undefined>(
  undefined
)

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

function callback(payload: MagicEmitterEvents['collision']) {
  console.log(payload)
}

useMagicEmitter().on('collision', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('collision', callback)
})
</script>
