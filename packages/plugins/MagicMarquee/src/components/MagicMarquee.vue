<template>
  <div ref="parentRef" class="magic-marquee">
    <div class="magic-marquee__track">
      <div ref="childRef" class="magic-marquee__content">
        <slot />
      </div>
      <div
        v-for="duplicate in duplicates"
        :key="duplicate"
        class="magic-marquee__content"
        :aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMarqueeApi } from '../composables/private/useMarqueeApi'
import { useMarqueeState } from '../composables/private/useMarqueeState'

import type { MagicMarqueeOptions } from '../types'

interface MagicMarqueeProps {
  id: MaybeRef<string>
  options?: MagicMarqueeOptions
}

const { id, options } = defineProps<MagicMarqueeProps>()

const { deleteState, initializeState } = useMarqueeState(id)
initializeState(options)

const parentRef = ref<HTMLElement | undefined>(undefined)
const childRef = ref<HTMLElement | undefined>(undefined)

const { duplicates, initialize } = useMarqueeApi({
  child: childRef,
  parent: parentRef,
  instanceId: id,
})

onMounted(() => {
  initialize()
})

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})
</script>

<style>
@keyframes magicMarqueeScrollX {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes magicMarqueeScrollY {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -100%, 0);
  }
}

.magic-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.magic-marquee__track {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: var(--magic-marquee-jusrify-content, flex-start);
  align-items: var(--magic-marquee-align-items, baseline);
}

.magic-marquee__content {
  white-space: nowrap;
  backface-visibility: hidden;
  padding-right: var(--magic-marquee-gap, 1rem);
  width: var(--magic-marquee-content-width, unset);
  animation-name: var(--magic-marquee-animation-name, magicMarqueeScrollX);
  animation-duration: var(--magic-marquee-animation-duration);
  animation-play-state: var(--magic-marquee-animation-play-state, running);
  animation-direction: var(--magic-marquee-animation-direction, normal);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  display: flex;
  gap: var(--magic-marquee-gap, 1rem);
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
