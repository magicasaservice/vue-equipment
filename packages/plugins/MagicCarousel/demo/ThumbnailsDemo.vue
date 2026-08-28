<template>
  <div class="flex w-full flex-col gap-3">
    <magic-carousel-provider
      id="magic-carousel-thumbnails-demo-main"
      class="w-full"
    >
      <magic-carousel-track class="demo-main w-full">
        <magic-carousel-slide
          v-for="index in 10"
          :key="index"
          class="aspect-[3/2]"
        >
          <carousel-demo-card :index="index" />
        </magic-carousel-slide>
      </magic-carousel-track>
    </magic-carousel-provider>

    <magic-carousel-provider
      id="magic-carousel-thumbnails-demo-thumbs"
      class="w-full"
    >
      <magic-carousel-track class="demo-thumbs w-full">
        <magic-carousel-slide
          v-for="index in 10"
          :key="index"
          class="aspect-square"
        >
          <button
            type="button"
            class="demo-thumb h-full w-full rounded-md"
            :data-selected="activeIndex === index - 1 || null"
            :aria-label="`Slide ${index}`"
            @click="snapTo(index - 1)"
          >
            <carousel-demo-card :index="index" size="sm" />
          </button>
        </magic-carousel-slide>
      </magic-carousel-track>
    </magic-carousel-provider>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useMagicCarousel } from '@maas/vue-equipment/plugins/MagicCarousel'
import CarouselDemoCard from './components/CarouselDemoCard.vue'

const { activeIndex, snapTo } = useMagicCarousel(
  'magic-carousel-thumbnails-demo-main'
)

const { snapTo: snapThumbsTo } = useMagicCarousel(
  'magic-carousel-thumbnails-demo-thumbs'
)

watch(activeIndex, (value) => snapThumbsTo(value))
</script>

<style scoped>
.demo-main {
  --magic-carousel-slides-per-view: 1;
  --magic-carousel-gap: 0.75rem;
}

.demo-thumbs {
  --magic-carousel-slide-size: 4rem;
  --magic-carousel-gap: 0.5rem;
  --magic-carousel-snap-type: x proximity;
}

.demo-thumb {
  opacity: 0.55;
  transition: opacity 150ms ease;
}

.demo-thumb[data-selected='true'] {
  opacity: 1;
}

.demo-thumb[data-selected='true'] > * {
  box-shadow: inset 0 0 0 1.5px currentColor;
}
</style>
