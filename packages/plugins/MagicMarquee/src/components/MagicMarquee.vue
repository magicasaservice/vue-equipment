<template>
  <div class="magic-marquee" ref="parentRef">
    <div class="magic-marquee__track">
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
import { ref, computed, onMounted } from 'vue'
import { useMarqueeApi } from '../composables/private/useMarqueeApi'

interface MagicMarqueeProps {
  direction?: 'reverse' | 'normal'
  speed?: number
}

const props = withDefaults(defineProps<MagicMarqueeProps>(), {
  direction: 'normal',
  speed: 1,
})

const parentRef = ref<HTMLElement | undefined>(undefined)
const childRef = ref<HTMLElement | undefined>(undefined)

const { duplicates, playing, play, pause, initialize } = useMarqueeApi({
  child: childRef,
  parent: parentRef,
  options: {
    speed: computed(() => props.speed),
    direction: computed(() => props.direction),
  },
})

onMounted(() => {
  initialize()
})

defineExpose({
  playing,
  play,
  pause,
})
</script>

<style lang="css">
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
  padding-right: var(--magic-marquee-gap, 1rem);
  width: var(--magic-marquee-content-width, unset);
  animation-name: var(--magic-marquee-animation-name);
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
