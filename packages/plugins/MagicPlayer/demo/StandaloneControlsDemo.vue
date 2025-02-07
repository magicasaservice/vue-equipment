<template>
  <div class="w-full flex flex-col">
    <magic-player-provider
      id="standalone-controls-demo-player"
      :options="{
        src: 'https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4',
      }"
    >
      <magic-player-video />
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
