<template>
  <vue-primitive
    ref="el"
    class="magic-carousel-track"
    :as-child="asChild"
    :data-draggable="state.draggable || null"
    :data-dragging="state.dragging || null"
    :data-scrolling="state.scrolling || null"
    :data-snapping="state.snapping || null"
    :data-loop="state.options.loop || null"
    :data-arrived-start="state.arrivedStart || null"
    :data-arrived-end="state.arrivedEnd || null"
    :style="mappedStyle"
  >
    <slot
      :active-index="state.activeIndex"
      :progress="state.progress"
      :dragging="state.dragging"
    />
  </vue-primitive>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError
  
} from '@maas/vue-equipment/plugins/MagicError'
import { MagicCarouselInstanceId } from '../symbols'
import { useCarouselState } from '../composables/private/useCarouselState'
import { useCarouselMeasure } from '../composables/private/useCarouselMeasure'
import { useCarouselScroll } from '../composables/private/useCarouselScroll'
import { useCarouselDrag } from '../composables/private/useCarouselDrag'
import type {UseMagicErrorReturn} from '@maas/vue-equipment/plugins/MagicError';

interface MagicCarouselTrackProps {
  asChild?: boolean
}

const { asChild } = defineProps<MagicCarouselTrackProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCarousel',
  source: 'MagicCarouselTrack',
})

const instanceId = inject(MagicCarouselInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCarouselTrack must be nested inside MagicCarouselProvider',
  errorCode: 'missing_instance_id',
})

const elRef = useTemplateRef<InstanceType<typeof VuePrimitive>>('el')

const { initializeState } = useCarouselState(instanceId)
const state = initializeState()

useCarouselMeasure(instanceId)
useCarouselScroll(instanceId)
useCarouselDrag(instanceId)

const mappedStyle = computed(() => ({
  '--mc-rubberband-x': `${state.rubberbandOffset}px`,
}))

onMounted(() => {
  const el = unrefElement(elRef)

  if (el instanceof HTMLElement) {
    state.trackEl = markRaw(el)
  }
})

onBeforeUnmount(() => {
  state.trackEl = null
})
</script>

<style>
.magic-carousel-track {
  --magic-carousel-drag-overshoot: 4rem;
  --mc-slide-basis: 100%;

  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(
    --magic-carousel-slide-size,
    calc(
      (
          var(--mc-slide-basis) - (var(--magic-carousel-slides-per-view, 1) - 1) *
            var(--magic-carousel-gap, 0px)
        ) /
        var(--magic-carousel-slides-per-view, 1)
    )
  );
  gap: var(--magic-carousel-gap, 0px);
  overflow-x: auto;
  overflow-y: clip;
  overscroll-behavior-x: contain;
  scroll-snap-type: var(--magic-carousel-snap-type, x mandatory);
  scrollbar-width: none;
  translate: var(--mc-rubberband-x, 0px) 0;
}

.magic-carousel-track::-webkit-scrollbar {
  display: none;
}

.magic-carousel-track[data-scrolling='true'],
.magic-carousel-track[data-snapping='true'] {
  scroll-snap-type: none;
}

.magic-carousel-track[data-loop='true'] {
  --mc-slide-basis: 100cqi;

  padding-inline: 50%;
  scroll-padding-inline: 50%;
}

.magic-carousel-track[data-loop='true']::after {
  content: '';
  width: calc(var(--magic-carousel-gap, 0px) + 8px);
}

.magic-carousel-track[data-draggable='true'] {
  cursor: var(--magic-carousel-cursor, grab);
}

.magic-carousel-track[data-draggable='true'][data-dragging='true'] {
  cursor: var(--magic-carousel-cursor-dragging, grabbing);
}

.magic-carousel-track[data-draggable='true'] * {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  user-select: none;
}
</style>
