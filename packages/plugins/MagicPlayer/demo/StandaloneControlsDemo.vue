<template>
  <div class="flex w-full flex-col">
    <magic-player-provider
      id="magic-player-standalone-controls-demo"
      :options="{
        src: 'https://stream.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8.m3u8',
        srcType: 'hls',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <img
          src="https://image.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8/thumbnail.jpg?time=4"
          alt="Poster"
        />
      </magic-player-poster>
      <magic-player-overlay />
    </magic-player-provider>
    <div class="relative flex w-full items-center pt-4">
      <magic-player-video-controls
        id="magic-player-standalone-controls-demo"
        class="bg-black"
        standalone
      >
        <template #timeline-before>
          <magic-player-display-time type="current" />
        </template>
        <template #timeline-after>
          <magic-player-display-time type="duration" />
        </template>
      </magic-player-video-controls>
    </div>
  </div>
</template>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-video-controls.css';
</style>
