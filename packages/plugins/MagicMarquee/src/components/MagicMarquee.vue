<template>
  <div class="magic-marquee" @click="togglePlay">
    <div class="magic-marquee__track" ref="parentRef">
      <div class="magic-marquee__content" ref="childRef">
        <slot />
      </div>
      <div
        v-for="_duplicate in duplicates"
        class="magic-marquee__content"
        :aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useMarquee } from '../composables/useMarquee'

interface Props {
  direction?: 'reverse' | 'normal'
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'normal',
  speed: 1,
})

const parentRef = ref<HTMLElement | undefined>(undefined)
const childRef = ref<HTMLElement | undefined>(undefined)

const { duplicates, playing, play, pause } = useMarquee({
  child: childRef,
  parent: parentRef,
  options: {
    speed: computed(() => props.speed),
    direction: computed(() => props.direction),
  },
})

defineExpose({
  playing,
  play,
  pause,
})
</script>

<style lang="css">
:root {
  --magic-marquee-gap: 1rem;
  --magic-marquee-content-width: unset;
  --magic-marquee-transform-target-x: -100%;
}

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
  justify-content: flex-start;
}

.magic-marquee__content {
  white-space: nowrap;
  backface-visibility: hidden;
  padding-right: var(--magic-marquee-gap);
  width: var(--magic-marquee-content-width);
  animation-name: var(--magic-marquee-animation-name);
  animation-duration: var(--magic-marquee-animation-duration);
  animation-play-state: var(--magic-marquee-animation-play-state, running);
  animation-direction: var(--magic-marquee-animation-direction, normal);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-delay: 0;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
