<template>
  <div class="w-full h-[300vh]">
    <magic-scroll-provider class="h-full">
      <magic-scroll-scene
        from="top-top"
        to="bottom-bottom"
        class="h-full"
        v-slot="{ progress }"
      >
        <div
          class="w-full h-20 bg-gray-500/5 text-white sticky top-[5rem] flex items-center justify-center"
        >
          {{ Math.round(progress * 100) }}%
        </div>
      </magic-scroll-scene>
    </magic-scroll-provider>
  </div>
</template>

<script setup lang="ts"></script>
