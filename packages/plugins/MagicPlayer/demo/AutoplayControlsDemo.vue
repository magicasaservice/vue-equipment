<template>
  <div class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-autoplay-controls-demo"
      :options="{
        src: 'https://stream.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8.m3u8',
        srcType: 'hls',
        autoplay: true,
      }"
    >
      <magic-player-video />
      <magic-player-overlay />
      <magic-player-video-controls>
        <template #popover>
          <magic-player-mux-popover />
        </template>
      </magic-player-video-controls>
    </magic-player-provider>
  </div>
</template>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-video-controls.css';
</style>
