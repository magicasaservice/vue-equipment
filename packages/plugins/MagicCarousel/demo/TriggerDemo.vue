<template>
  <magic-carousel-provider
    id="magic-carousel-trigger-demo"
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

    <div class="flex items-center gap-2">
      <magic-carousel-trigger v-slot="{ disabled }" action="previous" as-child>
        <m-button
          mode="outline"
          icon
          square
          :disabled="disabled"
          aria-label="Previous slide"
        >
          <i-maas-chevron-w-500 />
        </m-button>
      </magic-carousel-trigger>

      <magic-carousel-trigger v-slot="{ disabled }" action="next" as-child>
        <m-button
          mode="outline"
          icon
          square
          :disabled="disabled"
          aria-label="Next slide"
        >
          <i-maas-chevron-e-500 />
        </m-button>
      </magic-carousel-trigger>
    </div>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import CarouselDemoCard from './components/CarouselDemoCard.vue'
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
