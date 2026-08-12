<template>
  <magic-carousel-provider id="magic-carousel-snap-align-demo" class="w-full">
    <magic-carousel-view class="demo-carousel w-full">
      <magic-carousel-slide
        v-for="index in 6"
        :key="index"
        class="demo-slide aspect-[3/4]"
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
  --magic-carousel-slide-size: 16rem;
  --magic-carousel-gap: 0.75rem;
  --magic-carousel-snap-align: center;
  padding-inline: calc(50% - 8rem);
}

.demo-slide {
  opacity: 0.35;
  transition: opacity 300ms ease;
}

.demo-slide[data-active='true'] {
  opacity: 1;
}
</style>
