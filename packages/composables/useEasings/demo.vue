<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col p-8 gap-4 bg-gray-500/5 rounded">
      <div class="flex gap-2" v-for="easing in mappedEasings" :key="easing">
        <div class="w-40">{{ easing.name }}</div>
        <div class="w-full h-4 flex bg-gray-300/5 rounded-full pr-4">
          <div class="w-full h-full">
            <div
              class="w-4 h-4 bg-black rounded-full text-center"
              :style="easing.style"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="toggle" class="w-full h-full px-6 py-4">
        {{ isActive ? 'Reset' : 'Start' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEasings } from '@maas/vue-equipment/composables'
import { useRafFn } from '@vueuse/core'

const easings = useEasings()
const { pause, resume, isActive } = useRafFn(() => mapEasings(), {
  immediate: false,
})

const startTime = ref(0)
const duration = ref(1000)
const startX = ref(0)
const endX = ref(100)

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
  const easingsValues = Object.values(easings)
  const easingsKeys = Object.keys(easings)

  mappedEasings.value = easingsValues.map((easing, i) => {
    return {
      name: easingsKeys[i],
      style: isActive.value ? getStyle(easing) : '',
    }
  })
}

const getStyle = (easing: typeof easings.easeInCubic) => {
  return {
    marginLeft: `${
      easing(getCurrentTime()) * (endX.value - startX.value) + startX.value
    }%`,
  }
}

mapEasings()
</script>
