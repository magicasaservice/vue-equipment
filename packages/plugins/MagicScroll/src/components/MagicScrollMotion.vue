<template>
  <div ref="el" class="magic-scroll-motion" :data-progress="mappedProgress">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import defu from 'defu'
import { animate, scopeMotion } from 'motion'
import { MagicScrollProgress } from '../symbols'

import type {
  AnimationPlaybackControls,
  AnimationSequence,
  MotionScope,
  SequenceOptions,
} from 'motion'
import type { MagicScrollSequence } from '../types'

interface MagicScrollMotionProps {
  sequence: MagicScrollSequence
  sequenceOptions?: SequenceOptions
  progress?: number
}

const { progress, sequence, sequenceOptions } =
  defineProps<MagicScrollMotionProps>()

const animation = shallowRef<AnimationPlaybackControls | undefined>(undefined)
const animationScope = shallowRef<MotionScope | undefined>(undefined)
const elRef = useTemplateRef('el')

const injectedProgress = inject(
  MagicScrollProgress,
  computed(() => 0)
)

const mappedProgress = computed(() => {
  return progress ?? injectedProgress.value ?? 0
})

const defaultSequenceOptions: SequenceOptions = {
  duration: 1,
  delay: 0,
}

const mappedSequenceOptions = defu(sequenceOptions, defaultSequenceOptions)

function cancelAnimation() {
  // Unlike animation.cancel(), this also resets values motion runs on the main thread
  animationScope.value?.cancel()
  animationScope.value = undefined
  animation.value = undefined
}

function createAnimation() {
  const el = unrefElement(elRef)

  // Cancel before the guard, so an empty sequence clears the old one
  cancelAnimation()

  // Prevent animation creation
  if (!sequence || !sequence.length || !el) {
    return
  }

  const mappedSequence: AnimationSequence = sequence.map((item) => {
    const [animation, options = {}] = item
    return [el, animation, options]
  })

  animationScope.value = scopeMotion()
  animation.value = animationScope.value.run(() =>
    animate(mappedSequence, mappedSequenceOptions)
  )
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

onUnmounted(() => {
  cancelAnimation()
})
</script>
