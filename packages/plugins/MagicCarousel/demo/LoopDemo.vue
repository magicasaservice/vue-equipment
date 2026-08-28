<template>
  <magic-carousel-provider
    id="magic-carousel-loop-demo"
    class="w-full"
    :options="{ loop: true }"
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
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import CarouselDemoCard from './components/CarouselDemoCard.vue'
</script>

<style scoped>
.demo-carousel {
  --magic-carousel-slide-size: 14rem;
  --magic-carousel-gap: 0.75rem;
}
</style>
