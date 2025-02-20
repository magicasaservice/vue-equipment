<template>
  <div class="w-full flex flex-col">
    <magic-player-provider
      id="standalone-controls-demo-player"
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
    <div class="relative w-full pt-4 flex items-center">
      <magic-player-video-controls
        id="standalone-controls-demo-player"
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
