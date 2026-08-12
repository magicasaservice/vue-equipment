<template>
  <magic-carousel-provider
    id="magic-carousel-dots-demo"
    class="flex w-full flex-col items-center gap-6"
  >
    <magic-carousel-view class="demo-carousel w-full">
      <magic-carousel-slide
        v-for="index in 6"
        :key="index"
        class="aspect-[3/4]"
      >
        <carousel-demo-card :index="index" />
      </magic-carousel-slide>
    </magic-carousel-view>

    <div class="flex items-center gap-3">
      <magic-carousel-trigger
        v-for="(_, index) in slideCount"
        :key="index"
        :action="index"
        :aria-label="`Slide ${index + 1}`"
        class="demo-dot"
      />
    </div>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import { useMagicCarousel } from '@maas/vue-equipment/plugins/MagicCarousel'
import CarouselDemoCard from './components/CarouselDemoCard.vue'

const { slideCount } = useMagicCarousel('magic-carousel-dots-demo')
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

.demo-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.25;
  transition: opacity 150ms ease;
}

.demo-dot[data-active='true'] {
  opacity: 1;
}
</style>
