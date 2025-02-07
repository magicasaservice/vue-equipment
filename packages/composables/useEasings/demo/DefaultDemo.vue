<template>
  <div class="flex w-full flex-col gap-8">
    <div
      class="bg-surface-elevation-base rounded-surface-md flex flex-col gap-4 p-8"
    >
      <div
        class="flex gap-2"
        v-for="easing in mappedEasings"
        :key="easing.name"
      >
        <div class="w-40">
          <m-badge size="sm" mode="tone">{{ easing.name }}</m-badge>
        </div>
        <div
          class="bg-surface-elevation-high flex h-6 w-full rounded-full pr-5"
        >
          <div class="h-full w-full">
            <div
              class="m-1 h-4 w-4 rounded-full bg-[white] text-center"
              :style="easing.style"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center">
      <m-button @click="toggle">
        {{ isActive ? 'Reset' : 'Start' }}
      </m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton, MBadge } from '@maas/mirror/vue'
import { useEasings } from '@maas/vue-equipment/composables'
import { useRafFn } from '@vueuse/core'

interface MappedEasing {
  name: string
  style: {
    marginLeft?: string
  }
}

const easings = useEasings()

const { pause, resume, isActive } = useRafFn(() => mapEasings(), {
  immediate: false,
})

const startTime = ref(0)
const duration = ref(1000)
const startX = ref(0)
const endX = ref(100)

const mappedEasings = ref<MappedEasing[]>([])

function getCurrentTime() {
  if (!startTime.value) {
    startTime.value = Date.now()
  }

  const elapsedTime = Date.now() - startTime.value
  return Math.min(elapsedTime / duration.value, 1)
}

function toggle() {
  if (isActive.value) {
    pause()
    startTime.value = 0
    mapEasings()
  } else {
    resume()
  }
}

function mapEasings() {
  const easingsValues = Object.values(easings)
  const easingsKeys = Object.keys(easings)

  mappedEasings.value = easingsValues.map((easing, i) => {
    return {
      name: easingsKeys[i],
      style: isActive.value ? getStyle(easing) : {},
    }
  })
}

function getStyle(easing: typeof easings.easeInCubic) {
  return {
    marginLeft: `${
      easing(getCurrentTime()) * (endX.value - startX.value) + startX.value
    }%`,
  }
}

mapEasings()
</script>
