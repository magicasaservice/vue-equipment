<template>
  <magic-carousel-provider id="magic-carousel-cover-flow-demo" class="w-full">
    <magic-carousel-track class="demo-carousel w-full">
      <magic-carousel-slide v-for="index in 8" :key="index" class="demo-slide">
        <div class="demo-cover">
          <carousel-demo-card :index="index" />
        </div>
      </magic-carousel-slide>
    </magic-carousel-track>
  </magic-carousel-provider>
</template>

<script lang="ts" setup>
import CarouselDemoCard from './components/CarouselDemoCard.vue'
</script>

<style scoped>
.demo-carousel {
  --magic-carousel-slide-size: 8.5rem;
  --magic-carousel-gap: 0.25rem;
  --magic-carousel-snap-align: center;
  padding-inline: calc(50% - 4.25rem);
  padding-block: 2rem;
}

.demo-slide {
  position: relative;
  view-timeline: --slide inline calc(50% - 4.5rem);
}

.demo-cover {
  width: 11rem;
  height: 11rem;
  margin-inline: -1.25rem;
}

@supports (animation-timeline: view()) {
  .demo-slide {
    animation: demo-slide-depth linear both;
    animation-timeline: --slide;
    animation-range: cover;
  }

  .demo-cover {
    animation: demo-cover-flow linear both;
    animation-timeline: --slide;
    animation-range: cover;
  }
}

@keyframes demo-slide-depth {
  0% {
    z-index: 0;
  }

  50% {
    z-index: 10;
  }

  100% {
    z-index: 0;
  }
}

@keyframes demo-cover-flow {
  0% {
    transform: perspective(25rem) rotateY(-45deg) scale(0.9);
  }

  50% {
    transform: perspective(25rem) rotateY(0deg) scale(1.15);
  }

  100% {
    transform: perspective(25rem) rotateY(45deg) scale(0.9);
  }
}
</style>
