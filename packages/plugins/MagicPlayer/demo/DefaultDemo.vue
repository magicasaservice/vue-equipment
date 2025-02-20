<template>
  <div class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-default-demo"
      :options="{
        src: 'https://stream.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8.m3u8',
        srcType: 'hls',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <magic-player-provider
          id="magic-player-default-demo-poster"
          :options="{
            src: 'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
            autoplay: true,
            loop: true,
          }"
        >
          <magic-player-video />
          <magic-player-poster>
            <img
              src="https://image.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/thumbnail.png?time=0"
              alt="Poster"
            />
          </magic-player-poster>
        </magic-player-provider>
      </magic-player-poster>
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
