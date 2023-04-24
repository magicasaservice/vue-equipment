<template>
  <div>
    <div
      class="flex flex-col gap-4 divide-y divide-[rgba(100,200,0,1)]"
      ref="el"
    >
      <div class="flex gap-2" v-for="easing in mappedEasings" :key="easing">
        <div class="w-40">{{ easing.name }}</div>
        <div
          class="w-4 h-4 bg-black rounded-full text-center"
          :style="easing.style"
        />
      </div>
    </div>
    <button @click="toggle">Start</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  useEasings,
  EasingFunction,
  EasingKey,
} from '@vue-equipment/composables'
import { useRafFn, useElementSize } from '@vueuse/core'

const easings = useEasings()
const { pause, resume, isActive } = useRafFn(() => mapEasings(), {
  immediate: false,
})
const el = ref(null)
const { width } = useElementSize(el)

const startTime = ref(0)
const duration = ref(1000)
const startX = ref(0)
const endX = computed(() => width.value - (40 + 2 + 4) * 4)

const mappedEasings = ref<Record<string, any>>([])

const getCurrentTime = () => {
  if (!startTime.value) {
    startTime.value = Date.now()
  }

  const elapsedTime = Date.now() - startTime.value
  return Math.min(elapsedTime / duration.value, 1)
}

const toggle = () => {
  if (isActive.value) {
    pause()
    startTime.value = 0
    mapEasings()
  } else {
    resume()
  }
}

const mapEasings = () => {
  const easingsArray: EasingKey[] = Object.keys(easings) as EasingKey[]

  mappedEasings.value = easingsArray.map((easing) => {
    const easingFn = easings[easing]
    return {
      name: easing,
      style: isActive.value ? getStyle(easingFn) : '',
    }
  })
}

const getStyle = (easing: EasingFunction) => {
  return {
    transform: `translateX(${
      easing(getCurrentTime()) * (endX.value - startX.value) + startX.value
    }px)`,
  }
}

mapEasings()
</script>
