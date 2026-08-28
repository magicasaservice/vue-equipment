<template>
  <magic-carousel-provider
    id="magic-carousel-progress-demo"
    class="flex w-full flex-col items-center gap-6"
  >
    <magic-carousel-track class="demo-carousel w-full">
      <magic-carousel-slide
        v-for="index in 6"
        :key="index"
        class="aspect-[3/4]"
      >
        <carousel-demo-card :index="index" />
      </magic-carousel-slide>
    </magic-carousel-track>

    <div class="bg-surface-base h-1.5 w-48 overflow-hidden rounded-full">
      <div
        class="bg-primary-solid h-full w-full origin-left rounded-full"
        :style="{ transform: `scaleX(${progress})` }"
      />
    </div>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import { useMagicCarousel } from '@maas/vue-equipment/plugins/MagicCarousel'
import CarouselDemoCard from './components/CarouselDemoCard.vue'

const { progress } = useMagicCarousel('magic-carousel-progress-demo')
</script>

<style scoped>
.demo-carousel {
  --magic-carousel-slide-size: 70%;
  --magic-carousel-gap: 0.75rem;
}

@media (min-width: 768px) {
  .demo-carousel {
    --magic-carousel-slide-size: 45%;
  }
}
</style>
