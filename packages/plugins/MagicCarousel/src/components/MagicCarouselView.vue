<template>
  <vue-primitive
    ref="el"
    class="magic-carousel-view"
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

interface MagicCarouselViewProps {
  asChild?: boolean
}

const { asChild } = defineProps<MagicCarouselViewProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCarousel',
  source: 'MagicCarouselView',
})

const instanceId = inject(MagicCarouselInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCarouselView must be nested inside MagicCarouselProvider',
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
    state.viewEl = markRaw(el)
  }
})

onBeforeUnmount(() => {
  state.viewEl = null
})
</script>

<style>
.magic-carousel-view {
  --magic-carousel-drag-overshoot: 4rem;

  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(
    --magic-carousel-slide-size,
    calc(
      (
          100% - (var(--magic-carousel-slides-per-view, 1) - 1) *
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

.magic-carousel-view::-webkit-scrollbar {
  display: none;
}

.magic-carousel-view[data-scrolling='true'],
.magic-carousel-view[data-snapping='true'] {
  scroll-snap-type: none;
}

.magic-carousel-view[data-loop='true'] {
  padding-inline: 50%;
  scroll-padding-inline: 50%;
}

.magic-carousel-view[data-draggable='true'] {
  cursor: var(--magic-carousel-cursor, grab);
}

.magic-carousel-view[data-draggable='true'][data-dragging='true'] {
  cursor: var(--magic-carousel-cursor-dragging, grabbing);
}

.magic-carousel-view[data-draggable='true'] * {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  user-select: none;
}
</style>
