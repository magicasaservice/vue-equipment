<template>
  <div ref="elRef" class="magic-scroll-motion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, watch } from 'vue'
import { unrefElement } from '@vueuse/core'
import defu from 'defu'
import {
  animate,
  type ObjectSegment,
  type AnimationPlaybackControls,
  type SequenceOptions,
  type AnimationSequence,
} from 'motion'

import { MagicScrollProgress } from '../symbols'

interface MagicScrollMotionProps {
  sequence?: ObjectSegment[]
  progress?: number
  sequenceOptions?: SequenceOptions
}

const { sequence, progress, sequenceOptions } =
  defineProps<MagicScrollMotionProps>()

const animation = ref<AnimationPlaybackControls | undefined>(undefined)
const elRef = ref<HTMLElement | undefined>(undefined)

const injectedProgress = inject(
  MagicScrollProgress,
  computed(() => 0)
)

const mappedProgress = computed(() => {
  return progress || injectedProgress.value || 0
})

const defaultSequenceOptions: SequenceOptions = {
  duration: 1,
  delay: 0,
}

const mappedSequenceOptions = defu(sequenceOptions, defaultSequenceOptions)

function createAnimation() {
  const el = unrefElement(elRef)

  if (!sequence || !el) {
    return
  }

  const mappedSequence: AnimationSequence = sequence.map((item) => {
    return [el, ...item]
  })

  animation.value = animate(mappedSequence, mappedSequenceOptions)
  animation.value.time = mappedProgress.value
  animation.value.pause()
}

onMounted(() => {
  createAnimation()
})

watch(mappedProgress, (value) => {
  if ((!value && value !== 0) || !animation.value) {
    return
  }

  animation.value.time = value
})

watch(
  () => sequence,
  () => {
    createAnimation()
  },
  {
    deep: true,
  }
)
</script>
