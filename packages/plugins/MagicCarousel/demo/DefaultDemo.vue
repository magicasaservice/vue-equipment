<template>
  <magic-carousel-provider id="magic-carousel-default-demo" class="w-full">
    <magic-carousel-view class="demo-carousel w-full">
      <magic-carousel-slide
        v-for="index in 6"
        :key="index"
        class="aspect-[3/4]"
      >
        <carousel-demo-card :index="index" />
      </magic-carousel-slide>
    </magic-carousel-view>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
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
