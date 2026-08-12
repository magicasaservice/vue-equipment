<template>
  <magic-carousel-provider
    id="magic-carousel-variable-width-demo"
    class="w-full"
  >
    <magic-carousel-view class="demo-carousel w-full">
      <magic-carousel-slide
        v-for="(width, index) in widths"
        :key="index"
        :class="['h-80', width]"
      >
        <carousel-demo-card :index="index + 1" />
      </magic-carousel-slide>
    </magic-carousel-view>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import CarouselDemoCard from './components/CarouselDemoCard.vue'

const widths = ['w-40', 'w-64', 'w-48', 'w-72', 'w-44', 'w-60']
</script>

<style scoped>
.demo-carousel {
  --magic-carousel-slide-size: auto;
  --magic-carousel-gap: 0.75rem;
}
</style>
