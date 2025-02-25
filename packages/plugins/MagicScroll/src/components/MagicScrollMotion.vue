<template>
  <div ref="elRef" class="magic-scroll-motion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, watch, useTemplateRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import defu from 'defu'
import {
  animate,
  type AnimationPlaybackControls,
  type SequenceOptions,
  type AnimationSequence,
} from 'motion'

import { MagicScrollProgress } from '../symbols'
import { type MagicScrollSequence } from '../types'

interface MagicScrollMotionProps {
  sequence: MagicScrollSequence
  sequenceOptions?: SequenceOptions
  progress?: number
}

const { progress, sequence, sequenceOptions } =
  defineProps<MagicScrollMotionProps>()

const animation = ref<AnimationPlaybackControls | undefined>(undefined)
const elRef = useTemplateRef('elRef')

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

  // Prevent animation creation
  if (!sequence || !sequence.length || !el) {
    return
  }

  const mappedSequence: AnimationSequence = sequence.map((item) => {
    const [animation = [], options = {}] = item
    return [el, animation, options]
  })

  animation.value = animate(mappedSequence, mappedSequenceOptions)
  animation.value.pause()
  animation.value.time = mappedProgress.value
}

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

onMounted(() => {
  createAnimation()
})
</script>
