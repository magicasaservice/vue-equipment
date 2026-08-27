<template>
  <magic-noise
    class="custom-color-noise aspect-[16/10] w-full"
    :options="{ color: '#46a758', alpha: true }"
  />
</template>

<style>
.custom-color-noise {
  --magic-noise-background: #1d3a24;
}
</style>
